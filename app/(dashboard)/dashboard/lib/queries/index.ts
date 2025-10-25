import { getCurrentUser } from '@/lib/auth-helpers'
import {
  Category,
  CategoryTranslation,
  City,
  Color,
  Coupon,
  Image,
  Order,
  OrderItem,
  PaymentDetails,
  // Prisma,
  Product,
  ProductVariant,
  Province,
  Question,
  ShippingAddress,
  Size,
  Spec,
  SubCategory,
  SubCategoryTranslation,
  User,
} from '@/lib/generated/prisma'
import prisma from '@/lib/prisma'
import { cache } from 'react'

export const getAllCategories = cache(
  async ({
    page = 1,
    pageSize = 100,
  }: {
    page?: number
    pageSize?: number
  }): Promise<{
    categories: (Category & { images: Image[] } & {
      subCategories: (SubCategory & { images: Image[] })[]
    } & { translations: CategoryTranslation[] })[]
    isNext: boolean
  }> => {
    const skipAmount = (page - 1) * pageSize
    const [categories, count] = await prisma.$transaction([
      prisma.category.findMany({
        where: {},

        include: {
          images: true,
          subCategories: {
            include: {
              images: true,
            },
          },
          translations: true,
        },

        skip: skipAmount,
        take: pageSize,

        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.category.count({}),
    ])
    const isNext = count > skipAmount + categories.length
    return { categories, isNext }
  }
)

export const getCategoryById = cache(
  async (
    id: string
  ): Promise<
    | (Category & { images: Image[] } & { translations: CategoryTranslation[] })
    | null
  > => {
    const category = await prisma.category.findFirst({
      where: {
        id,
      },
      include: {
        images: true,
        translations: true,
      },
    })

    return category
  }
)

export const getAllSubCategories = cache(
  async ({
    page = 1,
    pageSize = 100,
  }: {
    page?: number
    pageSize?: number
  }): Promise<{
    subCategories: (SubCategory & {
      category: Category & { translations: CategoryTranslation[] }
    } & {
      translations: SubCategoryTranslation[]
    } & {
      images: Image[]
    })[]
    isNext: boolean
  }> => {
    const skipAmount = (page - 1) * pageSize
    const [subCategories, count] = await prisma.$transaction([
      prisma.subCategory.findMany({
        include: {
          images: true,
          category: {
            include: {
              translations: true,
            },
          },
          translations: true,
        },

        orderBy: {
          createdAt: 'desc',
        },

        skip: skipAmount,
        take: pageSize,
      }),
      prisma.category.count({}),
    ])
    const isNext = count > skipAmount + subCategories.length

    return { subCategories: subCategories, isNext }
  }
)

export const getSubCategoryById = async (
  id: string
): Promise<
  | (SubCategory & { category: Category } & { images: Image[] } & {
      translations: SubCategoryTranslation[]
    })
  | null
> => {
  const subCategory = await prisma.subCategory.findFirst({
    where: {
      id,
    },
    include: {
      images: true,
      category: true,
      translations: true,
    },
  })

  return subCategory
}

export const getCategoryList = cache(async (): Promise<Category[] | []> => {
  const categoryList = await prisma.category.findMany({
    include: {
      translations: true,
    },
  })
  if (!categoryList.length) return []
  return categoryList
})
export const getCategoryNames = cache(
  async (): Promise<(Category & { translations: { name: string } })[] | []> => {
    const categoryNames = await prisma.category.findMany({
      where: {},
      include: {
        translations: {
          where: { language: 'fa' },
          select: {
            name: true,
          },
          take: 1,
        },
      },
    })
    if (!categoryNames.length) return []
    return categoryNames.map((category) => ({
      ...category,
      translations: category.translations[0] || { name: '' },
    }))
  }
)

export const getAllProductsList = cache(
  async ({
    page = 1,
    pageSize = 100,
  }: {
    page?: number
    pageSize?: number
  }) => {
    try {
      const skipAmount = (page - 1) * pageSize

      // Retrieve all products associated with the store
      const products = await prisma.product.findMany({
        where: {},
        include: {
          category: {
            include: {
              translations: true,
            },
          },
          subCategory: {
            include: {
              translations: true,
            },
          },
          offerTag: {
            include: {
              translations: true,
            },
          },
          images: { orderBy: { created_at: 'desc' } },
          questions: {
            include: {
              translations: true,
            },
          },
          specs: {
            include: {
              translations: true,
            },
          },
          translations: true,
          // variantImages: true,
          // colors: true,
          // sizes: true,
          variants: {
            include: {
              color: true,
              images: true,
              size: true,
            },
          },
        },
        skip: skipAmount,
        take: pageSize,
      })
      const count = await prisma.product.count()

      const isNext = count > skipAmount + products.length

      // console.log({ products })
      return { products, isNext }
    } catch (error) {
      console.error(error)
    }
  }
)

export const getAllOfferTags = cache(async () => {
  const offerTgas = await prisma.offerTag.findMany({
    where: {},
    include: {
      products: {
        select: {
          id: true,
        },
      },
      translations: true,
    },
    orderBy: {
      products: {
        _count: 'desc', // Order by the count of associated products in descending order
      },
    },
  })
  return offerTgas ?? []
})

export const getProductById = cache(
  (
    id: string
  ): Promise<
    | (Product & { images: Image[] | null } & { specs: Spec[] | null } & {
        questions: Question[] | null
      } & {
        variants:
          | (ProductVariant & { images: Image[] | null } & {
              color: Color | null
            } & {
              size: Size | null
            })[]
          | null
      })
    | null
  > => {
    const product = prisma.product.findFirst({
      where: {
        id,
      },
      include: {
        variants: {
          include: {
            images: true,
            color: true,
            size: true,
          },
        },
        images: true,
        specs: true,
        questions: true,
      },
    })

    return product
  }
)

interface getAllReviewsProps {
  page?: number
  pageSize?: number
}
export const getAllReviews = async (params: getAllReviewsProps) => {
  const { page = 1, pageSize = 30 } = params
  const skipAmount = (page - 1) * pageSize

  try {
    const allCompleteReviews = await prisma.review.findMany({
      where: {},
      include: {
        user: true,
      },
      skip: skipAmount,
      take: pageSize,

      orderBy: {
        createdAt: 'desc',
      },
    })

    const totalReviews = await prisma.review.count()
    // console.log('totalReviews', totalReviews)

    // Calculate if there are more questions to be fetched
    // console.log('totalReviews', totalReviews)
    // console.log('skipAmount', skipAmount)

    const isNext = totalReviews > skipAmount + allCompleteReviews.length
    return { review: allCompleteReviews.flat() || [], isNext }
  } catch (error) {
    console.error(error)
  }
}

interface getAllOrdersProps {
  page?: number
  pageSize?: number
}

export const getAllOrders = async (
  params: getAllOrdersProps
): Promise<OrderType> => {
  const { page = 1, pageSize = 30 } = params
  const skipAmount = (page - 1) * pageSize
  try {
    const user = await getCurrentUser()

    if (!user) throw new Error('Unauthenticated.')

    if (user.role !== 'admin')
      throw new Error(
        'Unauthorized Access: Seller Privileges Required for Entry.'
      )

    // Retrieve order groups for the specified store and user
    const allOrders = await prisma.order.findMany({
      where: {},
      include: {
        items: true,
        // coupon: true,

        paymentDetails: true,
        user: {
          select: {
            phoneNumber: true,
            name: true,
          },
        },

        shippingAddress: {
          include: {
            city: true,
            province: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
      skip: skipAmount,
      take: pageSize,
    })
    const totalOrders = await prisma.order.count()

    const isNext = totalOrders > skipAmount + allOrders.length
    return { order: allOrders || [], isNext }
  } catch (error) {
    throw error
  }
}
interface getAllOrdersProps {
  page?: number
  pageSize?: number
}

export const getAllPaidOrders = async (
  params: getAllOrdersProps
): Promise<OrderType> => {
  const { page = 1, pageSize = 30 } = params
  const skipAmount = (page - 1) * pageSize
  try {
    const user = await getCurrentUser()

    if (!user) throw new Error('Unauthenticated.')

    if (user.role !== 'admin')
      throw new Error(
        'Unauthorized Access: Seller Privileges Required for Entry.'
      )

    // Retrieve order groups for the specified store and user
    const allOrders = await prisma.order.findMany({
      where: {
        paymentStatus: 'Paid',
      },
      include: {
        items: true,
        // coupon: true,

        paymentDetails: true,
        user: {
          select: {
            phoneNumber: true,
            name: true,
          },
        },

        shippingAddress: {
          include: {
            city: true,
            province: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
      skip: skipAmount,
      take: pageSize,
    })
    const totalOrders = await prisma.order.count({
      where: { paymentStatus: 'Paid' },
    })

    const isNext = totalOrders > skipAmount + allOrders.length
    return { order: allOrders || [], isNext }
  } catch (error) {
    throw error
  }
}

// export type OrderType = (Order & {
//   items: OrderItem[] // Added missing 'items'
//   paymentDetails: PaymentDetails | null
//   user: { phoneNumber: string | null }
//   shippingAddress: ShippingAddress & {
//     city: City | null
//     province: Province | null
//   }
// })[]
export type OrderType = {
  order: (Order & {
    items: OrderItem[] // Added missing 'items'
    paymentDetails: PaymentDetails | null
    user: { phoneNumber: string | null; name: string }
    shippingAddress: ShippingAddress & {
      city: City | null
      province: Province | null
    }
  })[] // The result is an array of orders
  isNext: boolean // Added 'isNext'
}
export type DetailedOrder = Order & {
  items: OrderItem[]
  paymentDetails: PaymentDetails | null
  user: { phoneNumber: string | null; name: string }
  shippingAddress: ShippingAddress & {
    city: City | null
    province: Province | null
  }
}

interface getAllReviewsProps {
  page?: number
  pageSize?: number
}

export const getAllCoupons = async (
  params: getAllReviewsProps
): Promise<{ coupon: Coupon[] } & { isNext: boolean }> => {
  const { page = 1, pageSize = 50 } = params
  const skipAmount = (page - 1) * pageSize
  try {
    const user = await getCurrentUser()

    if (!user) throw new Error('Unauthenticated.')

    if (user.role !== 'admin')
      throw new Error(
        'Unauthorized Access: Seller Privileges Required for Entry.'
      )

    // Retrieve order groups for the specified store and user
    const allCoupons = await prisma.coupon.findMany({
      where: {},

      orderBy: {
        updatedAt: 'desc',
      },
      skip: skipAmount,
      take: pageSize,
    })
    const totalCoupons = await prisma.coupon.count()

    const isNext = totalCoupons > skipAmount + allCoupons.length
    return { coupon: allCoupons || [], isNext }
  } catch (error) {
    throw error
  }
}

interface getAllUsersProps {
  page?: number
  pageSize?: number
}

export const getAllUsers = async (
  params: getAllUsersProps
): Promise<{ users: User[] } & { isNext: boolean }> => {
  const { page = 1, pageSize = 50 } = params
  const skipAmount = (page - 1) * pageSize
  try {
    const user = await getCurrentUser()

    if (!user) throw new Error('Unauthenticated.')

    if (user.role !== 'admin')
      throw new Error(
        'Unauthorized Access: Seller Privileges Required for Entry.'
      )
    const allUsers = await prisma.user.findMany({
      where: {},

      orderBy: {
        updatedAt: 'desc',
      },
      skip: skipAmount,
      take: pageSize,
    })

    const totalUsers = await prisma.user.count()

    const isNext = totalUsers > skipAmount + allUsers.length
    return { users: allUsers || [], isNext }
  } catch (error) {
    throw error
  }
}

// Order Summary

export type SalesDataType = Array<{
  month: string
  totalSales: number
}>

export async function getOrderSummary() {
  try {
    // Get counts for each resource
    const [ordersCount, productsCount, usersCount] = await Promise.all([
      prisma.order.count(),
      prisma.product.count(),
      prisma.user.count(),
    ])

    // Calculate the total sales (using 'total' field as per your schema)
    const totalSales = await prisma.order.aggregate({
      _sum: { total: true },
      where: {
        paymentStatus: 'Paid', // Only count paid orders
      },
    })

    // Get monthly sales data without raw query
    const currentYear = new Date().getFullYear()
    const lastYear = currentYear - 1

    // Get orders from last 12 months
    const startDate = new Date(lastYear, new Date().getMonth(), 1)

    const ordersWithSales = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
        paymentStatus: 'Paid', // Only paid orders
      },
      select: {
        total: true,
        createdAt: true,
      },
    })

    // Group by month/year and calculate totals
    const salesDataMap = new Map<string, number>()

    ordersWithSales.forEach((order) => {
      const month = order.createdAt.toLocaleDateString('fa-IR', {
        month: 'long',
        year: '2-digit',
      })
      const currentTotal = salesDataMap.get(month) || 0
      salesDataMap.set(month, currentTotal + order.total)
    })

    const salesData: SalesDataType = Array.from(salesDataMap.entries())
      .map(([month, totalSales]) => ({
        month,
        totalSales,
      }))
      .sort((a, b) => {
        // Sort by month/year
        const [aMonth, aYear] = a.month.split('/')
        const [bMonth, bYear] = b.month.split('/')
        if (aYear !== bYear) return parseInt(aYear) - parseInt(bYear)
        return parseInt(aMonth) - parseInt(bMonth)
      })

    // Get latest sales (recent orders)
    const latestSales = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, phoneNumber: true } },
      },
      take: 6,
    })

    // Get additional useful stats
    const ordersByStatus = await prisma.order.groupBy({
      by: ['orderStatus'],
      _count: {
        id: true,
      },
    })

    const ordersByPaymentStatus = await prisma.order.groupBy({
      by: ['paymentStatus'],
      _count: {
        id: true,
      },
    })

    return {
      ordersCount,
      productsCount,
      usersCount,
      totalSales,
      latestSales,
      salesData,
      ordersByStatus,
      ordersByPaymentStatus,
    }
  } catch (error) {
    console.error('Error fetching order summary:', error)
    throw new Error('Failed to fetch order summary')
  }
}
