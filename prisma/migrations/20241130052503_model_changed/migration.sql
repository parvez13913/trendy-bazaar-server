/*
  Warnings:

  - You are about to drop the column `imageId` on the `products` table. All the data in the column will be lost.
  - You are about to drop the `images` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_imageId_fkey";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "imageId";

-- DropTable
DROP TABLE "images";
