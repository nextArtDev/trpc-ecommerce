'use server'

import { currentUser } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { shippingAddressSchema } from '../schemas'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { updateCartWithShipping } from './cart'
import { getCurrentUser } from '@/lib/auth-helpers'
import { formatError } from '@/lib/utils'
import { AddressType } from '@/lib/generated/prisma'

interface CreateShippingAddressFormState {
  success?: string
  errors: {
    name?: string[]
    address1?: string[]
    addressType?: string[]
    cityId?: string[]
    provinceId?: string[]
    countryId?: string[]
    stateId?: string[]
    state?: string[]
    cityInt?: string[]
    zip_code?: string[]
    _form?: string[]
  }
}

export async function createShippingAddress(
  data: unknown,
  phone: string,
  path: string
): Promise<CreateShippingAddressFormState> {
  const result = shippingAddressSchema.safeParse(data)

  if (!result.success) {
    console.error(result.error.flatten().fieldErrors)
    return {
      errors: result.error.flatten().fieldErrors,
    }
  }
  // console.log('phone', phone)
  // console.log('result.data', result.data)
  try {
    const cUser = await currentUser()
    // console.log('cUser', cUser)
    // if (!cUser || !cUser.phoneNumber) {
    if (!cUser || !cUser.name) {
      return {
        errors: {
          _form: ['شما اجازه دسترسی ندارید!'],
        },
      }
    }

    const { addressType } = result.data

    const userAddress = await prisma.user.findFirst({
      where: {
        id: cUser.id,
      },
    })

    if (cUser.id !== userAddress?.id) {
      return {
        errors: {
          _form: ['شما اجازه دسترسی ندارید!'],
        },
      }
    }
    // Prepare address data based on type
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const addressData: any = {
      name: result.data.name,
      address1: result.data.address1,
      address2: result.data.address2 || null,
      zip_code: result.data.zip_code || null,
      userId: cUser.id,
      phone: phone.toString(),
      addressType: result.data.addressType,
    }

    if (addressType === AddressType.IRANIAN) {
      addressData.provinceId = result.data.provinceId
      addressData.cityId = result.data.cityId
      // Clear international fields
      addressData.countryId = null
      addressData.stateId = null
      addressData.state = null
      addressData.cityInt = null
    } else {
      addressData.countryId = result.data.countryId
      addressData.stateId = result.data.stateId || null
      addressData.state = result.data.state
      addressData.cityInt = result.data.cityInt
      // Clear Iranian fields
      addressData.provinceId = null
      addressData.cityId = null
    }

    // console.log(user)
    const shippingAddress = await prisma.shippingAddress.create({
      data: addressData,
      include: {
        province: {
          select: { name: true },
        },
        city: {
          select: { name: true },
        },
        country: {
          select: { name: true },
        },
        state: {
          select: { name: true },
        },
        user: {
          select: {
            name: true,
            cart: { select: { id: true } },
          },
        },
      },
    })

    let AddressToSaveForUser: string
    if (addressType === AddressType.IRANIAN) {
      AddressToSaveForUser = `${shippingAddress?.province?.name}-${shippingAddress?.city?.name} | ${shippingAddress.address1} - ${shippingAddress.zip_code}`
    } else {
      AddressToSaveForUser = `${shippingAddress?.country?.name}, ${
        shippingAddress?.state?.name || shippingAddress.state
      }, ${shippingAddress.cityInt} | ${shippingAddress.address1} - ${
        shippingAddress.zip_code || 'N/A'
      }`
    }

    await prisma.user.update({
      where: { id: cUser.id },
      data: {
        address: AddressToSaveForUser,
        name: result.data.name,
      },
    })

    await updateCartWithShipping(
      shippingAddress.user.cart?.id as string,
      shippingAddress.id
    )
    // console.log({ shippingFee })
    // updateCartWithShipping(cart)
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'مشکلی در سرور پیش آمده.'
    return { errors: { _form: [message] } }
  }
  revalidatePath(path)
  redirect(`/place-order`)
}
interface EditShippingAddressFormState {
  success?: string
  errors: {
    name?: string[]
    address1?: string[]
    addressType?: string[]
    cityId?: string[]
    provinceId?: string[]
    countryId?: string[]
    stateId?: string[]
    state?: string[]
    cityInt?: string[]
    zip_code?: string[]
    _form?: string[]
  }
}

