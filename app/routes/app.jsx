import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import { boundary } from "@shopify/shopify-app-remix/server";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import "@shopify/polaris/build/esm/styles.css";
import { authenticate } from "../shopify.server";
import { checkStatus } from "../models/billing.server";
import { GET_SHOP_INFO } from "../query";

export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const shopInfo = await admin.graphql(GET_SHOP_INFO);
  const data1 = await shopInfo.json();
  const shopId = data1.data.shop.id.split("/")[4];
  const status = await checkStatus(shopId);
  const expireDate = status?.expireDate;
  const currentDate = new Date();
  let isExpired;
  if (status && expireDate < currentDate) {
    isExpired = true;
  }

  console.log("Is Expired :", isExpired);
  return json({ apiKey: process.env.SHOPIFY_API_KEY || "", isExpired, status });
};

export default function App() {
  const { apiKey, isExpired, status } = useLoaderData();

  return (
    <AppProvider isEmbeddedApp apiKey={apiKey}>
      <ui-nav-menu>
        <Link to="/app" rel="home">
          Home
        </Link>
        {isExpired != true && status != null && (
          <>
            <Link to="/app/register">Register Products</Link>
            <Link to="/app/billing">Billing</Link>
          </>
        )}
      </ui-nav-menu>
      <Outlet />
    </AppProvider>
  );
}

// Shopify needs Remix to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
