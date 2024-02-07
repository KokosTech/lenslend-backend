-- CreateTable
CREATE TABLE "UserRating" (
    "uuid" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "user_rated_uuid" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "user_uuid" TEXT NOT NULL,

    CONSTRAINT "UserRating_pkey" PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserRating_user_uuid_user_rated_uuid_key" ON "UserRating"("user_uuid", "user_rated_uuid");

-- AddForeignKey
ALTER TABLE "UserRating" ADD CONSTRAINT "UserRating_user_rated_uuid_fkey" FOREIGN KEY ("user_rated_uuid") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRating" ADD CONSTRAINT "UserRating_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
