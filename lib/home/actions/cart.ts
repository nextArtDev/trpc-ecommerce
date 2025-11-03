'use server'

import { currentUser } from '@/lib/auth'
import { AddressType, Cart, CartItem } from '@/lib/generated/prisma'
import prisma from '@/lib/prisma'
import { calculateShippingCost } from '@/lib/shipping-price'

import { CartProductType, Currency } from '@/lib/types/home'
import { revalidatePath } from 'next/cache'
import { getCurrentLocale } from './locale'

export interface SaveCartResult {
  success: boolean
  message: string
  cartId?: string
  validationErrors?: Array<{
    variantId: string

    productName: string
    issue: string
    requestedQuantity: number
    availableStock: number
  }>
  correctedItems?: Array<{
    variantId: string

    originalQuantity: number
    correctedQuantity: number
  }>
}

export async function saveAllToCart(
  items: CartProductType[],
  currency: Currency
): Promise<SaveCartResult> {
  // 1. Authentication check
  const user = await currentUser()
  if (!user?.id) {
    return {
      success: false,
      message: 'لطفا وارد حساب کاربری خود شوید.',
    }
  }

  // 2. Input validation
  if (!items || items.length === 0) {
    return {
      success: false,
      message: 'محصولی برای خرید انتخاب نشده است.',
    }
  }
  const itemCurrencies = new Set(items.map((item) => item.currency))
  if (itemCurrencies.size > 1) {
    return {
      success: false,
      message: 'محصولات با واحدهای پولی مختلف در سبد خرید وجود دارد.',
    }
  }

  const firstItemCurrency = items[0]?.currency
  if (firstItemCurrency && firstItemCurrency !== currency) {
    return {
      success: false,
      message: `خطا: واحد پول درخواستی (${currency}) با واحد پول محصولات (${firstItemCurrency}) مطابقت ندارد.`,
    }
  }
  const locale = await getCurrentLocale()

  try {
    // 3. Start database transaction for atomicity
    const result = await prisma.$transaction(async (tx) => {
      // Delete existing cart if exists
      const existingCart = await tx.cart.findFirst({
        where: { userId: user.id },
      })

      if (existingCart) {
        await tx.cart.delete({
          where: { id: existingCart.id },
        })
      }

      // 4. Validate all items and prepare cart data
      const validationErrors: SaveCartResult['validationErrors'] = []
      const correctedItems: SaveCartResult['correctedItems'] = []

      const validatedCartItemsData = []

      for (const cartProduct of items) {
        const { variantId, quantity, name: productName } = cartProduct

        const variant = await tx.productVariant.findUnique({
          where: { id: variantId },
          include: {
            product: {
              include: {
                images: { take: 1, orderBy: { created_at: 'asc' } },
                translations: {
                  where: { language: locale },
                  select: { name: true },
                  take: 1,
                },
              },
            },
            size: true,
            color: true,
          },
        })

        if (!variant || !variant.product || !variant.size) {
          validationErrors.push({
            variantId,
            productName,
            issue: 'محصول یافت نشد.',
            requestedQuantity: quantity,
            availableStock: 0,
          })
          continue
        }

        if (variant.quantity <= 0) {
          validationErrors.push({
            variantId,
            productName,
            issue: 'موجودی تمام شده است.',
            requestedQuantity: quantity,
            availableStock: 0,
          })
          continue
        }

        const validQuantity = Math.min(quantity, variant.quantity)
        if (validQuantity < quantity) {
          correctedItems.push({
            variantId,
            originalQuantity: quantity,
            correctedQuantity: validQuantity,
          })
        }

        // Calculate price with discount
        const price =
          variant.discount > 0
            ? variant.price - variant.price * (variant.discount / 100)
            : variant.price
        const totalPrice = price * validQuantity

        validatedCartItemsData.push({
          variantId: variant.id,
          variant: variant,
          productSlug: variant.product.slug,
          productId: variant.product.id,
          sku: variant.sku || '',
          name: variant.product.translations[0]?.name || 'Unknown Product',
          image: variant.product.images[0]?.url || '',
          size: variant.size.name,
          color: variant.color.name,
          quantity: validQuantity,
          price,
          totalPrice,
          weight: variant.weight || 0,
          currency: cartProduct.currency,
        })
      }

      // If there are critical validation errors, return them
      if (validationErrors.length > 0) {
        throw { type: 'VALIDATION_FAILED', errors: validationErrors }
      }

      if (validatedCartItemsData.length === 0) {
        return {
          success: false,
          message: 'هیچ محصول معتبری برای خرید یافت نشد.',
        }
      }

      const subTotal = validatedCartItemsData.reduce(
        (acc, item) => acc + item.totalPrice,
        0
      )

      // Create new cart with items
      const cart = await tx.cart.create({
        data: {
          userId: user.id,
          subTotal,
          total: subTotal, // Will be updated after shipping calculation
          displayCurrency: currency,
          cartItems: {
            create: validatedCartItemsData.map((item) => ({
              // variantId: item.variantId,
              variant: { connect: { id: item.variantId } },
              product: { connect: { id: item.productId } },
              productSlug: item.productSlug,
              sku: item.sku,
              name: item.name,
              image: item.image,
              size: item.size,
              quantity: item.quantity,
              price: item.price,
              totalPrice: item.totalPrice,
              weight: item.weight,
              color: item.color,
              currency: item.currency,
            })),
          },
        },
      })

      return {
        success: true,
        message: `${validatedCartItemsData.length} محصول با موفقیت به سبد خرید اضافه شد.`,
        cartId: cart.id,
        correctedItems: correctedItems.length > 0 ? correctedItems : undefined,
      }
    })

    // Revalidate relevant paths
    revalidatePath('/cart')
    revalidatePath('/checkout')

    return result
  } catch (error) {
    console.error('Save cart error:', error)

    if (error instanceof Error) {
      if (error.message === 'VALIDATION_FAILED') {
        // This would need to be handled differently since we're inside a transaction
        // For now, return a generic error
        return {
          success: false,
          message:
            'برخی محصولات قابل خرید نیستند. لطفا سبد خرید خود را بررسی کنید.',
        }
      }

      if (error.message === 'NO_VALID_ITEMS') {
        return {
          success: false,
          message: 'هیچ محصول معتبری برای خرید یافت نشد.',
        }
      }
    }

    return {
      success: false,
      message: 'خطایی در ذخیره سبد خرید رخ داد. لطفا دوباره تلاش کنید.',
    }
  }
}

