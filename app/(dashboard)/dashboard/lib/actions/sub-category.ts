'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { deleteFileFromS3, uploadFileToS3 } from './s3Upload'
import { SubCategoryFormSchema } from '../schemas'
import { currentUser } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { Language, SubCategory } from '@/lib/generated/prisma'

interface CreateSubCategoryFormState {
  success?: string
  errors: {
    translations?: string[]
    url?: string[]
    featured?: string[]
    categoryId?: string[]
    images?: string[]
    _form?: string[]
  }
}

export async function createSubCategory(
  data: unknown,
  path: string
): Promise<CreateSubCategoryFormState> {
  const result = SubCategoryFormSchema.safeParse(data)

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

  const isCategoryExisted = await prisma.category.findFirst({
    where: {
      id: result.data.categoryId,
    },
  })
  if (!isCategoryExisted) {
    return {
      errors: {
        _form: ['دسته‌بندی حذف شده است!'],
      },
    }
  }

  try {
    const isExisting = await prisma.subCategory.findFirst({
      where: { url: result.data.url },
    })
    if (isExisting) {
      return {
        errors: {
          _form: ['زیردسته با این نام موجود است!'],
        },
      }
    }
    const existingTranslations = await prisma.subCategoryTranslation.findFirst({
      where: {
        OR: [
          { name: result.data.translations.fa.name, language: 'fa' },
          { name: result.data.translations.en.name, language: 'en' },
          { name: result.data.translations.de.name, language: 'de' },
          { name: result.data.translations.fr.name, language: 'fr' },
          { name: result.data.translations.it.name, language: 'it' },
        ],
      },
    })

    if (existingTranslations) {
      return {
        errors: {
          _form: ['زیردسته با این نام در یکی از زبان‌ها موجود است!'],
        },
      }
    }
    // console.log(isExisting)

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

    await prisma.subCategory.create({
      data: {
        url: result.data.url,
        featured: result.data.featured,
        categoryId: result.data.categoryId,
        images: {
          connect: imageIds.map((id) => ({
            id: id,
          })),
        },
        translations: {
          create: [
            {
              language: 'fa' as Language,
              name: result.data.translations.fa.name,
              description: result.data.translations.fa.description || null,
            },
            {
              language: 'en' as Language,
              name: result.data.translations.en.name,
              description: result.data.translations.en.description || null,
            },
            {
              language: 'de' as Language,
              name: result.data.translations.de.name,
              description: result.data.translations.de.description || null,
            },
            {
              language: 'fr' as Language,
              name: result.data.translations.fr.name,
              description: result.data.translations.fr.description || null,
            },
            {
              language: 'it' as Language,
              name: result.data.translations.it.name,
              description: result.data.translations.it.description || null,
            },
          ],
        },
      },
    })
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'مشکلی در سرور پیش آمده.'
    return { errors: { _form: [message] } }
  }
  revalidatePath(path)
  redirect(`/dashboard/sub-categories`)
}
interface EditSubCategoryFormState {
  errors: {
    translations?: string[]
    description?: string[]
    categoryId?: string[]
    images?: string[]
    _form?: string[]
  }
}
export async function editSubCategory(
  data: unknown,
  subCategoryId: string,
  path: string
): Promise<EditSubCategoryFormState> {
  const result = SubCategoryFormSchema.safeParse(data)

  // console.log(result)
  // console.log(formData.getAll('images'))

  if (!result.success) {
    // console.error(result.error.flatten().fieldErrors)
    return {
      errors: result.error.flatten().fieldErrors,
    }
  }
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
  if (!subCategoryId) {
    return {
      errors: {
        _form: ['زیردسته‌بندی در دسترس نیست!'],
      },
    }
  }
  // console.log(result)

  try {
    const isExisting:
      | (SubCategory & {
          images: { id: string; key: string }[] | null
        })
      | null = await prisma.subCategory.findFirst({
      where: { id: subCategoryId },
      include: {
        images: { select: { id: true, key: true } },
      },
    })
    if (!isExisting) {
      return {
        errors: {
          _form: ['زیردسته حذف شده است!'],
        },
      }
    }

    const isUrlExisting = await prisma.subCategory.findFirst({
      where: {
        url: result.data.url,
        NOT: { id: subCategoryId },
      },
    })

    if (isUrlExisting) {
      return {
        errors: {
          _form: ['زیردسته با این URL موجود است!'],
        },
      }
    }

    // const isNameExisting = await prisma.subCategory.findFirst({
    //   where: {
    //     AND: [
    //       {
    //         OR: [{ name: result.data.name }, { url: result.data.url }],
    //       },
    //       {
    //         categoryId: result.data.categoryId,
    //         NOT: {
    //           id: subCategoryId,
    //         },
    //       },
    //     ],
    //   },
    // })

    // if (isNameExisting) {
    //   return {
    //     errors: {
    //       _form: ['زیردسته‌بندی با این نام موجود است!'],
    //     },
    //   }
    // }

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

      await prisma.subCategory.update({
        where: {
          id: subCategoryId,
        },
        data: {
          images: {
            disconnect: isExisting.images?.map((image: { id: string }) => ({
              id: image.id,
            })),
          },
        },
      })
      await prisma.subCategory.update({
        where: {
          id: subCategoryId,
        },
        data: {
          url: result.data.url,
          featured: result.data.featured,
          categoryId: result.data.categoryId,

          images: {
            connect: imageIds.map((id) => ({
              id: id,
            })),
          },
          translations: {
            upsert: [
              {
                where: {
                  subCategoryId_language: {
                    subCategoryId: subCategoryId,
                    language: 'fa' as Language,
                  },
                },
                update: {
                  name: result.data.translations.fa.name,
                  description: result.data.translations.fa.description || null,
                },
                create: {
                  language: 'fa' as Language,
                  name: result.data.translations.fa.name,
                  description: result.data.translations.fa.description || null,
                },
              },
              {
                where: {
                  subCategoryId_language: {
                    subCategoryId: subCategoryId,
                    language: 'en' as Language,
                  },
                },
                update: {
                  name: result.data.translations.en.name,
                  description: result.data.translations.en.description || null,
                },
                create: {
                  language: 'en' as Language,
                  name: result.data.translations.en.name,
                  description: result.data.translations.en.description || null,
                },
              },
              {
                where: {
                  subCategoryId_language: {
                    subCategoryId: subCategoryId,
                    language: 'de' as Language,
                  },
                },
                update: {
                  name: result.data.translations.de.name,
                  description: result.data.translations.de.description || null,
                },
                create: {
                  language: 'de' as Language,
                  name: result.data.translations.de.name,
                  description: result.data.translations.de.description || null,
                },
              },
              {
                where: {
                  subCategoryId_language: {
                    subCategoryId: subCategoryId,
                    language: 'fr' as Language,
                  },
                },
                update: {
                  name: result.data.translations.fr.name,
                  description: result.data.translations.fr.description || null,
                },
                create: {
                  language: 'fr' as Language,
                  name: result.data.translations.fr.name,
                  description: result.data.translations.fr.description || null,
                },
              },
              {
                where: {
                  subCategoryId_language: {
                    subCategoryId: subCategoryId,
                    language: 'it' as Language,
                  },
                },
                update: {
                  name: result.data.translations.it.name,
                  description: result.data.translations.it.description || null,
                },
                create: {
                  language: 'it' as Language,
                  name: result.data.translations.it.name,
                  description: result.data.translations.it.description || null,
                },
              },
            ],
          },
        },
      })
    } else {
      await prisma.subCategory.update({
        where: {
          id: subCategoryId,
        },
        data: {
          url: result.data.url,
          featured: result.data.featured,
          categoryId: result.data.categoryId,
          translations: {
            upsert: [
              {
                where: {
                  subCategoryId_language: {
                    subCategoryId: subCategoryId,
                    language: 'fa' as Language,
                  },
                },
                update: {
                  name: result.data.translations.fa.name,
                  description: result.data.translations.fa.description || null,
                },
                create: {
                  language: 'fa' as Language,
                  name: result.data.translations.fa.name,
                  description: result.data.translations.fa.description || null,
                },
              },
              {
                where: {
                  subCategoryId_language: {
                    subCategoryId: subCategoryId,
                    language: 'en' as Language,
                  },
                },
                update: {
                  name: result.data.translations.en.name,
                  description: result.data.translations.en.description || null,
                },
                create: {
                  language: 'en' as Language,
                  name: result.data.translations.en.name,
                  description: result.data.translations.en.description || null,
                },
              },
              {
                where: {
                  subCategoryId_language: {
                    subCategoryId: subCategoryId,
                    language: 'de' as Language,
                  },
                },
                update: {
                  name: result.data.translations.de.name,
                  description: result.data.translations.de.description || null,
                },
                create: {
                  language: 'de' as Language,
                  name: result.data.translations.de.name,
                  description: result.data.translations.de.description || null,
                },
              },
              {
                where: {
                  subCategoryId_language: {
                    subCategoryId: subCategoryId,
                    language: 'fr' as Language,
                  },
                },
                update: {
                  name: result.data.translations.fr.name,
                  description: result.data.translations.fr.description || null,
                },
                create: {
                  language: 'fr' as Language,
                  name: result.data.translations.fr.name,
                  description: result.data.translations.fr.description || null,
                },
              },
              {
                where: {
                  subCategoryId_language: {
                    subCategoryId: subCategoryId,
                    language: 'it' as Language,
                  },
                },
                update: {
                  name: result.data.translations.it.name,
                  description: result.data.translations.it.description || null,
                },
                create: {
                  language: 'it' as Language,
                  name: result.data.translations.it.name,
                  description: result.data.translations.it.description || null,
                },
              },
            ],
          },
        },
      })
    }
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'مشکلی در سرور پیش آمده.'
    return { errors: { _form: [message] } }
  }
  revalidatePath(path)
  redirect(`/dashboard/sub-categories`)
}

