-- CreateTable
CREATE TABLE "consultations" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "age" INTEGER,
    "gender" TEXT NOT NULL,
    "phone" TEXT,
    "height" INTEGER,
    "weight" INTEGER,
    "complaints" TEXT,
    "examinations" TEXT,
    "chronicDiseases" TEXT,
    "hasChronicDiseases" BOOLEAN NOT NULL DEFAULT false,
    "medications" TEXT,
    "takesMedications" BOOLEAN NOT NULL DEFAULT false,
    "painLevel" INTEGER,
    "hasAllergy" BOOLEAN NOT NULL DEFAULT false,
    "allergies" TEXT,
    "additionalNotes" TEXT
);
