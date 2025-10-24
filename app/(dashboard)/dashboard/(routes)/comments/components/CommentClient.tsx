'use client'

import { Separator } from '@/components/ui/separator'

import { Columns, CommentColumn } from './columns'
import { Heading } from './Heading'
import { DataTable } from '../../../components/shared/DataTable'

// import { ApiList } from '@/components/dashboard/ApiList'

interface CommentClientProps {
  data: CommentColumn[]
}

export const CommentClient: React.FC<CommentClientProps> = ({ data }) => {
  return (
    <>
      <Heading
        title={`کامنت‌ها (${data.length})`}
        description="کامنتها را مدیریت کنید."
      />

      <Separator />
      <DataTable searchKey="comment" columns={Columns} data={data} />
      <Separator />
      {/* <ApiList entityName="doctors" entityIdName="doctorId" /> */}
    </>
  )
}
