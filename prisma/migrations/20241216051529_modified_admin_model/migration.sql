/*
  Warnings:

  - You are about to drop the column `dateBirth` on the `admins` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "admins" DROP COLUMN "dateBirth",
ADD COLUMN     "dateOfBirth" TEXT;
