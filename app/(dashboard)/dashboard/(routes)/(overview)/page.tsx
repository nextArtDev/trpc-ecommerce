import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { BadgeDollarSign, ScanBarcode, ShoppingCart, Users } from 'lucide-react'
import { Metadata } from 'next'
// import Link from 'next/link'

// import Charts from './components/charts'
import { currentUser } from '@/lib/auth'
import { notFound } from 'next/navigation'
import { getOrderSummary } from '../../lib/queries'
import Charts from './components/charts'
import {
  formatNumber,
  formatPrice,
  formatShortDate,
  translateOrderStatus,
  translatePaymentStatus,
} from '../../lib/server-utils'

export const metadata: Metadata = {
  title: 'دشبورد',
}

const AdminOverviewPage = async () => {
  const user = await currentUser()

  if (!user || user?.role !== 'admin') return notFound()

  const summary = await getOrderSummary()

  return (
    <div className="space-y-2 mx-2 py-4">
      {/* <h1 className="h2-bold">دشبورد</h1> */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">مجموع فروش</CardTitle>
            <BadgeDollarSign />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(summary.totalSales._sum.total || 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">سفارشات</CardTitle>
            <ShoppingCart />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(summary.ordersCount)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">خریداران</CardTitle>
            <Users />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(summary.usersCount)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">محصولات</CardTitle>
            <ScanBarcode />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(summary.productsCount)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Status Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">وضعیت سفارشات</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {summary.ordersByStatus.map((status) => (
              <div key={status.orderStatus} className="flex justify-between">
                <span className="text-sm">
                  {translateOrderStatus(status.orderStatus)}
                </span>
                <span className="font-medium">
                  {formatNumber(status._count.id)}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">وضعیت پرداخت</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {summary.ordersByPaymentStatus.map((payment) => (
              <div key={payment.paymentStatus} className="flex justify-between">
                <span className="text-sm">
                  {translatePaymentStatus(payment.paymentStatus)}
                </span>
                <span className="font-medium">
                  {formatNumber(payment._count.id)}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>فروش ماهانه</CardTitle>
          </CardHeader>
          <CardContent>
            {summary.salesData.length > 0 ? (
              <div className="space-y-2">
                {summary.salesData.map((data) => (
                  <div key={data.month} className="flex justify-between">
                    <span>{data.month}</span>
                    <span className="font-medium">
                      {formatPrice(data.totalSales)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">
                داده‌ای برای نمایش وجود ندارد
              </p>
            )}

            <Charts data={{ salesData: summary.salesData }} />
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>فروشهای اخیر</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>خریدار</TableHead>
                  <TableHead>تاریخ</TableHead>
                  <TableHead>مجموع</TableHead>
                  <TableHead>وضعیت</TableHead>
                  <TableHead>اقدام</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {summary.latestSales.length > 0 ? (
                  summary.latestSales.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        {order?.user?.name ||
                          order?.user?.phoneNumber ||
                          'کاربر حذف شده'}
                      </TableCell>
                      <TableCell>
                        {formatShortDate(new Date(order.createdAt))}
                      </TableCell>
                      <TableCell>{formatPrice(order.total)}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            order.orderStatus === 'Delivered'
                              ? 'bg-green-100 text-green-800'
                              : order.orderStatus === 'Pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      </TableCell>
                      <TableCell>
                        {/* <Link href={`/dashboard/orders/${order.id}`}>
                          <span className="px-2 text-blue-600 hover:text-blue-800">
                            جزئیات
                          </span>
                        </Link> */}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-muted-foreground"
                    >
                      سفارشی وجود ندارد
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AdminOverviewPage
