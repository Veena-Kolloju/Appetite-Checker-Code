// Test API connectivity
export const testApiConnection = async () => {
  try {
    const response = await fetch('http://localhost:5131/swagger/index.html');
    console.log('Backend reachable:', response.ok);
    return response.ok;
  } catch (error) {
    console.error('Backend not reachable:', error);
    return false;
  }
};

// Test login API
export const testLogin = async (username = 'admin@appetitechecker.com', password = 'Admin123!') => {
  try {
    const response = await fetch('http://localhost:5131/api/canvas/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Username: username, Password: password })
    });
    
    console.log('Login API response:', response.status);
    const data = await response.json();
    console.log('Login API data:', data);
    return data;
  } catch (error) {
    console.error('Login API error:', error);
    throw error;
  }
};