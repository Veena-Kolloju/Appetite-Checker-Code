import API_CONFIG from '../config/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const userService = {
  async getUsers(page = 1, pageSize = 25, role = null) {
    try {
      let url = `${API_CONFIG.BASE_URL}/canvas/carriers?page=${page}&pageSize=${pageSize}`;
      if (role) url += `&role=${role}`;
      
      const response = await fetch(url, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        if (response.status === 401) throw new Error('Please login again');
        if (response.status === 403) throw new Error('Access denied');
        throw new Error(`Failed to fetch users: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Get users error:', error);
      throw error;
    }
  },

  async createUser(userData) {
    try {
      const payload = {
        name: userData.name,
        email: userData.email,
        role: userData.role,
        organizationName: userData.organizationName || ''
      };
      
      const response = await fetch(`${API_CONFIG.BASE_URL}/canvas/create-user`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 401) throw new Error('Please login again');
        if (response.status === 403) throw new Error('Access denied');
        throw new Error(`Failed to create user: ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Create user error:', error);
      throw error;
    }
  },

  async updateUser(userId, userData) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/canvas/carrier/${userId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 401) throw new Error('Please login again');
        if (response.status === 403) throw new Error('Access denied');
        throw new Error(`Failed to update user: ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  },

  async deleteUser(userId) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/canvas/carrier/${userId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        if (response.status === 401) throw new Error('Please login again');
        if (response.status === 403) throw new Error('Access denied');
        if (response.status === 404) throw new Error('User not found');
        throw new Error('Failed to delete user');
      }
      
      return { success: true };
    } catch (error) {
      console.error('Delete user error:', error);
      throw error;
    }
  },

  async createQuickUser(userData) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/canvas/users`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 401) throw new Error('Please login again');
        if (response.status === 403) throw new Error('Access denied');
        throw new Error(`Failed to create user: ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Create quick user error:', error);
      throw error;
    }
  }
};