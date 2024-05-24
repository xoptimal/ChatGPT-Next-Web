-- DropForeignKey
ALTER TABLE `schedule` DROP FOREIGN KEY `schedule_user_id_fkey`;

-- AlterTable
ALTER TABLE `schedule` MODIFY `user_id` VARCHAR(191) NULL,
    MODIFY `counselorReady` INTEGER NULL DEFAULT 0,
    MODIFY `userReady` INTEGER NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE `schedule` ADD CONSTRAINT `schedule_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
