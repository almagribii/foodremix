/*
  Warnings:

  - You are about to drop the column `latitude` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the `CommunityPost` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PostRequest` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CommunityPost" DROP CONSTRAINT "CommunityPost_userId_fkey";

-- DropForeignKey
ALTER TABLE "PostRequest" DROP CONSTRAINT "PostRequest_postId_fkey";

-- DropForeignKey
ALTER TABLE "PostRequest" DROP CONSTRAINT "PostRequest_userId_fkey";

-- AlterTable
ALTER TABLE "UserProfile" DROP COLUMN "latitude",
DROP COLUMN "longitude";

-- DropTable
DROP TABLE "CommunityPost";

-- DropTable
DROP TABLE "PostRequest";

-- CreateTable
CREATE TABLE "RemixPicker" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "itemName" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "verdict" TEXT NOT NULL,
    "expectedLifespan" TEXT NOT NULL,
    "analysisDetails" TEXT[],
    "storageBlueprint" TEXT[],
    "scannedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RemixPicker_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RemixPicker_userId_idx" ON "RemixPicker"("userId");

-- AddForeignKey
ALTER TABLE "RemixPicker" ADD CONSTRAINT "RemixPicker_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
