import invariant from "tiny-invariant";
import { v4 as uuidv4 } from 'uuid';
import db from "../db.server";

export async function registerProducts(shopId, products) {
  try {
    for (const product of products) {
      const images = product.images;
      const variants = product.variants;
      for (const image of images) {
        var tempVariants = [];
        for (const variant of variants)
          tempVariants.push(variant.src);
        var uniqueVariants = [...new Set(tempVariants)];
        for (const uniqueVariant of uniqueVariants)
          if (image.src == uniqueVariant)
            await db.gyuProducts.create({
              data: {
                id: uuidv4(),
                shop_id: shopId,
                product_id: product.id.toString(),
                variant_id: image.id.toString(),
                url_product_image: image.src,
                gender: product.gender ? product.gender : "-",
                status: false,
              },
            });
      }
    }
    console.log("success!");
  } catch (error) {
    console.error("Error creating product:", error);
  } finally {
    await db.$disconnect();
  }
}

export async function removeAllProducts(shopId) {
  try {
    console.log("Removing all products...");
    await db.gyuProducts.deleteMany({
      where: {
        shop_id: shopId,
      },
    });
    console.log("All products removed successfully.");
  } catch (error) {
    console.error("Error removing products:", error);
  }
}

export async function getRegistered() {
  console.log("getRegistered----------");
  const registeredProducts = await db.gyuProducts.findMany({
    where: {
      status: true
    },
    orderBy: { id: "desc" },
  });

  console.log("All Gyu Products :", registeredProducts.length);
  return registeredProducts;
}

export async function getAllProducts() {
  console.log("getAllProducts----------");
  const allProducts = await db.gyuProducts.findMany({
    orderBy: { id: "desc" },
  });

  console.log("All registered Products :", allProducts.length);
  return allProducts;
}

export async function gyuRegister() {
  const products = await getAllProducts();
  let productData = [];
  console.log("Registering----------", products.length, "products");

  for (const product of products) {
    if(product.status == false) {
      let data = {
        shop_id: product.shopId,
        product_id: product.product_id.toString(),
        variant_id: product.variant_id.toString(),
        url_product_image: product.url_product_image,
        gender: product.gender ? product.gender : "-",
        status: false,
      };
      productData.push(data);
      const temp = await db.gyuProducts.update({
        where: { variant_id: product.variant_id.toString() },
        data: { status: true },
      });
      console.log("==============", temp);
    }
  }

  // console.log("GYU Products count : ", productData.length);

  // let count = 0,
  //   limit = 5;

  // for (const data of productData) {
  //   console.log(data);
  //   while (count >= limit) {
  //     await new Promise((f) => setTimeout(f, 500));
  //   }
  //   count++;

  //   try {
  //     const response = await fetch(
  //       "https://glamuup.ngrok.io/product-register",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(data),
  //       },
  //     );

  //     if (!response.ok) {
  //       throw new Error("Network response was not ok");
  //     }

  //     const time = new Date();
  //     console.log("Registered: ", time);
  //   } catch (error) {
  //     console.error("Fetch Error:", error);
  //   }

  //   count--;
  //   await new Promise((f) => setTimeout(f, 1000));
  // }
}
