import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Eye } from 'lucide-react'
import { FC } from 'react'
import { useTranslations } from 'next-intl'

interface ViewNumbersProps {
  views: number
}

const ViewNumbers: FC<ViewNumbersProps> = ({ views }) => {
  const t = useTranslations('product')

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="flex gap-1">
          <Eye />
          {views}
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <p>{t('views')}</p>
      </TooltipContent>
    </Tooltip>
  )
}

export default ViewNumbers
