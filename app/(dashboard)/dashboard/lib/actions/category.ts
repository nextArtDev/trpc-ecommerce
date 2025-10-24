'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { deleteFileFromS3, uploadFileToS3 } from './s3Upload'
import { CategoryFormSchema } from '../schemas'
import { currentUser } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { Category } from '@/lib/generated/prisma'

//bunx @better-auth/cli generate
interface CreateCategoryFormState {
  success?: string
  errors: {
    name?: string[]
    url?: string[]
    featured?: string[]
    images?: string[]
    _form?: string[]
  }
}

export async function createCategory(
  data: unknown,
  path: string
): Promise<CreateCategoryFormState> {
  const result = CategoryFormSchema.safeParse(data)

  if (!result.success) {
    console.error(result.error.flatten().fieldErrors)
    return {
      errors: result.error.flatten().fieldErrors,
    }
  }
  //   console.log(result?.data)

  const user = await currentUser()
  if (!user || user.role !== 'admin') {
    if (!user) {
      return {
        errors: {
          _form: ['شما اجازه دسترسی ندارید!'],
        },
      }
    }
  }
  try {
    const isExisting = await prisma.category.findFirst({
      where: {
        OR: [{ name: result.data.name }, { url: result.data.url }],
      },
    })
    if (isExisting) {
      return {
        errors: {
          _form: ['دسته‌بندی با این نام موجود است!'],
        },
      }
    }
    // console.log(isExisting)
    // console.log(billboard)
    let imageIds: string[] = []
    if (result.data.images) {
      const filesToUpload = result.data.images.filter(
        (img): img is File => img instanceof File
      )
      const newImageUploadPromises = filesToUpload.map(async (img: File) => {
        const buffer = Buffer.from(await img.arrayBuffer())
        return uploadFileToS3(buffer, img.name)
      })
      const uploadedImages = await Promise.all(newImageUploadPromises)
      imageIds = uploadedImages
        .map((res) => res?.imageId)
        .filter(Boolean) as string[]
    }

    await prisma.category.create({
      data: {
        name: result.data.name,
        url: result.data.url,
        featured: result.data.featured,
        images: {
          connect: imageIds.map((id) => ({
            id: id,
          })),
        },
      },
    })
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'مشکلی در سرور پیش آمده.'
    return { errors: { _form: [message] } }
  }
  revalidatePath(path)
  redirect(`/dashboard/categories`)
}
interface EditCategoryFormState {
  errors: {
    name?: string[]
    name_fa?: string[]
    description?: string[]
    featured?: string[]

    images?: string[]
    _form?: string[]
  }
}
export async function editCategory(
  data: unknown,
  categoryId: string,
  path: string
): Promise<EditCategoryFormState> {
  const result = CategoryFormSchema.safeParse(data)

  // console.log(formData.getAll('featured'))

  if (!result.success) {
    // console.error(result.error.flatten().fieldErrors)
    return {
      errors: result.error.flatten().fieldErrors,
    }
  }
  //   console.log(result.data)
  //   const session = await currentUser()
  //   // if (!session || session.role !== 'admin') {
  //   if (!session) {
  //     return {
  //       errors: {
  //         _form: ['شما اجازه دسترسی ندارید!'],
  //       },
  //     }
  //   }
  if (!categoryId) {
    return {
      errors: {
        _form: ['دسته‌بندی در دسترس نیست!'],
      },
    }
  }
  // console.log(result)

  try {
    const isExisting:
      | (Category & {
          images: { id: string; key: string }[] | null
        })
      | null = await prisma.category.findFirst({
      where: { id: categoryId },
      include: {
        images: { select: { id: true, key: true } },
      },
    })
    if (!isExisting) {
      return {
        errors: {
          _form: ['دسته‌بندی حذف شده است!'],
        },
      }
    }

    const isNameExisting = await prisma.category.findFirst({
      where: {
        AND: [
          {
            OR: [{ name: result.data.name }, { url: result.data.url }],
          },
          {
            NOT: {
              id: categoryId,
            },
          },
        ],
      },
    })

    if (isNameExisting) {
      return {
        errors: {
          _form: ['دسته‌بندی با این نام موجود است!'],
        },
      }
    }

    // console.log(isExisting)
    // console.log(billboard)
    if (
      typeof result.data?.images?.[0] === 'object' &&
      result.data.images[0] instanceof File
    ) {
      if (isExisting.images && isExisting.images.length > 0) {
        const oldImageKeys = isExisting.images.map((img) => img.key)
        // console.log('Deleting old keys from S3:', oldImageKeys)
        await Promise.all(oldImageKeys.map((key) => deleteFileFromS3(key)))
      }
      //   const imageIds: string[] = []
      //   for (const img of result.data.images) {
      //     if (img instanceof File) {
      //       const buffer = Buffer.from(await img.arrayBuffer())
      //       const res = await uploadFileToS3(buffer, img.name)

      //       if (res?.imageId && typeof res.imageId === 'string') {
      //         imageIds.push(res.imageId)
      //       }
      //     }
      //   }
      const filesToUpload = result.data.images.filter(
        (img): img is File => img instanceof File
      )
      const newImageUploadPromises = filesToUpload.map(async (img: File) => {
        const buffer = Buffer.from(await img.arrayBuffer())
        return uploadFileToS3(buffer, img.name)
      })
      const uploadedImages = await Promise.all(newImageUploadPromises)
      const imageIds = uploadedImages
        .map((res) => res?.imageId)
        .filter(Boolean) as string[]
      // console.log(res)
      await prisma.category.update({
        where: {
          id: categoryId,
        },
        data: {
          images: {
            disconnect: isExisting.images?.map((image: { id: string }) => ({
              id: image.id,
            })),
          },
        },
      })
      await prisma.category.update({
        where: {
          id: categoryId,
        },
        data: {
          name: result.data.name,
          url: result.data.url,
          featured: result.data.featured,
          images: {
            connect: imageIds.map((id) => ({
              id: id,
            })),
          },
        },
      })
    } else {
      await prisma.category.update({
        where: {
          id: categoryId,
        },
        data: {
          name: result.data.name,
          url: result.data.url,
          featured: result.data.featured,
        },
      })
    }
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'مشکلی در سرور پیش آمده.'
    return { errors: { _form: [message] } }
  }
  revalidatePath(path)
  redirect(`/dashboard/categories`)
}

