/*
  Warnings:

  - You are about to drop the `Permission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProfilePermission` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- DropForeignKey
ALTER TABLE "ProfilePermission" DROP CONSTRAINT "ProfilePermission_permissionId_fkey";

-- DropForeignKey
ALTER TABLE "ProfilePermission" DROP CONSTRAINT "ProfilePermission_profileId_fkey";

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "Role" "Role" NOT NULL DEFAULT 'USER';

-- DropTable
DROP TABLE "Permission";

-- DropTable
DROP TABLE "ProfilePermission";
