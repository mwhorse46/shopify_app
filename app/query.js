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