//////////////////////

interface DeleteBillboardFormState {
  errors: {
    name?: string[]
    featured?: string[]
    url?: string[]
    images?: string[]
    _form?: string[]
  }
}

export async function deleteCategory(
  path: string,
  categoryId: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  formState: DeleteBillboardFormState,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  formData: FormData
): Promise<DeleteBillboardFormState> {
  const user = await currentUser()
  if (!user || user.role !== 'admin') {
    if (!user) {
      return {
        errors: {
          _form: ['شما اجازه دسترسی ندارید!'],
        },
      }
    }
  }
  // console.log(result)
  if (!categoryId) {
    return {
      errors: {
        _form: ['دسته‌بندی در دسترس نیست!'],
      },
    }
  }

  try {
    const isExisting:
      | (Category & { images: { id: string; key: string }[] | null })
      | null = await prisma.category.findFirst({
      where: { id: categoryId },
      include: {
        images: { select: { id: true, key: true } },
      },
    })
    if (!isExisting) {
      return {
        errors: {
          _form: ['دسته‌بندی حذف شده است!'],
        },
      }
    }
    const subWithCategory = await prisma.subCategory.count({
      where: { categoryId: isExisting.id },
    })

    if (subWithCategory > 0) {
      return {
        errors: {
          _form: [
            'نمی‌توان دسته‌بندی را حذف کرد زیرا در آن زیردسته موجود است!',
          ],
        },
      }
    }
    if (isExisting.images && isExisting.images?.length > 0) {
      const oldImageKeys = isExisting.images.map((img) => img.key)

      await Promise.all(oldImageKeys.map((key) => deleteFileFromS3(key)))
      //   for (const image of isExisting.images) {
      //     if (image.key) {
      //       await deleteFileFromS3(image.key)
      //     }
      //   }
    }
    await prisma.category.delete({
      where: {
        id: categoryId,
      },
    })
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'مشکلی در سرور پیش آمده.'
    return { errors: { _form: [message] } }
  }
  revalidatePath(path)
  redirect(`/dashboard/categories`)
}

// export const getSubCategoryByCategoryId = async (categoryId: string) => {
//   try {
//     const subCategories = await getAllCategoriesForCategory(categoryId)
//     return subCategories
//   } catch (error) {
//     console.log(error)
//   }
// }
