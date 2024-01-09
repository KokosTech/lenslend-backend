-- CreateTable
CREATE TABLE "PlaceVisitor" (
    "uuid" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "userUuid" TEXT NOT NULL,
    "placeUuid" TEXT NOT NULL,

    CONSTRAINT "PlaceVisitor_pkey" PRIMARY KEY ("uuid")
);

-- AddForeignKey
ALTER TABLE "PlaceVisitor" ADD CONSTRAINT "PlaceVisitor_userUuid_fkey" FOREIGN KEY ("userUuid") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaceVisitor" ADD CONSTRAINT "PlaceVisitor_placeUuid_fkey" FOREIGN KEY ("placeUuid") REFERENCES "Place"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
