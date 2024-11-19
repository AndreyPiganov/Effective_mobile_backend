/*
  Warnings:

  - The values [CREATE,UPDATE,DELETE] on the enum `ActionType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ActionType_new" AS ENUM ('CREATE_STOCK', 'UPDATE_STOCK', 'DELETE_STOCK', 'INCREASE_STOCK', 'DECREASE_STOCK', 'CREATE_PRODUCT', 'UPDATE_PRODUCT', 'DELETE_PRODUCT');
ALTER TABLE "ActionHistory" ALTER COLUMN "action" TYPE "ActionType_new" USING ("action"::text::"ActionType_new");
ALTER TYPE "ActionType" RENAME TO "ActionType_old";
ALTER TYPE "ActionType_new" RENAME TO "ActionType";
DROP TYPE "ActionType_old";
COMMIT;
