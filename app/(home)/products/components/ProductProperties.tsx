import {
  Table,
  TableBody,
  //   TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ProductSpec, VariantsWithSizeAndColor } from '@/lib/types/home'
import React from 'react'

type Props = {
  variant: VariantsWithSizeAndColor
  specs?: ProductSpec[]
  weight?: number
}

const ProductProperties = ({ variant, specs, weight }: Props) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[150px]">مشخصات</TableHead>
          <TableHead className="text-right">مقدار</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="w-fit">
        <TableRow key="dimensions">
          <TableCell className="font-medium">ابعاد (طول×عرض×ارتفاع)</TableCell>
          <TableCell className="text-right">
            {`${variant.length} × ${variant.width} × ${variant.height} سانتی‌متر`}
          </TableCell>
        </TableRow>
        {weight && (
          <TableRow key="وزن">
            <TableCell className="font-medium"> وزن</TableCell>
            <TableCell className="text-right">{`${weight} گرم`}</TableCell>
          </TableRow>
        )}

        {specs?.map((spec) => (
          <TableRow key={spec.name}>
            <TableCell className="font-medium">{spec.name}</TableCell>
            <TableCell className="text-right">{spec.value}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default ProductProperties
