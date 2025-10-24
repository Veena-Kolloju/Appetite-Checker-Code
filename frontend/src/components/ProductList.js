import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Plus, Search, Edit, Trash2, Eye, X } from 'lucide-react';
import { productService } from '../services/productService';

const ProductList = ({ onCreateProduct, onEditProduct }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null);

  useEffect(() => {
    try {
      const user = localStorage.getItem('user');
      if (user) {
        const userData = JSON.parse(user);
        // Handle both array and string formats for roles
        const roles = Array.isArray(userData.roles) ? userData.roles : (userData.roles ? userData.roles.split(',') : []);
        setUserRole(roles[0] || 'user');
      }
    } catch (err) {
      console.error('Error parsing user data:', err);
      setUserRole('user');
    }
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const result = await productService.getProducts();
      // Handle paginated response structure
      const productData = result?.data || result || [];
      setProducts(Array.isArray(productData) ? productData : []);
      setError('');
    } catch (err) {
      console.error('Load products error:', err);
      setError(err.message || 'Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    try {
      await productService.deleteProduct(productId);
      setProducts(products.filter(p => p.id !== productId));
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Delete product error:', err);
      setError(err.message || 'Failed to delete product');
    }
  };

  const handleEdit = async (product) => {
    try {
      // Get full product details for editing
      const fullProduct = await productService.getProduct(product.id);
      onEditProduct(fullProduct);
    } catch (err) {
      console.error('Edit product error:', err);
      setError(err.message || 'Failed to load product details');
    }
  };

  const handleView = async (product) => {
    try {
      const fullProduct = await productService.getProduct(product.id);
      setViewingProduct(fullProduct);
    } catch (err) {
      console.error('View product error:', err);
      setError(err.message || 'Failed to load product details');
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
                {product.description && (
                  <p className="text-gray-600">{product.description}</p>
                )}
                <div className="flex gap-2 mt-2">
                  {product.productType && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {product.productType}
                    </span>
                  )}
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    {product.carrierName || product.carrier}
                  </span>
                </div>
                {product.naicsAllowed && (
                  <div className="mt-2 text-sm text-gray-500">
                    <span>NAICS: {product.naicsAllowed}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleView(product)}
                    className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </button>
                  {(userRole === 'admin' || userRole === 'carrier') && (
                    <>
                      <button
                        onClick={() => handleEdit(product)}
                        className="flex items-center px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(product.id)}
                        className="flex items-center px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </button>
                    </>
                  )}
                </div>
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

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-md mx-4"
          >
            <h3 className="text-lg font-semibold mb-4">Delete Product</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Product Details Modal */}
      {viewingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Product Details</h3>
              <button
                onClick={() => setViewingProduct(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-3">
              <div><strong>ID:</strong> {viewingProduct.id}</div>
              <div><strong>Name:</strong> {viewingProduct.name}</div>
              {viewingProduct.description && <div><strong>Description:</strong> {viewingProduct.description}</div>}
              {viewingProduct.productType && <div><strong>Product Type:</strong> {viewingProduct.productType}</div>}
              <div><strong>Carrier:</strong> {viewingProduct.carrier}</div>
              <div><strong>Per Occurrence:</strong> ${viewingProduct.perOccurrence?.toLocaleString() || 'N/A'}</div>
              <div><strong>Aggregate:</strong> ${viewingProduct.aggregate?.toLocaleString() || 'N/A'}</div>
              <div><strong>Min Annual Revenue:</strong> ${viewingProduct.minAnnualRevenue?.toLocaleString() || 'N/A'}</div>
              <div><strong>Max Annual Revenue:</strong> ${viewingProduct.maxAnnualRevenue?.toLocaleString() || 'N/A'}</div>
              <div><strong>NAICS Allowed:</strong> {viewingProduct.naicsAllowed || 'Not specified'}</div>
              <div><strong>Created:</strong> {new Date(viewingProduct.createdAt).toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ProductList;