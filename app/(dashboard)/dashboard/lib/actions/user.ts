'use server'

import { currentUser } from '@/lib/auth'
import { Role, User } from '@/lib/generated/prisma'
import prisma from '@/lib/prisma'
import { deleteFileFromS3 } from './s3Upload'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { updateUserSchema } from '../schemas'

// Delete a user
// export async function deleteUser(id: string) {
//   try {
//     await prisma.user.delete({ where: { id } })

//     revalidatePath('/admin/users')

//     return {
//       success: true,
//       message: 'User deleted successfully',
//     }
//   } catch (error) {
//     return {
//       success: false,
//       message: formatError(error),
//     }
//   }
// }

interface EditUserFormState {
  errors: {
    name?: string[]
    phoneNumber?: string[]
    role?: string[]

    _form?: string[]
  }
}
export async function updateUser(
  data: unknown,
  userId: string,
  path: string
): Promise<EditUserFormState> {
  const result = updateUserSchema.safeParse(data)
  if (!result.success) {
    // console.error(result.error.flatten().fieldErrors)
    return {
      errors: result.error.flatten().fieldErrors,
    }
  }
  const cUser = await currentUser()
  if (!cUser || cUser.role !== 'admin') {
    if (!cUser) {
      return {
        errors: {
          _form: ['شما اجازه دسترسی ندارید!'],
        },
      }
    }
  }
  if (!userId) {
    return {
      errors: {
        _form: ['کاربر در دسترس نیست!'],
      },
    }
  }
  try {
    const isExisting: User | null = await prisma.user.findFirst({
      where: { id: userId },
    })
    if (!isExisting) {
      return {
        errors: {
          _form: ['کاربر حذف شده است!'],
        },
      }
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        name: result.data.name,
        role: result.data.role as Role,
      },
    })
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'مشکلی در سرور پیش آمده.'
    return { errors: { _form: [message] } }
  }
  revalidatePath(path)
  redirect(path)
}

interface DeleteUserFormState {
  errors: {
    images?: string[]

    _form?: string[]
  }
}

export async function deleteUser(
  path: string,
  userId: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  formState: DeleteUserFormState,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  formData: FormData
): Promise<DeleteUserFormState> {
  const cUser = await currentUser()
  if (!cUser || cUser.role !== 'admin') {
    if (!cUser) {
      return {
        errors: {
          _form: ['شما اجازه دسترسی ندارید!'],
        },
      }
    }
  }
  // console.log(result)
  if (!userId) {
    return {
      errors: {
        _form: ['فروشگاه در دسترس نیست!'],
      },
    }
  }

  try {
    const isExisting:
      | (User & { images: { id: string; key: string }[] | null })
      | null = await prisma.user.findFirst({
      where: { id: userId },
      include: {
        images: { select: { id: true, key: true } },
      },
    })
    if (!isExisting) {
      return {
        errors: {
          _form: ['کاربر حذف شده است!'],
        },
      }
    }

    if (isExisting.images && isExisting.images?.length > 0) {
      const oldImageKeys = isExisting.images.map((img) => img.key)

      await Promise.all(oldImageKeys.map((key) => deleteFileFromS3(key)))
      await prisma.user.delete({
        where: {
          id: userId,
        },
      })
    }
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
  }
  await prisma.user.delete({ where: { id: userId } })
  revalidatePath(path)
  redirect(`/dashboard/users`)
}
