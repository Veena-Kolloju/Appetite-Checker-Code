import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Plus, Search } from 'lucide-react';
import { productService } from '../services/productService';

const ProductList = ({ onCreateProduct }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      setUserRole(userData.roles?.[0] || 'user');
    }
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const result = await productService.getProducts();
      setProducts(result.data || []);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div></div>;
  if (error) return <div className="text-red-500 p-4 text-center">{error}</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Package className="w-6 h-6 text-primary-500 mr-2" />
          <h2 className="text-2xl font-bold">Products</h2>
        </div>
        {(userRole === 'admin' || userRole === 'carrier') && (
          <button
            onClick={onCreateProduct}
            className="flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </button>
        )}
      </div>

      <div className="grid gap-4">
        {products.map((product) => (
          <motion.div
            key={product.id}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-lg shadow-md p-4 border border-gray-200"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <p className="text-gray-600">{product.description || 'No description available'}</p>
                <div className="flex gap-2 mt-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    {product.productType || 'N/A'}
                  </span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    {product.carrier}
                  </span>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  <span>NAICS: {product.naicsAllowed || 'Not specified'}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                  {product.id}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No products found
        </div>
      )}
    </motion.div>
  );
};

export default ProductList;