// Additional helper action for getting cart with shipping calculation
export async function getCartForCheckout(): Promise<
  Cart & { cartItems: CartItem[] }
> {
  try {
    const user = await currentUser()
    if (!user?.id) {
      // return { success: false, message: 'کاربر وارد نشده است.' }
      throw new Error('کاربر وارد نشده است.')
    }

    const cart = await prisma.cart.findFirst({
      where: { userId: user.id },
      include: {
        cartItems: {
          include: {
            // You might want to include product details for validation
          },
        },
      },
    })

    if (!cart) {
      // return { success: false, message: 'سبد خرید یافت نشد.' }
      throw new Error('سبد خرید یافت نشد.')
    }

    return cart
  } catch (error) {
    console.error('Get cart error:', error)

    throw new Error('خطا در بارگذاری سبد خرید.')
  }
}

// Action to update cart with shipping information
export async function updateCartWithShipping(
  cartId: string,
  shippingAddressId: string
) {
  try {
    const user = await currentUser()
    if (!user?.id) {
      return { success: false, message: 'کاربر وارد نشده است.' }
    }

    // Get shipping address
    const shippingAddress = await prisma.shippingAddress.findUnique({
      where: { id: shippingAddressId },
      include: {
        city: true,
        province: true,
        country: true,
        state: true,
      },
    })

    if (!shippingAddress || shippingAddress.userId !== user.id) {
      return { success: false, message: 'آدرس ارسال نامعتبر است.' }
    }

    // Get cart with items
    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        cartItems: true,
      },
    })

    if (!cart || cart.userId !== user.id) {
      return { success: false, message: 'سبد خرید نامعتبر است.' }
    }

    // Calculate total weight and value
    const totalWeight = cart.cartItems.reduce(
      (acc, item) =>
        acc + ((Number(item.weight) ?? 1000) * item.quantity || 2000),
      0
    )

    const totalValue = cart.cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    )

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const shippingParams: any = {
      origin: { province: 'خوزستان', city: 'دزفول' },
      weightGrams: totalWeight,
      valueRial: totalValue * 10, // Convert to Rial
      dimensions: { length: 50, width: 50, height: 50 },
      addressType: shippingAddress.addressType,
    }

    if (shippingAddress.addressType === AddressType.IRANIAN) {
      shippingParams.destination = {
        province: shippingAddress.province?.name,
        city: shippingAddress.city?.name,
      }
    } else {
      // For international addresses, we need to determine the currency
      // This could come from user preferences or cart metadata
      // For now, we'll default to USD for international addresses
      shippingParams.destination = {
        country: shippingAddress.country?.name,
        state: shippingAddress.state?.name,
        cityInt: shippingAddress.cityInt,
      }
      shippingParams.currency = 'dollar' // Default to USD for international
    }
    // Calculate shipping cost
    const shippingCost = calculateShippingCost(shippingParams)
    // Convert shipping cost to Rial for database storage
    let shippingFeeInRial = shippingCost.total
    if (shippingCost.currency === 'dollar') {
      shippingFeeInRial = shippingCost.total * 43000
    } else if (shippingCost.currency === 'euro') {
      shippingFeeInRial = shippingCost.total * 47000
    }

    // Update cart with shipping information
    await prisma.cart.update({
      where: { id: cartId },
      data: {
        total: cart.subTotal + shippingFeeInRial,
        shippingFees: shippingFeeInRial,
      },
    })

    return {
      success: true,
      message: 'هزینه ارسال محاسبه شد.',
      totalShippingFee: shippingCost,
      total: cart.subTotal + shippingFeeInRial,
    }
  } catch (error) {
    console.error('Update shipping error:', error)
    return {
      success: false,
      message: 'خطا در محاسبه هزینه ارسال.',
    }
  }
}

