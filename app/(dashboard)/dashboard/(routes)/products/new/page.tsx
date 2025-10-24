import { notFound } from 'next/navigation'
import { getAllOfferTags, getCategoryList } from '../../../lib/queries'
import prisma from '@/lib/prisma'
import ProductDetails from '../components/product-details'

export default async function ProductPage() {
  const categories = await getCategoryList()
  // console.log({ categories })

  const offerTags = await getAllOfferTags()
  const provinces = await prisma.province.findMany({
    orderBy: {
      name: 'asc',
    },
  })
  if (!categories) return notFound()
  return (
    <div className="w-full mx-1">
      <ProductDetails
        categories={categories}
        offerTags={offerTags ?? []}
        provinces={provinces ?? []}
      />
    </div>
  )
}
