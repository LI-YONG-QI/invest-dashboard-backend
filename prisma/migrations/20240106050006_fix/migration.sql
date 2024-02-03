/*
  Warnings:

  - You are about to drop the column `quatity` on the `Asset` table. All the data in the column will be lost.
  - Added the required column `quantity` to the `Asset` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Asset" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "quantity" REAL NOT NULL,
    "value" REAL NOT NULL
);
INSERT INTO "new_Asset" ("id", "name", "symbol", "value") SELECT "id", "name", "symbol", "value" FROM "Asset";
DROP TABLE "Asset";
ALTER TABLE "new_Asset" RENAME TO "Asset";
CREATE UNIQUE INDEX "Asset_name_key" ON "Asset"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