//////////////////////

interface DeleteSubCategoryFormState {
  errors: {
    // translations?: string[]
    // featured?: string[]
    // url?: string[]
    images?: string[]

    _form?: string[]
  }
}

export async function deleteSubCategory(
  path: string,
  subCategoryId: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  formState: DeleteSubCategoryFormState,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  formData: FormData
): Promise<DeleteSubCategoryFormState> {
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
  if (!subCategoryId) {
    return {
      errors: {
        _form: ['فروشگاه در دسترس نیست!'],
      },
    }
  }

  try {
    const isExisting:
      | (SubCategory & { images: { id: string; key: string }[] | null })
      | null = await prisma.subCategory.findFirst({
      where: { id: subCategoryId },
      include: {
        images: { select: { id: true, key: true } },
      },
    })
    if (!isExisting) {
      return {
        errors: {
          _form: ['زیر دسته‌بندی حذف شده است!'],
        },
      }
    }
    const productWithSubcategory = await prisma.product.count({
      where: { subCategoryId: isExisting.id },
    })

    if (productWithSubcategory > 0) {
      return {
        errors: {
          _form: ['نمی‌توان زیردسته را حذف کرد زیرا در آن محصولات موجود است!'],
        },
      }
    }
    if (isExisting?.images && isExisting?.images?.length > 0) {
      const oldImageKeys = isExisting.images.map((img) => img.key)

      await Promise.all(oldImageKeys.map((key) => deleteFileFromS3(key)))
    }
    await prisma.subCategory.delete({
      where: {
        id: subCategoryId,
      },
    })
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
  revalidatePath(path)
  redirect(`/dashboard/sub-categories`)
}
