/*
  Warnings:

  - You are about to drop the column `taskTagetId` on the `task` table. All the data in the column will be lost.
  - You are about to drop the `taskTaget` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `task` DROP FOREIGN KEY `task_taskTagetId_fkey`;

-- AlterTable
ALTER TABLE `task` DROP COLUMN `taskTagetId`,
    ADD COLUMN `taskTargetId` INTEGER NULL;

-- DropTable
DROP TABLE `taskTaget`;

-- CreateTable
CREATE TABLE `taskTarget` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isDeleted` INTEGER NULL DEFAULT 0,
    `remark` VARCHAR(191) NULL,
    `user_id` VARCHAR(191) NULL,
    `createUserId` VARCHAR(191) NOT NULL,
    `taskId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `task` ADD CONSTRAINT `task_taskTargetId_fkey` FOREIGN KEY (`taskTargetId`) REFERENCES `taskTarget`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
