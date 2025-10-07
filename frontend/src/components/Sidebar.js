import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  UserPlus, 
  Package, 
  BookOpen, 
  Plus, 
  Upload, 
  BarChart3, 
  User, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Users
} from 'lucide-react';

const Sidebar = ({ activeSection, setActiveSection }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userRole, setUserRole] = useState(null);

  // Get user role from localStorage
  React.useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      setUserRole(userData.roles?.[0] || 'user');
    }
  }, []);

  const getMenuItems = () => {
    const baseItems = [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'from-primary-500 to-primary-600' },
      { id: 'carriers', label: 'Carriers', icon: Users, color: 'from-blue-500 to-blue-600', adminOnly: true },
      { 
        id: 'carrier-onboarding', 
        label: 'Carrier Onboarding', 
        icon: UserPlus, 
        color: 'from-success-500 to-success-600',
        disabled: userRole === 'carrier',
        disabledMessage: 'You are already an onboarded carrier. Use My Profile to view your details.'
      },
      { id: 'product-library', label: 'Product Library', icon: Package, color: 'from-purple-500 to-purple-600' },
      { id: 'rule-library', label: 'Rule Library', icon: BookOpen, color: 'from-accent-500 to-accent-600' },
      { id: 'add-rule', label: 'Add Rule', icon: Plus, color: 'from-danger-500 to-danger-600' },
      { id: 'upload-rules', label: 'Upload Rules', icon: Upload, color: 'from-primary-600 to-accent-500' },
      { id: 'analytics', label: 'Analytics', icon: BarChart3, color: 'from-success-600 to-primary-500' },
      { id: 'profile', label: userRole === 'carrier' ? 'My Profile' : 'Profile', icon: User, color: 'from-warning-600 to-danger-500' },
      { id: 'rule-configuration', label: 'Rule Configuration', icon: Settings, color: 'from-accent-600 to-primary-600' },
    ];

    // Filter items based on user role
    return baseItems.filter(item => {
      if (item.adminOnly && userRole !== 'admin') return false;
      return true;
    });
  };

  const menuItems = getMenuItems();

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0, width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.3 }}
      className="h-full bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 shadow-2xl relative"
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-8 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors z-10"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Logo Section */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl flex items-center justify-center animate-glow">
            <LayoutDashboard className="w-6 h-6 text-white" />
          </div>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-xl font-bold text-white">Canvas Portal</h2>
              <p className="text-xs text-gray-400">Rule Management</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Menu Items */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item, index) => (
          <div key={item.id} className="relative group">
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={!item.disabled ? { scale: 1.02, x: 5 } : {}}
              whileTap={!item.disabled ? { scale: 0.98 } : {}}
              onClick={() => {
                if (item.disabled) {
                  // Show tooltip message - handled by CSS
                  return;
                }
                setActiveSection(item.id);
              }}
              disabled={item.disabled}
              className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 group ${
                item.disabled
                  ? 'text-gray-500 cursor-not-allowed opacity-60'
                  : activeSection === item.id
                  ? 'bg-gradient-to-r ' + item.color + ' text-white shadow-lg'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                item.disabled
                  ? 'bg-gray-700'
                  : activeSection === item.id 
                  ? 'bg-white/20' 
                  : 'bg-gray-600 group-hover:bg-gray-500'
              }`}>
                <item.icon size={18} />
              </div>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-medium text-sm"
                >
                  {item.label}
                </motion.span>
              )}
            </motion.button>
            
            {/* Professional tooltip for disabled items */}
            {item.disabled && item.disabledMessage && !isCollapsed && (
              <div className="absolute left-full ml-3 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs rounded-lg px-4 py-3 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50 shadow-xl border border-blue-500 max-w-xs">
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-3 h-3 bg-blue-600 rotate-45 border-l border-b border-blue-500"></div>
                <div className="flex items-start space-x-2">
                  <div className="w-4 h-4 rounded-full bg-blue-400 flex items-center justify-center mt-0.5">
                    <span className="text-xs font-bold">i</span>
                  </div>
                  <div className="text-left leading-relaxed">
                    {item.disabledMessage}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </nav>
    </motion.div>
  );
};

export default Sidebar;