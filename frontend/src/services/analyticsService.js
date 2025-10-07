import API_CONFIG from '../config/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const analyticsService = {
  async getAnalytics(since = null) {
    let url = `${API_CONFIG.BASE_URL}/canvas/analytics`;
    if (since) url += `?since=${since}`;
    
    const response = await fetch(url, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      if (response.status === 401) throw new Error('Please login again');
      if (response.status === 403) throw new Error('Access denied');
      throw new Error('Failed to fetch analytics');
    }
    return await response.json();
  },

  // Process real backend data
  processAnalyticsData(backendData) {
    return {
      totalUsers: backendData.metrics.totalUsers,
      totalCarriers: backendData.metrics.totalCarriers,
      totalRules: backendData.metrics.totalRules,
      totalProducts: backendData.metrics.totalProducts,
      rulesByPriority: backendData.metrics.rulesByPriority,
      usersByRole: backendData.metrics.usersByRole,
      growthData: backendData.metrics.growthData,
      recentActivity: backendData.metrics.recentUploads
    };
  }
};