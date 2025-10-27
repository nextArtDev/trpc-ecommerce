import ProductDetailCarousel from '@/components/product/product-detail-carousel'
import AddToCardBtn from '@/components/product/product-detail/AddToCardBtn'
import { SingleStarRating } from '@/components/home/testemonial/SingleStartRating'
import ProductStatements from '@/components/product/product-detail/ProductStatemeents'
import { buttonVariants } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Review } from '@/lib/generated/prisma'
import { ProductDetails, ProductReview, RelatedProduct } from '@/lib/types/home'
import { FC, useMemo } from 'react'
import ReviewList from './ReviewList'
import RelatedProductCarousel from '@/components/product/related-products-carousel'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import FAQItem from '../../faq/components/FAQItem'
import Countdown from './count-down'
import ProductProperties from './ProductProperties'
import ViewNumbers from './view-numbers'
import BookmarkBtn from './BookmarkBtn'
import ProductBreadcrumb from './ProductBreadcrumb'
import { Check } from 'lucide-react'
import ProductDescription from './ProductDescription'
import { ShareButton } from './share-button'
import { useTranslations, useLocale } from 'next-intl'

type ProductPageProp = {
  data: NonNullable<ProductDetails>
  userId?: string | null
  reviews: ProductReview[]
  productAverageRating: { rating: number; count: number } | null
  userReview: Review | null
  selectedSizeId: string
  selectedColorId: string
  relatedProducts: RelatedProduct[] | null
  isInWishList: boolean
}

