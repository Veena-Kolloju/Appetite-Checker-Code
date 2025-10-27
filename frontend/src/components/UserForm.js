import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, User } from 'lucide-react';
import { userService } from '../services/userService';

const UserForm = ({ onBack, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user',
    organizationName: '',
    orgnId: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState('');
  const [createdUser, setCreatedUser] = useState(null);

  useEffect(() => {
    try {
      const user = localStorage.getItem('user');
      if (user) {
        const userData = JSON.parse(user);
        const roles = Array.isArray(userData.roles) ? userData.roles : (userData.roles ? userData.roles.split(',') : []);
        setUserRole(roles[0] || 'user');
        
        // Auto-fill organization for Carrier Admin
        if (roles[0] === 'carrier' && userData.organizationName) {
          setFormData(prev => ({
            ...prev,
            organizationName: userData.organizationName
          }));
        }
      }
    } catch (err) {
      console.error('Error parsing user data:', err);
      setUserRole('user');
    }
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
              <div><strong>Temporary Password:</strong> 
                <span className="bg-gray-100 px-2 py-1 rounded font-mono ml-2">{createdUser.temporaryPassword}</span>
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
                  setFormData({ name: '', email: '', role: 'user', organizationName: '', orgnId: '' });
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
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organization Name
                  </label>
                  <input
                    type="text"
                    name="organizationName"
                    value={formData.organizationName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter organization name"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organization ID
                  </label>
                  <input
                    type="text"
                    name="orgnId"
                    value={formData.orgnId}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter organization ID"
                  />
                </div>
              </>
            )}
            
            {userRole === 'carrier' && (
              <div className="md:col-span-2">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Organization:</strong> {formData.organizationName || 'Your Organization'}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    New users will be added to your organization automatically.
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