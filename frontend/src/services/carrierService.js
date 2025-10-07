import API_CONFIG from '../config/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const carrierService = {
  async getCarrier(id) {
    const response = await fetch(`${API_CONFIG.BASE_URL}/canvas/carrier/${id}`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      if (response.status === 401) throw new Error('Please login again');
      if (response.status === 403) throw new Error('Access denied');
      throw new Error('Failed to fetch carrier');
    }
    return await response.json();
  },

  async getCarriers(page = 1, pageSize = 25, role = null) {
    let url = `${API_CONFIG.BASE_URL}/canvas/carriers-list?page=${page}&pageSize=${pageSize}`;
    
    const response = await fetch(url, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      if (response.status === 401) throw new Error('Please login again');
      if (response.status === 403) throw new Error('Access denied');
      throw new Error('Failed to fetch carriers');
    }
    return await response.json();
  },

  async createCarrier(data) {
    console.log('Creating carrier with data:', data);
    
    const response = await fetch(`${API_CONFIG.BASE_URL}/canvas/carriers`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Create carrier error:', response.status, errorText);
      
      if (response.status === 401) throw new Error('Please login again');
      if (response.status === 403) throw new Error('Access denied');
      if (response.status === 400) throw new Error(`Bad request: ${errorText}`);
      throw new Error(`Failed to create carrier: ${response.status}`);
    }
    return await response.json();
  },

  async getCarrierDetails(id) {
    const response = await fetch(`${API_CONFIG.BASE_URL}/canvas/carrier-details/${id}`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      if (response.status === 401) throw new Error('Please login again');
      if (response.status === 403) throw new Error('Access denied');
      throw new Error('Failed to fetch carrier details');
    }
    return await response.json();
  },

  async deleteCarrier(carrierId) {
    const response = await fetch(`${API_CONFIG.BASE_URL}/canvas/carrier-details/${carrierId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Delete carrier error:', response.status, errorText);
      
      if (response.status === 401) throw new Error('Please login again');
      if (response.status === 403) throw new Error('Access denied');
      if (response.status === 404) throw new Error('Carrier not found');
      throw new Error(`Failed to delete carrier: ${response.status}`);
    }
    return true;
  }
};