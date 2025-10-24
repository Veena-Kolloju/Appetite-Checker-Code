import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  FileText, 
  Shield, 
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle,
  Package
} from 'lucide-react';
import { analyticsService } from '../services/analyticsService';

const DashboardContent = ({ onNavigate }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    loadDashboardData();
    
    // Get user role from localStorage
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      setUserRole(userData.roles?.[0] || 'user');
    }
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const result = await analyticsService.getAnalytics();
      const processedData = analyticsService.processAnalyticsData(result);
      setDashboardData(processedData);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStats = () => {
    if (!dashboardData) return [];
    
    const allStats = [
      { 
        title: 'Active Rules', 
        value: dashboardData.totalRules.toString(), 
        icon: Shield, 
        color: 'from-primary-500 to-primary-600', 
        change: dashboardData.totalRules > 0 ? 'Active' : 'No Rules'
      },
      { 
        title: 'Total Carriers', 
        value: dashboardData.totalCarriers.toString(), 
        icon: Users, 
        color: 'from-success-500 to-success-600', 
        change: dashboardData.totalCarriers > 0 ? 'Active' : 'No Data',
        hideForUser: true
      },
      { 
        title: 'Total Users', 
        value: dashboardData.totalUsers.toString(), 
        icon: Users, 
        color: 'from-blue-500 to-blue-600', 
        change: dashboardData.totalUsers > 0 ? 'Active' : 'No Users',
        adminOnly: true
      },
      { 
        title: 'Products', 
        value: dashboardData.totalProducts.toString(), 
        icon: Package, 
        color: 'from-accent-500 to-accent-600', 
        change: 'Available'
      },
    ];
    
    // Filter stats based on user role
    return allStats.filter(stat => {
      if (stat.adminOnly && userRole !== 'admin') {
        return false;
      }
      if (stat.hideForUser && (userRole === 'user' || userRole === 'carrier')) {
        return false;
      }
      return true;
    });
  };

  const stats = getStats();

  const getRecentActivities = () => {
    if (!dashboardData) return [];
    
    const activities = [];
    
    if (dashboardData.totalUsers > 0) {
      activities.push({
        action: `System has ${dashboardData.totalUsers} registered users`,
        time: 'Current status',
        type: 'success',
        icon: CheckCircle
      });
    }
    
    if (dashboardData.totalCarriers > 0) {
      activities.push({
        action: `${dashboardData.totalCarriers} carriers are onboarded`,
        time: 'Current status',
        type: 'success',
        icon: CheckCircle
      });
    }
    
    if (dashboardData.totalRules > 0) {
      activities.push({
        action: `${dashboardData.totalRules} business rules are active`,
        time: 'Current status',
        type: 'info',
        icon: Activity
      });
    } else {
      activities.push({
        action: 'No business rules configured yet',
        time: 'Action needed',
        type: 'warning',
        icon: AlertTriangle
      });
    }
    
    activities.push({
      action: `${dashboardData.totalProducts} products available in library`,
      time: 'Current status',
      type: 'info',
      icon: Activity
    });
    
    activities.push({
      action: 'System is running normally',
      time: 'System status',
      type: 'success',
      icon: CheckCircle
    });
    
    return activities;
  };
  
  const recentActivities = getRecentActivities();

  const quickActions = [
    { title: 'Add New Rule', desc: 'Create custom business rules', color: 'from-primary-500 to-primary-600', icon: Shield },
    { title: 'Onboard Carrier', desc: 'Add new insurance carrier', color: 'from-success-500 to-success-600', icon: Users },
    { title: 'Upload Rules', desc: 'Bulk upload rule files', color: 'from-warning-500 to-warning-600', icon: FileText },
    { title: 'View Analytics', desc: 'Check system performance', color: 'from-accent-500 to-accent-600', icon: TrendingUp },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <div className="text-red-500 mb-4">Failed to load dashboard data</div>
        <button 
          onClick={loadDashboardData}
          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-500 via-accent-500 to-primary-600 rounded-3xl p-8 text-white relative overflow-hidden"
      >
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2">Welcome to Canvas Portal</h1>
          <p className="text-xl opacity-90">Manage your rules and carriers efficiently</p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const getNavigationTarget = (title) => {
            switch (title) {
              case 'Active Rules': return 'rule-library';
              case 'Total Carriers': return 'carriers';
              case 'Total Users': return 'users';
              case 'Products': return 'product-library';
              default: return 'dashboard';
            }
          };
          
          return (
            <motion.button
              key={stat.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate(getNavigationTarget(stat.title))}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 cursor-pointer text-left w-full"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center animate-pulse-slow`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-semibold text-success-600 bg-success-100 px-2 py-1 rounded-full">
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</h3>
              <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
            </motion.button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-1"
        >
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-primary-500" />
              Quick Actions
            </h3>
            <div className="space-y-4">
              {quickActions.map((action, index) => {
                const getNavigationTarget = (title) => {
                  switch (title) {
                    case 'Add New Rule': return 'add-rule';
                    case 'Onboard Carrier': return 'carriers';
                    case 'Upload Rules': return 'upload-rules';
                    case 'View Analytics': return 'analytics';
                    default: return 'dashboard';
                  }
                };
                
                return (
                  <motion.button
                    key={action.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onNavigate(getNavigationTarget(action.title))}
                    className={`w-full p-4 bg-gradient-to-r ${action.color} text-white rounded-xl hover:shadow-lg transition-all duration-200 text-left group`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <action.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{action.title}</h4>
                        <p className="text-xs opacity-90">{action.desc}</p>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-primary-500" />
              Recent Activities
            </h3>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.01, x: 5 }}
                  className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200 cursor-pointer"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    activity.type === 'success' ? 'bg-success-100 text-success-600' :
                    activity.type === 'warning' ? 'bg-warning-100 text-warning-600' :
                    'bg-primary-100 text-primary-600'
                  }`}>
                    <activity.icon size={18} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardContent;