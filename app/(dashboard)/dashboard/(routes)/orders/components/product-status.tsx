import { ProductStatus } from '@/lib/generated/prisma'
import { Package } from 'lucide-react' // Lucide package icon

interface ProductStatusTagProps {
  status: ProductStatus
}

const productStatusStyles: {
  [key in ProductStatus]: { bgColor: string; textColor: string; label: string }
} = {
  [ProductStatus.Pending]: {
    bgColor: 'bg-gray-100 dark:bg-gray-500/10',
    textColor: 'text-gray-800 dark:text-gray-500',
    label: 'در انتظار',
  },
  [ProductStatus.Processing]: {
    bgColor: 'bg-yellow-100 dark:bg-yellow-500/10',
    textColor: 'text-yellow-800 dark:text-yellow-500',
    label: 'در حال پردازش',
  },
  [ProductStatus.ReadyForShipment]: {
    bgColor: 'bg-blue-100 dark:bg-blue-500/10',
    textColor: 'text-blue-800 dark:text-blue-500',
    label: 'آماده ارسال',
  },
  [ProductStatus.Shipped]: {
    bgColor: 'bg-teal-100 dark:bg-teal-500/10',
    textColor: 'text-teal-800 dark:text-teal-500',
    label: 'ارسال شده',
  },
  [ProductStatus.Delivered]: {
    bgColor: 'bg-green-100 dark:bg-green-500/10',
    textColor: 'text-green-800 dark:text-green-500',
    label: 'تحویل شده',
  },
  [ProductStatus.Canceled]: {
    bgColor: 'bg-red-100 dark:bg-red-500/10',
    textColor: 'text-red-800 dark:text-red-500',
    label: 'کنسل شده',
  },
  [ProductStatus.Returned]: {
    bgColor: 'bg-pink-100 dark:bg-pink-500/10',
    textColor: 'text-pink-800 dark:text-pink-500',
    label: 'برگشت داده شده',
  },
  [ProductStatus.Refunded]: {
    bgColor: 'bg-purple-100 dark:bg-purple-500/10',
    textColor: 'text-purple-800 dark:text-purple-500',
    label: 'بازپرداخت شده',
  },
  [ProductStatus.FailedDelivery]: {
    bgColor: 'bg-orange-100 dark:bg-orange-500/10',
    textColor: 'text-orange-800 dark:text-orange-500',
    label: 'ناموفق در تحویل',
  },
  [ProductStatus.OnHold]: {
    bgColor: 'bg-indigo-100 dark:bg-indigo-500/10',
    textColor: 'text-indigo-800 dark:text-indigo-500',
    label: 'On Hold',
  },
  [ProductStatus.Backordered]: {
    bgColor: 'bg-cyan-100 dark:bg-cyan-500/10',
    textColor: 'text-cyan-800 dark:text-cyan-500',
    label: 'سفارش معوق',
  },
  [ProductStatus.PartiallyShipped]: {
    bgColor: 'bg-lime-100 dark:bg-lime-500/10',
    textColor: 'text-lime-800 dark:text-lime-500',
    label: 'ارسال جزئی',
  },
  [ProductStatus.ExchangeRequested]: {
    bgColor: 'bg-rose-100 dark:bg-rose-500/10',
    textColor: 'text-rose-800 dark:text-rose-500',
    label: 'درخواست تعویض',
  },
  [ProductStatus.AwaitingPickup]: {
    bgColor: 'bg-violet-100 dark:bg-violet-500/10',
    textColor: 'text-violet-800 dark:text-violet-500',
    label: 'در انتظار جمع‌آوری',
  },
}

const ProductStatusTag: React.FC<ProductStatusTagProps> = ({ status }) => {
  const styles = productStatusStyles[status]

  return (
    <div>
      <span
        className={`py-1 px-2 inline-flex items-center gap-x-1 text-xs font-medium rounded-md ${styles.bgColor} ${styles.textColor}`}
      >
        <Package className="shrink-0 size-3" />
        {styles.label}
      </span>
    </div>
  )
}

export default ProductStatusTag
