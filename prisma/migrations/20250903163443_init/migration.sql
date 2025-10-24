-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('USER', 'admin');
-- CreateEnum
CREATE TYPE "public"."StoreStatus" AS ENUM ('PENDING', 'ACTIVE', 'BANNED', 'DISABLED');
-- CreateEnum
CREATE TYPE "public"."ShippingFeeMethod" AS ENUM ('ITEM', 'WEIGHT', 'FIXED');
-- CreateEnum
CREATE TYPE "public"."OrderStatus" AS ENUM (
    'Pending',
    'Confirmed',
    'Processing',
    'Shipped',
    'OutforDelivery',
    'Delivered',
    'Cancelled',
    'Failed',
    'Refunded',
    'Returned',
    'PartiallyShipped',
    'OnHold'
);
-- CreateEnum
CREATE TYPE "public"."PaymentStatus" AS ENUM (
    'Pending',
    'Paid',
    'Failed',
    'Declined',
    'Cancelled',
    'Refunded',
    'PartiallyRefunded',
    'Chargeback'
);
-- CreateEnum
CREATE TYPE "public"."ProductStatus" AS ENUM (
    'Pending',
    'Processing',
    'ReadyForShipment',
    'Shipped',
    'Delivered',
    'Canceled',
    'Returned',
    'Refunded',
    'FailedDelivery',
    'OnHold',
    'Backordered',
    'PartiallyShipped',
    'ExchangeRequested',
    'AwaitingPickup'
);
-- CreateTable
CREATE TABLE "public"."user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'USER',
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "phoneNumber" TEXT,
    "phoneNumberVerified" BOOLEAN,
    "address" TEXT,
    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "public"."session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,
    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "public"."account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "public"."verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3),
    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "public"."Image" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "categoryId" TEXT,
    "subCategoryId" TEXT,
    "variantImageId" TEXT,
    "productId" TEXT,
    "reviewId" TEXT,
    "userId" TEXT,
    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "public"."Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "public"."SubCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "SubCategory_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "public"."Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "sales" INTEGER NOT NULL DEFAULT 0,
    "numReviews" INTEGER NOT NULL DEFAULT 0,
    "shippingFeeMethod" "public"."ShippingFeeMethod" NOT NULL DEFAULT 'ITEM',
    "views" INTEGER NOT NULL DEFAULT 0,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isSale" BOOLEAN NOT NULL DEFAULT false,
    "saleEndDate" TEXT,
    "sku" TEXT,
    "keywords" TEXT NOT NULL,
    "weight" DOUBLE PRECISION,
    "categoryId" TEXT NOT NULL,
    "subCategoryId" TEXT NOT NULL,
    "offerTagId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "public"."Size" (
    "id" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "length" INTEGER NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "productId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Size_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "public"."Color" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "productId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Color_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "public"."OfferTag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "OfferTag_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "public"."Spec" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "productId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Spec_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "public"."Question" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "productId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "public"."Country" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Country_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "public"."ShippingRate" (
    "id" TEXT NOT NULL,
    "shippingService" TEXT NOT NULL,
    "shippingFeePerItem" DOUBLE PRECISION NOT NULL,
    "shippingFeeForAdditionalItem" DOUBLE PRECISION NOT NULL,
    "shippingFeePerKg" DOUBLE PRECISION NOT NULL,
    "shippingFeeFixed" DOUBLE PRECISION NOT NULL,
    "deliveryTimeMin" INTEGER NOT NULL,
    "deliveryTimeMax" INTEGER NOT NULL,
    "returnPolicy" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,
    "cityId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ShippingRate_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "public"."FreeShipping" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FreeShipping_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "public"."FreeShippingCity" (
    "id" TEXT NOT NULL,
    "freeShippingId" TEXT NOT NULL,
    "cityId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FreeShippingCity_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "public"."Review" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isVerifiedPurchase" BOOLEAN NOT NULL DEFAULT true,
    "rating" DOUBLE PRECISION NOT NULL,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isPending" BOOLEAN NOT NULL DEFAULT true,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "public"."Cart" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "couponId" TEXT,
    "shippingFees" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "subTotal" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "public"."CartItem" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "sizeId" TEXT NOT NULL,
    "productSlug" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "weight" DOUBLE PRECISION,
    "price" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "shippingFee" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "cartId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "CartItem_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "public"."ShippingAddress" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address1" TEXT NOT NULL,
    "address2" TEXT,
    "zip_code" TEXT NOT NULL,
    "default" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "countryId" TEXT,
    "provinceId" INTEGER NOT NULL,
    "cityId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ShippingAddress_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "public"."Order" (
    "id" TEXT NOT NULL,
    "shippingFees" DOUBLE PRECISION NOT NULL,
    "subTotal" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "paidAt" TIMESTAMP(6),
    "deliveredAt" TIMESTAMP(6),
    "orderStatus" "public"."OrderStatus" NOT NULL DEFAULT 'Pending',
    "paymentStatus" "public"."PaymentStatus" NOT NULL DEFAULT 'Pending',
    "authority" TEXT,
    "shippingAddressId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "couponId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "public"."OrderItem" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "sizeId" TEXT NOT NULL,
    "productSlug" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "shippingFee" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "price" DOUBLE PRECISION NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "status" "public"."ProductStatus" NOT NULL DEFAULT 'Pending',
    "orderId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "public"."OrderGroup" (
    "id" TEXT NOT NULL,
    "status" "public"."OrderStatus" NOT NULL DEFAULT 'Pending',
    "shippingService" TEXT NOT NULL,
    "shippingDeliveryMin" INTEGER NOT NULL,
    "shippingDeliveryMax" INTEGER NOT NULL,
    "shippingFees" DOUBLE PRECISION NOT NULL,
    "subTotal" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "OrderGroup_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "public"."PaymentDetails" (
    "id" TEXT NOT NULL,
    "status" TEXT,
    "amount" DOUBLE PRECISION,
    "Authority" TEXT,
    "orderId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "PaymentDetails_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "public"."Wishlist" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "sizeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Wishlist_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "public"."Coupon" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT NOT NULL,
    "discount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Coupon_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "public"."Province" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "center" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    CONSTRAINT "Province_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "public"."City" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "provinceId" INTEGER NOT NULL,
    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "public"."TopBar" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "buttonTitle" TEXT,
    "buttonColor" TEXT,
    "buttonLink" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "TopBar_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "public"."_CouponToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_CouponToUser_AB_pkey" PRIMARY KEY ("A", "B")
);
-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "public"."user"("email");
-- CreateIndex
CREATE UNIQUE INDEX "user_phoneNumber_key" ON "public"."user"("phoneNumber");
-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "public"."session"("token");
-- CreateIndex
CREATE INDEX "Image_subCategoryId_idx" ON "public"."Image"("subCategoryId");
-- CreateIndex
CREATE INDEX "Image_categoryId_idx" ON "public"."Image"("categoryId");
-- CreateIndex
CREATE INDEX "Image_productId_idx" ON "public"."Image"("productId");
-- CreateIndex
CREATE INDEX "Image_reviewId_idx" ON "public"."Image"("reviewId");
-- CreateIndex
CREATE INDEX "Image_variantImageId_idx" ON "public"."Image"("variantImageId");
-- CreateIndex
CREATE UNIQUE INDEX "Category_url_key" ON "public"."Category"("url");
-- CreateIndex
CREATE UNIQUE INDEX "SubCategory_url_key" ON "public"."SubCategory"("url");
-- CreateIndex
CREATE INDEX "SubCategory_categoryId_idx" ON "public"."SubCategory"("categoryId");
-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "public"."Product"("slug");
-- CreateIndex
CREATE INDEX "Product_categoryId_idx" ON "public"."Product"("categoryId");
-- CreateIndex
CREATE INDEX "Product_subCategoryId_idx" ON "public"."Product"("subCategoryId");
-- CreateIndex
CREATE INDEX "Product_offerTagId_idx" ON "public"."Product"("offerTagId");
-- CreateIndex
CREATE INDEX "Size_productId_idx" ON "public"."Size"("productId");
-- CreateIndex
CREATE INDEX "Color_productId_idx" ON "public"."Color"("productId");
-- CreateIndex
CREATE UNIQUE INDEX "OfferTag_url_key" ON "public"."OfferTag"("url");
-- CreateIndex
CREATE INDEX "Spec_productId_idx" ON "public"."Spec"("productId");
-- CreateIndex
CREATE INDEX "Question_productId_idx" ON "public"."Question"("productId");
-- CreateIndex
CREATE UNIQUE INDEX "Country_name_key" ON "public"."Country"("name");
-- CreateIndex
CREATE UNIQUE INDEX "Country_code_key" ON "public"."Country"("code");
-- CreateIndex
CREATE INDEX "ShippingRate_countryId_idx" ON "public"."ShippingRate"("countryId");
-- CreateIndex
CREATE INDEX "ShippingRate_cityId_idx" ON "public"."ShippingRate"("cityId");
-- CreateIndex
CREATE UNIQUE INDEX "FreeShipping_productId_key" ON "public"."FreeShipping"("productId");
-- CreateIndex
CREATE INDEX "FreeShippingCity_freeShippingId_idx" ON "public"."FreeShippingCity"("freeShippingId");
-- CreateIndex
CREATE INDEX "FreeShippingCity_cityId_idx" ON "public"."FreeShippingCity"("cityId");
-- CreateIndex
CREATE INDEX "Review_userId_idx" ON "public"."Review"("userId");
-- CreateIndex
CREATE INDEX "Review_productId_idx" ON "public"."Review"("productId");
-- CreateIndex
CREATE UNIQUE INDEX "Cart_userId_key" ON "public"."Cart"("userId");
-- CreateIndex
CREATE INDEX "Cart_couponId_idx" ON "public"."Cart"("couponId");
-- CreateIndex
CREATE INDEX "CartItem_cartId_idx" ON "public"."CartItem"("cartId");
-- CreateIndex
CREATE INDEX "ShippingAddress_countryId_idx" ON "public"."ShippingAddress"("countryId");
-- CreateIndex
CREATE INDEX "ShippingAddress_provinceId_idx" ON "public"."ShippingAddress"("provinceId");
-- CreateIndex
CREATE INDEX "ShippingAddress_userId_idx" ON "public"."ShippingAddress"("userId");
-- CreateIndex
CREATE INDEX "ShippingAddress_cityId_idx" ON "public"."ShippingAddress"("cityId");
-- CreateIndex
CREATE INDEX "Order_shippingAddressId_idx" ON "public"."Order"("shippingAddressId");
-- CreateIndex
CREATE INDEX "Order_userId_idx" ON "public"."Order"("userId");
-- CreateIndex
CREATE UNIQUE INDEX "PaymentDetails_orderId_key" ON "public"."PaymentDetails"("orderId");
-- CreateIndex
CREATE INDEX "PaymentDetails_orderId_idx" ON "public"."PaymentDetails"("orderId");
-- CreateIndex
CREATE INDEX "PaymentDetails_userId_idx" ON "public"."PaymentDetails"("userId");
-- CreateIndex
CREATE INDEX "Wishlist_userId_idx" ON "public"."Wishlist"("userId");
-- CreateIndex
CREATE INDEX "Wishlist_productId_idx" ON "public"."Wishlist"("productId");
-- CreateIndex
CREATE INDEX "Wishlist_sizeId_idx" ON "public"."Wishlist"("sizeId");
-- CreateIndex
CREATE UNIQUE INDEX "Coupon_code_key" ON "public"."Coupon"("code");
-- CreateIndex
CREATE UNIQUE INDEX "Province_name_key" ON "public"."Province"("name");
-- CreateIndex
CREATE INDEX "City_provinceId_idx" ON "public"."City"("provinceId");
-- CreateIndex
CREATE INDEX "_CouponToUser_B_index" ON "public"."_CouponToUser"("B");
-- AddForeignKey
ALTER TABLE "public"."session"
ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "public"."account"
ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "public"."Image"
ADD CONSTRAINT "Image_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE
SET NULL ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "public"."Image"
ADD CONSTRAINT "Image_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "public"."SubCategory"("id") ON DELETE
SET NULL ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "public"."Image"
ADD CONSTRAINT "Image_variantImageId_fkey" FOREIGN KEY ("variantImageId") REFERENCES "public"."Product"("id") ON DELETE
SET NULL ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "public"."Image"
ADD CONSTRAINT "Image_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE
SET NULL ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "public"."Image"
ADD CONSTRAINT "Image_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "public"."Review"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
-- AddForeignKey
ALTER TABLE "public"."Image"
ADD CONSTRAINT "Image_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE
SET NULL ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "public"."SubCategory"
ADD CONSTRAINT "SubCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "public"."Product"
ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "public"."Product"
ADD CONSTRAINT "Product_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "public"."SubCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "public"."Product"
ADD CONSTRAINT "Product_offerTagId_fkey" FOREIGN KEY ("offerTagId") REFERENCES "public"."OfferTag"("id") ON DELETE
SET NULL ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "public"."Size"
ADD CONSTRAINT "Size_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE
SET NULL ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "public"."Color"
ADD CONSTRAINT "Color_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "public"."Spec"
ADD CONSTRAINT "Spec_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "public"."Question"
ADD CONSTRAINT "Question_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "public"."ShippingRate"
ADD CONSTRAINT "ShippingRate_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "public"."Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "public"."ShippingRate"
ADD CONSTRAINT "ShippingRate_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "public"."City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "public"."FreeShipping"
ADD CONSTRAINT "FreeShipping_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "public"."FreeShippingCity"
ADD CONSTRAINT "FreeShippingCity_freeShippingId_fkey" FOREIGN KEY ("freeShippingId") REFERENCES "public"."FreeShipping"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "public"."FreeShippingCity"
ADD CONSTRAINT "FreeShippingCity_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "public"."City"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "public"."Review"
ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "public"."Review"
ADD CONSTRAINT "Review_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "public"."Cart"
ADD CONSTRAINT "Cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "public"."Cart"
ADD CONSTRAINT "Cart_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "public"."Coupon"("id") ON DELETE
SET NULL ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "public"."CartItem"
ADD CONSTRAINT "CartItem_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "public"."Cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "public"."ShippingAddress"
ADD CONSTRAINT "ShippingAddress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "public"."ShippingAddress"
ADD CONSTRAINT "ShippingAddress_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "public"."Country"("id") ON DELETE
SET NULL ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "public"."ShippingAddress"
ADD CONSTRAINT "ShippingAddress_provinceId_fkey" FOREIGN KEY ("provinceId") REFERENCES "public"."Province"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "public"."ShippingAddress"
ADD CONSTRAINT "ShippingAddress_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "public"."City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "public"."Order"
ADD CONSTRAINT "Order_shippingAddressId_fkey" FOREIGN KEY ("shippingAddressId") REFERENCES "public"."ShippingAddress"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "public"."Order"
ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "public"."Order"
ADD CONSTRAINT "Order_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "public"."Coupon"("id") ON DELETE
SET NULL ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "public"."OrderItem"
ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "public"."PaymentDetails"
ADD CONSTRAINT "PaymentDetails_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "public"."PaymentDetails"
ADD CONSTRAINT "PaymentDetails_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "public"."Wishlist"
ADD CONSTRAINT "Wishlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "public"."Wishlist"
ADD CONSTRAINT "Wishlist_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "public"."Wishlist"
ADD CONSTRAINT "Wishlist_sizeId_fkey" FOREIGN KEY ("sizeId") REFERENCES "public"."Size"("id") ON DELETE
SET NULL ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "public"."City"
ADD CONSTRAINT "City_provinceId_fkey" FOREIGN KEY ("provinceId") REFERENCES "public"."Province"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "public"."_CouponToUser"
ADD CONSTRAINT "_CouponToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Coupon"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "public"."_CouponToUser"
ADD CONSTRAINT "_CouponToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;