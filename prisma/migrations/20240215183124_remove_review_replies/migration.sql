/*
  Warnings:

  - You are about to drop the `PlaceReviewReply` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PlaceReviewReply" DROP CONSTRAINT "PlaceReviewReply_reviewUuid_fkey";

-- DropForeignKey
ALTER TABLE "PlaceReviewReply" DROP CONSTRAINT "PlaceReviewReply_userUuid_fkey";

-- DropTable
DROP TABLE "PlaceReviewReply";
