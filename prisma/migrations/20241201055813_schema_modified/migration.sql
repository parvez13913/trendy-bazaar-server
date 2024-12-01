/*
  Warnings:

  - You are about to drop the `admins` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `customers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `productCategories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `products` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `subProductCategories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "admins" DROP CONSTRAINT "admins_userId_fkey";

-- DropForeignKey
ALTER TABLE "customers" DROP CONSTRAINT "customers_userId_fkey";

-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_productCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_subProductCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "subProductCategories" DROP CONSTRAINT "subProductCategories_productCategoryId_fkey";

-- DropTable
DROP TABLE "admins";

-- DropTable
DROP TABLE "customers";

-- DropTable
DROP TABLE "productCategories";

-- DropTable
DROP TABLE "products";

-- DropTable
DROP TABLE "subProductCategories";

-- DropTable
DROP TABLE "users";

-- DropEnum
DROP TYPE "UserRole";
