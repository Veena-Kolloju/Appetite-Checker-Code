import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, ArrowLeft } from 'lucide-react';
import { productService } from '../services/productService';

const ProductForm = ({ onBack, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    productType: '',
    naicsAllowed: '',
    carrier: ''
  });
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      setCurrentUser(userData);
      // Auto-populate carrier name from user's organization or name
      setFormData(prev => ({
        ...prev,
        carrier: userData.name || 'Default Carrier'
      }));
    }
  }, []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const productData = {
        id: '',
        name: formData.name,
        description: formData.description,
        productType: formData.productType,
        carrier: formData.carrier,
        naicsAllowed: formData.naicsAllowed,
        perOccurrence: 1000000,
        aggregate: 2000000,
        minAnnualRevenue: 0,
        maxAnnualRevenue: 5000000,
        createdAt: new Date().toISOString()
      };

      await productService.createProduct(productData);
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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
      className="p-6"
    >
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-6">
          <button onClick={onBack} className="mr-4 p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <Package className="w-6 h-6 text-primary-500 mr-2" />
          <h2 className="text-2xl font-bold">Add New Product</h2>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Carrier Name *
            </label>
            <input
              type="text"
              name="carrier"
              value={formData.carrier}
              onChange={handleChange}
              required
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
              placeholder="Auto-populated from user"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter product name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter product description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Type *
            </label>
            <input
              type="text"
              name="productType"
              value={formData.productType}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter product type (e.g., Auto, Home, Life)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              NAICS Allowed *
            </label>
            <input
              type="text"
              name="naicsAllowed"
              value={formData.naicsAllowed}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter NAICS codes (comma separated, e.g., 445310, 722511)"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default ProductForm;