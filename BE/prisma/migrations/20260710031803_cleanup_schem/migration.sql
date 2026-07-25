/*
  Warnings:

  - You are about to drop the column `reviewKeywords` on the `destinations` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `recommendations` table. All the data in the column will be lost.
  - You are about to drop the column `energy` on the `recommended_tracks` table. All the data in the column will be lost.
  - You are about to drop the column `tempo` on the `recommended_tracks` table. All the data in the column will be lost.
  - You are about to drop the column `valence` on the `recommended_tracks` table. All the data in the column will be lost.
  - You are about to drop the `destination_tags` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tags` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `profileText` to the `destinations` table without a default value. This is not possible if the table is not empty.
  - Made the column `destinationId` on table `recommendations` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector";

-- DropForeignKey
ALTER TABLE "destination_tags" DROP CONSTRAINT "destination_tags_destinationId_fkey";

-- DropForeignKey
ALTER TABLE "destination_tags" DROP CONSTRAINT "destination_tags_tagId_fkey";

-- DropForeignKey
ALTER TABLE "recommendations" DROP CONSTRAINT "recommendations_destinationId_fkey";

-- AlterTable
ALTER TABLE "destinations" DROP COLUMN "reviewKeywords",
ADD COLUMN     "embedding" vector(512),
ADD COLUMN     "moodTags" TEXT[],
ADD COLUMN     "profileText" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "recommendations" DROP COLUMN "type",
ALTER COLUMN "destinationId" SET NOT NULL;

-- AlterTable
ALTER TABLE "recommended_tracks" DROP COLUMN "energy",
DROP COLUMN "tempo",
DROP COLUMN "valence";

-- DropTable
DROP TABLE "destination_tags";

-- DropTable
DROP TABLE "tags";

-- DropEnum
DROP TYPE "RecommendationType";

-- CreateTable
CREATE TABLE "TrackPool" (
    "spotifyTrackId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "artistId" TEXT,
    "genre" TEXT NOT NULL,
    "moodTags" TEXT[],
    "profileText" TEXT NOT NULL,
    "embedding" vector(512),
    "cachedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrackPool_pkey" PRIMARY KEY ("spotifyTrackId")
);

-- AddForeignKey
ALTER TABLE "recommendations" ADD CONSTRAINT "recommendations_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "destinations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
