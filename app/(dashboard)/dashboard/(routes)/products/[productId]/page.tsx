import prisma from '@/lib/prisma'

import { notFound } from 'next/navigation'
import ProductForm from '../components/product-details'
import { getAllOfferTags, getCategoryList } from '../../../lib/queries'

export default async function SellerNewProductPage({
  params,
}: // searchParams,
{
  params: Promise<{ productId: string }>
  // searchParams: Promise<{ categoryId: string }>
}) {
  const productId = (await params).productId
  const product = await prisma.product.findFirst({
    where: {
      id: productId,
    },
    include: {
      images: { select: { url: true } },
      specs: {
        include: {
          translations: { select: { name: true, value: true, id: true } },
        },
      },
      questions: {
        include: {
          translations: { select: { question: true, answer: true, id: true } },
        },
      },
      category: {
        include: {
          translations: { select: { name: true } },
        },
      },
      variants: {
        include: { color: true, size: true, images: true },
      },
    },
  })
  if (!product) return notFound()
  const categories = await getCategoryList()
  // console.log({ categories })

  const offerTags = await getAllOfferTags()

  return (
    <div className="w-full">
      <ProductForm
        categories={categories}
        offerTags={offerTags}
        data={product}
      />
    </div>
  )
}
