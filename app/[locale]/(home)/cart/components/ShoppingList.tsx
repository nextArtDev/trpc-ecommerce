import { TransitionLink } from '@/components/home/shared/TransitionLink'
import AddToCardBtn from '@/components/product/product-detail/AddToCardBtn'
import { Badge } from '@/components/ui/badge'
import { CartProductType } from '@/lib/types/home'

import Image from 'next/image'

type Props = {
  cartItems: CartProductType[]
  mutable?: boolean
}

const ShoppingList = ({ cartItems, mutable = false }: Props) => {
  return (
    <ul
      role="list"
      className="w-full h-full divide-y divide-foreground border-t border-b border-foreground"
    >
      {cartItems?.map((item) => (
        <li
          key={item.slug}
          // className={cn(' flex py-6 sm:py-10')}
          className="w-full h-full flex flex-col items-center justify-center sm:items-center sm:justify-center sm:flex-row gap-4 py-6 px-4 sm:px-0 hover:bg-muted/30 transition-colors duration-200"
        >
          {!mutable && (
            <div className="relative shrink-0 mx-auto sm:mx-0">
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 overflow-hidden rounded-xl border border-border shadow-sm">
                <Image
                  unoptimized
                  fill
                  alt={item.name}
                  // src={item.image || '/placeholder-image.jpg'}
                  src={item.image || '/images/fallback-image.webp'}
                  className="object-cover transition-transform duration-300 hover:scale-105"
                  sizes="(max-width: 640px) 96px, (max-width: 1024px) 112px, 128px"
                />
              </div>
            </div>
          )}

          <div className="flex-1 space-y-3 sm:space-y-4">
            <div className="w-ful h-full flex flex-col items-center  justify-center sm:flex-row sm:justify-evenly sm:items-start gap-3">
              <div className="flex flex-col gap-2 sm:flex-row  sm:justify-evenly sm:items-center flex-1">
                <TransitionLink
                  href={`/products/${item.slug}`}
                  className="font-medium line-clamp-1  hover:underline"
                >
                  <h3 className="font-semibold text-base sm:text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-200">
                    {item.name}
                  </h3>
                  {item.size && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        سایز:
                      </span>
                      <p className="text-xs px-2 py-1">{item.size}</p>
                    </div>
                  )}
                  {item.color && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        رنگ:
                      </span>
                      <p className="text-xs px-2 py-1">{item.color}</p>
                    </div>
                  )}
                </TransitionLink>
                {/* <p className="mt-1 text-sm ">{product.color}</p> */}
                {/* {item.size ? (
                    <p className="mt-1 text-sm ">{item.size}</p>
                  ) : null} */}

                <div className="text-left space-y-3 px-auto text-sm font-medium ">
                  {/* <div className="text-sm text-muted-foreground">
                      {`${item.price} × ${item.quantity}  =`}
                    </div> */}

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      تعداد:
                    </span>
                    <p className="text-xs px-0.5 py-1">{item.quantity}</p>
                    {!mutable && (
                      <>
                        <span className="text-sm text-muted-foreground">
                          قیمت واحد:
                        </span>
                        <p className="text-xs px-0.5 py-1">{item.price}</p>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2"></div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm sm:text-base text-muted-foreground">
                      قیمت مجموع:
                    </span>
                    <Badge
                      variant="outline"
                      className="text-red-500 text-sm sm:text-base px-2 py-1"
                    >
                      {+item.price * item.quantity} تومان
                    </Badge>
                  </div>
                </div>
              </div>
              {/* <div className="flex items-center gap-2 text-sm">
                {item.stock > 0 ? (
                  <>
                    <CheckIcon className="w-4 h-4 text-green-600 shrink-0" />
                    <span className="text-green-700 font-medium">
                      ( تعداد {item.stock} در انبار)
                    </span>
                  </>
                ) : (
                  <>
                    <ClockIcon className="w-4 h-4 text-amber-600 shrink-0" />
                    <span className="text-amber-700 font-medium">ناموجود!</span>
                  </>
                )}
              </div> */}

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
                <div className="flex-1">
                  {!mutable && (
                    // <AddToCardBtn  item={product} />
                    <AddToCardBtn
                      product={{
                        id: item.productId,
                        slug: item.slug,
                        name: item.name,
                        image: item.image,
                        shippingFeeMethod: item.shippingMethod,
                      }}
                      variant={{
                        id: item.variantId,
                        size: item.size,
                        color: item.color,
                        price: item.price,
                        discount: 0,
                        quantity: item.stock,
                        weight: item.weight,
                      }}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* <p className="mt-4 flex space-x-2 text-sm ">
              {item.stock ? (
                <CheckIcon
                  aria-hidden="true"
                  className="size-5 shrink-0 text-green-500"
                />
              ) : (
                <ClockIcon aria-hidden="true" className="size-5 shrink-0 " />
              )}

              <span>
                        {product.inStock
                          ? 'In stock'
                          : `Ships in ${product.leadTime}`}
                      </span>
            </p> */}
          </div>
        </li>
      ))}
    </ul>
  )
}

export default ShoppingList
