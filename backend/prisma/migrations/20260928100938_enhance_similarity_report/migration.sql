-- AlterTable
ALTER TABLE "similarity_reports" ADD COLUMN     "aiProbability" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "fileSize" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "fileType" TEXT,
ADD COLUMN     "filename" TEXT,
ADD COLUMN     "processingMessage" TEXT,
ADD COLUMN     "sourcesCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalPages" INTEGER NOT NULL DEFAULT 1;
