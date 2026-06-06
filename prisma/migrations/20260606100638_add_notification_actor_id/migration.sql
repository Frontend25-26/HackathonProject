-- AlterTable
ALTER TABLE `notifications` ADD COLUMN `actor_id` INTEGER NULL;

-- CreateIndex
CREATE INDEX `notifications_actor_id_idx` ON `notifications`(`actor_id`);

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_actor_id_fkey` FOREIGN KEY (`actor_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
