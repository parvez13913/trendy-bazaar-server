/*
  Warnings:

  - You are about to drop the `ProductCategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "ProductCategory";

-- CreateTable
CREATE TABLE "productCategories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "productCategories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subProductCategories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "productCategoryId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subProductCategories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "productCategories_name_key" ON "productCategories"("name");

-- AddForeignKey
ALTER TABLE "subProductCategories" ADD CONSTRAINT "subProductCategories_productCategoryId_fkey" FOREIGN KEY ("productCategoryId") REFERENCES "productCategories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
