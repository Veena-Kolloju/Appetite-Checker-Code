import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, ArrowLeft, Save } from 'lucide-react';
import { ruleService } from '../services/ruleService';

const AddRule = ({ onBack, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    businessType: '',
    naicsCodes: '',
    states: '',
    carrier: '',
    product: '',
    restrictions: '',
    priority: 'medium',
    outcome: 'eligible',
    status: 'Active',
    minRevenue: '',
    maxRevenue: '',
    minYearsInBusiness: '',
    maxYearsInBusiness: '',
    priorClaimsAllowed: '',
    priorClaimsThreshold: '',
    conditions: '',
    contactEmail: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      setCurrentUser(userData);
      // Auto-populate carrier from user's organization
      setFormData(prev => ({
        ...prev,
        carrier: userData.name || 'Default Carrier',
        contactEmail: userData.email || ''
      }));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const ruleData = {
        ruleId: '',
        title: formData.title,
        description: formData.description,
        businessType: formData.businessType,
        naicsCodes: formData.naicsCodes ? formData.naicsCodes.split(',').map(code => code.trim()) : null,
        states: formData.states ? formData.states.split(',').map(state => state.trim()) : null,
        carrier: formData.carrier,
        product: formData.product,
        restrictions: formData.restrictions ? formData.restrictions.split(',').map(r => r.trim()) : null,
        priority: formData.priority,
        outcome: formData.outcome,
        ruleVersion: '1.0',
        status: formData.status,
        effectiveFrom: new Date().toISOString(),
        effectiveTo: null,
        minRevenue: formData.minRevenue ? parseFloat(formData.minRevenue) : null,
        maxRevenue: formData.maxRevenue ? parseFloat(formData.maxRevenue) : null,
        minYearsInBusiness: formData.minYearsInBusiness ? parseInt(formData.minYearsInBusiness) : null,
        maxYearsInBusiness: formData.maxYearsInBusiness ? parseInt(formData.maxYearsInBusiness) : null,
        priorClaimsAllowed: formData.priorClaimsAllowed ? parseInt(formData.priorClaimsAllowed) : null,
        priorClaimsThreshold: formData.priorClaimsThreshold ? parseInt(formData.priorClaimsThreshold) : null,
        conditions: formData.conditions ? formData.conditions.split(',').map(c => c.trim()) : null,
        contactEmail: formData.contactEmail,
        createdBy: currentUser?.name || 'system',
        createdAt: new Date().toISOString(),
        updatedAt: null,
        additionalJson: null
      };

      await ruleService.createRule(ruleData);
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <button onClick={onBack} className="mr-4 p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <Plus className="w-6 h-6 text-primary-500 mr-2" />
          <h2 className="text-2xl font-bold">Add New Rule</h2>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-4">📋 Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rule Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter rule title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority *
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter rule description"
                  />
                </div>
              </div>
            </div>

            {/* Business Rules */}
            <div className="bg-green-50 rounded-xl p-6 border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-4">🏢 Business Rules</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Type
                  </label>
                  <input
                    type="text"
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., Retail, Manufacturing"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    NAICS Codes
                  </label>
                  <input
                    type="text"
                    name="naicsCodes"
                    value={formData.naicsCodes}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., 445310, 722511 (comma separated)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    States
                  </label>
                  <input
                    type="text"
                    name="states"
                    value={formData.states}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., CA, NY, TX (comma separated)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product
                  </label>
                  <input
                    type="text"
                    name="product"
                    value={formData.product}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter product name"
                  />
                </div>
              </div>
            </div>

            {/* Financial Criteria */}
            <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
              <h3 className="text-lg font-semibold text-yellow-800 mb-4">💰 Financial Criteria</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min Revenue ($)
                  </label>
                  <input
                    type="number"
                    name="minRevenue"
                    value={formData.minRevenue}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Revenue ($)
                  </label>
                  <input
                    type="number"
                    name="maxRevenue"
                    value={formData.maxRevenue}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="1000000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min Years in Business
                  </label>
                  <input
                    type="number"
                    name="minYearsInBusiness"
                    value={formData.minYearsInBusiness}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Years in Business
                  </label>
                  <input
                    type="number"
                    name="maxYearsInBusiness"
                    value={formData.maxYearsInBusiness}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="50"
                  />
                </div>
              </div>
            </div>

            {/* Rule Configuration */}
            <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
              <h3 className="text-lg font-semibold text-purple-800 mb-4">⚙️ Rule Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Carrier (Auto-populated)
                  </label>
                  <input
                    type="text"
                    name="carrier"
                    value={formData.carrier}
                    onChange={handleChange}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="contact@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Outcome *
                  </label>
                  <select
                    name="outcome"
                    value={formData.outcome}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="eligible">Eligible</option>
                    <option value="declined">Declined</option>
                    <option value="restricted">Restricted</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status *
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prior Claims Allowed
                  </label>
                  <input
                    type="number"
                    name="priorClaimsAllowed"
                    value={formData.priorClaimsAllowed}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prior Claims Threshold
                  </label>
                  <input
                    type="number"
                    name="priorClaimsThreshold"
                    value={formData.priorClaimsThreshold}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Restrictions
                  </label>
                  <input
                    type="text"
                    name="restrictions"
                    value={formData.restrictions}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., No flood zones (comma separated)"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Conditions
                  </label>
                  <input
                    type="text"
                    name="conditions"
                    value={formData.conditions}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., Must have security system (comma separated)"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onBack}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
              >
                <Save className="w-5 h-5 mr-2" />
                {loading ? 'Creating...' : 'Create Rule'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default AddRule;