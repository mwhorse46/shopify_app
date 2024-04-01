import {
  Page,
  LegacyCard,
  BlockStack,
  Layout,
  Button,
  ProgressBar,
} from "@shopify/polaris";
import React, { useState, useEffect } from "react";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { useAppBridge } from "@shopify/app-bridge-react";
import { getAllProducts, getRegistered } from "../models/gyuProducts.server";
import { authenticate } from "../shopify.server";
import CountView from "../components/countView";
import { GET_PRODUCTS_QUERY, GET_SHOP_INFO } from "../query";
import {
  REGISTER_PRODUCTS,
  TOTAL_PRODUCTS,
  REGISTERED_PRODUCTS,
  UNREGISTERED_PRODUCTS,
} from "../constant";
import "../style.css";

export const loader = async ({ request, params }) => {
  const { admin } = await authenticate.admin(request);
  const shopInfo = await admin.graphql(GET_SHOP_INFO);
  const data1 = await shopInfo.json();
  const shopId = data1.data.shop.id.split("/")[4];
  console.log("shopId :", shopId);
  const response = await admin.graphql(GET_PRODUCTS_QUERY);

  const data = await response.json();
  const products = data.data.products.edges.map((edge) => ({
    id: edge.node.id.split("/")[4],
    title: edge.node.title,
    images: edge.node.images.edges.map((imageEdge) => ({
      id: imageEdge.node.id.split("/")[4],
      src: imageEdge.node.originalSrc,
    })),
    variants: edge.node.variants.edges.map((variantEdge) => ({
      id: variantEdge.node.id.split("/")[4],
      src: variantEdge.node.image ? variantEdge.node.image.originalSrc : null,
    })),
  }));
  var totalProducts = 0;
  var imageCount = 0;

  for (const product of products) {
    const images = product.images;
    const variants = product.variants;
    for (const image of images) {
      imageCount++;

      var tempVariants = [];
      for (const variant of variants)
        tempVariants.push(variant.src);
      var uniqueVariants = [...new Set(tempVariants)];
      for (const uniqueVariant of uniqueVariants)
        if (image.src == uniqueVariant) totalProducts++;
    }
  }
  // await removeAllProducts(shopId);
  // await registerProducts(shopId, products);
  const totalItem = await getAllProducts();
  const totalItemCount = totalItem.length;
  const registeredItem = await getRegistered();
  const registeredItemCount = registeredItem.length;
  console.log("Count----------- : ", products.length);
  console.log("Total Items :", totalProducts);
  console.log("Image Count :", imageCount);
  return { products, totalItemCount, registeredItemCount };
};

export default function GYUSettingPage() {
  const { products, totalItemCount, registeredItemCount } = useLoaderData();
  // const totalProducts = totalItemCount;
  // const registeredProducts = registeredItemCount;
  // const unregisteredProducts = totalProducts - registeredProducts;
  const totalProducts = 100;
  const registeredProducts = 80;
  const unregisteredProducts = totalProducts - registeredProducts;
  const [storeURL, setStoreURL] = useState("");
  const [allRegistered, setAllRegistered] = useState(false);
  const [percent, setPercent] = useState(0);
  const bridge = useAppBridge();
  const navigate = useNavigate();

  function DemoPage() {
    setStoreURL(bridge.config.shop);
  }

  useEffect(() => {
    console.log(products);
    DemoPage();
  }, []);

  useEffect(() => {
    setPercent(parseInt((registeredProducts / totalProducts) * 100));
    if (totalProducts === registeredProducts) setAllRegistered(true);
  }, [registeredProducts, unregisteredProducts, totalProducts]);

  const handleRegister = async () => {
    console.log("Register all Products!");
    // await gyuRegister();
    // navigate("/app/register/gyuRegister");
  };

  return (
    <Page>
      <ui-title-bar title={REGISTER_PRODUCTS}></ui-title-bar>
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <LegacyCard>
              <div className="content">
                {!allRegistered && (
                  <Button
                    variant="primary"
                    onClick={handleRegister}
                  >
                    {REGISTER_PRODUCTS}
                  </Button>
                )}
                <CountView
                  title={TOTAL_PRODUCTS}
                  count={totalProducts}
                  tone="info"
                />
                <div className="progress-content">
                  <CountView
                    title={REGISTERED_PRODUCTS}
                    count={registeredProducts}
                    tone="success"
                  />
                  <div style={{ marginBottom: "50px" }}>
                    <p className="percent">{percent}%</p>
                    <div style={{ width: 500 }}>
                      <ProgressBar progress={percent} />
                    </div>
                  </div>
                  <CountView
                    title={UNREGISTERED_PRODUCTS}
                    count={unregisteredProducts}
                    tone="attention"
                  />
                </div>
                {!allRegistered && (
                  <p className="description">
                    There are {unregisteredProducts} items awaiting
                    registration.
                    <br />
                    Your prompt attention to registering these items will enable
                    us to effectively assist customers in discovering their
                    perfect fashion choices.
                    <br />
                    By ensuring all items are registered, we can enhance our
                    service delivery and ensure customer satisfaction.
                  </p>
                )}
                {allRegistered && (
                  <p className="description">
                    All items have been successfully registered.
                    <br />
                    We are committed to assisting your customers in discovering
                    their perfect fashion matches.
                    <br />
                    Your satisfaction is our priority, and we look forward to
                    providing exceptional service to meet your needs.
                    <br />
                    Thank you for choosing us as your trusted partner.
                  </p>
                )}
              </div>
            </LegacyCard>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
