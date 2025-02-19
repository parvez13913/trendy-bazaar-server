/*
  Warnings:

  - Made the column `productImage` on table `products` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "products" ALTER COLUMN "productImage" SET NOT NULL;
