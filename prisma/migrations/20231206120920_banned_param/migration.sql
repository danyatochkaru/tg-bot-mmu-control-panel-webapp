/*
  Warnings:

  - The values [BANNED] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('USER', 'ADMIN');
ALTER TABLE "Profile" ALTER COLUMN "Role" DROP DEFAULT;
ALTER TABLE "Profile" ALTER COLUMN "Role" TYPE "Role_new" USING ("Role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
ALTER TABLE "Profile" ALTER COLUMN "Role" SET DEFAULT 'USER';
COMMIT;

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "banned" TIMESTAMP(3);
