/*
  Warnings:

  - A unique constraint covering the columns `[user_uuid,listing_uuid]` on the table `ListingRating` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[placeUuid,userUuid]` on the table `PlaceReview` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[placeUuid,userUuid]` on the table `PlaceVisitor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_uuid,listing_uuid]` on the table `UserSavedListings` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ListingRating_user_uuid_listing_uuid_key" ON "ListingRating"("user_uuid", "listing_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "PlaceReview_placeUuid_userUuid_key" ON "PlaceReview"("placeUuid", "userUuid");

-- CreateIndex
CREATE UNIQUE INDEX "PlaceVisitor_placeUuid_userUuid_key" ON "PlaceVisitor"("placeUuid", "userUuid");

-- CreateIndex
CREATE UNIQUE INDEX "UserSavedListings_user_uuid_listing_uuid_key" ON "UserSavedListings"("user_uuid", "listing_uuid");
