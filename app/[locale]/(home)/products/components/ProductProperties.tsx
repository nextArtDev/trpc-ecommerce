import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { SpecTranslation, VariantsWithSizeAndColor } from '@/lib/types/home'
import { useTranslations } from 'next-intl'

type Props = {
  variant: VariantsWithSizeAndColor
  specs?: SpecTranslation[]
  weight?: number
}

const ProductProperties = ({ variant, specs, weight }: Props) => {
  const t = useTranslations('product')

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[150px]">
            {t('specificationsTable.title')}
          </TableHead>
          <TableHead className="text-right">
            {t('specificationsTable.value')}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="w-fit">
        <TableRow key="dimensions">
          <TableCell className="font-medium">
            {t('specificationsTable.dimensions')}
          </TableCell>
          <TableCell className="text-right">
            {`${variant.length} × ${variant.width} × ${variant.height} ${t(
              'specificationsTable.unit.cm'
            )}`}
          </TableCell>
        </TableRow>
        {weight && (
          <TableRow key="weight">
            <TableCell className="font-medium">
              {t('specificationsTable.weight')}
            </TableCell>
            <TableCell className="text-right">{`${weight} ${t(
              'specificationsTable.unit.g'
            )}`}</TableCell>
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
