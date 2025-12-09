-- CreateTable
CREATE TABLE `etudiants` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `matricule` VARCHAR(20) NOT NULL,
    `nom` VARCHAR(100) NOT NULL,
    `prenom` VARCHAR(100) NOT NULL,
    `dateNaissance` DATE NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `telephone` VARCHAR(20) NULL,
    `adresse` VARCHAR(255) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `etudiants_matricule_key`(`matricule`),
    UNIQUE INDEX `etudiants_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cours` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(20) NOT NULL,
    `intitule` VARCHAR(150) NOT NULL,
    `description` TEXT NULL,
    `credits` INTEGER NOT NULL DEFAULT 3,
    `professeur` VARCHAR(100) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `cours_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inscriptions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `etudiantId` INTEGER NOT NULL,
    `coursId` INTEGER NOT NULL,
    `anneeAcademique` VARCHAR(9) NOT NULL,
    `semestre` INTEGER NOT NULL DEFAULT 1,
    `note` FLOAT NULL,
    `dateInscription` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `inscriptions_etudiantId_coursId_anneeAcademique_semestre_key`(`etudiantId`, `coursId`, `anneeAcademique`, `semestre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `inscriptions` ADD CONSTRAINT `inscriptions_etudiantId_fkey` FOREIGN KEY (`etudiantId`) REFERENCES `etudiants`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inscriptions` ADD CONSTRAINT `inscriptions_coursId_fkey` FOREIGN KEY (`coursId`) REFERENCES `cours`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
