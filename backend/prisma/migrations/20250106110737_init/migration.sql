-- CreateEnum
CREATE TYPE "Status" AS ENUM ('processing', 'pending', 'processed');

-- CreateTable
CREATE TABLE "Upload" (
    "id" TEXT NOT NULL,
    "uploadUrl" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'pending',

    CONSTRAINT "Upload_pkey" PRIMARY KEY ("id")
);
