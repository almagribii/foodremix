-- AlterTable
ALTER TABLE "RemixHistory" ADD COLUMN     "instructions" TEXT[] DEFAULT ARRAY[]::TEXT[];
