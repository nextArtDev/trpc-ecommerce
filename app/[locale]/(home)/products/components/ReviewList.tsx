import { ProductReview } from '@/lib/types/home'
import TestimonialCarousel from '@/components/home/testemonial/Testemonial'
import { Review } from '@/lib/generated/prisma'
import Link from 'next/link'
import ReviewForm from './ReviewForm'
import { useTranslations, useLocale } from 'next-intl'

type Props = {
  reviews: ProductReview[]
  productId: string
  productSlug: string
  userId?: string | null
  userReview: Review | null
}

const ReviewList = ({
  reviews,
  productId,
  productSlug,
  userReview,
  userId,
}: Props) => {
  const t = useTranslations('product')
  const locale = useLocale()

  return (
    <div className="space-y-4">
      {reviews.length === 0 && <div>{t('reviews.beFirst')}</div>}
      {userId ? (
        <ReviewForm productId={productId} initialData={userReview} />
      ) : (
        <div>
          {t('reviews.signInPrompt')}
          <Link
            className="text-blue-700 px-2"
            href={`/${locale}/sign-in?callbackUrl=/${locale}/products/${productSlug}`}
          >
            {t('reviews.signInLink')}
          </Link>
        </div>
      )}
      <div className="flex flex-col gap-3">
        {!!reviews.length && (
          <TestimonialCarousel
            testimonials={reviews.map((review) => {
              const { title, description, user, createdAt, rating } = review
              return {
                title,
                description,
                user: user.name!,
                createdAt,
                rating,
              }
            })}
          />
        )}
      </div>
    </div>
  )
}

export default ReviewList
