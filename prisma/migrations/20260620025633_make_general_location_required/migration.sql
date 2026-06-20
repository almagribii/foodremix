/*
  Warnings:

  - Made the column `generalLocation` on table `UserProfile` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "UserProfile" ALTER COLUMN "generalLocation" SET NOT NULL;
