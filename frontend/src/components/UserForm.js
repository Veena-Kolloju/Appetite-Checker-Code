import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, User, RefreshCw, Copy, Check } from 'lucide-react';
import { userService } from '../services/userService';
import { carrierService } from '../services/carrierService';

const UserForm = ({ onBack, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user',
    carrierID: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState('');
  const [createdUser, setCreatedUser] = useState(null);
  const [carriers, setCarriers] = useState([]);
  const [refreshingCarriers, setRefreshingCarriers] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const user = localStorage.getItem('user');
        if (user) {
          const userData = JSON.parse(user);
          const roles = Array.isArray(userData.roles) ? userData.roles : (userData.roles ? userData.roles.split(',') : []);
          setUserRole(roles[0] || 'user');
          
          // Load carriers for Super Admin
          if (roles[0] === 'admin') {
            const carriersData = await carrierService.getCarriers();
            setCarriers(carriersData.data || []);
          }
        }
      } catch (err) {
        console.error('Error loading data:', err);
        setUserRole('user');
      }
    };
    loadData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      setError('Name and Email are required');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const result = await userService.createUser(formData);
      setCreatedUser(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshCarriers = async () => {
    try {
      setRefreshingCarriers(true);
      const carriersData = await carrierService.getCarriers();
      setCarriers(carriersData.data || []);
    } catch (err) {
      console.error('Error refreshing carriers:', err);
    } finally {
      setRefreshingCarriers(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6"
    >
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg mr-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </button>
        <User className="w-6 h-6 text-primary-500 mr-2" />
        <h2 className="text-2xl font-bold">Add New User</h2>
      </div>

      <div className="max-w-2xl">
        {createdUser ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-800 mb-4">User Created Successfully!</h3>
            <div className="space-y-3">
              <div><strong>User ID:</strong> {createdUser.userId}</div>
              <div><strong>Email:</strong> {createdUser.email}</div>
              <div className="flex items-center gap-2">
                <span><strong>Temporary Password:</strong></span>
                <span className="bg-gray-100 px-2 py-1 rounded font-mono">{createdUser.temporaryPassword}</span>
                <button
                  onClick={() => copyToClipboard(createdUser.temporaryPassword)}
                  className="flex items-center px-2 py-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
                  title="Copy to clipboard"
                >
                  {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                </button>
                {copied && <span className="text-sm text-green-600 font-medium">Copied!</span>}
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mt-4">
                <p className="text-sm text-yellow-800">
                  <strong>Important:</strong> Please share this temporary password with the user securely. 
                  They should change it after their first login.
                </p>
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => {
                  setCreatedUser(null);
                  setFormData({ name: '', email: '', role: 'user', carrierID: '' });
                }}
                className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
              >
                Create Another User
              </button>
              <button
                onClick={onSuccess}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Back to Users
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter email address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role *
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="user">User</option>
                {userRole === 'admin' && <option value="admin">Admin</option>}
                <option value="carrier">Carrier</option>
              </select>
            </div>

            {userRole === 'admin' && (
              <div className="md:col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    CarrierID
                  </label>
                  <button
                    type="button"
                    onClick={refreshCarriers}
                    disabled={refreshingCarriers}
                    className="flex items-center px-2 py-1 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                  >
                    <RefreshCw className={`w-3 h-3 mr-1 ${refreshingCarriers ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                </div>
                <select
                  name="carrierID"
                  value={formData.carrierID}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select Carrier (Optional)</option>
                  {carriers.map((carrier) => (
                    <option key={carrier.carrierId} value={carrier.carrierId}>
                      {carrier.displayName} (ID: {carrier.carrierId})
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            {userRole === 'carrier' && (
              <div className="md:col-span-2">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> New users will be added to your carrier automatically.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {loading ? 'Creating...' : 'Create User'}
            </button>
            
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
          </form>
        )}
      </div>
    </motion.div>
  );
};

export default UserForm;