/*
  Warnings:

  - You are about to drop the column `subProductCategoryId` on the `products` table. All the data in the column will be lost.
  - You are about to drop the `subProductCategories` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_subProductCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "subProductCategories" DROP CONSTRAINT "subProductCategories_productCategoryId_fkey";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "subProductCategoryId";

-- DropTable
DROP TABLE "subProductCategories";
