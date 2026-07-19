-- CreateEnum
CREATE TYPE "BillingCycle" AS ENUM ('monthly', 'q3', 'q6', 'q12');

-- CreateTable
CREATE TABLE "Region" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Region_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contaboProductId" TEXT NOT NULL,
    "regionId" TEXT NOT NULL,
    "specs" JSONB NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanPrice" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "billingCycle" "BillingCycle" NOT NULL,
    "priceMinor" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "discountPct" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlanPrice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContaboCost" (
    "id" TEXT NOT NULL,
    "contaboProductId" TEXT NOT NULL,
    "regionId" TEXT NOT NULL,
    "wholesaleMinor" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContaboCost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OsImage" (
    "id" TEXT NOT NULL,
    "contaboImageId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "family" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OsImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppTemplate" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "iconUrl" TEXT,
    "requiredImageId" TEXT NOT NULL,
    "cloudInit" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Region_code_key" ON "Region"("code");

-- CreateIndex
CREATE INDEX "Plan_regionId_idx" ON "Plan"("regionId");

-- CreateIndex
CREATE INDEX "Plan_enabled_sortOrder_idx" ON "Plan"("enabled", "sortOrder");

-- CreateIndex
CREATE INDEX "PlanPrice_planId_idx" ON "PlanPrice"("planId");

-- CreateIndex
CREATE UNIQUE INDEX "PlanPrice_planId_billingCycle_key" ON "PlanPrice"("planId", "billingCycle");

-- CreateIndex
CREATE INDEX "ContaboCost_regionId_idx" ON "ContaboCost"("regionId");

-- CreateIndex
CREATE UNIQUE INDEX "ContaboCost_contaboProductId_regionId_key" ON "ContaboCost"("contaboProductId", "regionId");

-- CreateIndex
CREATE UNIQUE INDEX "OsImage_contaboImageId_key" ON "OsImage"("contaboImageId");

-- CreateIndex
CREATE UNIQUE INDEX "AppTemplate_key_key" ON "AppTemplate"("key");

-- CreateIndex
CREATE INDEX "AppTemplate_enabled_category_idx" ON "AppTemplate"("enabled", "category");

-- AddForeignKey
ALTER TABLE "Plan" ADD CONSTRAINT "Plan_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanPrice" ADD CONSTRAINT "PlanPrice_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContaboCost" ADD CONSTRAINT "ContaboCost_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppTemplate" ADD CONSTRAINT "AppTemplate_requiredImageId_fkey" FOREIGN KEY ("requiredImageId") REFERENCES "OsImage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
