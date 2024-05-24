/*
  Warnings:

  - You are about to drop the column `type` on the `product_audit` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `product_audit` DROP COLUMN `type`;

-- CreateTable
CREATE TABLE `schedule_audit` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `schedule_id` INTEGER NOT NULL,
    `message` VARCHAR(191) NULL,
    `auditMessage` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `attachment` LONGTEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `schedule_audit` ADD CONSTRAINT `schedule_audit_schedule_id_fkey` FOREIGN KEY (`schedule_id`) REFERENCES `schedule`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
