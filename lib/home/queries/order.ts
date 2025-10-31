import { getCurrentUser } from '@/lib/auth-helpers'
import {
  City,
  Order,
  OrderItem,
  PaymentDetails,
  Province,
  ShippingAddress,
} from '@/lib/generated/prisma'
import prisma from '@/lib/prisma'

export async function getOrderById(orderId: string) {
  try {
    const { unstable_noStore } = await import('next/cache')
    unstable_noStore()
    const data = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
      include: {
        paymentDetails: true,

        items: true,
        shippingAddress: {
          include: {
            province: {
              select: {
                name: true,
              },
            },
            city: {
              select: {
                name: true,
              },
            },
            country: {
              select: {
                name: true,
              },
            },
            state: {
              select: {
                name: true,
              },
            },
          },
        },
        user: { select: { name: true, phoneNumber: true, role: true } },
      },
    })

    return data
  } catch (error) {
    console.error(error)
    // unstable_noStore not available, continue without it
  }
}

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
interface getAllMyOrdersProps {
  userId: string
  page?: number
  pageSize?: number
}

export const getMyOrders = async (
  params: getAllMyOrdersProps
): Promise<OrderType> => {
  const { page = 1, pageSize = 50 } = params
  const skipAmount = (page - 1) * pageSize
  try {
    const cUser = await getCurrentUser()

    if (!cUser) throw new Error('Unauthenticated.')
    const user = await prisma.user.findFirst({
      where: {
        id: params.userId,
      },
    })

    if (!user?.id || user.id !== cUser.id) throw new Error('Unauthenticated.')
    // Retrieve order groups for the specified store and user
    const allOrders = await prisma.order.findMany({
      where: {
        userId: params.userId,
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
      where: {
        userId: user.id,
      },
    })

    const isNext = totalOrders > skipAmount + allOrders.length
    return { order: allOrders || [], isNext }
  } catch (error) {
    throw error
  }
}
