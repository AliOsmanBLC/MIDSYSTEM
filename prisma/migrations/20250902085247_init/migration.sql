-- CreateTable
CREATE TABLE "Consent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "recipient" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ConsentOperation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "recipient" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Consent_recipient_channel_key" ON "Consent"("recipient", "channel");
