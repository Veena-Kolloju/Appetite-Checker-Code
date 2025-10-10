import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  UserPlus, 
  Package, 
  BookOpen, 
  Plus, 
  Upload, 
  BarChart3, 
  User, 
  Settings,
  Search,
  Filter,
  Edit,
  Eye,
  Save,
  X
} from 'lucide-react';
import { PieChart, BarChart, LineChart, DonutChart } from './Charts';

const SectionContent = ({ section, currentUser }) => {
  const [formData, setFormData] = useState({});
  const [uploadFile, setUploadFile] = useState(null);
  const [showUploadPreview, setShowUploadPreview] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Form submitted successfully!');
    setFormData({});
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadFile(file);
      setShowUploadPreview(true);
    }
  };

  if (section === 'carrier-onboarding') {
    return (
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-success-500 to-success-600 rounded-3xl p-8 text-white relative overflow-hidden"
        >
          <div className="relative z-10 flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center animate-bounce-slow">
              <UserPlus className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Carrier Onboarding</h1>
              <p className="text-xl opacity-90">Add new insurance carriers to the system</p>
            </div>
          </div>
        </motion.div>

        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Carrier Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="carrierName"
                value={formData.carrierName || ''}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-success-500 focus:border-transparent transition-all duration-200"
                placeholder="e.g., ABC Insurance Co."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Website</label>
              <input
                type="url"
                name="website"
                value={formData.website || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-success-500 focus:border-transparent transition-all duration-200"
                placeholder="https://www.example.com"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="contactName"
                  value={formData.contactName || ''}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-success-500 focus:border-transparent transition-all duration-200"
                  placeholder="Jane Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Email <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail || ''}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-success-500 focus:border-transparent transition-all duration-200"
                  placeholder="jane.doe@example.com"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-success-500 to-success-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Save Carrier
              </motion.button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (section === 'product-onboarding') {
    return (
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-warning-500 to-warning-600 rounded-3xl p-8 text-white relative overflow-hidden"
        >
          <div className="relative z-10 flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center animate-bounce-slow">
              <Package className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Product Onboarding</h1>
              <p className="text-xl opacity-90">Add new insurance products to the catalog</p>
            </div>
          </div>
        </motion.div>

        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="productName"
                value={formData.productName || ''}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-warning-500 focus:border-transparent transition-all duration-200"
                placeholder="e.g., Commercial Auto"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description <span className="text-red-500">*</span></label>
              <textarea
                name="description"
                value={formData.description || ''}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-warning-500 focus:border-transparent transition-all duration-200"
                placeholder="Describe the coverage..."
              />
            </div>
            <div className="flex justify-end space-x-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-warning-500 to-warning-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Add Product
              </motion.button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (section === 'product-library') {
    const products = [
      { id: 1, name: 'Health Insurance', category: 'Health', status: 'Active', description: 'Comprehensive health coverage plans', createdDate: '2024-01-15' },
      { id: 2, name: 'Motor Insurance', category: 'Auto', status: 'Active', description: 'Vehicle insurance and protection', createdDate: '2024-01-10' },
      { id: 3, name: 'Home Insurance', category: 'Property', status: 'Active', description: 'Residential property coverage', createdDate: '2024-01-08' },
      { id: 4, name: 'Travel Insurance', category: 'Travel', status: 'Active', description: 'Travel protection and coverage', createdDate: '2024-01-05' },
      { id: 5, name: 'Fire Insurance', category: 'Property', status: 'Active', description: 'Fire damage protection', createdDate: '2024-01-03' },
      { id: 6, name: 'Marine Insurance', category: 'Marine', status: 'Inactive', description: 'Marine cargo and vessel coverage', createdDate: '2024-01-01' },
      { id: 7, name: 'Commercial Insurance', category: 'Commercial', status: 'Active', description: 'Business and commercial coverage', createdDate: '2023-12-28' },
    ];

    return (
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-3xl p-8 text-white relative overflow-hidden"
        >
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center animate-bounce-slow">
                <Package className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">Product Library</h1>
                <p className="text-xl opacity-90">Manage all insurance products</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="pl-10 pr-4 py-2 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm"
                />
              </div>
              <button className="p-2 bg-white/20 border border-white/30 rounded-xl hover:bg-white/30 transition-all">
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product, index) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.category}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{product.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        product.status === 'Active' ? 'bg-success-100 text-success-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.createdDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <button className="text-primary-600 hover:text-primary-900 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  if (section === 'rule-library') {
    const rules = [
      { product: 'General Liability', state: 'CA', naics: '541211', condition: 'Premium > $50K', appetite: 'Eligible', status: 'Active' },
      { product: 'Property Insurance', state: 'TX', naics: '722511', condition: 'Building Age < 20 years', appetite: 'Restricted', status: 'Active' },
      { product: 'Workers Comp', state: 'FL', naics: '238210', condition: 'Payroll < $2M', appetite: 'Decline', status: 'Pending' },
    ];

    return (
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-accent-500 to-accent-600 rounded-3xl p-8 text-white relative overflow-hidden"
        >
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center animate-bounce-slow">
                <BookOpen className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">Rule Library</h1>
                <p className="text-xl opacity-90">Manage all business rules and policies</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search rules..."
                  className="pl-10 pr-4 py-2 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm"
                />
              </div>
              <button className="p-2 bg-white/20 border border-white/30 rounded-xl hover:bg-white/30 transition-all">
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NAICS Class</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Condition</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Appetite</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rules.map((rule, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rule.product}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rule.state}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rule.naics}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rule.condition}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        rule.appetite === 'Eligible' ? 'bg-success-100 text-success-800' :
                        rule.appetite === 'Restricted' ? 'bg-warning-100 text-warning-800' :
                        'bg-danger-100 text-danger-800'
                      }`}>
                        {rule.appetite}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        rule.status === 'Active' ? 'bg-success-100 text-success-800' : 'bg-warning-100 text-warning-800'
                      }`}>
                        {rule.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <button className="text-primary-600 hover:text-primary-900 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  if (section === 'add-rule') {
    return (
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-danger-500 to-danger-600 rounded-3xl p-8 text-white relative overflow-hidden"
        >
          <div className="relative z-10 flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center animate-bounce-slow">
              <Plus className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Add Rule</h1>
              <p className="text-xl opacity-90">Create new business rules for the system</p>
            </div>
          </div>
        </motion.div>

        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Product <span className="text-red-500">*</span></label>
              <select
                name="product"
                value={formData.product || ''}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-danger-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Select Product Type</option>
                <option value="Health Insurance">Health Insurance</option>
                <option value="Motor Insurance">Motor Insurance</option>
                <option value="Home Insurance">Home Insurance</option>
                <option value="Travel Insurance">Travel Insurance</option>
                <option value="Fire Insurance">Fire Insurance</option>
                <option value="Marine Insurance">Marine Insurance</option>
                <option value="Commercial Insurance">Commercial Insurance</option>
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">State <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="state"
                  value={formData.state || ''}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-danger-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., CA"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">NAICS Code <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="naics"
                  value={formData.naics || ''}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-danger-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., 541211"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Condition</label>
              <input
                type="text"
                name="condition"
                value={formData.condition || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-danger-500 focus:border-transparent transition-all duration-200"
                placeholder="e.g., Premium > $50K"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Appetite <span className="text-red-500">*</span></label>
              <select
                name="appetite"
                value={formData.appetite || 'Eligible'}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-danger-500 focus:border-transparent transition-all duration-200"
              >
                <option value="Eligible">Eligible</option>
                <option value="Restricted">Restricted</option>
                <option value="Decline">Decline</option>
              </select>
            </div>
            <div className="flex justify-end space-x-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-danger-500 to-danger-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Save Rule
              </motion.button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (section === 'upload-rules') {
    return (
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary-600 to-accent-500 rounded-3xl p-8 text-white relative overflow-hidden"
        >
          <div className="relative z-10 flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center animate-bounce-slow">
              <Upload className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Upload Rules</h1>
              <p className="text-xl opacity-90">Bulk upload rules from CSV or Excel files</p>
            </div>
          </div>
        </motion.div>

        <div className="bg-white p-8 rounded-2xl border-2 border-dashed border-gray-300 hover:border-primary-400 transition-colors">
          <div className="text-center">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Upload Rule File</h3>
            <p className="text-gray-600 mb-4">Drag and drop your CSV or Excel file here, or click to browse</p>
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="bg-primary-600 text-white px-6 py-3 rounded-xl cursor-pointer hover:bg-primary-700 inline-block transition-colors font-semibold"
            >
              Choose File
            </label>
          </div>
        </div>

        {showUploadPreview && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
          >
            <h3 className="text-lg font-semibold mb-4">Upload Preview</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-primary-50 rounded-xl">
                <p className="text-sm text-gray-600">File Name</p>
                <p className="font-semibold">{uploadFile?.name || '-'}</p>
              </div>
              <div className="text-center p-4 bg-success-50 rounded-xl">
                <p className="text-sm text-gray-600">Total Rows</p>
                <p className="font-semibold">156</p>
              </div>
              <div className="text-center p-4 bg-danger-50 rounded-xl">
                <p className="text-sm text-gray-600">Issues Found</p>
                <p className="font-semibold">7</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-danger-600">
                <X className="h-4 w-4" />
                <span className="font-medium">2 Errors</span>
              </div>
              <div className="bg-danger-50 p-3 rounded text-sm">
                <p>• Row 23: Missing NAICS classification code</p>
                <p>• Row 45: Invalid state abbreviation 'XX'</p>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                Download Error Report
              </button>
              <button className="px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-semibold">
                Save Rules
              </button>
            </div>
          </motion.div>
        )}
      </div>
    );
  }

  if (section === 'analytics') {
    
    const appetiteData = [
      { label: 'Eligible', value: 156, color: '#10B981' },
      { label: 'Restricted', value: 89, color: '#F59E0B' },
      { label: 'Declined', value: 45, color: '#EF4444' }
    ];

    const submissionData = [
      { label: 'Jan', value: 45 },
      { label: 'Feb', value: 52 },
      { label: 'Mar', value: 48 },
      { label: 'Apr', value: 61 },
      { label: 'May', value: 55 },
      { label: 'Jun', value: 67 }
    ];

    const productData = [
      { label: 'General Liability', value: 247, color: '#3B82F6' },
      { label: 'Property', value: 189, color: '#8B5CF6' },
      { label: 'Workers Comp', value: 156, color: '#06B6D4' },
      { label: 'Cyber', value: 98, color: '#F59E0B' }
    ];

    const ruleStatusData = [
      { label: 'Active', value: 423, color: '#10B981' },
      { label: 'Pending', value: 67, color: '#F59E0B' },
      { label: 'Inactive', value: 34, color: '#6B7280' }
    ];

    return (
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-success-600 to-primary-500 rounded-3xl p-8 text-white relative overflow-hidden"
        >
          <div className="relative z-10 flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center animate-bounce-slow">
              <BarChart3 className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Analytics</h1>
              <p className="text-xl opacity-90">Comprehensive analytics and reporting dashboard</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <PieChart data={appetiteData} title="Appetite Distribution" />
          <LineChart data={submissionData} title="Submissions Over Time" />
          <BarChart data={productData} title="Rules by Product" />
          <DonutChart data={ruleStatusData} title="Rule Status" />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
          >
            <h3 className="font-semibold mb-4 text-gray-800">Key Metrics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Rules</span>
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="text-2xl font-bold text-primary-600"
                >
                  1,247
                </motion.span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Active Carriers</span>
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  className="text-2xl font-bold text-success-600"
                >
                  89
                </motion.span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">NAICS Classes</span>
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.4 }}
                  className="text-2xl font-bold text-accent-600"
                >
                  20,847
                </motion.span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (section === 'profile') {
    const profileData = {
      name: formData.name || currentUser?.username || '',
      email: formData.email || (currentUser?.carrierName ? `${currentUser.username}@${currentUser.carrierName.toLowerCase().replace(/\s+/g, '')}.com` : `${currentUser?.username || 'user'}@example.com`),
      role: formData.role || 'Carrier Admin',
      phone: formData.phone || 'Not provided'
    };

    const handleEdit = () => {
      setFormData(profileData);
      setIsEditing(true);
    };

    const handleSave = (e) => {
      e.preventDefault();
      setIsEditing(false);
      alert('Profile updated successfully!');
    };

    const handleCancel = () => {
      setFormData({});
      setIsEditing(false);
    };

    return (
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-warning-600 to-danger-500 rounded-3xl p-8 text-white relative overflow-hidden"
        >
          <div className="relative z-10 flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center animate-bounce-slow">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">My Profile</h1>
              <p className="text-xl opacity-90">Manage your account settings and preferences</p>
            </div>
          </div>
        </motion.div>

        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 max-w-2xl">
          {!isEditing ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">Name</label>
                <span className="text-lg font-semibold text-gray-900">{profileData.name}</span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">Email</label>
                <span className="text-gray-700">{profileData.email}</span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">Role</label>
                <span className="text-gray-700">{profileData.role}</span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">Phone</label>
                <span className="text-gray-700">{profileData.phone}</span>
              </div>
              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleEdit}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-warning-600 to-danger-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </motion.button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-warning-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-warning-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
                <input
                  type="text"
                  name="role"
                  value={formData.role || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-warning-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your role"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-warning-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter phone number"
                />
              </div>
              <div className="flex justify-end gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-warning-600 to-danger-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </motion.button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  if (section === 'rule-configuration') {
    return (
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-accent-600 to-primary-600 rounded-3xl p-8 text-white relative overflow-hidden"
        >
          <div className="relative z-10 flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center animate-bounce-slow">
              <Settings className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Rule Configuration</h1>
              <p className="text-xl opacity-90">Perform CRUD operations on rules</p>
            </div>
          </div>
        </motion.div>

        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <p className="mb-6 text-gray-600">Manage rule configurations and perform operations</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-4 bg-gradient-to-r from-success-500 to-success-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Add Rule
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-4 bg-gradient-to-r from-warning-500 to-warning-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Update Rule
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Get Rules
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-4 bg-gradient-to-r from-danger-500 to-danger-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Delete Rule
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-64">
      <p className="text-gray-500">Section not found</p>
    </div>
  );
};

export default SectionContent;