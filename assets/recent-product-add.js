function initRecentViewed () {
    const el = document.querySelector(".product__media-wrapper");
    if (!el) {
      console.log("NO ELEMENT FOUND");
      return
    }

    const { productId } = el.dataset;
    if (!productId) {
      console.log("NO PRODUCT FOUND");
      return
    }

    const STORAGE_KEY = "recentlyViewedProducts";
    const MAX_ITEMS = 8;

    let arr = [];

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        arr = JSON.parse(stored);
      } catch {
        arr = [];
      }
    }

    // Remove current product if exists
    arr = arr.filter((id) => String(id) !== String(productId));

    // Add to front
    arr.unshift(productId);

    // Limit length
    arr = arr.slice(0, MAX_ITEMS);

    console.log("RECENTLY VIEWED PRODUCT IDs", arr);

    // Save
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));

}

initRecentViewed()