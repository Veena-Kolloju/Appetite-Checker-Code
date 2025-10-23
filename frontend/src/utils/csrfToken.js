// CSRF Token utility
let csrfToken = null;

export const getCsrfToken = async () => {
  if (csrfToken) {
    return csrfToken;
  }

  try {
    const response = await fetch('/api/csrf-token', {
      credentials: 'include'
    });
    
    if (response.ok) {
      const data = await response.json();
      csrfToken = data.token;
      return csrfToken;
    }
  } catch (error) {
    console.warn('Failed to get CSRF token:', error);
  }
  
  return null;
};

export const getSecureHeaders = async () => {
  const token = await getCsrfToken();
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers['X-XSRF-TOKEN'] = token;
  }
  
  return headers;
};