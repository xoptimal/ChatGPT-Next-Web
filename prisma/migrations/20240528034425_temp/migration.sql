/*
  Warnings:

  - Added the required column `createUserId` to the `subtask` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createUserId` to the `task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `subtask` ADD COLUMN `createUserId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `task` ADD COLUMN `createUserId` VARCHAR(191) NOT NULL;
