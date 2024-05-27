const productList = document.querySelector('#products');
const addProductForm = document.querySelector('#add-product-form');
const updateProductForm = document.querySelector('#update-product-form');
const updateProductId = document.querySelector('#update-id');
const updateProductName = document.querySelector('#update-name');
const updateProductPrice = document.querySelector('#update-price');
const updateProductDescription = document.querySelector('#update-description');

// Function to fetch all products from the server
async function fetchProducts() {
  try {
    const response = await fetch('http://18.216.242.127:3000/products/');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const products = await response.json();

    // Clear product list
    productList.innerHTML = '';

    // Add each product to the list
    products.forEach(product => {
      const li = document.createElement('li');
      li.innerHTML = `${product.name} - $${product.price} - ${product.description}`;

      // Add delete button for each product
      const deleteButton = document.createElement('button');
      deleteButton.innerHTML = 'Delete';
      deleteButton.addEventListener('click', async () => {
        await deleteProduct(product.id);
        await fetchProducts();
        window.location.reload(); // Reload the page
      });
      li.appendChild(deleteButton);

      // Add update button for each product
      const updateButton = document.createElement('button');
      updateButton.innerHTML = 'Update';
      updateButton.addEventListener('click', () => {
        updateProductId.value = product.id;
        updateProductName.value = product.name;
        updateProductPrice.value = product.price;
        updateProductDescription.value = product.description;
        updateProductForm.style.display = 'block';
      });
      li.appendChild(updateButton);

      productList.appendChild(li);
    });
  } catch (error) {
    console.error('Failed to fetch products:', error);
  }
}

// Event listener for Add Product form submit button
addProductForm.addEventListener('submit', async event => {
  event.preventDefault();
  const name = addProductForm.elements['name'].value;
  const price = addProductForm.elements['price'].value;
  const description = addProductForm.elements['description'].value;
  try {
    await addProduct(name, price, description);
    addProductForm.reset();
    await fetchProducts(); // Fetch products to update the list
    window.location.reload(); // Reload the page
  } catch (error) {
    console.error('Failed to add product:', error);
  }
});

// Event listener for Update Product form submit button
updateProductForm.addEventListener('submit', async event => {
  event.preventDefault();
  const id = updateProductForm.elements['update-id'].value;
  const name = updateProductForm.elements['update-name'].value;
  const price = updateProductForm.elements['update-price'].value;
  const description = updateProductForm.elements['update-description'].value;
  try {
    await updateProduct(id, name, price, description);
    updateProductForm.reset();
    updateProductForm.style.display = 'none';
    await fetchProducts();
    window.location.reload(); // Reload the page
  } catch (error) {
    console.error('Failed to update product:', error);
  }
});

// Function to add a new product
async function addProduct(name, price, description) {
  try {
    const response = await fetch('http://18.216.242.127:3000/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, price, description })
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to add product:', error);
    throw error;
  }
}

// Function to update an existing product
async function updateProduct(id, name, price, description) {
  try {
    const response = await fetch('http://18.216.242.127:3000/products/${id}', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, price, description })
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to update product:', error);
    throw error;
  }
}

// Function to delete a new product
async function deleteProduct(id) {
  try {
    const response = await fetch('http://18.216.242.127:3000/products/' + id, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to delete product:', error);
    throw error;
  }
}

// Fetch all products on page load
fetchProducts();
