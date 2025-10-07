import API_CONFIG from '../config/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const productService = {
  async getProduct(id) {
    const response = await fetch(`${API_CONFIG.BASE_URL}/canvas/product/${id}`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      if (response.status === 401) throw new Error('Please login again');
      if (response.status === 403) throw new Error('Access denied');
      throw new Error('Failed to fetch product');
    }
    return await response.json();
  },

  async getProducts(carrier = null, page = 1, pageSize = 20) {
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
  }
};