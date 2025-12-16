console.log("Hello world.....");
const API_Access_Token = '1bfb25e9e643afa7eb514b2a3f5f84a5';

const STOREFRONT_TOKEN = '1bfb25e9e643afa7eb514b2a3f5f84a5';
const SHOP_DOMAIN = 'training-playground.myshopify.com';

const query = `
    query getCollectionProducts($handle: String!) {
      collection(handle: $handle) {
        title
        products(first: 10) {
          edges {
            node {
              id
              title
              handle
              featuredImage {
                url
                altText
              }
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              variants(first: 10) {
                edges {
                  node {
                    id
                    title
                    availableForSale
                    selectedOptions {
                      name
                      value
                    }
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
              options {
                name
                values
              }
            }
          }
        }
      }
    }
  `;

async function fetchCollectionProducts(collectionHandle) {
    try {
        const response = await fetch(`https://${SHOP_DOMAIN}/api/2025-10/graphql.json`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN,
            },
            body: JSON.stringify({
                query,
                variables: {
                    handle: collectionHandle,
                },
            }),
        });

        const data = await response.json();

        if (data.errors) {
            console.error('GraphQL errors:', data.errors);
            return;
        }

        console.log('Products:', data.data.collection.products.edges);
        return data.data.collection.products.edges;
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

//   Products card loop

function renderProductCards(products) {
    const cardList = document.querySelector('.limited-products__card-list');
    if (!cardList) {
        console.log('Card list nhi hai');
        return;
    }

    cardList.innerHTML = '';

    products.forEach(({ node: product }) => {
        const { title, handle, featuredImage, priceRange, variants } = product;

        const hasMultipleVariants = variants.edges.length > 1;
        const firstVariant = variants.edges[0]?.node;

        const cardHTML = `
        <div class="limited-product-card">
          
          <a href="/products/${handle}" class="limited-product-card__image">
            <img 
              src="${featuredImage?.url || ''}" 
              alt="${featuredImage?.altText || title}"
              loading="lazy"
            />
          </a>

          <div class="limited-product-card__info">
            <h3 class="limited-product-card__title">
              ${title}
            </h3>

            <p class="limited-product-card__price">
              ${priceRange.minVariantPrice.amount}
              ${priceRange.minVariantPrice.currencyCode}
            </p>

            ${hasMultipleVariants
                ? `<a href="/products/${handle}" class="limited-product-card__btn" data-handle="${handle}">
                    Check the product
                  </a>`
                : `<a 
                      href="/products/${handle}"
                    class="limited-product-card__btn "
                    data-variant-id="${firstVariant.id}">
                    Check the product
                  </a>`
            }
          </div>
        </div>
      `;

        cardList.insertAdjacentHTML('beforeend', cardHTML);
    });
}

// INIT

async function initLimitedProducts() {
    const section = document.querySelector('.limited-products__wrapper');
    const collectionHandle = section.dataset.collectionHandle;
    console.log('Collection handle', collectionHandle);
    const products = await fetchCollectionProducts(collectionHandle);
    renderProductCards(products);
    console.log('kam hua ki nhi');
}

initLimitedProducts();
