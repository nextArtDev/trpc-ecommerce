import { notFound } from 'next/navigation'
import CategoryDetails from '../components/category-details'
import { getCategoryById } from '../../../lib/queries'

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ categoryId: string }>
}) {
  const categoryId = (await params).categoryId

  const category = await getCategoryById(categoryId)
  if (!category) return notFound()
  return (
    <div>
      <CategoryDetails initialData={category} />
    </div>
  )
}
