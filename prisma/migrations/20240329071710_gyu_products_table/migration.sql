-- CreateTable
CREATE TABLE "gyuProducts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shop_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "variant_id" TEXT NOT NULL,
    "url_product_image" TEXT NOT NULL,
    "gender" TEXT NOT NULL DEFAULT '-',
    "status" BOOLEAN NOT NULL DEFAULT false
);

-- CreateIndex
CREATE UNIQUE INDEX "gyuProducts_variant_id_key" ON "gyuProducts"("variant_id");