export async function fetchCurrentPricesAndStock(variantIds: string[]) {
  try {
    const variants = await prisma.productVariant.findMany({
      where: { id: { in: variantIds } },
      select: { id: true, price: true, quantity: true, discount: true },
    })

    return variants.map((variant) => ({
      variantId: variant.id,
      price: variant.price,
      stock: variant.quantity,
      discount: variant.discount,
    }))
  } catch (error) {
    console.error('Failed to fetch current prices and stock:', error)
    throw new Error('Unable to fetch current prices')
  }
}

// -----------------------------
// Real Time validation Cart
// -----------------------------

export interface DbCartItem {
  id: string
  productId: string
  variantId: string
  productSlug: string
  sku: string
  name: string
  image: string
  size: string
  price: number
  quantity: number
  shippingFee: number
  totalPrice: number
  // Validation fields
  currency: Currency
  currentStock: number
  currentPrice: number
  isStockValid: boolean
  isPriceValid: boolean
  color: string
  maxAvailableQuantity: number
}

export interface DbCart {
  id: string
  userId: string
  subTotal: number
  shippingFees: number
  total: number
  items: DbCartItem[]
  hasValidationIssues: boolean
  currency: Currency
  validationErrors: Array<{
    itemId: string
    productName: string
    issue: string
    severity: 'warning' | 'error'
  }>
}

export interface CartValidationResult {
  success: boolean
  cart?: DbCart
  message: string
  requiresUserAction?: boolean
}

