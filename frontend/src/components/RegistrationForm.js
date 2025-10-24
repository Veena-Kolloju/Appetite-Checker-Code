import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { authService } from '../services/authService';

const RegistrationForm = ({ onBack, onRegister }) => {
  const [formData, setFormData] = useState({
    carrierName: '',
    contactName: '',
    contactEmail: '',
    website: '',
    username: '',
    password: '',
    phone: '',
    agreeTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.carrierName && formData.contactName && formData.contactEmail && 
        formData.username && formData.password && formData.agreeTerms) {
      try {
        const result = await authService.register(formData);
        alert('Registration successful! ' + result.message);
        onRegister(formData);
      } catch (error) {
        alert('Registration failed: ' + error.message);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-2xl"
    >
      <div className="glass-effect rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-16 h-16 bg-gradient-to-r from-accent-500 to-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-glow"
          >
            <UserPlus className="w-8 h-8 text-white" />
          </motion.div>
          <h2 className="text-3xl font-bold gradient-text mb-2">Join Canvas Portal</h2>
          <p className="text-gray-600">Create your account</p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
            <p className="text-sm text-blue-800">
              <strong>Account Type:</strong> {window.localStorage.getItem('userCount') === '0' ? 'Super Admin (First User)' : 'Carrier Admin'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Carrier Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="carrierName"
              value={formData.carrierName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
              placeholder="e.g., ABC Insurance Company"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Contact Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="contactName"
                value={formData.contactName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Contact Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                placeholder="john@company.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Company Website
            </label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
              placeholder="https://www.company.com"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                placeholder="Choose username"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 pr-12 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                  placeholder="Create password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                required
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-600">
                I agree to the Terms of Service and Privacy Policy
              </span>
            </label>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-gradient-to-r from-accent-500 to-primary-500 text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Create Account
          </motion.button>
        </form>

        <motion.button
          whileHover={{ x: -5 }}
          onClick={onBack}
          className="flex items-center justify-center w-full mt-6 text-gray-600 hover:text-gray-800 transition-colors text-sm font-medium"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to options
        </motion.button>
      </div>
    </motion.div>
  );
};

export default RegistrationForm;