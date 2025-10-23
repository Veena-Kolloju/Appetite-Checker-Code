import API_CONFIG from '../config/api';

export const authService = {
  async login(username, password) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOGIN}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Username: username, Password: password })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Login failed: ${response.status} - ${errorText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async register(data) {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.REGISTER}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        OrganizationType: 'carrier',
        OrganizationName: data.carrierName,
        Username: data.username,
        Password: data.password,
        Admin: {
          Name: data.contactName,
          Email: data.contactEmail,
          Phone: data.phone || ''
        }
      })
    });
    
    if (!response.ok) throw new Error('Registration failed');
    return await response.json();
  }
};