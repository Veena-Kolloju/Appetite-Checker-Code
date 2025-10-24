import API_CONFIG from '../config/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const productService = {
  async getProducts(page = 1, pageSize = 25, carrier = null) {
    let url = `${API_CONFIG.BASE_URL}/canvas/products?page=${page}&pageSize=${pageSize}`;
    if (carrier) url += `&carrier=${carrier}`;
    
    const response = await fetch(url, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      if (response.status === 401) throw new Error('Please login again');
      if (response.status === 403) throw new Error('Access denied');
      throw new Error('Failed to fetch products');
    }
    return await response.json();
  },

  async getProduct(id) {
    const response = await fetch(`${API_CONFIG.BASE_URL}/canvas/product/${id}`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      if (response.status === 401) throw new Error('Please login again');
      if (response.status === 403) throw new Error('Access denied');
      if (response.status === 404) throw new Error('Product not found');
      throw new Error('Failed to fetch product');
    }
    return await response.json();
  },

  async createProduct(data) {
    const response = await fetch(`${API_CONFIG.BASE_URL}/canvas/products`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      if (response.status === 401) throw new Error('Please login again');
      if (response.status === 403) throw new Error('Access denied');
      if (response.status === 400) throw new Error(`Bad request: ${errorText}`);
      throw new Error(`Failed to create product: ${response.status}`);
    }
    return await response.json();
  },

  async updateProduct(id, data) {
    const response = await fetch(`${API_CONFIG.BASE_URL}/canvas/product/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      if (response.status === 401) throw new Error('Please login again');
      if (response.status === 403) throw new Error('Access denied');
      if (response.status === 404) throw new Error('Product not found');
      throw new Error('Failed to update product');
    }
    return await response.json();
  },

  async deleteProduct(id) {
    const response = await fetch(`${API_CONFIG.BASE_URL}/canvas/product/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      if (response.status === 401) throw new Error('Please login again');
      if (response.status === 403) throw new Error('Access denied');
      if (response.status === 404) throw new Error('Product not found');
      throw new Error('Failed to delete product');
    }
    return true;
  },

  async getProductTypes() {
    const response = await fetch(`${API_CONFIG.BASE_URL}/database/product-types`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      if (response.status === 401) throw new Error('Please login again');
      if (response.status === 403) throw new Error('Access denied');
      throw new Error('Failed to fetch product types');
    }
    return await response.json();
  }
};