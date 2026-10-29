
export function getRecommendations(products, selectedProduct = null, limit = 4) {
  if (!Array.isArray(products) || products.length === 0) {
    return [];
  }

  const selectedId = selectedProduct?._id;

  return products
    .filter((product) => {
      return (
        product._id !== selectedId &&
        Number(product.stock) > 0
      );
    })
    .map((product) => {
      let score = 0;

      // Prefer products from the same category.
      if (
        selectedProduct?.category &&
        product.category?.toLowerCase() ===
          selectedProduct.category.toLowerCase()
      ) {
        score += 3;
      }

      // Prefer products with similar prices.
      if (selectedProduct) {
        const price = Number(product.price);
        const selectedPrice = Number(selectedProduct.price);

        if (price > 0 && selectedPrice > 0) {
          const difference =
            Math.abs(price - selectedPrice) / selectedPrice;

          if (difference <= 0.2) {
            score += 2;
          } else if (difference <= 0.5) {
            score += 1;
          }
        }
      }

      return {
        ...product,
        recommendationScore: score,
      };
    })
    .sort((a, b) => {
      if (b.recommendationScore !== a.recommendationScore) {
        return b.recommendationScore - a.recommendationScore;
      }

      return Number(b.stock) - Number(a.stock);
    })
    .slice(0, limit);
}
