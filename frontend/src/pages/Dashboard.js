import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, 
  Bell,
  Search,
  Menu,
  X
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import DashboardContent from '../components/DashboardContent';
import SectionContent from '../components/SectionContent';
import Chatbot from '../components/Chatbot';
import UserTooltip from '../components/UserTooltip';
import CarrierList from '../components/CarrierList';
import CarrierForm from '../components/CarrierForm';
import ProductList from '../components/ProductList';
import ProductForm from '../components/ProductForm';
import RuleLibrary from '../components/RuleLibrary';
import RuleConfiguration from '../components/RuleConfiguration';
import UploadRules from '../components/UploadRules';
import AddRule from '../components/AddRule';
import Analytics from '../components/Analytics';

const Dashboard = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showCarrierForm, setShowCarrierForm] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showAddRule, setShowAddRule] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      setCurrentUser(JSON.parse(user));
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-20'} transition-all duration-300 flex-shrink-0`}>
        <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <motion.header
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 px-6 py-4 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                  Canvas Portal
                </h1>
                <p className="text-sm text-gray-600">Rule Management System</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent backdrop-blur-sm transition-all"
                />
              </div>
              
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-danger-500 rounded-full animate-pulse"></span>
              </motion.button>

              <UserTooltip currentUser={currentUser}>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-800">{currentUser.username}</p>
                    <p className="text-xs text-gray-600">
                      {currentUser.carrierName || 'Carrier Account'}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white font-semibold shadow-lg hover:scale-105 transition-transform">
                    {currentUser.username.charAt(0).toUpperCase()}
                  </div>
                </div>
              </UserTooltip>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:text-danger-600 hover:bg-danger-50 rounded-lg transition-all"
              >
                <LogOut className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </motion.header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-8">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeSection === 'dashboard' ? (
              <DashboardContent onNavigate={setActiveSection} />
            ) : activeSection === 'carriers' ? (
              showCarrierForm ? (
                <CarrierForm 
                  onBack={() => setShowCarrierForm(false)}
                  onSuccess={() => {
                    setShowCarrierForm(false);
                    alert('Carrier created successfully!');
                  }}
                />
              ) : (
                <CarrierList onCreateCarrier={() => setShowCarrierForm(true)} />
              )
            ) : activeSection === 'product-library' ? (
              showProductForm ? (
                <ProductForm 
                  onBack={() => setShowProductForm(false)}
                  onSuccess={() => {
                    setShowProductForm(false);
                    alert('Product created successfully!');
                  }}
                />
              ) : (
                <ProductList onCreateProduct={() => setShowProductForm(true)} />
              )
            ) : activeSection === 'rule-library' ? (
              <RuleLibrary />
            ) : activeSection === 'add-rule' ? (
              showAddRule ? (
                <AddRule 
                  onBack={() => setShowAddRule(false)}
                  onSuccess={() => {
                    setShowAddRule(false);
                    alert('Rule created successfully!');
                  }}
                />
              ) : (
                <div className="p-6">
                  <div className="max-w-2xl mx-auto text-center">
                    <h2 className="text-2xl font-bold mb-4">Add New Rule</h2>
                    <p className="text-gray-600 mb-6">Create business rules to define insurance eligibility criteria</p>
                    <button
                      onClick={() => setShowAddRule(true)}
                      className="px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      Create New Rule
                    </button>
                  </div>
                </div>
              )
            ) : activeSection === 'rule-configuration' ? (
              <RuleConfiguration />
            ) : activeSection === 'upload-rules' ? (
              <UploadRules />
            ) : activeSection === 'analytics' ? (
              <Analytics />
            ) : (
              <SectionContent section={activeSection} currentUser={currentUser} />
            )}
          </motion.div>
        </main>
      </div>
      
      {/* Chatbot */}
      <Chatbot />
    </div>
  );
};

export default Dashboard;