/* eslint-disable @typescript-eslint/no-explicit-any */
import { getCurrentUser } from '../auth-helpers'
import { Prisma } from '../generated/prisma'

// Base types for common structures
export type ProductImage = {
  // id: string
  url: string
  // key: string
}

export type BasicProductImage = {
  url: string
}

export type ProductSize = {
  id: string
  name: string
}

export type ProductColor = {
  id: string
  name: string
  hex: string
}

export type BasicProductColor = {
  name: string
  hex: string
}

export type Translation = {
  name: string
  description?: string | null
}

export type ProductTranslation = {
  name: string
  description: string
  keywords?: string
}

export type SpecTranslation = {
  name: string
  value: string
}

export type QuestionTranslation = {
  question: string
  answer: string
}

export type CategoryInfo = {
  id: string
  translations: Translation[]
  url: string
}

export type SubCategoryInfo = {
  id: string
  translations: Translation[]
  url: string
}

export type VariantsWithSizeAndColor = {
  id: string
  // sku:string
  price: number
  quantity: number
  discount: number
  weight: number | null
  length: number | null
  width: number | null
  height: number | null
  images: ProductImage[] | null
  size: ProductSize
  color: ProductColor
}
export type VariantsBasics = {
  price: number
  discount: number
}

// 1. Homepage Products Type
export type HomepageProduct = {
  id: string
  // name: string
  // description: string
  translations: ProductTranslation[]
  slug: string
  rating: number
  isFeatured: boolean
  isSale: boolean
  brand: string | null
  saleEndDate: string | null
  images: BasicProductImage[]
  variants: { price: number; discount: number; quantity: number }[]
  category: CategoryInfo
  subCategory: SubCategoryInfo
}

export type HomepageProductsResult = HomepageProduct[]

// 2. Best Sellers Type
export type BestSellerProduct = {
  id: string
  slug: string
  rating: number
  sales: number
  brand: string | null
  translations: ProductTranslation[]
  images: BasicProductImage[]
  variants: VariantsWithSizeAndColor[]
  category: CategoryInfo
  subCategory: SubCategoryInfo
}

export type BestSellersResult = BestSellerProduct[]

// 3. New Products Type
export type NewProduct = {
  id: string
  slug: string
  rating: number
  translations: ProductTranslation[]
  images: BasicProductImage[]
  variants: VariantsWithSizeAndColor[]
}

export type NewProductsResult = NewProduct[]

// 4. Categories with Stats Type
export type CategoryWithStats = {
  id: string
  url: string
  featured: boolean
  updatedAt: Date
  translations: Translation[]
  images: BasicProductImage[]
  _count: {
    products: number
  }
  subCategories: {
    id: string
    url: string
    translations: Translation[]
    images: BasicProductImage[]
    _count: {
      products: number
    }
  }[]
}

export type SubCategoryForHomePage = {
  id: string
  url: string
  translations: Translation[]
  images: { url: string }[]
}

export type CategoriesWithStatsResult = CategoryWithStats[]

// 5. Search Products Types
export interface SearchFilters {
  search?: string
  categoryId?: string
  subCategoryId?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: 'newest' | 'oldest' | 'price_asc' | 'price_desc' | 'rating' | 'sales'
  page?: number
  colors?: string[]
  sizes?: string[]
}

export interface SortOption {
  name: string
  value: SearchFilters['sortBy']
}

export interface CategoryData {
  id: string
  name: string
  url: string
  featured: boolean
}

export interface FiltersData {
  priceRange: {
    min: number
    max: number
  }
  colors: string[]
  sizes: string[]
  brands: (string | null)[]
}

export interface SearchProduct {
  id: string
  slug: string
  brand: string | null
  rating: number
  numReviews: number
  sales: number
  isSale: boolean
  saleEndDate: string | null
  translations: ProductTranslation[]
  images: { url: string }[]
  variants: {
    price: number
    discount: number
    quantity: number
    size: ProductSize
    images: ProductImage[]
    color: ProductColor
  }[]
  category?: CategoryInfo
  subCategory?: SubCategoryInfo
}

