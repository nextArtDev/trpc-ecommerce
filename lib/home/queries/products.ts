import { currentUser } from '@/lib/auth'
import { Prisma, Review } from '@/lib/generated/prisma'
import prisma from '@/lib/prisma'
import {
  CategoryWithStats,
  ProductDetails,
  SearchFilters,
  SubCategoryForHomePage,
} from '@/lib/types/home'
import { redirect } from 'next/navigation'
import { cache } from 'react'

// Homepage Products (with basic info + first image)
export async function getHomepageProducts(limit: number = 12) {
  return await prisma.product.findMany({
    take: limit,
    select: {
      id: true,
      name: true,
      description: true,
      slug: true,
      rating: true,
      isFeatured: true,
      isSale: true,
      saleEndDate: true,
      updatedAt: true,
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
          name: true,
          url: true,
        },
      },
      subCategory: {
        select: {
          id: true,
          name: true,
          url: true,
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
export async function getBestSellers(limit: number = 8) {
  return await prisma.product.findMany({
    take: limit,
    select: {
      id: true,
      name: true,
      slug: true,
      rating: true,
      sales: true,
      description: true,
      brand: true,

      images: {
        take: 1,
        select: {
          url: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
          url: true,
        },
      },
      subCategory: {
        select: {
          id: true,
          name: true,
          url: true,
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
        orderBy: [
          { quantity: 'desc' }, // Prioritize higher stock
          { price: 'asc' }, // Then lowest price
        ],

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

// 3. NEW PRODUCTS SECTION
export async function getNewProducts(limit: number = 8) {
  return await prisma.product.findMany({
    take: limit,
    select: {
      id: true,
      name: true,
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
    orderBy: {
      createdAt: 'desc',
    },
  })
}

// 4. CATEGORIES FOR NAVIGATION/HOMEPAGE
export async function getSubCategories(): Promise<SubCategoryForHomePage[]> {
  return await prisma.subCategory.findMany({
    where: { featured: true },
    // select: {
    //   id: true,
    //   name: true,
    //   url: true,

    // },
    include: {
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
export async function getCategoriesWithStats(): Promise<CategoryWithStats[]> {
  return await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      url: true,
      updatedAt: true,
      featured: true,
      images: {
        take: 1,
        select: {
          url: true,
        },
      },
      // Get product count for each category
      _count: {
        select: {
          products: true,
        },
      },
      subCategories: {
        select: {
          id: true,
          name: true,
          url: true,
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
        // orderBy:{

        // }
        // orderBy: {Prisma.sql`RANDOM()`}
      },
    },
    orderBy: {
      featured: 'desc',
    },
  })
  // for (const category of categories) {
  //   category.subCategories = shuffleArray(category.subCategories).slice(0, 5) // Get up to 5 random subcategories
  // }
  //return categories;
}

// 5. SEARCH/FILTER PAGE - More comprehensive
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
  const skip = (page - 1) * limit

  // Build where clause
  const where: Prisma.ProductWhereInput = { AND: [] }
  const pushToAnd = (condition: Prisma.ProductWhereInput) =>
    (where.AND as Prisma.ProductWhereInput[]).push(condition)

  if (search) {
    ;(where.AND as Prisma.ProductWhereInput[]).push({
      OR: [
        { name: { contains: search } },
        { description: { contains: search } },
        { brand: { contains: search } },
        { keywords: { contains: search } },
      ],
    })
  }

  if (categoryId) (where.AND as Prisma.ProductWhereInput[]).push({ categoryId })
  if (subCategoryId)
    (where.AND as Prisma.ProductWhereInput[]).push({ subCategoryId })
  if (brands && brands.length > 0)
    (where.AND as Prisma.ProductWhereInput[]).push({ brand: { in: brands } })

  // Build conditions array for complex filtering
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
            orderBy: [
              { quantity: 'desc' }, // Prioritize higher stock
              { price: 'asc' }, // Then lowest price
            ], // Always show the cheapest variant first
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
          // Calculate final price after discount for an accurate sort
          return Math.min(
            ...p.variants.map((v) => v.price - v.price * (v.discount / 100))
          )
        }
        const priceA = getMinPrice(a)
        const priceB = getMinPrice(b)

        return sortBy === 'price_asc' ? priceA - priceB : priceB - priceA
      })

      // Apply pagination *after* the sort is complete
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
// 6. SINGLE PRODUCT PAGE - Full details
export const getProductDetails = cache(
  async (slug: string): Promise<ProductDetails> => {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        images: {
          select: {
            // id: true,
            url: true,
            // key: true,
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
          orderBy: [
            { price: 'asc' }, // Then lowest price
            { quantity: 'desc' }, // Prioritize higher stock
          ],
        },
        specs: {
          select: {
            name: true,
            value: true,
          },
        },
        questions: {
          select: {
            question: true,
            answer: true,
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
                //   avatar: true,
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
            name: true,
            url: true,
          },
        },
        subCategory: {
          select: {
            id: true,
            name: true,
            url: true,
          },
        },
        offerTag: {
          select: {
            name: true,
            url: true,
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

    // Increment view count (do this async without blocking)
    if (product) {
      prisma.product
        .update({
          where: { id: product.id },
          data: { views: { increment: 1 } },
        })
        .catch(console.error)
    }

    return product
  }
)

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
      name: true,
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

// export async function getAllProducts({
//   query,
//   limit = 10,
//   page,
//   category,
//   price,
//   rating,
//   sort,
// }: {
//   query: string
//   limit?: number
//   page: number
//   category?: string
//   price?: string
//   rating?: string
//   sort?: string
// }) {
//   // Query filter
//   const queryFilter: Prisma.ProductWhereInput =
//     query && query !== 'all'
//       ? {
//           name: {
//             contains: query,
//             // mode: 'insensitive',
//           } as Prisma.StringFilter,
//         }
//       : {}

//   // Category filter
//   const categoryFilter: Prisma.CategoryWhereInput =
//     category && category !== 'all'
//       ? {
//           category: {
//             contains: query,
//             // mode: 'insensitive',
//           } ,
//         }
//       : {}

//   // Price filter
//   const priceFilter: Prisma.SizeWhereInput =
//     price && price !== 'all'
//       ? {
//           price: {
//             gte: Number(price.split('-')[0]),
//             lte: Number(price.split('-')[1]),
//           },
//         }
//       : {}

//   // Rating filter
//   const ratingFilter =
//     rating && rating !== 'all'
//       ? {
//           rating: {
//             gte: Number(rating),
//           },
//         }
//       : {}

//   const data = await prisma.product.findMany({
//     where: {
//       ...queryFilter,
//       ...ratingFilter,
//     },
//     include: {
//       images: {
//         select: { url: true },
//       },
//       category: {
//         where: {
//           ...categoryFilter,
//         },
//       },
//       sizes: {
//         where: {
//           ...priceFilter,
//         },
//          orderBy:
//       sort === 'lowest'
//         ? { price: 'asc' }
//         :  { price: 'desc' }
//       },

//     },
//     orderBy:
//       // sort === 'lowest'
//       //   ? { price: 'asc' }
//       //   : sort === 'highest'
//       //   ? { price: 'desc' }:
//          sort === 'rating'
//         ? { rating: 'desc' }
//         : { createdAt: 'desc' },
//     skip: (page - 1) * limit,
//     take: limit,
//   })

//   const dataCount = await prisma.product.count()

//   return {
//     data,
//     totalPages: Math.ceil(dataCount / limit),
//   }
// }
export async function getAllCategories({}) {
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
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
          name: true,
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
          name: true,
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

// export async function getBestSellers(limit: number = 8) {
//   const bestSellersByQuantity = await prisma.orderItem.groupBy({
//     by: ['productId'],
//     _sum: {
//       quantity: true,
//     },
//     where: {
//       // IMPORTANT: Only count items from successful orders
//       order: {
//         paymentStatus: 'Paid',
//         orderStatus: {
//           notIn: ['Cancelled', 'Refunded', 'Failed'],
//         },
//       },
//     },
//     orderBy: {
//       _sum: {
//         quantity: 'desc',
//       },
//     },
//     take: limit,
//   })
//   if (bestSellersByQuantity.length === 0) {
//     return [] // No best sellers found
//   }

//   // Extract just the product IDs in the correct order
//   const bestSellerProductIds = bestSellersByQuantity.map(
//     (item) => item.productId
//   )

//   const products = await prisma.product.findMany({
//     where: {
//       id: {
//         in: bestSellerProductIds,
//       },
//     },
//     take: limit,
//     select: {
//       id: true,
//       name: true,
//       slug: true,
//       rating: true,
//       sales: true,
//       images: {
//         take: 1,
//         select: {
//           url: true,
//         },
//       },
//       category: {
//         select: {
//           id: true,
//           name: true,
//           url: true,
//         },
//       },
//       subCategory: {
//         select: {
//           id: true,
//           name: true,
//           url: true,
//         },
//       },
//       sizes: {
//         select: {
//           price: true,
//           discount: true,
//         },
//         orderBy: {
//           price: 'asc',
//         },
//         take: 1,
//       },
//     },
//     orderBy: {
//       createdAt: 'asc',
//     },
//   })
//   const orderedProducts = bestSellerProductIds.map((id) =>
//     products.find((p) => p.id === id)
//   )
//   return orderedProducts.filter(Boolean)
// }
