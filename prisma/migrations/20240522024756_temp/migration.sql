-- AlterTable
ALTER TABLE `schedule` ADD COLUMN `counselorReady` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `remark` VARCHAR(191) NULL,
    ADD COLUMN `userReady` INTEGER NOT NULL DEFAULT 0;
