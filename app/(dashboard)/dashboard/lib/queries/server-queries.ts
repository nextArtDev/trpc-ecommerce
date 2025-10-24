'use server'

import prisma from '@/lib/prisma'
import { cache } from 'react'

export const getSubCategoryByCategoryId = cache(async (categoryId: string) => {
  try {
    // Retrieve all subcategories of category from the database
    const subCategories = prisma.subCategory.findMany({
      where: {
        categoryId,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    return subCategories
  } catch (error) {
    console.error(error)
  }
})

export const getCityByProvinceId = cache(async (provinceId: string) => {
  try {
    const cities = await prisma.city.findMany({
      where: {
        provinceId: +provinceId,
      },
      orderBy: {
        id: 'asc',
      },
    })

    return cities
  } catch (error) {
    console.log(error)
  }
})
