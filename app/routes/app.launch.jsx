import { useNavigate } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import { newPlan } from "../models/billing.server";
import { GET_SHOP_INFO } from "../query";
import "../style.css";
import { useEffect } from "react";

export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const shopInfo = await admin.graphql(GET_SHOP_INFO);
  const data1 = await shopInfo.json();
  const shopId = data1.data.shop.id.split("/")[4];
  console.log("launch shopId :", shopId);
  const launchDate = new Date();
  const expireDate = new Date(launchDate.getTime() + 30 * 24 * 60 * 60 * 1000);
  console.log("-----------------Launch APP!-----------------");
  await newPlan(shopId, launchDate, expireDate);
  return null;
};

export default function LaunchApp() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/app");
  }, []);

  return null;
}
