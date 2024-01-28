/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `phone` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.
  - The required column `uuid` was added to the `User` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "State" AS ENUM ('NEW', 'LIKE_NEW', 'USED', 'REFURBISHED');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PUBLIC', 'PRIVATE', 'REMOVED', 'DELETED');

-- CreateEnum
CREATE TYPE "ListingType" AS ENUM ('PRODUCT', 'SERVICE');

-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'MOD';

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "id",
DROP COLUMN "updatedAt",
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "chatUuid" TEXT,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "header_pic" TEXT,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "profile_pic" TEXT,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER',
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL,
ADD COLUMN     "uuid" TEXT NOT NULL,
ADD COLUMN     "verified_email" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "verified_phone" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "name" SET NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("uuid");

-- DropTable
DROP TABLE "Post";

-- CreateTable
CREATE TABLE "UserSettings" (
    "uuid" TEXT NOT NULL,
    "preferred_theme" TEXT NOT NULL DEFAULT 'light',
    "marketing_emails" BOOLEAN NOT NULL DEFAULT true,
    "in_app_notifications" BOOLEAN NOT NULL DEFAULT true,
    "email_notifications" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "user_uuid" TEXT NOT NULL,

    CONSTRAINT "UserSettings_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "UserSavedListings" (
    "uuid" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "user_uuid" TEXT NOT NULL,
    "listing_uuid" TEXT NOT NULL,

    CONSTRAINT "UserSavedListings_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Listing" (
    "uuid" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "ListingType" NOT NULL,
    "price" DOUBLE PRECISION,
    "state" "State",
    "rental" INTEGER,
    "negotiable" BOOLEAN NOT NULL DEFAULT false,
    "status" "Status" NOT NULL DEFAULT 'PUBLIC',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "user_uuid" TEXT NOT NULL,
    "category_uuid" TEXT NOT NULL,
    "tagUuid" TEXT,

    CONSTRAINT "Listing_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Category" (
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "parent_uuid" TEXT,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "ListingImage" (
    "uuid" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "status" "Status" NOT NULL DEFAULT 'PUBLIC',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "listing_uuid" TEXT NOT NULL,

    CONSTRAINT "ListingImage_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "ListingTag" (
    "listing_uuid" TEXT NOT NULL,
    "tag_uuid" TEXT NOT NULL,

    CONSTRAINT "ListingTag_pkey" PRIMARY KEY ("listing_uuid","tag_uuid")
);

-- CreateTable
CREATE TABLE "Tag" (
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'PUBLIC',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "ListingComment" (
    "uuid" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "user_uuid" TEXT NOT NULL,
    "listing_uuid" TEXT NOT NULL,

    CONSTRAINT "ListingComment_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "ListingRating" (
    "uuid" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "user_uuid" TEXT NOT NULL,
    "listing_uuid" TEXT NOT NULL,

    CONSTRAINT "ListingRating_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "ListingReport" (
    "uuid" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "user_uuid" TEXT NOT NULL,
    "listing_uuid" TEXT NOT NULL,

    CONSTRAINT "ListingReport_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Chat" (
    "uuid" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Message" (
    "uuid" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "user_uuid" TEXT NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "_SavedListings" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ChatUsers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSettings_user_uuid_key" ON "UserSettings"("user_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "_SavedListings_AB_unique" ON "_SavedListings"("A", "B");

-- CreateIndex
CREATE INDEX "_SavedListings_B_index" ON "_SavedListings"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ChatUsers_AB_unique" ON "_ChatUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_ChatUsers_B_index" ON "_ChatUsers"("B");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_chatUuid_fkey" FOREIGN KEY ("chatUuid") REFERENCES "Chat"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSettings" ADD CONSTRAINT "UserSettings_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSavedListings" ADD CONSTRAINT "UserSavedListings_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSavedListings" ADD CONSTRAINT "UserSavedListings_listing_uuid_fkey" FOREIGN KEY ("listing_uuid") REFERENCES "Listing"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_category_uuid_fkey" FOREIGN KEY ("category_uuid") REFERENCES "Category"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_tagUuid_fkey" FOREIGN KEY ("tagUuid") REFERENCES "Tag"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_parent_uuid_fkey" FOREIGN KEY ("parent_uuid") REFERENCES "Category"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingImage" ADD CONSTRAINT "ListingImage_listing_uuid_fkey" FOREIGN KEY ("listing_uuid") REFERENCES "Listing"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingTag" ADD CONSTRAINT "ListingTag_listing_uuid_fkey" FOREIGN KEY ("listing_uuid") REFERENCES "Listing"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingTag" ADD CONSTRAINT "ListingTag_tag_uuid_fkey" FOREIGN KEY ("tag_uuid") REFERENCES "Tag"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingComment" ADD CONSTRAINT "ListingComment_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingComment" ADD CONSTRAINT "ListingComment_listing_uuid_fkey" FOREIGN KEY ("listing_uuid") REFERENCES "Listing"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingRating" ADD CONSTRAINT "ListingRating_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingRating" ADD CONSTRAINT "ListingRating_listing_uuid_fkey" FOREIGN KEY ("listing_uuid") REFERENCES "Listing"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingReport" ADD CONSTRAINT "ListingReport_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingReport" ADD CONSTRAINT "ListingReport_listing_uuid_fkey" FOREIGN KEY ("listing_uuid") REFERENCES "Listing"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SavedListings" ADD CONSTRAINT "_SavedListings_A_fkey" FOREIGN KEY ("A") REFERENCES "Listing"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SavedListings" ADD CONSTRAINT "_SavedListings_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChatUsers" ADD CONSTRAINT "_ChatUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "Chat"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChatUsers" ADD CONSTRAINT "_ChatUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
