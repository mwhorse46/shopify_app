import React, { useEffect } from "react";
import {
  Page,
  Layout,
  Text,
  Card,
  BlockStack,
  MediaCard,
  VideoThumbnail,
  Grid,
  LegacyCard,
  InlineGrid,
  Button,
} from "@shopify/polaris";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import { checkStatus } from "../models/billing.server";
import { GET_SHOP_INFO } from "../query";
import { LAUNCH_APP } from "../constant";
import "../style.css";

export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const shopInfo = await admin.graphql(GET_SHOP_INFO);
  const data1 = await shopInfo.json();
  const shopId = data1.data.shop.id.split("/")[4];
  const status = await checkStatus(shopId);
  console.log("Shop ID :", shopId);
  console.log("Status :", status);

  const expireDate = status?.expireDate;
  const currentDate = new Date();
  let isExpired;
  if (status && expireDate < currentDate) {
    console.log("Expired------------");
    isExpired = true;
  }

  return { status, isExpired };
};

export default function Index() {
  const navigate = useNavigate();
  const { status, isExpired } = useLoaderData();

  const handleLaunch = async () => {
    console.log("From now launch the app!");
    navigate("/app/launch");
  };

  useEffect(() => {
    console.log("---------------------------", isExpired);
    if (isExpired != true) {
      console.log("Expired------------taking plan");
      navigate("/billing/topUpBalance");
    }
  }, []);

  return (
    <>
      {status != null && (
        <Page>
          <ui-title-bar title="Glam You Up"></ui-title-bar>
          <BlockStack gap="500">
            <Layout>
              <Layout.Section>
                <Text as="p" variant="bodyMd">
                  Elevate your fashion experience with our app, empowering
                  customers to effortlessly discover and select the most
                  excellent and trendsetting styles. Unlock a world of fashion
                  possibilities and refine your wardrobe with ease.
                </Text>
              </Layout.Section>
              <Layout.Section>
                <Card>
                  <Text as="h2" variant="headingMd">
                    Feature Overview
                  </Text>
                  <div style={{ width: "100%", height: "20px" }}></div>
                  <Grid>
                    <Grid.Cell
                      columnSpan={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }}
                    >
                      <LegacyCard title="GYU Register" sectioned>
                        <p>
                          Capture a customer's self-portrait for AI analysis and
                          obtain insightful results to enhance their
                          personalized experience.
                        </p>
                        <img
                          src="https://firebasestorage.googleapis.com/v0/b/glam-you-up.appspot.com/o/gyuRegister.png?alt=media&token=0bdcb85b-0d5b-4d61-b25b-154d82f3caec"
                          width={"100%"}
                          height={200}
                          style={{ objectFit: "cover", marginTop: "10px" }}
                        />
                      </LegacyCard>
                    </Grid.Cell>
                    <Grid.Cell
                      columnSpan={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }}
                    >
                      <LegacyCard title="Sort By GYU" sectioned>
                        <p>
                          Leverage AI to categorize and prioritize products,
                          ensuring optimal matches tailored to each customer's
                          preferences.
                        </p>
                        <img
                          src="https://firebasestorage.googleapis.com/v0/b/glam-you-up.appspot.com/o/gyuSort.png?alt=media&token=545f75b2-af9e-44cb-b6a7-954ae8497188"
                          width={"100%"}
                          height={200}
                          style={{ objectFit: "cover", marginTop: "10px" }}
                        />
                      </LegacyCard>
                    </Grid.Cell>
                    <Grid.Cell
                      columnSpan={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }}
                    >
                      <LegacyCard title="GYU Analysis" sectioned>
                        <p>
                          Utilize AI recommendations to suggest the most
                          suitable color and style for products tailored to each
                          customer's preferences.
                        </p>
                        <img
                          src="https://firebasestorage.googleapis.com/v0/b/glam-you-up.appspot.com/o/gyuAnalysis.png?alt=media&token=70229fca-20a9-4117-b76a-2a05f6c08ac3"
                          width={"100%"}
                          height={200}
                          style={{ objectFit: "cover", marginTop: "10px" }}
                        />
                      </LegacyCard>
                    </Grid.Cell>
                  </Grid>
                </Card>
              </Layout.Section>
              <Layout.Section>
                <MediaCard
                  width={"100%"}
                  title="Glam You Up guide video"
                  description={`In this course, you’ll learn how the Glam You Up assist you and get more hapiness customers.`}
                  popoverActions={[{ content: "Dismiss", onAction: () => { } }]}
                >
                  <VideoThumbnail
                    videoLength={80}
                    thumbnailUrl="https://burst.shopifycdn.com/photos/business-woman-smiling-in-office.jpg?width=1850"
                    onClick={() => console.log("clicked")}
                  />
                </MediaCard>
              </Layout.Section>
            </Layout>
          </BlockStack>
        </Page>
      )}
      {status == null && (
        <Page>
          <ui-title-bar title={LAUNCH_APP}></ui-title-bar>
          <BlockStack gap="500" className="billing-report">
            <Layout>
              <Layout.Section>
                <Card roundedAbove="sm">
                  <BlockStack gap="200">
                    <InlineGrid columns="1fr auto">
                      <Text as="h2" variant="headingSm">
                        You can improve your CRO with our App.
                        <br />
                        Please launch the app.
                      </Text>
                    </InlineGrid>
                    <Button onClick={handleLaunch}>Launch</Button>
                  </BlockStack>
                </Card>
              </Layout.Section>
            </Layout>
          </BlockStack>
        </Page>
      )}
    </>
  );
}
