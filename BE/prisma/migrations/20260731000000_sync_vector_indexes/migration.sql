ALTER TABLE "destinations" ALTER COLUMN "profileText" DROP NOT NULL;

CREATE INDEX IF NOT EXISTS trackpool_embedding_hnsw_idx
  ON "TrackPool" USING hnsw ("embedding" vector_cosine_ops);

CREATE INDEX IF NOT EXISTS destination_embedding_hnsw_idx
  ON "destinations" USING hnsw ("embedding" vector_cosine_ops);