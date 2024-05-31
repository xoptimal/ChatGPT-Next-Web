/*
  Warnings:

  - You are about to drop the `Parent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `Parent`;

-- CreateTable
CREATE TABLE `parent` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `parentId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
