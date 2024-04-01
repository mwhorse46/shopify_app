import {
  Page,
  BlockStack,
  Layout,
  Button,
  ActionList,
  Bleed,
  Box,
  ButtonGroup,
  Card,
  InlineGrid,
  InlineStack,
  List,
  Popover,
  ResourceList,
  Text,
} from "@shopify/polaris";
import { PlusIcon } from "@shopify/polaris-icons";
import React, { useState } from "react";
import { useNavigate } from "@remix-run/react";
import { authenticate } from "../shopify.server";

import { BILLING } from "../constant";
import "../style.css";

export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  return null;
};

export default function GYUSettingPage() {
  const navigate = useNavigate();

  const handleBilling = async () => {
    console.log("Go to Billing Page");
    navigate("/billing/topUpBalance");
  };

  return (
    <Page>
      <ui-title-bar title={BILLING}></ui-title-bar>
      <BlockStack gap="500" className="billing-report">
        <Layout>
          <Layout.Section>
            <Card roundedAbove="sm">
              <BlockStack gap="200">
                <InlineGrid columns="1fr auto">
                  <Text as="h2" variant="headingSm">
                    Plan
                  </Text>
                </InlineGrid>
                <BlockStack gap="400">
                  <Text as="p" variant="bodyMd">
                    30 days for free
                  </Text>
                  {/* <Text as="h3" variant="headingSm" fontWeight="medium">
                    Check Current Status
                  </Text> */}
                </BlockStack>
                <Bleed marginInline="400">
                  <Box
                    background="bg-surface-secondary"
                    paddingBlock="300"
                    paddingInline="400"
                  >
                    <BlockStack gap="200">
                      {/* <List>
                        <List.Item>
                          Sold Products Count{" "}
                          <span className="balance">1500</span>
                        </List.Item>
                        <List.Item>
                          We will take{" "}
                          <span className="balance">$300.0</span>
                        </List.Item>
                      </List> */}
                      <Text as="p" variant="bodyMd">
                        Are you satisfied with our service?<br/>
                        If so, please take the plan for next 30 days.
                      </Text>
                    </BlockStack>
                  </Box>
                </Bleed>
                <Button icon={PlusIcon} onClick={handleBilling}>
                  Subscribe
                </Button>
                <BlockStack gap="200">
                  <Text as="h3" variant="headingSm" fontWeight="medium">
                    Note
                  </Text>
                  <Text as="p" variant="bodyMd">
                    The minimun plan is $199.
                    <br />
                    We will take $0.2 * count of the sold products.
                  </Text>
                  {/* <InlineStack align="end">
                    <ButtonGroup>
                      <Button onClick={() => {}} accessibilityLabel="Dismiss">
                        Dismiss
                      </Button>
                      <Button
                        variant="primary"
                        onClick={() => {}}
                        accessibilityLabel="Export Report"
                      >
                        Export Report
                      </Button>
                    </ButtonGroup>
                  </InlineStack> */}
                </BlockStack>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
