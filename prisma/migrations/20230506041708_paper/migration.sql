/*
  Warnings:

  - You are about to drop the column `knowledgePointId` on the `Exercise` table. All the data in the column will be lost.
  - You are about to drop the column `label` on the `Exercise` table. All the data in the column will be lost.
  - You are about to drop the column `point` on the `Exercise` table. All the data in the column will be lost.
  - The values [COMPLETITION_QUESTION] on the enum `ExerciseRule_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- DropForeignKey
ALTER TABLE `Bookmark` DROP FOREIGN KEY `Bookmark_exerciseId_fkey`;

-- DropForeignKey
ALTER TABLE `Bookmark` DROP FOREIGN KEY `Bookmark_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Course` DROP FOREIGN KEY `Course_collegeId_fkey`;

-- DropForeignKey
ALTER TABLE `Exercise` DROP FOREIGN KEY `Exercise_knowledgePointId_fkey`;

-- DropForeignKey
ALTER TABLE `Exercise` DROP FOREIGN KEY `Exercise_userId_fkey`;

-- DropForeignKey
ALTER TABLE `KnowledgePoint` DROP FOREIGN KEY `KnowledgePoint_courseId_fkey`;

-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_collegeId_fkey`;

-- AlterTable
ALTER TABLE `Course` ADD COLUMN `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `Exercise` DROP COLUMN `knowledgePointId`,
    DROP COLUMN `label`,
    DROP COLUMN `point`,
    ADD COLUMN `analysis` TEXT NULL,
    ADD COLUMN `paperId` VARCHAR(191) NULL,
    MODIFY `type` ENUM('ALL_QUESTION', 'CHOICE_QUESTION', 'COMPLETION_QUESTION', 'BIG_QUESTION') NOT NULL,
    MODIFY `difficulty` ENUM('ANY', 'EASY', 'MEDIUM', 'HARD') NOT NULL,
    MODIFY `userId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `KnowledgePoint` ADD COLUMN `label` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Option` (
    `id` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `exerciseId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ExerciseRule` (
    `id` VARCHAR(191) NOT NULL,
    `type` ENUM('ALL_QUESTION', 'CHOICE_QUESTION', 'COMPLETION_QUESTION', 'BIG_QUESTION') NOT NULL,
    `difficulty` ENUM('ANY', 'EASY', 'MEDIUM', 'HARD') NOT NULL,
    `amount` INTEGER NOT NULL,
    `knowledgePointId` VARCHAR(191) NOT NULL,
    `paperId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ExerciseRule_knowledgePointId_key`(`knowledgePointId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Paper` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Paper_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ExerciseToKnowledgePoint` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_ExerciseToKnowledgePoint_AB_unique`(`A`, `B`),
    INDEX `_ExerciseToKnowledgePoint_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_collegeId_fkey` FOREIGN KEY (`collegeId`) REFERENCES `College`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Course` ADD CONSTRAINT `Course_collegeId_fkey` FOREIGN KEY (`collegeId`) REFERENCES `College`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `KnowledgePoint` ADD CONSTRAINT `KnowledgePoint_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Option` ADD CONSTRAINT `Option_exerciseId_fkey` FOREIGN KEY (`exerciseId`) REFERENCES `Exercise`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Exercise` ADD CONSTRAINT `Exercise_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Exercise` ADD CONSTRAINT `Exercise_paperId_fkey` FOREIGN KEY (`paperId`) REFERENCES `Paper`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Bookmark` ADD CONSTRAINT `Bookmark_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Bookmark` ADD CONSTRAINT `Bookmark_exerciseId_fkey` FOREIGN KEY (`exerciseId`) REFERENCES `Exercise`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExerciseRule` ADD CONSTRAINT `ExerciseRule_knowledgePointId_fkey` FOREIGN KEY (`knowledgePointId`) REFERENCES `KnowledgePoint`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExerciseRule` ADD CONSTRAINT `ExerciseRule_paperId_fkey` FOREIGN KEY (`paperId`) REFERENCES `Paper`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Paper` ADD CONSTRAINT `Paper_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ExerciseToKnowledgePoint` ADD CONSTRAINT `_ExerciseToKnowledgePoint_A_fkey` FOREIGN KEY (`A`) REFERENCES `Exercise`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ExerciseToKnowledgePoint` ADD CONSTRAINT `_ExerciseToKnowledgePoint_B_fkey` FOREIGN KEY (`B`) REFERENCES `KnowledgePoint`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
