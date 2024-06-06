-- AlterTable
ALTER TABLE `subtask` MODIFY `isDisabled` INTEGER NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `task` ADD COLUMN `taskTagetId` INTEGER NULL;

-- CreateTable
CREATE TABLE `taskTaget` (
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
ALTER TABLE `task` ADD CONSTRAINT `task_taskTagetId_fkey` FOREIGN KEY (`taskTagetId`) REFERENCES `taskTaget`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
