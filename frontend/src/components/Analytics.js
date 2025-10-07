import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Users, Package, BookOpen, TrendingUp } from 'lucide-react';
import { analyticsService } from '../services/analyticsService';
import LineChart from './charts/LineChart';
import PieChart from './charts/PieChart';
import BarChart from './charts/BarChart';

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState('30');

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const since = new Date();
      since.setDate(since.getDate() - parseInt(timeRange));
      
      const result = await analyticsService.getAnalytics(since.toISOString());
      const processedData = analyticsService.processAnalyticsData(result);
      
      setAnalytics({
        ...result,
        processedData
      });
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getKPICards = () => {
    if (!analytics?.processedData) return [];
    
    const data = analytics.processedData;
    
    return [
      {
        title: 'Total Users',
        value: data.totalUsers,
        icon: Users,
        color: 'from-blue-500 to-blue-600',
        change: data.totalUsers > 0 ? 'Active' : 'No Data'
      },
      {
        title: 'Total Carriers',
        value: data.totalCarriers,
        icon: Users,
        color: 'from-green-500 to-green-600',
        change: data.totalCarriers > 0 ? 'Active' : 'No Data'
      },
      {
        title: 'Active Rules',
        value: data.totalRules,
        icon: BookOpen,
        color: 'from-purple-500 to-purple-600',
        change: data.totalRules > 0 ? 'Active' : 'No Rules'
      },
      {
        title: 'Products',
        value: data.totalProducts,
        icon: Package,
        color: 'from-orange-500 to-orange-600',
        change: 'Available'
      }
    ];
  };

  const getGrowthChartData = () => {
    if (!analytics?.processedData?.growthData) return null;
    
    const growthData = analytics.processedData.growthData;
    return {
      labels: growthData.map(d => new Date(d.date).toLocaleDateString()),
      datasets: [
        {
          label: 'New Users',
          data: growthData.map(d => d.users),
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4
        },
        {
          label: 'New Rules',
          data: growthData.map(d => d.rules),
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: true,
          tension: 0.4
        }
      ]
    };
  };

  const getRulesPriorityData = () => {
    if (!analytics?.processedData?.rulesByPriority) return null;
    
    const data = analytics.processedData.rulesByPriority;
    return {
      labels: Object.keys(data).map(key => key.charAt(0).toUpperCase() + key.slice(1)),
      datasets: [{
        data: Object.values(data),
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(34, 197, 94, 0.8)'
        ],
        borderColor: [
          'rgba(239, 68, 68, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(34, 197, 94, 1)'
        ],
        borderWidth: 2
      }]
    };
  };

  const getUsersRoleData = () => {
    if (!analytics?.processedData?.usersByRole) return null;
    
    const data = analytics.processedData.usersByRole;
    return {
      labels: Object.keys(data).map(key => key.charAt(0).toUpperCase() + key.slice(1)),
      datasets: [{
        label: 'Users by Role',
        data: Object.values(data),
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(236, 72, 153, 0.8)'
        ],
        borderColor: [
          'rgba(99, 102, 241, 1)',
          'rgba(168, 85, 247, 1)',
          'rgba(236, 72, 153, 1)'
        ],
        borderWidth: 2
      }]
    };
  };

  if (loading) return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div></div>;
  if (error) return <div className="text-red-500 p-4 text-center">{error}</div>;

  const kpiCards = getKPICards();
  const growthData = getGrowthChartData();
  const priorityData = getRulesPriorityData();
  const roleData = getUsersRoleData();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <BarChart3 className="w-6 h-6 text-primary-500 mr-2" />
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
        </select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpiCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                <p className="text-sm text-green-600 font-medium">{card.change}</p>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-r ${card.color} rounded-lg flex items-center justify-center`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Growth Chart */}
        {growthData && (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <LineChart 
              data={growthData} 
              title="Growth Trends" 
              height={350}
            />
          </div>
        )}

        {/* Rules Priority Distribution */}
        {priorityData && (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <PieChart 
              data={priorityData} 
              title="Rules by Priority" 
              height={350}
            />
          </div>
        )}
      </div>

      {/* Bottom Chart */}
      <div className="grid grid-cols-1 gap-6">
        {roleData && (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <BarChart 
              data={roleData} 
              title="Users by Role Distribution" 
              height={300}
            />
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="mt-8 bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl p-6 border border-primary-200">
        <h3 className="text-lg font-semibold text-primary-800 mb-4">📊 Analytics Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium text-primary-700">System Health:</span>
            <span className="ml-2 text-green-600 font-semibold">Excellent</span>
          </div>
          <div>
            <span className="font-medium text-primary-700">Data Updated:</span>
            <span className="ml-2 text-gray-600">{new Date().toLocaleString()}</span>
          </div>
          <div>
            <span className="font-medium text-primary-700">Active Period:</span>
            <span className="ml-2 text-gray-600">Last {timeRange} days</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Analytics;