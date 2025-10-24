import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, ArrowLeft } from 'lucide-react';
import { productService } from '../services/productService';

const ProductForm = ({ onBack, onSuccess, editProduct = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    productTypeId: '',
    naicsAllowed: '',
    carrier: ''
  });
  const [currentUser, setCurrentUser] = useState(null);
  const [productTypes, setProductTypes] = useState([]);

  // Fetch product types on component mount
  useEffect(() => {
    const fetchProductTypes = async () => {
      try {
        const types = await productService.getProductTypes();
        setProductTypes(types);
      } catch (error) {
        console.error('Failed to fetch product types:', error);
        // Fallback to hardcoded types if API fails
        setProductTypes([
          { productTypeId: 1, typeName: 'Auto Insurance' },
          { productTypeId: 2, typeName: 'Health Insurance' },
          { productTypeId: 3, typeName: 'Life Insurance' },
          { productTypeId: 4, typeName: 'Property Insurance' },
          { productTypeId: 5, typeName: 'Travel Insurance' },
          { productTypeId: 6, typeName: 'Home Insurance' }
        ]);
      }
    };
    
    fetchProductTypes();
  }, []);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      setCurrentUser(userData);
      
      if (editProduct) {
        // Pre-populate form with existing product data
        setFormData({
          name: editProduct.name || '',
          description: editProduct.description || '',
          productTypeId: editProduct.productTypeId || '',
          naicsAllowed: editProduct.naicsAllowed || '',
          carrier: editProduct.carrier || ''
        });
      } else {
        // Auto-populate carrier name from user's organization name
        const carrierName = userData.organizationName || userData.name || 'Default Carrier';
        setFormData(prev => ({
          ...prev,
          carrier: carrierName
        }));
      }
    }
  }, [editProduct]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const productData = {
        id: editProduct?.id || '',
        name: formData.name,
        description: formData.description,
        productTypeId: formData.productTypeId ? parseInt(formData.productTypeId) : null,
        carrier: formData.carrier,
        naicsAllowed: formData.naicsAllowed,
        perOccurrence: editProduct?.perOccurrence || 1000000,
        aggregate: editProduct?.aggregate || 2000000,
        minAnnualRevenue: editProduct?.minAnnualRevenue || 0,
        maxAnnualRevenue: editProduct?.maxAnnualRevenue || 5000000,
        createdAt: editProduct?.createdAt || new Date().toISOString()
      };

      if (editProduct) {
        await productService.updateProduct(editProduct.id, productData);
      } else {
        await productService.createProduct(productData);
      }
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
          <h2 className="text-2xl font-bold">{editProduct ? 'Edit Product' : 'Add New Product'}</h2>
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
            <select
              name="productTypeId"
              value={formData.productTypeId}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Select Product Type</option>
              {productTypes.map(type => (
                <option key={type.productTypeId} value={type.productTypeId}>
                  {type.typeName}
                </option>
              ))}
            </select>
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
              {loading ? (editProduct ? 'Updating...' : 'Creating...') : (editProduct ? 'Update Product' : 'Create Product')}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default ProductForm;