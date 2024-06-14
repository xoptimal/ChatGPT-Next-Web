-- AlterTable
ALTER TABLE `subtask` MODIFY `remark` VARCHAR(191) NULL,
    MODIFY `startTime` DATETIME(3) NULL,
    MODIFY `endTime` DATETIME(3) NULL,
    MODIFY `requireRemark` VARCHAR(191) NULL,
    MODIFY `targetRemark` VARCHAR(191) NULL,
    MODIFY `title` VARCHAR(191) NULL;
