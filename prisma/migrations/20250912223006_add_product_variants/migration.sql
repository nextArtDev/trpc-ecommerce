/*
  Warnings:

  - The values [USER] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `sizeId` on the `CartItem` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Color` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `Color` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Color` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `sizeId` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `weight` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Size` table. All the data in the column will be lost.
  - You are about to drop the column `discount` on the `Size` table. All the data in the column will be lost.
  - You are about to drop the column `height` on the `Size` table. All the data in the column will be lost.
  - You are about to drop the column `length` on the `Size` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Size` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `Size` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `Size` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `Size` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Size` table. All the data in the column will be lost.
  - You are about to drop the column `width` on the `Size` table. All the data in the column will be lost.
  - You are about to drop the column `sizeId` on the `Wishlist` table. All the data in the column will be lost.
  - You are about to drop the `OrderGroup` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `Color` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[hex]` on the table `Color` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Size` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `color` to the `CartItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `variantId` to the `CartItem` table without a default value. This is not possible if the table is not empty.
  - Made the column `weight` on table `CartItem` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `hex` to the `Color` table without a default value. This is not possible if the table is not empty.
  - Added the required column `color` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `variantId` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Size` table without a default value. This is not possible if the table is not empty.
  - Added the required column `variantId` to the `Wishlist` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."Role_new" AS ENUM ('user', 'admin');
ALTER TABLE "public"."user" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "public"."user" ALTER COLUMN "role" TYPE "public"."Role_new" USING ("role"::text::"public"."Role_new");
ALTER TYPE "public"."Role" RENAME TO "Role_old";
ALTER TYPE "public"."Role_new" RENAME TO "Role";
DROP TYPE "public"."Role_old";
ALTER TABLE "public"."user" ALTER COLUMN "role" SET DEFAULT 'user';
COMMIT;

-- DropForeignKey
ALTER TABLE "public"."Color" DROP CONSTRAINT "Color_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Image" DROP CONSTRAINT "Image_variantImageId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PaymentDetails" DROP CONSTRAINT "PaymentDetails_orderId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PaymentDetails" DROP CONSTRAINT "PaymentDetails_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Size" DROP CONSTRAINT "Size_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Wishlist" DROP CONSTRAINT "Wishlist_sizeId_fkey";

-- DropIndex
DROP INDEX "public"."Color_productId_idx";

-- DropIndex
DROP INDEX "public"."Size_productId_idx";

-- DropIndex
DROP INDEX "public"."Wishlist_productId_idx";

-- DropIndex
DROP INDEX "public"."Wishlist_sizeId_idx";

-- AlterTable
ALTER TABLE "public"."CartItem" DROP COLUMN "sizeId",
ADD COLUMN     "color" TEXT NOT NULL,
ADD COLUMN     "variantId" TEXT NOT NULL,
ALTER COLUMN "weight" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."Category" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "public"."Color" DROP COLUMN "createdAt",
DROP COLUMN "productId",
DROP COLUMN "updatedAt",
ADD COLUMN     "hex" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."OrderItem" DROP COLUMN "productId",
DROP COLUMN "sizeId",
ADD COLUMN     "color" TEXT NOT NULL,
ADD COLUMN     "variantId" TEXT NOT NULL,
ALTER COLUMN "sku" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."PaymentDetails" ADD COLUMN     "transactionId" TEXT;

-- AlterTable
ALTER TABLE "public"."Product" DROP COLUMN "weight",
ALTER COLUMN "brand" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Size" DROP COLUMN "createdAt",
DROP COLUMN "discount",
DROP COLUMN "height",
DROP COLUMN "length",
DROP COLUMN "price",
DROP COLUMN "productId",
DROP COLUMN "quantity",
DROP COLUMN "size",
DROP COLUMN "updatedAt",
DROP COLUMN "width",
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."SubCategory" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "public"."Wishlist" DROP COLUMN "sizeId",
ADD COLUMN     "variantId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."session" ADD COLUMN     "impersonatedBy" TEXT;

-- AlterTable
ALTER TABLE "public"."user" ADD COLUMN     "banExpires" TEXT,
ADD COLUMN     "banReason" TEXT,
ADD COLUMN     "banned" BOOLEAN DEFAULT false,
ADD COLUMN     "image" TEXT,
ALTER COLUMN "role" SET DEFAULT 'user';

-- DropTable
DROP TABLE "public"."OrderGroup";

-- DropEnum
DROP TYPE "public"."StoreStatus";

-- CreateTable
CREATE TABLE "public"."OtpRateLimit" (
    "id" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "lastSentAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OtpRateLimit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProductVariant" (
    "id" TEXT NOT NULL,
    "sku" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "weight" DOUBLE PRECISION NOT NULL,
    "length" INTEGER,
    "width" INTEGER,
    "height" INTEGER,
    "productId" TEXT NOT NULL,
    "sizeId" TEXT NOT NULL,
    "colorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PaymentLock" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "authority" TEXT NOT NULL,
    "lockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentLock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PaymentAttempt" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "authority" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaymentAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PaymentRateLimit" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaymentRateLimit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OtpRateLimit_phoneNumber_key" ON "public"."OtpRateLimit"("phoneNumber");

-- CreateIndex
CREATE INDEX "OtpRateLimit_phoneNumber_idx" ON "public"."OtpRateLimit"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "ProductVariant_sku_key" ON "public"."ProductVariant"("sku");

-- CreateIndex
CREATE INDEX "ProductVariant_productId_idx" ON "public"."ProductVariant"("productId");

-- CreateIndex
CREATE INDEX "ProductVariant_sizeId_idx" ON "public"."ProductVariant"("sizeId");

-- CreateIndex
CREATE INDEX "ProductVariant_colorId_idx" ON "public"."ProductVariant"("colorId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductVariant_productId_sizeId_colorId_key" ON "public"."ProductVariant"("productId", "sizeId", "colorId");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentLock_orderId_key" ON "public"."PaymentLock"("orderId");

-- CreateIndex
CREATE INDEX "PaymentLock_orderId_idx" ON "public"."PaymentLock"("orderId");

-- CreateIndex
CREATE INDEX "PaymentLock_expiresAt_idx" ON "public"."PaymentLock"("expiresAt");

-- CreateIndex
CREATE INDEX "PaymentAttempt_orderId_idx" ON "public"."PaymentAttempt"("orderId");

-- CreateIndex
CREATE INDEX "PaymentAttempt_authority_idx" ON "public"."PaymentAttempt"("authority");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentAttempt_orderId_authority_key" ON "public"."PaymentAttempt"("orderId", "authority");

-- CreateIndex
CREATE INDEX "PaymentRateLimit_userId_createdAt_idx" ON "public"."PaymentRateLimit"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Color_name_key" ON "public"."Color"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Color_hex_key" ON "public"."Color"("hex");

-- CreateIndex
CREATE UNIQUE INDEX "Size_name_key" ON "public"."Size"("name");

-- CreateIndex
CREATE INDEX "Wishlist_variantId_idx" ON "public"."Wishlist"("variantId");

-- AddForeignKey
ALTER TABLE "public"."Image" ADD CONSTRAINT "Image_variantImageId_fkey" FOREIGN KEY ("variantImageId") REFERENCES "public"."ProductVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductVariant" ADD CONSTRAINT "ProductVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductVariant" ADD CONSTRAINT "ProductVariant_sizeId_fkey" FOREIGN KEY ("sizeId") REFERENCES "public"."Size"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductVariant" ADD CONSTRAINT "ProductVariant_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "public"."Color"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CartItem" ADD CONSTRAINT "CartItem_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "public"."ProductVariant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CartItem" ADD CONSTRAINT "CartItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrderItem" ADD CONSTRAINT "OrderItem_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "public"."ProductVariant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PaymentDetails" ADD CONSTRAINT "PaymentDetails_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PaymentDetails" ADD CONSTRAINT "PaymentDetails_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Wishlist" ADD CONSTRAINT "Wishlist_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "public"."ProductVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
