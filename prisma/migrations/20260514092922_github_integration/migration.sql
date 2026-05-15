-- AlterTable
ALTER TABLE `assignments` ADD COLUMN `classroom_assignment_id` INTEGER NULL,
    ADD COLUMN `invite_link` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `review_comments` ADD COLUMN `github_comment_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `review_threads` ADD COLUMN `github_thread_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `submissions` ADD COLUMN `pr_number` INTEGER NULL,
    ADD COLUMN `repo_name` VARCHAR(191) NULL,
    ADD COLUMN `repo_owner` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `commits` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sha` VARCHAR(191) NOT NULL,
    `message` TEXT NOT NULL,
    `author_name` VARCHAR(191) NOT NULL,
    `author_login` VARCHAR(191) NULL,
    `committed_at` DATETIME(3) NOT NULL,
    `ci_status` ENUM('UNKNOWN', 'PENDING', 'RUNNING', 'SUCCESS', 'FAILURE') NOT NULL DEFAULT 'UNKNOWN',
    `ci_details_url` VARCHAR(191) NULL,
    `submission_id` INTEGER NOT NULL,

    INDEX `commits_submission_id_fkey`(`submission_id`),
    UNIQUE INDEX `commits_submission_id_sha_key`(`submission_id`, `sha`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sync_logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entity_type` VARCHAR(191) NOT NULL,
    `entity_id` INTEGER NULL,
    `action` VARCHAR(191) NOT NULL,
    `success` BOOLEAN NOT NULL,
    `error_message` TEXT NULL,
    `rate_limit_remaining` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `sync_logs_entity_idx`(`entity_type`, `entity_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `commits` ADD CONSTRAINT `commits_submission_id_fkey` FOREIGN KEY (`submission_id`) REFERENCES `submissions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
