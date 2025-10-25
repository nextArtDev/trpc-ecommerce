// import { prisma } from '@/lib/prisma'
// import { notFound } from 'next/navigation'

import { notFound } from 'next/navigation'
import SubCategoryDetails from '../components/sub-category-details'

import { getCategoryNames } from '../../../lib/queries'

export default async function AdminNewSubCategoryPage() {
  const categories = await getCategoryNames()
  if (!categories) return notFound()
  return (
    <div className="w-full">
      <SubCategoryDetails categories={categories} />
    </div>
  )
}
