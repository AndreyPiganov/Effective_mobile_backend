/*
  Warnings:

  - Changed the type of `action` on the `ActionHistory` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `plu` on table `ActionHistory` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "ActionType" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'INCREASE_STOCK', 'DECREASE_STOCK');

-- AlterTable
ALTER TABLE "ActionHistory" DROP COLUMN "action",
ADD COLUMN     "action" "ActionType" NOT NULL,
ALTER COLUMN "plu" SET NOT NULL;
