import { ProductReview } from '@/lib/types/home'

import TestimonialCarousel from '@/components/home/testemonial/Testemonial'
import { Review } from '@/lib/generated/prisma'
import Link from 'next/link'
import ReviewForm from './ReviewForm'

type Props = {
  reviews: ProductReview[]
  productId: string
  productSlug: string
  //   numReviews: number
  userId?: string | null
  userReview: Review | null
}

const ReviewList = ({
  reviews,
  productId,
  productSlug,
  //   numReviews,
  userReview,
  userId,
}: Props) => {
  return (
    <div className="space-y-4">
      {reviews.length === 0 && <div>اولین نفری باشید که نظر می‌دهید!</div>}
      {userId ? (
        <ReviewForm productId={productId} initialData={userReview} />
      ) : (
        <div>
          لطفا
          <Link
            className="text-blue-700 px-2"
            href={`/sign-in?callbackUrl=/products/${productSlug}`}
          >
            وارد حساب خود شوید
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
