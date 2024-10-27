/*
  Warnings:

  - You are about to drop the column `dateOfbirth` on the `admins` table. All the data in the column will be lost.
  - You are about to drop the column `dateOfbirth` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `dateOfbirth` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "admins" DROP COLUMN "dateOfbirth",
ADD COLUMN     "dateBirth" TEXT;

-- AlterTable
ALTER TABLE "customers" DROP COLUMN "dateOfbirth",
ADD COLUMN     "dateBirth" TEXT;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "dateOfbirth",
ADD COLUMN     "dateBirth" TEXT;
