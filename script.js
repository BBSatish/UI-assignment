document.addEventListener('DOMContentLoaded', () => {
  const API_URL = 'https://fakestoreapi.com/products';
  let products = [];
  let displayedProducts = 0;
  const productsPerPage = 10;

  const productList = document.getElementById('product-list');
  const loadMoreButton = document.getElementById('load-more');
  const categoryFilter = document.getElementById('category-filter');
  const priceFilter = document.getElementById('price-filter');
  const sortFilter = document.getElementById('sort-filter');
  const searchBar = document.getElementById('search-bar');

  // Fetch products from the API
  fetch(API_URL)
    .then(response => response.json())
    .then(data => {
      products = data;
      displayProducts();
      populateCategoryFilter();
    })
    .catch(error => {
      console.error('Error fetching products:', error);
      productList.innerHTML = '<p>Failed to load products. Please try again later.</p>';
    });

  // Display products
  function displayProducts() {
    const productsToDisplay = products.slice(displayedProducts, displayedProducts + productsPerPage);
    productsToDisplay.forEach(product => {
      const productElement = document.createElement('div');
      productElement.className = 'product';
      productElement.innerHTML = `
        <img src="${product.image}" alt="${product.title}">
        <h2>${product.title}</h2>
        <p>${product.description.substring(0, 50)}...</p>
        <p><strong>$${product.price}</strong></p>
      `;
      productList.appendChild(productElement);
    });
    displayedProducts += productsToDisplay.length;
    if (displayedProducts >= products.length) {
      loadMoreButton.style.display = 'none';
    }
  }

  // Populate category filter
  function populateCategoryFilter() {
    const categories = [...new Set(products.map(product => product.category))];
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
      categoryFilter.appendChild(option);
    });
  }

  // Event listeners for filters and load more button
  loadMoreButton.addEventListener('click', displayProducts);
  categoryFilter.addEventListener('change', filterAndSortProducts);
  priceFilter.addEventListener('change', filterAndSortProducts);
  sortFilter.addEventListener('change', filterAndSortProducts);
  searchBar.addEventListener('input', filterAndSortProducts);

  // Filter and sort products
  function filterAndSortProducts() {
    const selectedCategory = categoryFilter.value;
    const selectedPriceRange = priceFilter.value;
    const selectedSortOption = sortFilter.value;
    const searchTerm = searchBar.value.toLowerCase();

    let filteredProducts = products.filter(product => {
      let matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      let matchesPrice = selectedPriceRange === 'all' || (
        selectedPriceRange === '0-50' && product.price <= 50 ||
        selectedPriceRange === '50-100' && product.price > 50 && product.price <= 100 ||
        selectedPriceRange === '100-200' && product.price > 100 && product.price <= 200 ||
        selectedPriceRange === '200-500' && product.price > 200 && product.price <= 500 ||
        selectedPriceRange === '500' && product.price > 500
      );
      let matchesSearch = product.title.toLowerCase().includes(searchTerm) || product.description.toLowerCase().includes(searchTerm);
      return matchesCategory && matchesPrice && matchesSearch;
    });

    if (selectedSortOption === 'price-asc') {
      filteredProducts.sort((a, b) => a.price - b.price);
    } else if (selectedSortOption === 'price-desc') {
      filteredProducts.sort((a, b) => b.price - a.price);
    } else if (selectedSortOption === 'name-asc') {
      filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
    } else if (selectedSortOption === 'name-desc') {
      filteredProducts.sort((a, b) => b.title.localeCompare(a.title));
    }

    displayedProducts = 0;
    productList.innerHTML = '';
    products = filteredProducts;
    displayProducts();
  }
});
