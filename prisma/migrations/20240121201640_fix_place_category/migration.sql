/*
  Warnings:

  - You are about to drop the column `description` on the `PlaceCategory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PlaceCategory" DROP COLUMN "description",
ADD COLUMN     "parent_uuid" TEXT;

-- AddForeignKey
ALTER TABLE "PlaceCategory" ADD CONSTRAINT "PlaceCategory_parent_uuid_fkey" FOREIGN KEY ("parent_uuid") REFERENCES "PlaceCategory"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;
