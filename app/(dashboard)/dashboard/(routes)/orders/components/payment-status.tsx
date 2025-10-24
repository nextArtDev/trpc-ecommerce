import { PaymentStatus } from '@/lib/types/home'
import { CreditCard } from 'lucide-react' // Lucide credit card icon

interface PaymentStatusTagProps {
  status: PaymentStatus
  isTable?: boolean
}

const paymentStatusStyles: {
  [key in PaymentStatus]: { bgColor: string; textColor: string; label: string }
} = {
  [PaymentStatus.Pending]: {
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    label: 'در انتظار',
  },
  [PaymentStatus.Paid]: {
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    label: 'پرداخت شده',
  },
  [PaymentStatus.Failed]: {
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    label: 'ناموفق',
  },
  [PaymentStatus.Declined]: {
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-800 ',
    label: 'رد شده',
  },
  [PaymentStatus.Cancelled]: {
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800',
    label: 'لغو شده',
  },
  [PaymentStatus.Refunded]: {
    bgColor: 'bg-blue-100 dark:bg-blue-500/10',
    textColor: 'text-blue-800 dark:text-blue-500',
    label: 'بازپرداخت شده',
  },

  [PaymentStatus.Chargeback]: {
    bgColor: 'bg-pink-100 dark:bg-pink-500/10',
    textColor: 'text-pink-800 dark:text-pink-500',
    label: 'بازگشت وجه',
  },
}

const PaymentStatusTag: React.FC<PaymentStatusTagProps> = ({
  status,
  isTable,
}) => {
  const styles = paymentStatusStyles[status]

  return (
    <div>
      <span
        className={` py-1 px-2 inline-flex items-center gap-x-1 text-xs font-medium rounded-md ${styles.bgColor} ${styles.textColor}`}
      >
        <CreditCard className="shrink-0 size-3" />
        {/* Lucide Credit Card Icon */}
        {status === 'Pending' && !isTable ? 'در انتظار پرداخت' : styles.label}
      </span>
    </div>
  )
}

export default PaymentStatusTag
