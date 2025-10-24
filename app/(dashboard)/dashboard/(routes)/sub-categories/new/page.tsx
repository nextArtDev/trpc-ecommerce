// import { prisma } from '@/lib/prisma'
// import { notFound } from 'next/navigation'

import { notFound } from 'next/navigation'
import SubCategoryDetails from '../components/sub-category-details'
import prisma from '@/lib/prisma'

export default async function AdminNewSubCategoryPage() {
  const categories = await prisma.category.findMany({
    where: {},
  })
  if (!categories) return notFound()
  return (
    <div className="w-full">
      <SubCategoryDetails categories={categories} />
    </div>
  )
}
