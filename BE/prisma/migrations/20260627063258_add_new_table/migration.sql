/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "RecommendationType" AS ENUM ('PLAYLIST', 'DESTINATION');

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "nickname" TEXT NOT NULL,
    "profileImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spotify_accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "spotifyUserId" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "scope" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "spotify_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "onboardings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "genres" TEXT[],
    "artistSeeds" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "onboardings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "destinations" (
    "id" TEXT NOT NULL,
    "googlePlaceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "address" TEXT,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "photoUrl" TEXT,
    "reviewKeywords" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "destinations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "valenceMin" DOUBLE PRECISION,
    "valenceMax" DOUBLE PRECISION,
    "energyMin" DOUBLE PRECISION,
    "energyMax" DOUBLE PRECISION,
    "tempoMin" DOUBLE PRECISION,
    "tempoMax" DOUBLE PRECISION,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "destination_tags" (
    "destinationId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "destination_tags_pkey" PRIMARY KEY ("destinationId","tagId")
);

-- CreateTable
CREATE TABLE "recommendations" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "destinationId" TEXT,
    "type" "RecommendationType" NOT NULL,
    "matchedTags" TEXT[],
    "explanation" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recommendations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recommended_tracks" (
    "id" TEXT NOT NULL,
    "recommendationId" TEXT NOT NULL,
    "spotifyTrackId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "albumImageUrl" TEXT,
    "previewUrl" TEXT,
    "energy" DOUBLE PRECISION,
    "valence" DOUBLE PRECISION,
    "tempo" DOUBLE PRECISION,
    "position" INTEGER NOT NULL,

    CONSTRAINT "recommended_tracks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saved_playlists" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "sourceRecommendationId" TEXT,
    "spotifyPlaylistId" TEXT,
    "spotifyPlaylistUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "saved_playlists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saved_tracks" (
    "id" TEXT NOT NULL,
    "savedPlaylistId" TEXT NOT NULL,
    "spotifyTrackId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "albumImageUrl" TEXT,
    "previewUrl" TEXT,
    "position" INTEGER NOT NULL,

    CONSTRAINT "saved_tracks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "spotify_accounts_userId_key" ON "spotify_accounts"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "spotify_accounts_spotifyUserId_key" ON "spotify_accounts"("spotifyUserId");

-- CreateIndex
CREATE UNIQUE INDEX "onboardings_userId_key" ON "onboardings"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "destinations_googlePlaceId_key" ON "destinations"("googlePlaceId");

-- CreateIndex
CREATE INDEX "destinations_category_idx" ON "destinations"("category");

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_key" ON "tags"("name");

-- CreateIndex
CREATE INDEX "recommendations_userId_idx" ON "recommendations"("userId");

-- CreateIndex
CREATE INDEX "recommendations_expiresAt_idx" ON "recommendations"("expiresAt");

-- CreateIndex
CREATE INDEX "recommended_tracks_recommendationId_idx" ON "recommended_tracks"("recommendationId");

-- CreateIndex
CREATE INDEX "saved_playlists_userId_idx" ON "saved_playlists"("userId");

-- CreateIndex
CREATE INDEX "saved_tracks_savedPlaylistId_idx" ON "saved_tracks"("savedPlaylistId");

-- AddForeignKey
ALTER TABLE "spotify_accounts" ADD CONSTRAINT "spotify_accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "onboardings" ADD CONSTRAINT "onboardings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "destination_tags" ADD CONSTRAINT "destination_tags_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "destinations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "destination_tags" ADD CONSTRAINT "destination_tags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendations" ADD CONSTRAINT "recommendations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendations" ADD CONSTRAINT "recommendations_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "destinations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommended_tracks" ADD CONSTRAINT "recommended_tracks_recommendationId_fkey" FOREIGN KEY ("recommendationId") REFERENCES "recommendations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_playlists" ADD CONSTRAINT "saved_playlists_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_tracks" ADD CONSTRAINT "saved_tracks_savedPlaylistId_fkey" FOREIGN KEY ("savedPlaylistId") REFERENCES "saved_playlists"("id") ON DELETE CASCADE ON UPDATE CASCADE;
