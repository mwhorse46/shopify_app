-- CreateTable
CREATE TABLE "gyuAppStatus" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shop_id" TEXT NOT NULL,
    "installed_date" DATETIME NOT NULL,
    "expire_date" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "gyuAppStatus_shop_id_key" ON "gyuAppStatus"("shop_id");
