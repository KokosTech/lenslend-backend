/*
  Warnings:

  - You are about to drop the column `bg_color` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `color` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `dark_bg_color` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `dark_color` on the `Service` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Service" DROP COLUMN "bg_color",
DROP COLUMN "color",
DROP COLUMN "dark_bg_color",
DROP COLUMN "dark_color";
