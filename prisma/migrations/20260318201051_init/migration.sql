-- CreateTable
CREATE TABLE "practice_areas" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "icon" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "practice_areas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "practice_areas_title_key" ON "practice_areas"("title");

-- CreateIndex
CREATE INDEX "idx_practice_area_isDeleted" ON "practice_areas"("isDeleted");

-- CreateIndex
CREATE INDEX "idx_practice_area_title" ON "practice_areas"("title");
