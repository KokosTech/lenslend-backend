-- DropForeignKey
ALTER TABLE "Place" DROP CONSTRAINT "Place_ownerUuid_fkey";

-- AlterTable
ALTER TABLE "Place" ALTER COLUMN "ownerUuid" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Place" ADD CONSTRAINT "Place_ownerUuid_fkey" FOREIGN KEY ("ownerUuid") REFERENCES "User"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;
