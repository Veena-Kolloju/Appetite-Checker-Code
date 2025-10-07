import API_CONFIG from '../config/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const ruleService = {
  async getRules(page = 1, pageSize = 25, sortBy = null) {
    let url = `${API_CONFIG.BASE_URL}/canvas/rules?page=${page}&pageSize=${pageSize}`;
    if (sortBy) url += `&sortBy=${sortBy}`;
    
    const response = await fetch(url, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      if (response.status === 401) throw new Error('Please login again');
      if (response.status === 403) throw new Error('Access denied');
      throw new Error('Failed to fetch rules');
    }
    return await response.json();
  },

  async getRule(id) {
    const response = await fetch(`${API_CONFIG.BASE_URL}/canvas/rule/${id}`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      if (response.status === 401) throw new Error('Please login again');
      if (response.status === 403) throw new Error('Access denied');
      throw new Error('Failed to fetch rule');
    }
    return await response.json();
  },

  async createRule(data) {
    const response = await fetch(`${API_CONFIG.BASE_URL}/canvas/rules`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      if (response.status === 401) throw new Error('Please login again');
      if (response.status === 403) throw new Error('Access denied');
      if (response.status === 400) throw new Error(`Bad request: ${errorText}`);
      throw new Error(`Failed to create rule: ${response.status}`);
    }
    return await response.json();
  },

  async updateRule(id, data) {
    const response = await fetch(`${API_CONFIG.BASE_URL}/canvas/rule/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      if (response.status === 401) throw new Error('Please login again');
      if (response.status === 403) throw new Error('Access denied');
      if (response.status === 400) throw new Error(`Bad request: ${errorText}`);
      throw new Error(`Failed to update rule: ${response.status}`);
    }
    return await response.json();
  },

  async deleteRule(id) {
    const response = await fetch(`${API_CONFIG.BASE_URL}/canvas/rule/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      if (response.status === 401) throw new Error('Please login again');
      if (response.status === 403) throw new Error('Access denied');
      throw new Error('Failed to delete rule');
    }
    return true;
  },

  async uploadRules(file, overwrite = false) {
    const formData = new FormData();
    formData.append('rulesFile', file);
    formData.append('overwrite', overwrite);

    const token = localStorage.getItem('token');
    const response = await fetch(`${API_CONFIG.BASE_URL}/canvas/rules/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      if (response.status === 401) throw new Error('Please login again');
      if (response.status === 403) throw new Error('Access denied');
      throw new Error(`Upload failed: ${errorText}`);
    }
    return await response.json();
  }
};