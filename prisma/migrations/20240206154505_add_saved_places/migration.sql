-- CreateTable
CREATE TABLE "UserSavedPlaces" (
    "uuid" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "user_uuid" TEXT NOT NULL,
    "place_uuid" TEXT NOT NULL,

    CONSTRAINT "UserSavedPlaces_pkey" PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSavedPlaces_user_uuid_place_uuid_key" ON "UserSavedPlaces"("user_uuid", "place_uuid");

-- AddForeignKey
ALTER TABLE "UserSavedPlaces" ADD CONSTRAINT "UserSavedPlaces_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSavedPlaces" ADD CONSTRAINT "UserSavedPlaces_place_uuid_fkey" FOREIGN KEY ("place_uuid") REFERENCES "Place"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
