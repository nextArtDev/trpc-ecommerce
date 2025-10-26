import { currentUser } from '@/lib/auth'
import { Language, Prisma, Review } from '@/lib/generated/prisma'
import prisma from '@/lib/prisma'
import {
  CategoryWithStats,
  ProductDetails,
  SearchFilters,
  SubCategoryForHomePage,
} from '@/lib/types/home'
import { redirect } from 'next/navigation'
import { cache } from 'react'
import { getLocale } from 'next-intl/server'

const getTranslationSelect = (locale: Language) => ({
  where: { language: locale },
  select: {
    name: true,
    description: true,
  },
})

// Homepage Products (with basic info + first image)
export async function getHomepageProducts(limit: number = 12) {
  const locale = (await getLocale()) as Language
  return await prisma.product.findMany({
    take: limit,
    select: {
      id: true,
      // name: true,
      // description: true,
      slug: true,
      rating: true,
      isFeatured: true,
      isSale: true,
      saleEndDate: true,
      updatedAt: true,
      // Get translations for current locale
      translations: {
        where: { language: locale },
        select: {
          name: true,
          description: true,
        },
        take: 1,
      },
      // Get only the first image for performance
      images: {
        take: 1,
        select: {
          id: true,
          url: true,
          key: true,
        },
      },
      // Get minimum size info for price display
      variants: {
        select: {
          price: true,
          discount: true,
          quantity: true,
        },
        where: {
          quantity: {
            gt: 0,
          },
        },
        orderBy: [
          { quantity: 'desc' }, // Prioritize higher stock
          { price: 'asc' }, // Then lowest price
        ],
        take: 1,
      },
      category: {
        select: {
          id: true,
          url: true,
          translations: {
            where: { language: locale },
            select: { name: true },
            take: 1,
          },
        },
      },
      subCategory: {
        select: {
          id: true,
          url: true,
          translations: {
            where: { language: locale },
            select: { name: true },
            take: 1,
          },
        },
      },
    },
    where: {
      variants: {
        some: {
          quantity: {
            gt: 0,
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

// 2. BEST SELLERS SECTION

export async function getNewProducts(limit: number = 8) {
  const locale = (await getLocale()) as Language

  return await prisma.product.findMany({
    take: limit,
    select: {
      id: true,
      slug: true,
      rating: true,
      sales: true,
      brand: true,
      translations: {
        where: { language: locale },
        select: {
          name: true,
          description: true,
        },
        take: 1,
      },
      images: {
        take: 1,
        select: {
          url: true,
        },
      },
      category: {
        select: {
          id: true,
          url: true,
          translations: {
            where: { language: locale },
            select: { name: true },
            take: 1,
          },
        },
      },
      subCategory: {
        select: {
          id: true,
          url: true,
          translations: {
            where: { language: locale },
            select: { name: true },
            take: 1,
          },
        },
      },
      variants: {
        select: {
          price: true,
          discount: true,
          quantity: true,
        },
        where: {
          quantity: {
            gt: 0,
          },
        },
        orderBy: [{ quantity: 'desc' }, { price: 'asc' }],
        take: 1,
      },
    },
    where: {
      variants: {
        some: {
          quantity: {
            gt: 0,
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

// 4. CATEGORIES FOR NAVIGATION/HOMEPAGE
export async function getBestSellers(limit: number = 8) {
  const locale = (await getLocale()) as Language

  return await prisma.product.findMany({
    take: limit,
    select: {
      id: true,
      slug: true,
      rating: true,
      sales: true,
      brand: true,
      translations: {
        where: { language: locale },
        select: {
          name: true,
          description: true,
        },
        take: 1,
      },
      images: {
        take: 1,
        select: {
          url: true,
        },
      },
      category: {
        select: {
          id: true,
          url: true,
          translations: {
            where: { language: locale },
            select: { name: true },
            take: 1,
          },
        },
      },
      subCategory: {
        select: {
          id: true,
          url: true,
          translations: {
            where: { language: locale },
            select: { name: true },
            take: 1,
          },
        },
      },
      variants: {
        select: {
          price: true,
          discount: true,
          quantity: true,
        },
        where: {
          quantity: {
            gt: 0,
          },
        },
        orderBy: [{ quantity: 'desc' }, { price: 'asc' }],
        take: 1,
      },
    },
    where: {
      variants: {
        some: {
          quantity: {
            gt: 0,
          },
        },
      },
    },
    orderBy: {
      sales: 'desc',
    },
  })
}

// SubCategories with translations
export async function getSubCategories() {
  const locale = (await getLocale()) as Language

  return await prisma.subCategory.findMany({
    where: { featured: true },
    select: {
      id: true,
      url: true,
      translations: {
        where: { language: locale },
        select: {
          name: true,
          description: true,
        },
        take: 1,
      },
      images: {
        select: {
          url: true,
        },
        take: 1,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

// Categories with translations
export async function getCategoriesWithStats() {
  const locale = (await getLocale()) as Language

  return await prisma.category.findMany({
    select: {
      id: true,
      url: true,
      updatedAt: true,
      featured: true,
      translations: {
        where: { language: locale },
        select: {
          name: true,
        },
        take: 1,
      },
      images: {
        take: 1,
        select: {
          url: true,
        },
      },
      _count: {
        select: {
          products: true,
        },
      },
      subCategories: {
        select: {
          id: true,
          url: true,
          translations: {
            where: { language: locale },
            select: {
              name: true,
            },
            take: 1,
          },
          images: {
            select: { url: true },
            take: 1,
          },
          _count: {
            select: {
              products: true,
            },
          },
        },
        take: 5,
      },
    },
    orderBy: {
      featured: 'desc',
    },
  })
}

// 5. SEARCH/FILTER PAGE - More comprehensive

// 6. SINGLE PRODUCT PAGE - Full details
export const getProductDetails = cache(async (slug: string) => {
  const locale = (await getLocale()) as Language

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      translations: {
        where: { language: locale },
        select: {
          name: true,
          description: true,
          // keywords: true,
        },
        take: 1,
      },
      images: {
        select: {
          url: true,
        },
      },

      variants: {
        select: {
          id: true,
          price: true,
          quantity: true,
          discount: true,
          weight: true,
          length: true,
          width: true,
          height: true,
          images: {
            select: {
              url: true,
            },
          },
          color: {
            select: {
              id: true,
              name: true,
              hex: true,
            },
          },
          size: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: [{ price: 'asc' }, { quantity: 'desc' }],
      },
      specs: {
        select: {
          translations: {
            where: { language: locale },
            select: {
              name: true,
              value: true,
            },
            take: 1,
          },
        },
      },
      questions: {
        select: {
          translations: {
            where: { language: locale },
            select: {
              question: true,
              answer: true,
            },
            take: 1,
          },
        },
      },
      reviews: {
        where: {
          isPending: false,
        },
        select: {
          id: true,
          isFeatured: true,
          isPending: true,
          isVerifiedPurchase: true,
          rating: true,
          title: true,
          description: true,
          likes: true,
          createdAt: true,
          user: {
            select: {
              name: true,
            },
          },
          images: {
            select: {
              url: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 10,
      },
      category: {
        select: {
          id: true,
          url: true,
          translations: {
            where: { language: locale },
            select: {
              name: true,
            },
            take: 1,
          },
        },
      },
      subCategory: {
        select: {
          id: true,
          url: true,
          translations: {
            where: { language: locale },
            select: {
              name: true,
            },
            take: 1,
          },
        },
      },
      offerTag: {
        select: {
          url: true,
          translations: {
            where: { language: locale },
            select: {
              name: true,
            },
            take: 1,
          },
        },
      },
      freeShipping: {
        include: {
          eligibleCities: {
            include: {
              city: true,
            },
          },
        },
      },
    },
  })

  if (product) {
    prisma.product
      .update({
        where: { id: product.id },
        data: { views: { increment: 1 } },
      })
      .catch(console.error)
  }

  return product
})

// 7. RELATED PRODUCTS
export async function getRelatedProducts(
  productId: string,
  subCategoryId: string,
  limit: number = 6
) {
  return await prisma.product.findMany({
    where: {
      subCategoryId,
      id: { not: productId },
    },
    select: {
      id: true,
      // name: true,
      translations: {
        select: {
          name: true,
        },
      },
      slug: true,
      rating: true,
      images: {
        take: 1,
        select: {
          url: true,
        },
      },
      variants: {
        select: {
          price: true,
          discount: true,
        },
        orderBy: {
          price: 'asc',
        },
        take: 1,
      },
    },
    take: limit,

    orderBy: {
      rating: 'desc',
    },
  })
}

export async function searchProducts({
  search,
  categoryId,
  subCategoryId,
  minPrice,
  maxPrice,
  sortBy = 'newest',
  page = 1,
  limit = 20,
  colors,
  sizes,
  brands,
}: {
  search?: string
  categoryId?: string
  subCategoryId?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: 'newest' | 'oldest' | 'price_asc' | 'price_desc' | 'rating' | 'sales'
  page?: number
  limit?: number
  colors?: string[]
  sizes?: string[]
  brands?: string[]
}) {
  const locale = (await getLocale()) as Language
  const skip = (page - 1) * limit

  const where: Prisma.ProductWhereInput = { AND: [] }
  const pushToAnd = (condition: Prisma.ProductWhereInput) =>
    (where.AND as Prisma.ProductWhereInput[]).push(condition)

  // Search in translations
  if (search) {
    ;(where.AND as Prisma.ProductWhereInput[]).push({
      OR: [
        {
          translations: {
            some: {
              language: locale,
              OR: [
                { name: { contains: search } },
                { description: { contains: search } },
              ],
            },
          },
        },
        { keywords: { contains: search } },
        { brand: { contains: search } },
      ],
    })
  }

  if (categoryId) pushToAnd({ categoryId })
  if (subCategoryId) pushToAnd({ subCategoryId })
  if (brands && brands.length > 0) pushToAnd({ brand: { in: brands } })

  const variantWhere: Prisma.ProductVariantWhereInput = { AND: [] }
  const pushToVariantAnd = (condition: Prisma.ProductVariantWhereInput) =>
    (variantWhere.AND as Prisma.ProductVariantWhereInput[]).push(condition)

  if (minPrice || maxPrice) {
    pushToVariantAnd({ price: { gte: minPrice, lte: maxPrice } })
  }
  if (sizes && sizes.length > 0) {
    pushToVariantAnd({ size: { name: { in: sizes } } })
  }
  if (colors && colors.length > 0) {
    pushToVariantAnd({ color: { hex: { in: colors } } })
  }

  if ((variantWhere.AND as unknown[]).length > 0) {
    pushToAnd({ variants: { some: variantWhere } })
  }

  const isPriceSort = sortBy === 'price_asc' || sortBy === 'price_desc'
  let orderBy: Prisma.ProductOrderByWithRelationInput = {}

  if (!isPriceSort) {
    switch (sortBy) {
      case 'rating':
        orderBy = { rating: 'desc' }
        break
      case 'sales':
        orderBy = { sales: 'desc' }
        break
      case 'oldest':
        orderBy = { createdAt: 'asc' }
        break
      case 'newest':
      default:
        orderBy = { createdAt: 'desc' }
        break
    }
  }

  try {
    const [allProducts, total] = await prisma.$transaction([
      prisma.product.findMany({
        where,
        include: {
          translations: {
            where: { language: locale },
            select: {
              name: true,
              description: true,
            },
            take: 1,
          },
          images: { take: 1, orderBy: { created_at: 'asc' } },
          variants: {
            select: {
              price: true,
              discount: true,
              quantity: true,
              images: {
                take: 1,
                select: { url: true },
                orderBy: { created_at: 'asc' },
              },
              size: true,
              color: true,
            },
            orderBy: [{ quantity: 'desc' }, { price: 'asc' }],
          },
        },
        orderBy,
        skip: isPriceSort ? undefined : skip,
        take: isPriceSort ? undefined : limit,
      }),
      prisma.product.count({ where }),
    ])

    let products = allProducts

    if (isPriceSort) {
      products.sort((a, b) => {
        const getMinPrice = (p: typeof a) => {
          if (!p.variants || p.variants.length === 0) return Infinity
          return Math.min(
            ...p.variants.map((v) => v.price - v.price * (v.discount / 100))
          )
        }
        const priceA = getMinPrice(a)
        const priceB = getMinPrice(b)

        return sortBy === 'price_asc' ? priceA - priceB : priceB - priceA
      })

      products = products.slice(skip, skip + limit)
    }

    return {
      products,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        current: page,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    }
  } catch (error) {
    console.error('Error searching products:', error)
    return {
      products: [],
      pagination: {
        total: 0,
        pages: 1,
        current: 1,
        hasNext: false,
        hasPrev: false,
      },
    }
  }
}

export async function updateSearchFilters(filters: Partial<SearchFilters>) {
  const params = new URLSearchParams()

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, v))
      } else {
        params.set(key, value.toString())
      }
    }
  })

  // Reset page when filters change
  params.set('page', '1')

  redirect(`/search?${params.toString()}`)
}
// 8. FILTERS DATA FOR SEARCH PAGE
export async function getFiltersData(
  categoryId?: string,
  subCategoryId?: string
) {
  const where: Prisma.ProductWhereInput = {}
  if (categoryId) where.categoryId = categoryId
  if (subCategoryId) where.subCategoryId = subCategoryId

  try {
    const [priceRange, colors, sizes, brands] = await Promise.all([
      // Get price range
      prisma.productVariant.aggregate({
        where: { product: where },
        _min: { price: true },
        _max: { price: true },
      }),
      // Get available colors
      prisma.color.findMany({
        where: {
          variants: { some: { product: where } },
        },
        select: { name: true, hex: true },
        distinct: ['name'],
      }),
      // Get available sizes
      prisma.size.findMany({
        where: {
          variants: { some: { product: where, quantity: { gt: 0 } } },
        },
        select: { name: true },
        distinct: ['name'],
      }),
      // Get brands
      prisma.product.findMany({
        where,
        select: {
          brand: true,
        },
        distinct: ['brand'],
      }),
    ])

    return {
      priceRange: {
        min: priceRange._min.price || 0,
        max: priceRange._max.price || 1000000,
      },
      colors: colors.map((c) => c.hex),
      sizes: sizes.map((s) => s.name),
      brands: brands.map((b) => b.brand),
    }
  } catch (error) {
    console.error('Error fetching filters data:', error)
    return {
      priceRange: { min: 0, max: 1000000 },
      colors: [],
      sizes: [],
      brands: [],
    }
  }
}

export async function getAllCategories({}) {
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      // name: true,
      translations: {
        select: {
          name: true,
        },
      },
      url: true,
      featured: true,
    },
    orderBy: {
      featured: 'desc',
    },
  })

  return {
    categories,
  }
}

export async function getSubCategoryBySlug({ slug }: { slug: string }) {
  return await prisma.subCategory.findFirst({
    where: {
      url: slug,
    },
    include: {
      images: {
        select: { url: true },
      },
      products: {
        select: {
          id: true, // You'll likely need this
          // name: true,
          translations: {
            select: { name: true },
          },
          slug: true,
          brand: true,
          rating: true,
          numReviews: true,
          sales: true,
          isSale: true,
          saleEndDate: true,
          images: {
            select: {
              url: true,
            },
          },
          // variantImages: {
          //   select: {
          //     url: true,
          //   },
          // },
          variants: {
            orderBy: {
              discount: 'desc',
            },
            select: {
              price: true,
              discount: true,
              quantity: true,

              size: {
                select: {
                  id: true,
                  name: true,
                },
              },
              color: {
                select: {
                  id: true,
                  name: true,
                  hex: true,
                },
              },
              images: {
                select: {
                  url: true,
                },
              },
            },
          },
        },
      },
      category: {
        select: {
          id: true,
          translations: {
            select: {
              name: true,
            },
          },
          url: true,
        },
      },
    },
  })
}

export const getHomePageReviews = async (): Promise<
  | (Review & {
      user: {
        name: string | null
      }
    })[]
  | null
> => {
  return await prisma.review.findMany({
    where: {},
    include: {
      user: {
        select: { name: true },
      },
    },
    orderBy: {
      rating: 'desc',
    },
    take: 8,
  })
}

export async function userBookmarkedProducts({
  page = 1,
  limit = 50,
}: {
  page?: number
  limit?: number
}) {
  const skip = (page - 1) * limit
  const user = await currentUser()
  if (!user) redirect('/sign-in')

  try {
    const [allWhishedProducts, total] = await prisma.$transaction([
      prisma.wishlist.findMany({
        where: {
          userId: user.id,
        },
        include: {
          product: {
            include: {
              images: { take: 1, orderBy: { created_at: 'asc' } },
              variants: {
                select: {
                  price: true,
                  discount: true,
                  quantity: true,
                  images: {
                    take: 1,
                    select: { url: true },
                    orderBy: { created_at: 'asc' },
                  },
                  size: true,
                  color: true,
                },
              },
            },
          },
        },
        skip: skip,
        take: limit,
        orderBy: {
          updatedAt: 'desc',
        },
      }),
      prisma.wishlist.count({
        where: {
          userId: user.id,
        },
      }),
    ])

    // Remove the double slicing - it's already handled by Prisma's skip/take
    const products = allWhishedProducts.map((w) => w.product)

    return {
      products,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        current: page,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    }
  } catch (error) {
    console.error('Error searching products:', error)
    return {
      products: [],
      pagination: {
        total: 0,
        pages: 1,
        current: 1,
        hasNext: false,
        hasPrev: false,
      },
    }
  }
}
