export const GET_PRODUCTS_QUERY = `#graphql
query getProducts {
  products(first: 250) {
    edges {
      node {
        id
        title
        images(first: 250) {
          edges {
            node {
              id
              originalSrc
            }
          }
        }
        variants(first: 250) {
          edges {
            node {
              id
              image {
                originalSrc
              }
            }
          }
        }
      }
    }
  }
}`;

export const GET_SHOP_INFO = `#graphql
query {
  shop {
    id
    url
  }
}`;

export const SET_EXPIRED_INFO = `#graphql
mutation {
  metaobjectDefinitionCreate(definition: {
    type: "$app:product_highlight",
    access: {
      admin: MERCHANT_READ_WRITE,
      storefront: PUBLIC_READ
    },
    capabilities: {
      publishable: {
        enabled: true
      }
    },
    fieldDefinitions: [
      { key: "title", name: "Highlight Title", type: "single_line_text_field" },
      { key: "description", name: "Description", type: "multi_line_text_field" },
      { key: "creative", name: "Creative", type: "file_reference" }
    ]
  }) {
    metaobjectDefinition {
      id
      type
      fieldDefinitions {
        key
        name
        type {
          name
        }
      }
    }
  }
}`;