/*
  Warnings:

  - Made the column `userId` on table `Asset` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Asset" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "quantity" REAL NOT NULL,
    "value" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "currencyId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Asset_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES "Currency" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Asset_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Asset" ("createdAt", "currencyId", "id", "quantity", "updatedAt", "userId", "value") SELECT "createdAt", "currencyId", "id", "quantity", "updatedAt", "userId", "value" FROM "Asset";
DROP TABLE "Asset";
ALTER TABLE "new_Asset" RENAME TO "Asset";
CREATE UNIQUE INDEX "Asset_currencyId_key" ON "Asset"("currencyId");
CREATE UNIQUE INDEX "Asset_userId_key" ON "Asset"("userId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
