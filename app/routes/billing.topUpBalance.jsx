import React, { useEffect } from "react";
import { useLoaderData } from "@remix-run/react";
import { redirect } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { GET_SHOP_INFO } from "../query";
// import { topUpBalance } from "../models/billing.server";
import "../style.css";

export const loader = async ({ request, params }) => {
  const { admin } = await authenticate.admin(request);
  const shopInfo = await admin.graphql(GET_SHOP_INFO);
  const data1 = await shopInfo.json();
  const shopUrl = data1.data.shop.url;
  console.log("shopUrl :", shopUrl);
  console.log("-----------------Top Up Balance!-----------------");
  // await topUpBalance();

  const lastMonth = new Date(
    Date.now() - 30 * 24 * 60 * 60 * 1000,
  ).toISOString();

  const orders = await admin.graphql(
    `#graphql
    query {
      orders(first: 250, query: "created_at:>${lastMonth}") {
        edges {
          node {
            id
            currentSubtotalLineItemsQuantity
          }
        }
      }
    }`,
  );

  const orderData = await orders.json();

  let soldProductsCount = 0;

  orderData.data.orders.edges.forEach((order) => {
    soldProductsCount += order.node.currentSubtotalLineItemsQuantity;
  });

  console.log(`orderData:`, orderData);
  console.log(`Count of sold products:`, soldProductsCount);

  let appPrice;

  if (soldProductsCount > 1000) {
    appPrice = soldProductsCount * 0.2;
  } else {
    appPrice = 199;
  }

  const response = await admin.graphql(
    `#graphql
    mutation AppSubscriptionCreate($name: String!, $lineItems: [AppSubscriptionLineItemInput!]!, $returnUrl: URL!) {
      appSubscriptionCreate(name: $name, returnUrl: $returnUrl, lineItems: $lineItems) {
        userErrors {
          field
          message
        }
        appSubscription {
          id
          lineItems {
            id
            plan {
              pricingDetails
              __typename
            }
          }
        }
        confirmationUrl
      }
    }`,
    {
      variables: {
        name: "Glam You Up awesome plan",
        returnUrl: `${shopUrl}/admin`,
        lineItems: [
          {
            plan: {
              appRecurringPricingDetails: {
                price: {
                  amount: appPrice,
                  currencyCode: "USD",
                },
              },
            },
          },
        ],
        test: true,
        replacementBehavior: "APPLY_IMMEDIATELY",
        trialDays: 30,
      },
    },
  );

  const data = await response.json();
  console.log("Top up action:", data);
  const confirmationUrl = data.data.appSubscriptionCreate.confirmationUrl;
  console.log("Top up confirmationUrl:", confirmationUrl);
  return confirmationUrl;
};

export default function TopUpBalance() {
  const confirmationUrl = useLoaderData();

  useEffect(() => {
    console.log(confirmationUrl);
    top.location.href = confirmationUrl;
  }, [confirmationUrl]);

  return null;
}
