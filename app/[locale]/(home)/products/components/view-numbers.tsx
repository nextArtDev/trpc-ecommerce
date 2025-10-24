import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Eye } from 'lucide-react'
import { FC } from 'react'

interface ViewNumbersProps {
  views: number
}

const ViewNumbers: FC<ViewNumbersProps> = ({ views }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="flex gap-1">
          <Eye />
          {views}
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <p>مشاهده</p>
      </TooltipContent>
    </Tooltip>
  )
}

export default ViewNumbers