export async function editShippingAddress(
  data: unknown,
  shippingAddressId: string,
  path: string
): Promise<EditShippingAddressFormState> {
  const result = shippingAddressSchema.safeParse(data)

  if (!result.success) {
    console.error(result.error.flatten().fieldErrors)
    return {
      errors: result.error.flatten().fieldErrors,
    }
  }

  if (!shippingAddressId) {
    return {
      errors: {
        _form: ['آدرس مورد نظر در دسترس نیست!'],
      },
    }
  }
  try {
    const cUser = await currentUser()
    // if (!cUser || !cUser.phoneNumber) {
    if (!cUser || !cUser.name) {
      return {
        errors: {
          _form: ['شما اجازه دسترسی ندارید!'],
        },
      }
    }
    const isExisting = await prisma.shippingAddress.findFirst({
      where: {
        id: shippingAddressId,
      },
    })
    if (!isExisting) {
      return {
        errors: {
          _form: ['آدرس مورد نظر در دسترس نیست!'],
        },
      }
    }

    const userAddress = await prisma.user.findFirst({
      where: {
        id: cUser.id,
      },
    })

    if (cUser.id !== userAddress?.id) {
      return {
        errors: {
          _form: ['شما اجازه دسترسی ندارید!'],
        },
      }
    }
    // await prisma.user.findFirst({
    //   where: {
    //     id: cUser.id,
    //   },
    //   include: {
    //     shippingAddresses: {
    //       include: {
    //         city: true,
    //         province: true,
    //         country: true,
    //         state: true,
    //       },
    //     },
    //   },
    // })

    // console.log(user)

    const { addressType } = result.data

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const addressData: any = {
      name: result.data.name,
      address1: result.data.address1,
      address2: result.data.address2 || null,
      zip_code: result.data.zip_code || null,
      addressType: result.data.addressType,
    }

    if (addressType === AddressType.IRANIAN) {
      addressData.provinceId = result.data.provinceId
      addressData.cityId = result.data.cityId
      // Clear international fields
      addressData.country = { disconnect: true }
      addressData.state = { disconnect: true }
    } else {
      // For international addresses, use the correct field names
      addressData.country = { connect: { id: result.data.countryId } }
      if (result.data.stateId) {
        addressData.state = { connect: { id: result.data.stateId } }
      }
      // Clear Iranian fields
      addressData.province = { disconnect: true }
      addressData.city = { disconnect: true }
    }

    const shippingAddress = await prisma.shippingAddress.update({
      where: { id: shippingAddressId },
      data: addressData,
      include: {
        province: {
          select: { name: true },
        },
        city: {
          select: { name: true },
        },
        country: {
          select: { name: true },
        },
        state: {
          select: { name: true },
        },
        user: {
          select: {
            name: true,
            cart: { select: { id: true } },
          },
        },
      },
    })

    await updateCartWithShipping(
      shippingAddress.user.cart?.id as string,
      shippingAddress.id
    )

    // console.log({ shippingAddress })
    let AddressToSaveForUser: string
    if (addressType === AddressType.IRANIAN) {
      AddressToSaveForUser = `${shippingAddress?.province?.name}-${shippingAddress?.city?.name} | ${shippingAddress.address1} - ${shippingAddress.zip_code}`
    } else {
      AddressToSaveForUser = `${shippingAddress?.country?.name}, ${
        shippingAddress?.state?.name
      }, ${shippingAddress.cityInt} | ${shippingAddress.address1} - ${
        shippingAddress.zip_code || 'N/A'
      }`
    }

    await prisma.user.update({
      where: { id: userAddress.id },
      data: {
        address: AddressToSaveForUser,
        name: result.data.name,
      },
    })
    // console.log(res)
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'مشکلی در سرور پیش آمده.'
    return { errors: { _form: [message] } }
  }
  revalidatePath(path)
  redirect(`/place-order`)
}

export async function updateProfile(user: { name: string; phone?: string }) {
  try {
    const session = await getCurrentUser()
    if (!session) throw new Error('کاربر پیدا نشد!')
    const currentUser = await prisma.user.findFirst({
      where: {
        id: session?.id,
        // phone: user?.phone,
      },
    })

    if (!currentUser) throw new Error('User not found')

    await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        name: user.name,
      },
    })

    return {
      success: true,
      message: 'اطلاعات با موفقیت آپدیت شد!',
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

interface ActionState {
  errors: {
    _form?: string[]
    [key: string]: string[] | undefined
  }
  message?: string
  success?: boolean
}

export async function toggleWishlistItem(
  path: string,
  productId: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  formState: ActionState,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  formData: FormData
): Promise<ActionState> {
  try {
    const user = await currentUser()

    if (!user || !user.id) {
      redirect('/sign-in')
    }

    const userId = user.id

    // Check if the item already exists in the wishlist
    const existingWishlistItem = await prisma.wishlist.findFirst({
      where: {
        userId,
        productId,
      },
    })

    if (existingWishlistItem) {
      // If it exists, remove it from the wishlist
      await prisma.wishlist.delete({
        where: {
          id: existingWishlistItem.id,
        },
      })

      revalidatePath(path)
      return {
        errors: {},
        message: 'محصول از لیست علاقه‌مندی‌ها حذف شد.',
        success: true,
      }
    } else {
      await prisma.wishlist.create({
        data: {
          userId,
          productId,
        },
      })

      revalidatePath(path)
      return {
        errors: {},
        message: 'محصول به لیست علاقه‌مندی‌ها اضافه شد.',
        success: true,
      }
    }
  } catch (err: unknown) {
    console.error('Error in toggleWishlistItem:', err)
    const message =
      err instanceof Error ? err.message : 'مشکلی در سرور پیش آمده.'

    return {
      errors: {
        _form: [message],
      },
      success: false,
    }
  }
}

// interface SignOutFormState {
//   errors: {
//     _form?: string[]
//   }
// }
// export async function signOutAction(
//   // path: string,
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   formState: SignOutFormState,
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   formData: FormData
// ): Promise<SignOutFormState> {
//   const user = await currentUser()

//   if (!user) redirect('/sign-in')

//   try {
//     const ascr = await authClient.signOut()
//     console.log({ ascr })
//   } catch (err: unknown) {
//     if (err instanceof Error) {
//       return {
//         errors: {
//           _form: [err.message],
//         },
//       }
//     } else {
//       return {
//         errors: {
//           _form: ['مشکلی پیش آمده، لطفا دوباره امتحان کنید!'],
//         },
//       }
//     }
//   }
//   // revalidatePath(path)
//   redirect('/sign-in')
// }

export async function signOutServerAction() {
  // Revalidate all auth-related paths
  revalidatePath('/', 'layout')
  redirect('/sign-in')
}