export interface SearchPagination {
  total: number
  pages: number
  current: number
  hasNext: boolean
  hasPrev: boolean
}

export interface SearchProductsResult {
  products: SearchProduct[]
  pagination: SearchPagination
}

// 6. Product Details Types
export type ProductSpec = {
  translations: SpecTranslation[] // Single translation for current locale
}

export type ProductQuestion = {
  translations: QuestionTranslation[]
}

export type ProductReview = {
  id: string
  title: string
  description: string
  isVerifiedPurchase: boolean
  isFeatured: boolean
  isPending: boolean
  rating: number
  likes: number
  createdAt: Date
  user: {
    name: string | null
  }
  images: BasicProductImage[]
}

export type OfferTag = {
  url: string
  translations: Translation[]
}

export type FreeShippingCity = {
  city: {
    id: number
    name: string
  }
}

export type FreeShipping = {
  id: string
  productId: string
  createdAt: Date
  updatedAt: Date
  eligibleCities: FreeShippingCity[]
}

export type ProductDetails = {
  id: string
  name: string
  description: string
  slug: string
  brand: string | null
  sku: string | null
  keywords: string
  images: ProductImage[]
  variants: VariantsWithSizeAndColor[]
  specs: ProductSpec[]
  questions: ProductQuestion[]
  shippingFeeMethod: 'ITEM' | 'WEIGHT' | 'FIXED'
  isSale: boolean
  saleEndDate: string | null
  views: number
  subCategory: SubCategoryInfo
  offerTag: OfferTag | null
  freeShipping: FreeShipping | null

  rating: number
  sales: number
  numReviews: number
  isFeatured: boolean
  categoryId: string
  subCategoryId: string
  offerTagId: string | null
  createdAt: Date
  updatedAt: Date
  translations: ProductTranslation[]
  reviews: ProductReview[]
  category: CategoryInfo
} | null
// 7. Related Products Type
export type RelatedProduct = {
  id: string
  slug: string
  rating: number
  translations: ProductTranslation[]
  images: BasicProductImage[]
  variants: VariantsBasics[]
}

export type RelatedProductsResult = RelatedProduct[]

// 8. Filters Data Types
export type PriceRange = {
  min: number
  max: number
}
// Additional utility types for components
export type TransformedProduct<
  T extends { translations: ProductTranslation[] }
> = Omit<T, 'translations'> & {
  name: string
  description: string
  keywords?: string
}

export type TransformedCategory<T extends { translations: Translation[] }> =
  Omit<T, 'translations'> & {
    name: string
    description?: string
  }

// For product cards/listings
export type ProductCardProps = {
  product:
    | HomepageProduct
    | BestSellerProduct
    | NewProduct
    | SearchProduct
    | RelatedProduct
  showCategory?: boolean
  showBrand?: boolean
  showRating?: boolean
  showSales?: boolean
}

// For category components
export type CategoryCardProps = {
  category: CategoryWithStats
  showProductCount?: boolean
  showSubCategories?: boolean
}

// For search/filter components
export type SearchFiltersProps = {
  filtersData: FiltersData
  onFiltersChange: (filters: SearchFilters) => void
  currentFilters: SearchFilters
}
export interface SortOption {
  name: string
  value: SearchFilters['sortBy']
}

// Updated category type to match your actual data
export interface CategoryData {
  id: string
  name: string
  url: string
  featured: boolean
}

// Type for filters data
export interface FiltersData {
  priceRange: {
    min: number
    max: number
  }
  colors: string[]
  sizes: string[]
  brands: (string | null)[]
}
export interface SortOption {
  name: string
  value: SearchFilters['sortBy']
}

// For pagination component
export type PaginationProps = {
  pagination: SearchPagination
  onPageChange: (page: number) => void
}

// For product reviews component
export type ProductReviewsProps = {
  reviews: ProductReview[]
  productRating: number
  totalReviews: number
}

// For product specifications component
export type ProductSpecsProps = {
  specs: Array<{
    name: string
    value: string
  }>
}

// For product Q&A component
export type ProductQAProps = {
  questions: Array<{
    question: string
    answer: string
  }>
}