// Get cart with real-time validation
export async function getValidatedCart(): Promise<CartValidationResult> {
  try {
    const user = await currentUser()
    if (!user?.id) {
      return {
        success: false,
        message: 'کاربر وارد نشده است.',
      }
    }

    const cart = await prisma.cart.findFirst({
      where: { userId: user.id },
      include: {
        cartItems: true,
      },
    })
    if (!cart) {
      return {
        success: false,
        message: 'سبد خرید یافت نشد.',
      }
    }

    if (cart.cartItems.length === 0) {
      return {
        success: false,
        message: 'سبد خرید خالی است.',
      }
    }

    // Validate each item against current product data
    const cartCurrency = cart.displayCurrency
    const itemsWithWrongCurrency = cart.cartItems.filter(
      (item) => item.currency !== cartCurrency
    )

    if (itemsWithWrongCurrency.length > 0) {
      return {
        success: false,
        message: `برخی محصولات با واحد پول متفاوت هستند. واحد پول سبد خرید: ${cartCurrency}`,
        requiresUserAction: true,
      }
    }

    const validatedItems: DbCartItem[] = []
    const validationErrors: DbCart['validationErrors'] = []
    let hasValidationIssues = false
    let recalculatedSubTotal = 0

    for (const item of cart.cartItems) {
      // Get current product and size data
      const currentVariant = await prisma.productVariant.findUnique({
        where: { id: item.variantId },
        include: { product: { include: { images: { take: 1 } } } },
      })

      if (!currentVariant) {
        validationErrors.push({
          itemId: item.id,
          productName: item.name,
          issue: 'محصول دیگر موجود نیست.',
          severity: 'error',
        })
        hasValidationIssues = true
        continue
      }

      const currentPrice =
        currentVariant.discount > 0
          ? currentVariant.price -
            currentVariant.price * (currentVariant.discount / 100)
          : currentVariant.price
      const isStockValid = currentVariant.quantity >= item.quantity
      const isPriceValid = Math.abs(currentPrice - item.price) < 0.01
      const maxAvailableQuantity = currentVariant.quantity

      if (!isStockValid) {
        hasValidationIssues = true
        if (currentVariant.quantity === 0) {
          validationErrors.push({
            itemId: item.id,
            productName: item.name,
            issue: 'موجودی تمام شده است.',
            severity: 'error',
          })
        } else {
          validationErrors.push({
            itemId: item.id,
            productName: item.name,
            issue: `تنها ${currentVariant.quantity} عدد در انبار موجود است. (درخواستی: ${item.quantity})`,
            severity: 'warning',
          })
        }
      }

      if (!isPriceValid) {
        hasValidationIssues = true
        validationErrors.push({
          itemId: item.id,
          productName: item.name,
          issue: 'قیمت تغییر کرده است!',
          severity: 'warning',
        })
      }

      // Add validation issues
      if (!isStockValid) {
        if (currentVariant.quantity === 0) {
          validationErrors.push({
            itemId: item.id,
            productName: item.name,
            issue: 'موجودی تمام شده است.',
            severity: 'error',
          })
        } else {
          validationErrors.push({
            itemId: item.id,
            productName: item.name,
            issue: `تنها ${currentVariant.quantity} عدد در انبار موجود است. (درخواستی: ${item.quantity})`,
            severity: 'warning',
          })
        }
        hasValidationIssues = true
      }

      if (!isPriceValid) {
        validationErrors.push({
          itemId: item.id,
          productName: item.name,
          issue: `قیمت تغییر کرده است! قیمت قبلی: ${item.price.toLocaleString()}، قیمت جدید: ${currentPrice.toLocaleString()}`,
          severity: 'warning',
        })
        hasValidationIssues = true
      }

      if (item.currency !== cartCurrency) {
        validationErrors.push({
          itemId: item.id,
          productName: item.name,
          issue: `واحد پول محصول (${item.currency}) با واحد پول سبد خرید (${cartCurrency}) مطابقت ندارد.`,
          severity: 'error',
        })
        hasValidationIssues = true
      }

      const validatedQuantity = Math.min(item.quantity, currentVariant.quantity)
      const validatedTotalPrice = currentPrice * validatedQuantity

      validatedItems.push({
        id: item.id,
        productId: item.productId,
        variantId: item.variantId,
        productSlug: item.productSlug,
        sku: item.sku,
        name: item.name,
        image: currentVariant.product?.images?.[0]?.url || item.image,
        size: item.size,
        price: item.price,
        quantity: item.quantity,
        shippingFee: item.shippingFee,
        totalPrice: item.totalPrice,
        currency: item.currency, // ✅ NEW: Include currency in validated item
        // Current validation data
        currentStock: currentVariant.quantity,
        currentPrice,
        isStockValid,
        isPriceValid,
        maxAvailableQuantity,
        color: item.color,
      })

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      recalculatedSubTotal += validatedTotalPrice
    }

    const hasErrors = validationErrors.some((err) => err.severity === 'error')

    if (hasErrors) {
      return {
        success: false,
        message: 'سبد خرید دارای خطاهای مهم است. لطفا آن‌ها را برطرف کنید.',
        cart: {
          ...cart,
          items: validatedItems,
          currency: cart.displayCurrency,
          hasValidationIssues: true,
          validationErrors,
        },
        requiresUserAction: true,
      }
    }

    const validatedCart: DbCart = {
      ...cart,
      items: validatedItems,
      currency: cart.displayCurrency,
      hasValidationIssues,
      validationErrors,
    }

    return {
      success: true,
      cart: validatedCart,
      message: hasValidationIssues
        ? 'سبد خرید شما بروزرسانی شده است. لطفا تغییرات را بررسی کنید.'
        : 'سبد خرید معتبر است.',
      requiresUserAction: hasValidationIssues,
    }
  } catch (error) {
    console.error('Cart validation error:', error)
    return {
      success: false,
      message: 'خطا در بارگذاری سبد خرید.',
    }
  }
}

