-- AlterTable
ALTER TABLE `task` MODIFY `status` VARCHAR(191) NULL DEFAULT '0',
    MODIFY `createUserId` VARCHAR(191) NULL;
