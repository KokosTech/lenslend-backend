-- CreateTable
CREATE TABLE "Place" (
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "categoryUuid" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "icon" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'PUBLIC',
    "creatorUuid" TEXT NOT NULL,
    "ownerUuid" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Place_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "PlaceCategory" (
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'PUBLIC',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "PlaceCategory_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Service" (
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "bg_color" TEXT NOT NULL,
    "dark_color" TEXT NOT NULL,
    "dark_bg_color" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'PUBLIC',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Service_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "PlaceService" (
    "uuid" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "placeUuid" TEXT NOT NULL,
    "serviceUuid" TEXT NOT NULL,

    CONSTRAINT "PlaceService_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "PlaceImage" (
    "uuid" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "order" INTEGER,
    "status" "Status" NOT NULL DEFAULT 'PUBLIC',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "placeUuid" TEXT NOT NULL,

    CONSTRAINT "PlaceImage_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "PlaceTag" (
    "placeUuid" TEXT NOT NULL,
    "tagUuid" TEXT NOT NULL,

    CONSTRAINT "PlaceTag_pkey" PRIMARY KEY ("placeUuid","tagUuid")
);

-- CreateTable
CREATE TABLE "PlaceReview" (
    "uuid" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'PUBLIC',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "userUuid" TEXT NOT NULL,
    "placeUuid" TEXT NOT NULL,

    CONSTRAINT "PlaceReview_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "PlaceReviewReply" (
    "uuid" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'PUBLIC',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "userUuid" TEXT NOT NULL,
    "reviewUuid" TEXT NOT NULL,

    CONSTRAINT "PlaceReviewReply_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "PlaceReport" (
    "uuid" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "userUuid" TEXT NOT NULL,
    "placeUuid" TEXT NOT NULL,

    CONSTRAINT "PlaceReport_pkey" PRIMARY KEY ("uuid")
);

-- AddForeignKey
ALTER TABLE "Place" ADD CONSTRAINT "Place_categoryUuid_fkey" FOREIGN KEY ("categoryUuid") REFERENCES "PlaceCategory"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Place" ADD CONSTRAINT "Place_creatorUuid_fkey" FOREIGN KEY ("creatorUuid") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Place" ADD CONSTRAINT "Place_ownerUuid_fkey" FOREIGN KEY ("ownerUuid") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaceService" ADD CONSTRAINT "PlaceService_placeUuid_fkey" FOREIGN KEY ("placeUuid") REFERENCES "Place"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaceService" ADD CONSTRAINT "PlaceService_serviceUuid_fkey" FOREIGN KEY ("serviceUuid") REFERENCES "Service"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaceImage" ADD CONSTRAINT "PlaceImage_placeUuid_fkey" FOREIGN KEY ("placeUuid") REFERENCES "Place"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaceTag" ADD CONSTRAINT "PlaceTag_placeUuid_fkey" FOREIGN KEY ("placeUuid") REFERENCES "Place"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaceTag" ADD CONSTRAINT "PlaceTag_tagUuid_fkey" FOREIGN KEY ("tagUuid") REFERENCES "Tag"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaceReview" ADD CONSTRAINT "PlaceReview_userUuid_fkey" FOREIGN KEY ("userUuid") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaceReview" ADD CONSTRAINT "PlaceReview_placeUuid_fkey" FOREIGN KEY ("placeUuid") REFERENCES "Place"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaceReviewReply" ADD CONSTRAINT "PlaceReviewReply_userUuid_fkey" FOREIGN KEY ("userUuid") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaceReviewReply" ADD CONSTRAINT "PlaceReviewReply_reviewUuid_fkey" FOREIGN KEY ("reviewUuid") REFERENCES "PlaceReview"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaceReport" ADD CONSTRAINT "PlaceReport_userUuid_fkey" FOREIGN KEY ("userUuid") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaceReport" ADD CONSTRAINT "PlaceReport_placeUuid_fkey" FOREIGN KEY ("placeUuid") REFERENCES "Place"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
