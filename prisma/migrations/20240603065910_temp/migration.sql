/*
  Warnings:

  - You are about to drop the column `title` on the `subtask` table. All the data in the column will be lost.
  - Added the required column `requireRemark` to the `subtask` table without a default value. This is not possible if the table is not empty.
  - Added the required column `targetRemark` to the `subtask` table without a default value. This is not possible if the table is not empty.
  - Made the column `remark` on table `subtask` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `subtask` DROP COLUMN `title`,
    ADD COLUMN `requireRemark` VARCHAR(191) NOT NULL,
    ADD COLUMN `targetRemark` VARCHAR(191) NOT NULL,
    MODIFY `remark` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `subtask_list` ADD COLUMN `subtask_service_listId` INTEGER NULL;

-- CreateTable
CREATE TABLE `subtask_service_list` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isDeleted` INTEGER NULL DEFAULT 0,
    `createUserId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `remark` VARCHAR(191) NOT NULL,
    `attachment` LONGTEXT NULL,
    `subtaskId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `subtask_list` ADD CONSTRAINT `subtask_list_subtask_service_listId_fkey` FOREIGN KEY (`subtask_service_listId`) REFERENCES `subtask_service_list`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
