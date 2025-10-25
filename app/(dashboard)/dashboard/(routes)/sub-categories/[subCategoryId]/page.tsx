import { notFound } from 'next/navigation'
import SubCategoryDetails from '../components/sub-category-details'
import { getCategoryNames, getSubCategoryById } from '../../../lib/queries'

export default async function EditSubCategoryPage({
  params,
}: {
  params: Promise<{ subCategoryId: string }>
}) {
  const subcategoryId = (await params).subCategoryId

  const subcategory = await getSubCategoryById(subcategoryId)
  const categories = await getCategoryNames()

  if (!subcategory) return notFound()
  return (
    <div>
      <SubCategoryDetails categories={categories} initialData={subcategory} />
    </div>
  )
}