// Example usage in components:

// Homepage component props
export type HomepageProps = {
  featuredProducts: HomepageProductsResult
  bestSellers: BestSellersResult
  newProducts: NewProductsResult
  categories: CategoriesWithStatsResult
}

// Search page component props
export type SearchPageProps = {
  searchResults: SearchProductsResult
  filtersData: FiltersData
  currentFilters: SearchFilters
}

// Product page component props
export type ProductPageProps = {
  product: ProductDetails
  relatedProducts: RelatedProductsResult
}

// Helper type for getting the actual return type from Prisma queries
export type InferQueryResult<T> = T extends Promise<infer U> ? U : T

// Example of how to use with actual function:
// type ActualHomepageProductsType = InferQueryResult<ReturnType<typeof getHomepageProducts>>;

// Union types for different product contexts
export type AnyProductType =
  | HomepageProduct
  | BestSellerProduct
  | NewProduct
  | SearchProduct
  | RelatedProduct

// Generic product list props
export type ProductListProps<T extends AnyProductType> = {
  products: T[]
  title: string
  showViewAll?: boolean
  viewAllLink?: string
  loading?: boolean
  error?: string | null
}

//Cart
export type CartProductType = {
  variantId: string
  productId: string
  slug: string
  name: string
  image: string
  size: string
  color: string
  price: number
  stock: number
  weight: number
  quantity: number
  shippingMethod: string
  shippingFee: number
  extraShippingFee: number
}

// Payment
export enum OrderStatus {
  Pending = 'Pending',
  Confirmed = 'Confirmed',
  Processing = 'Processing',
  Shipped = 'Shipped',
  OutforDelivery = 'OutforDelivery',
  Delivered = 'Delivered',
  Cancelled = 'Cancelled',
  Failed = 'Failed',
  Refunded = 'Refunded',
  Returned = 'Returned',
  OnHold = 'OnHold',
}

export enum PaymentStatus {
  Pending = 'Pending',
  Paid = 'Paid',
  Failed = 'Failed',
  Declined = 'Declined',
  Cancelled = 'Cancelled',
  Refunded = 'Refunded',
  Chargeback = 'Chargeback',
}

// Navigation Types

interface FeaturedItem {
  name: string
  href: string
  imageSrc: string
  imageAlt: string
}

interface Category {
  name: string
  featured: FeaturedItem[]
}

interface Page {
  name: string
  href: string
}

export interface NavigationData {
  categories: Category[]
  pages: Page[]
}

export type CurrentUserType = Prisma.PromiseReturnType<typeof getCurrentUser>

/**
 * Extracts the translation for display
 * Assumes translations array has exactly one item (the current locale)
 */
export function extractTranslation<T extends { translations: any[] }>(
  item: T
): T extends { translations: (infer U)[] } ? U : never {
  return item.translations[0] as any
}

/**
 * Transform product with translations to simpler format
 */
export function transformProduct<
  T extends { translations: ProductTranslation[] }
>(product: T): TransformedProduct<T> {
  const { translations, ...rest } = product
  return {
    ...rest,
    name: translations[0]?.name || '',
    description: translations[0]?.description || '',
    keywords: translations[0]?.keywords,
  } as TransformedProduct<T>
}

/**
 * Transform category with translations to simpler format
 */
export function transformCategory<T extends { translations: Translation[] }>(
  category: T
): TransformedCategory<T> {
  const { translations, ...rest } = category
  return {
    ...rest,
    name: translations[0]?.name || '',
    description: translations[0]?.description,
  } as TransformedCategory<T>
}

/**
 * Transform specs array
 */
export function transformSpecs(
  specs: ProductSpec[]
): Array<{ name: string; value: string }> {
  return specs.map((spec) => ({
    name: spec.translations[0]?.name || '',
    value: spec.translations[0]?.value || '',
  }))
}

/**
 * Transform questions array
 */
export function transformQuestions(
  questions: ProductQuestion[]
): Array<{ question: string; answer: string }> {
  return questions.map((q) => ({
    question: q.translations[0]?.question || '',
    answer: q.translations[0]?.answer || '',
  }))
}
