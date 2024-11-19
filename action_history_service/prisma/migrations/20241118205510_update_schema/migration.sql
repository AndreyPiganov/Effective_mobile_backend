-- AlterTable
ALTER TABLE "ActionHistory" ADD COLUMN     "metadata" JSON,
ALTER COLUMN "shopId" DROP NOT NULL;
