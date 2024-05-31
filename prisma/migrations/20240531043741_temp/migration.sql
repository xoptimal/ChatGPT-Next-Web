/*
  Warnings:

  - You are about to drop the column `address` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `age` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `childIds` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `class` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `companyName` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `entityType` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `parentIds` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `parentInfo` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `school` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `users` DROP COLUMN `address`,
    DROP COLUMN `age`,
    DROP COLUMN `childIds`,
    DROP COLUMN `class`,
    DROP COLUMN `companyName`,
    DROP COLUMN `country`,
    DROP COLUMN `entityType`,
    DROP COLUMN `parentIds`,
    DROP COLUMN `parentInfo`,
    DROP COLUMN `school`,
    DROP COLUMN `score`,
    DROP COLUMN `studentId`,
    ADD COLUMN `info` LONGTEXT NULL;

-- CreateTable
CREATE TABLE `Parent` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `parentId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
