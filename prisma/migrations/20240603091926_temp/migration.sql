/*
  Warnings:

  - You are about to drop the column `attachment` on the `subtask` table. All the data in the column will be lost.
  - You are about to drop the column `subtask_service_listId` on the `subtask_list` table. All the data in the column will be lost.
  - You are about to drop the `subtask_service_list` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `subtask_list` DROP FOREIGN KEY `subtask_list_subtask_service_listId_fkey`;

-- AlterTable
ALTER TABLE `subtask` DROP COLUMN `attachment`,
    ADD COLUMN `list` LONGTEXT NULL;

-- AlterTable
ALTER TABLE `subtask_list` DROP COLUMN `subtask_service_listId`;

-- DropTable
DROP TABLE `subtask_service_list`;