// Fix cart issues automatically where possible
export async function autoFixCartIssues(cartId: string) {
  try {
    const user = await currentUser()
    if (!user?.id) {
      return { success: false, message: 'کاربر وارد نشده است.' }
    }

    await prisma.$transaction(async (tx) => {
      const cart = await tx.cart.findUnique({
        where: { id: cartId },
        include: { cartItems: true },
      })

      if (!cart || cart.userId !== user.id) {
        throw new Error('سبد خرید نامعتبر است.')
      }

      for (const item of cart.cartItems) {
        const currentVariant = await tx.productVariant.findUnique({
          where: { id: item.variantId },
        })

        if (!currentVariant || currentVariant.quantity === 0) {
          await tx.cartItem.delete({ where: { id: item.id } })
          continue
        }

        const currentPrice =
          currentVariant.discount > 0
            ? currentVariant.price -
              currentVariant.price * (currentVariant.discount / 100)
            : currentVariant.price
        const validQuantity = Math.min(item.quantity, currentVariant.quantity)

        if (currentVariant.quantity === 0) {
          // Remove out of stock items
          await tx.cartItem.delete({ where: { id: item.id } })
          continue
        }

        // Update item with corrected values
        await tx.cartItem.update({
          where: { id: item.id },
          data: {
            quantity: validQuantity,
            price: currentPrice,
            totalPrice: currentPrice * validQuantity,
          },
        })
      }

      const updatedItems = await tx.cartItem.findMany({ where: { cartId } })
      const newSubTotal = updatedItems.reduce(
        (sum, item) => sum + item.totalPrice,
        0
      )

      await tx.cart.update({
        where: { id: cartId },
        data: { subTotal: newSubTotal, total: newSubTotal }, // Reset total, shipping will be recalculated
      })
    })

    revalidatePath('/checkout')
    return {
      success: true,
      message: 'سبد خرید اصلاح شد.',
    }
  } catch (error) {
    console.error('Auto fix cart error:', error)
    return {
      success: false,
      message: 'خطا در اصلاح سبد خرید.',
    }
  }
}

// Remove invalid items from cart
export async function removeCartItems(cartId: string, itemIds: string[]) {
  try {
    const user = await currentUser()
    if (!user?.id) {
      return { success: false, message: 'کاربر وارد نشده است.' }
    }

    await prisma.$transaction(async (tx) => {
      // Verify cart ownership
      const cart = await tx.cart.findUnique({
        where: { id: cartId },
      })

      if (!cart || cart.userId !== user.id) {
        throw new Error('سبد خرید نامعتبر است.')
      }

      // Remove items
      await tx.cartItem.deleteMany({
        where: {
          id: { in: itemIds },
          cartId: cartId,
        },
      })

      // Recalculate cart totals
      const remainingItems = await tx.cartItem.findMany({
        where: { cartId: cartId },
      })

      const newSubTotal = remainingItems.reduce(
        (sum, item) => sum + item.totalPrice,
        0
      )

      await tx.cart.update({
        where: { id: cartId },
        data: {
          subTotal: newSubTotal,
          total: newSubTotal,
        },
      })
    })

    revalidatePath('/checkout')
    return {
      success: true,
      message: 'محصولات حذف شدند.',
    }
  } catch (error) {
    console.error('Remove cart items error:', error)
    return {
      success: false,
      message: 'خطا در حذف محصولات.',
    }
  }
}
