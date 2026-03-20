-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateTable
CREATE TABLE "lawyers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "profilePhoto" TEXT,
    "contactNumber" TEXT,
    "address" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "barRegistrationNumber" TEXT NOT NULL,
    "experience" INTEGER NOT NULL DEFAULT 0,
    "gender" "Gender" NOT NULL,
    "consultationFee" DOUBLE PRECISION NOT NULL,
    "qualification" TEXT NOT NULL,
    "currentFirm" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "averageRating" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "lawyers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LawyerPracticeArea" (
    "lawyerId" TEXT NOT NULL,
    "practiceAreaId" TEXT NOT NULL,

    CONSTRAINT "LawyerPracticeArea_pkey" PRIMARY KEY ("lawyerId","practiceAreaId")
);

-- CreateIndex
CREATE UNIQUE INDEX "lawyers_email_key" ON "lawyers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "lawyers_barRegistrationNumber_key" ON "lawyers"("barRegistrationNumber");

-- CreateIndex
CREATE UNIQUE INDEX "lawyers_userId_key" ON "lawyers"("userId");

-- CreateIndex
CREATE INDEX "idx_lawyer_email" ON "lawyers"("email");

-- CreateIndex
CREATE INDEX "idx_lawyer_isDeleted" ON "lawyers"("isDeleted");

-- AddForeignKey
ALTER TABLE "lawyers" ADD CONSTRAINT "lawyers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LawyerPracticeArea" ADD CONSTRAINT "LawyerPracticeArea_lawyerId_fkey" FOREIGN KEY ("lawyerId") REFERENCES "lawyers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LawyerPracticeArea" ADD CONSTRAINT "LawyerPracticeArea_practiceAreaId_fkey" FOREIGN KEY ("practiceAreaId") REFERENCES "practice_areas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
