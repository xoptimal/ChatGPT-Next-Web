-- AddForeignKey
ALTER TABLE `parent` ADD CONSTRAINT `parent_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
