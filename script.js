// script.js

document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'https://fakestoreapi.com/products';
    const productList = document.getElementById('product-list');
    const loadMoreButton = document.getElementById('load-more');
    const searchBar = document.getElementById('search-bar');
    const categoryFilter = document.getElementById('category-filter');
    const priceFilter = document.getElementById('price-filter');
    let products = [];
    let displayedProducts = 0;
    const productsPerPage = 10;
  
    const fetchProducts = async () => {
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Network response was not ok');
        products = await response.json();
        populateCategoryFilter();
        displayProducts();
      } catch (error) {
        console.error('Error fetching products:', error);
        productList.innerHTML = '<p>Failed to load products. Please try again later.</p>';
      }
    };
  
    const populateCategoryFilter = () => {
      const categories = [...new Set(products.map(product => product.category))];
      categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        categoryFilter.appendChild(option);
      });
    };
  
    const displayProducts = () => {
      const filteredProducts = filterProducts(products);
      const fragment = document.createDocumentFragment();
      for (let i = displayedProducts; i < displayedProducts + productsPerPage && i < filteredProducts.length; i++) {
        const product = filteredProducts[i];
        const productElement = document.createElement('div');
        productElement.className = 'product';
        productElement.innerHTML = `
          <img src="${product.image}" alt="${product.title}">
          <h2>${product.title}</h2>
          <p>${product.description}</p>
          <p>$${product.price}</p>
        `;
        fragment.appendChild(productElement);
      }
      productList.appendChild(fragment);
      displayedProducts += productsPerPage;
      if (displayedProducts >= filteredProducts.length) {
        loadMoreButton.style.display = 'none';
      } else {
        loadMoreButton.style.display = 'block';
      }
    };
  
    const filterProducts = (products) => {
      const searchTerm = searchBar.value.toLowerCase();
      const selectedCategory = categoryFilter.value;
      const selectedPriceRange = priceFilter.value;
  
      return products.filter(product => {
        const matchesSearch = product.title.toLowerCase().includes(searchTerm);
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        const matchesPrice = selectedPriceRange === 'all' || (
          selectedPriceRange === '500' ? product.price >= 500 :
          selectedPriceRange.split('-').length === 2 ? (
            product.price >= parseFloat(selectedPriceRange.split('-')[0]) &&
            product.price < parseFloat(selectedPriceRange.split('-')[1])
          ) : false
        );
  
        return matchesSearch && matchesCategory && matchesPrice;
      });
    };
  
    const searchProducts = () => {
      displayedProducts = 0;
      productList.innerHTML = '';
      displayProducts();
    };
  
    loadMoreButton.addEventListener('click', displayProducts);
    searchBar.addEventListener('input', searchProducts);
    categoryFilter.addEventListener('change', searchProducts);
    priceFilter.addEventListener('change', searchProducts);
  
    fetchProducts();
  });
  