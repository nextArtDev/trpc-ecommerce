'use server'

import prisma from '@/lib/prisma'
import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { getValidatedCart } from './cart'
import { getUserById } from '../queries/user'
import { updateOrderToPaidSecure } from './payment1'
import { revalidatePath } from 'next/cache'
import { getCurrentUser } from '@/lib/auth-helpers'

import { UpdateOrderStatusFormSchema } from '../schemas'
import { currentUser } from '@/lib/auth'
import { Currency, OrderStatus } from '@/lib/types/home'
import { redirect } from 'next/navigation'

export async function createOrder(currency?: Currency) {
  try {
    const session = await getCurrentUser()
    // if (!session) throw new Error('User is not authenticated')

    // const cart = await getMyCart()
    const userId = session?.id

    if (!userId) {
      return {
        success: false,
        message: 'وارد حساب کاربری خود شوید!',
        redirectTo: '/sign-in',
      }
    }

    const user = await getUserById(userId)

    const cart = await getValidatedCart()
    if (!cart || !cart.cart?.items) {
      return {
        success: false,
        message: 'سبد خرید شما خالی است!',
        redirectTo: '/cart',
      }
    }

    const cartCurrency = cart.cart.currency
    if (currency && currency !== cartCurrency) {
      return {
        success: false,
        message: `خطا: واحد پول درخواستی (${currency}) با واحد پول سبد خرید (${cartCurrency}) مطابقت ندارد.`,
        redirectTo: '/cart',
      }
    }

    if (!user?.shippingAddresses.length) {
      return {
        success: false,
        message: 'آدرس پستی موجود نیست!',
        redirectTo: '/shipping-address',
      }
    }

    const itemCurrencies = new Set(cart.cart.items.map((item) => item.currency))
    if (itemCurrencies.size > 1) {
      return {
        success: false,
        message: 'خطا: محصولات با واحدهای پولی مختلف در سبد خرید وجود دارد.',
        redirectTo: '/cart',
      }
    }

    const order = await prisma.order.create({
      data: {
        userId: userId,
        shippingAddressId: user.shippingAddresses[0].id,
        orderStatus: 'Pending',
        paymentStatus: 'Pending',
        currency: cartCurrency,
        subTotal: cart.cart.subTotal, // Will calculate below
        shippingFees: cart.cart.shippingFees, // Will calculate below
        total: cart.cart.total, // Will calculate below
      },
    })
    const insertedOrderId = await prisma.$transaction(async (tx) => {
      for (const item of cart?.cart?.items ?? []) {
        await tx.orderItem.create({
          data: {
            // productId: item.productId,

            // sizeId: item.sizeId,
            variantId: item.variantId,
            color: item.color,
            productSlug: item.productSlug,
            sku: item.sku,
            name: item.name,
            image: item.image,
            size: item.size,
            quantity: item.quantity,
            price: item.price,
            shippingFee: item.shippingFee,
            totalPrice: item.totalPrice,
            orderId: order.id,
          },
        })
        // console.log({ orders })
      }

      // console.log({ order })
      await tx.cart.delete({
        where: {
          userId,
        },
      })
      //   console.log({ res })
      return order.id
    })
    // console.log({ insertedOrderId })

    if (!insertedOrderId) throw new Error('Order not created')

    const paymentRoute =
      cartCurrency === 'تومان'
        ? `/payment/${insertedOrderId}` // Iranian payment
        : `/payment/paypal/${insertedOrderId}` // International payment

    return {
      success: true,
      message: 'Order created',
      // redirectTo: `/order/${insertedOrderId}`,
      redirectTo: paymentRoute,
    }
  } catch (error) {
    console.log({ error })
    if (isRedirectError(error)) throw error
    return { success: false, message: error }
  }
}

export async function updateOrderToPaidCOD(orderId: string) {
  try {
    await updateOrderToPaidSecure({ orderId })

    revalidatePath(`/order/${orderId}`)

    return { success: true, message: 'وضعیت سفارش به پرداخت شده تغییر کرد.' }
  } catch (error) {
    // return { success: false, message: formatError(error) }
    return { success: false, message: error }
  }
}

export async function deliverOrder(orderId: string) {
  try {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
    })

    if (!order) throw new Error('Order not found')
    if (order.paymentStatus !== 'Paid') throw new Error('Order is not paid')

    await prisma.order.update({
      where: { id: orderId },
      data: {
        orderStatus: 'Delivered',
        // isDelivered: true,
        // deliveredAt: new Date(),
      },
    })

    revalidatePath(`/order/${orderId}`)

    return {
      success: true,
      message: 'سفارش به عنوان تحویل داده شده، ثبت شد.',
    }
  } catch (error) {
    return { success: false, message: error }
  }
}

interface UpdateOrderItemStatusFormState {
  status?: string
  errors: {
    status?: string[]
    _form?: string[]
  }
}

export async function updateOrderItemStatus(
  path: string,
  orderId: string,
  formState: UpdateOrderItemStatusFormState,
  formData: FormData
): Promise<UpdateOrderItemStatusFormState> {
  const result = UpdateOrderStatusFormSchema.safeParse({
    status: formData.get('status'),
  })

  if (!result.success) {
    console.error(result.error.flatten().fieldErrors)
    return {
      errors: result.error.flatten().fieldErrors,
    }
  }
  // console.log({ result })
  const session = await currentUser()

  if (!session || !session.id || session.role !== 'admin') {
    return {
      errors: {
        _form: ['شما اجازه دسترسی ندارید!'],
      },
    }
  }

  if (!orderId) {
    return {
      errors: {
        _form: ['سفارش در دسترس نیست!'],
      },
    }
  }
  try {
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
        // userId: session.id,
      },
    })
    if (!order?.id) {
      return {
        errors: {
          _form: ['سفارش در دسترس نیست!'],
        },
      }
    }
    // console.log('result.data.status ', result.data.status)
    // Verify seller ownership

    const updatedOrder = await prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        orderStatus: result.data.status as OrderStatus,
      },
    })

    revalidatePath(path)

    // console.log('Order updated successfully:', updatedOrder)

    return {
      status: updatedOrder.orderStatus as OrderStatus,
      errors: {},
    }
    //  return updatedOrder.status
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        errors: {
          _form: [err.message],
        },
      }
    } else {
      return {
        errors: {
          _form: ['مشکلی پیش آمده، لطفا دوباره امتحان کنید!'],
        },
      }
    }
  } finally {
    revalidatePath(path)
    redirect(path)
  }
}
