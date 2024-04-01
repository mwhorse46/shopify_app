import {
  Page,
  LegacyCard,
  BlockStack,
  Layout,
  Button,
  Text,
} from "@shopify/polaris";
import { useNavigate } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import { gyuRegister } from "../models/gyuProducts.server";
import { GET_SHOP_INFO } from "../query";
import "../style.css";

export const loader = async ({ request, params }) => {
  const { admin } = await authenticate.admin(request);
  const response = await admin.graphql(GET_SHOP_INFO);
  const shopInfo = await response.json();
  const shopId = shopInfo.data.shop.id.split("/")[4];
  console.log("shopId :", shopId);

  if (params.action == "gyuRegister") {
    console.log("-----------------Register Products!-----------------");
    await gyuRegister();
  }
  return null;
};