const ProductPage: FC<ProductPageProp> = ({
  data,
  userId,
  reviews,
  productAverageRating,
  userReview,
  relatedProducts,
  selectedColorId,
  selectedSizeId,
  isInWishList,
}) => {
  const t = useTranslations('product')
  const locale = useLocale()

  const {
    description,
    sku,
    images,
    variants,
    brand,
    subCategory,
    id,
    name,
    slug,
    shippingFeeMethod,
    questions,
    specs,
    keywords,
    isSale,
    saleEndDate,
    views,
  } = data

  const currentVariant = variants.find(
    (v) => v.size?.id === selectedSizeId && v.color?.id === selectedColorId
  )

  const uniqueSizes = useMemo(() => {
    const seen = new Set()
    return variants
      .map((v) => v.size)
      .filter((size) => {
        if (!size || seen.has(size.id)) return false
        seen.add(size.id)
        return true
      })
  }, [variants])

  const uniqueColors = useMemo(() => {
    const seen = new Set()
    return variants
      .map((v) => v.color)
      .filter((color) => {
        if (!color || seen.has(color.id)) return false
        seen.add(color.id)
        return true
      })
  }, [variants])

  return (
    <section className="pb-24 w-full h-full">
      <ProductBreadcrumb
        links={[
          { id: '1', label: t('breadcrumb.home'), href: `/${locale}` },
          {
            id: '2',
            label: subCategory.name,
            href: `/${locale}/sub-categories/${subCategory.url}`,
          },
          { id: '3', label: name, href: `/${locale}/products/${slug}` },
        ]}
      />
      <div className="max-w-2xl px-4 mx-auto flex flex-col gap-4">
        <article className="">
          <ProductDetailCarousel
            images={[...variants?.flatMap((vr) => vr?.images ?? []), ...images]}
          />
        </article>

        <article className="grid grid-row-5 gap-4">
          <div className="flex items-center justify-between gap-2">
            {productAverageRating && (
              <div className="flex gap-2">
                <SingleStarRating rating={productAverageRating.rating} />
                {productAverageRating.rating}
                <p>{t('rating.from')}</p>
                {productAverageRating.count}
                <p>{t('rating.people')}</p>
              </div>
            )}

            <ViewNumbers views={views} />
            <BookmarkBtn isInWishList={isInWishList} productId={id} />
            <ShareButton />
          </div>
          <p className="text-sm font-semibold">{brand}</p>
          <p className="text-base font-bold">{name}</p>

          <Separator />
          <article className="flex items-center justify-evenly">
            {/* === COLOR SELECTION === */}
            <div className="flex-1 flex flex-col gap-4 items-start">
              <p className="text-base font-semibold flex items-center gap-x-1">
                {t('size.selected')}:
                <Badge className="text-indigo-500 bg-indigo-500/35 inline text-base font-semibold py-0.5 px-1">
                  {currentVariant?.size.name}
                </Badge>
              </p>
              <ul className="flex flex-wrap gap-1">
                {uniqueSizes.map((size) => {
                  if (!size) return null
                  const isAvailable = variants.some(
                    (v) => v.size?.id === size.id && v.quantity > 0
                  )
                  return (
                    <li key={size.id}>
                      <Link
                        href={{
                          pathname: `/${locale}/products/${slug}`,
                          query: { size: size.id, color: selectedColorId },
                        }}
                        replace
                        scroll={false}
                        className={cn(
                          buttonVariants({
                            variant:
                              selectedSizeId === size.id ? 'indigo' : 'link',
                          }),
                          !isAvailable &&
                            'opacity-50 cursor-not-allowed pointer-events-none'
                        )}
                      >
                        {size.name}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
            <Separator orientation="vertical" />
            <div className="pr-2 flex-1 flex flex-col gap-4 items-start">
              <p className="text-base font-semibold flex items-center gap-x-1">
                {t('color.selected')}:{' '}
                <Badge className="text-indigo-500 bg-indigo-500/35 inline text-base font-semibold py-0.5 px-1">
                  {currentVariant?.color.name}
                </Badge>
              </p>
              <div className="flex gap-1">
                {uniqueColors.map((color) => {
                  if (!color) return null
                  const isAvailable = variants.some(
                    (v) => v.color?.id === color.id && v.quantity > 0
                  )
                  return (
                    <Link
                      key={color.id}
                      href={{
                        pathname: `/${locale}/products/${slug}`,
                        query: { size: selectedSizeId, color: color.id },
                      }}
                      replace
                      scroll={false}
                      className={cn(
                        'relative rounded-none m-2 transition-all',
                        selectedColorId === color.id
                          ? 'ring-4 ring-indigo-500'
                          : '',
                        !isAvailable &&
                          'opacity-50 cursor-not-allowed pointer-events-none grayscale-75'
                      )}
                    >
                      <div
                        className="size-8 rounded-none"
                        style={{ backgroundColor: color.hex }}
                      />
                      {selectedColorId === color.id && (
                        <Check className="absolute inset-0 -left-1/2 top-1/2 -translate-x-1/5 -translate-y-1/2 bg-transparent text-indigo-500" />
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          </article>
        </article>
        <Separator />
        <article>
          {isSale && saleEndDate && (
            <div className="mt-4 pb-2">
              <Countdown targetDate={saleEndDate} />
            </div>
          )}
        </article>
        <span className="text-green-600 flex gap-1 text-sm items-center">
          <span
            className={cn(
              'w-2 h-2 animate-pulse rounded-full',
              currentVariant && currentVariant.quantity > 0
                ? 'bg-green-600'
                : 'bg-red-600'
            )}
          ></span>
          {currentVariant && currentVariant.quantity > 0
            ? t('stock.available')
            : t('stock.outOfStock')}
          {currentVariant && currentVariant.quantity > 0 && (
            <span className="text-xs text-gray-500">
              ({currentVariant.quantity} {t('stock.remaining')})
            </span>
          )}
        </span>
        <article className="sticky top-1 bg-background/10 backdrop-blur-sm z-20 rounded-md flex items-center justify-center w-full h-full">
          {currentVariant && currentVariant.size && currentVariant.color ? (
            <AddToCardBtn
              variant={{
                id: currentVariant?.id,
                size: currentVariant.size.name,
                color: currentVariant.color.name,
                price: currentVariant.price,
                discount: currentVariant.discount,
                quantity: currentVariant.quantity,
                weight: currentVariant?.weight,
              }}
              product={{
                id: id,
                slug: slug,
                name: name,
                image: (data.images[0] || data.variants[0]?.images)?.url,
                shippingFeeMethod: shippingFeeMethod,
              }}
            />
          ) : (
            <div className="bg-orange-100 border border-orange-200 rounded-md p-4 text-center">
              <p className="text-orange-700 font-medium">
                {t('variant.unavailable')}
              </p>
              <p className="text-sm text-orange-600 mt-1">
                {t('variant.selectAnother')}
              </p>
            </div>
          )}
        </article>

        <Link
          className={cn(
            buttonVariants({ variant: 'outline' }),
            'max-w-sm mx-auto'
          )}
          href={`/${locale}/cart`}
        >
          {t('cart.viewCart')}
        </Link>
        <Separator />
        <article className="flex flex-col gap-6 items-start py-12">
          <div className="flex flex-col gap-4 justify-around">
            <ProductDescription description={description} />

            {sku && (
              <p dir="ltr" className="text-xs">
                SKU:{sku}
              </p>
            )}

            {!!keywords && (
              <div className="flex gap-3">
                <h1 className="font-semibold">{t('keywords')}:</h1>
                {keywords.split(',').map((k, i) => (
                  <Badge key={i} variant={'outline'}>
                    #{k}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <Separator />
          <div className="w-full h-full flex flex-col gap-4">
            <h1 className="font-semibold">{t('specifications')}:</h1>

            {currentVariant && currentVariant.size && (
              <ProductProperties
                variant={currentVariant}
                weight={
                  currentVariant?.weight ? currentVariant.weight : undefined
                }
                specs={
                  !!specs.filter((s) => s.name.trim().length > 0).length
                    ? specs
                    : undefined
                }
              />
            )}
          </div>
        </article>
        <Separator />
        <ProductStatements />
        <Separator />
        {!!questions.filter((q) => q.question.trim().length > 0).length && (
          <div className="flex items-start w-full mx-auto max-w-2xl space-y-2">
            {questions.map((faq, index) => (
              <FAQItem
                key={index}
                {...faq}
                index={index}
                className="rounded-sm w-full"
              />
            ))}
          </div>
        )}
        <Separator />
        <ReviewList
          reviews={reviews}
          productId={id}
          userId={userId}
          productSlug={slug}
          userReview={userReview}
        />

        <Separator />
      </div>
      <Separator />
      {!!relatedProducts?.length && (
        <section className="flex gap-6 flex-col justify-center items-center py-8">
          <h2 className="font-bold text-2xl">{t('relatedProducts')}</h2>
          <RelatedProductCarousel items={relatedProducts} />
        </section>
      )}
    </section>
  )
}

export default ProductPage
