import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Eye, Edit, Save, X, Trash2, Plus, Upload } from 'lucide-react';
import { ruleService } from '../services/ruleService';
import AddRule from './AddRule';
import UploadRules from './UploadRules';

const RuleLibrary = () => {
  const [activeTab, setActiveTab] = useState('view');
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingRule, setEditingRule] = useState(null);
  const [viewingRule, setViewingRule] = useState(null);
  const [editData, setEditData] = useState({});
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      setUserRole(userData.roles?.[0] || 'user');
    }
  }, []);

  useEffect(() => {
    loadRules();
  }, []);

  const loadRules = async () => {
    try {
      setLoading(true);
      const result = await ruleService.getRules();
      setRules(result.data || []);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (rule) => {
    try {
      const fullRule = await ruleService.getRule(rule.ruleId);
      setEditingRule(rule.ruleId);
      setEditData(fullRule);
    } catch (err) {
      alert('Failed to load rule details: ' + err.message);
    }
  };

  const handleSave = async () => {
    try {
      await ruleService.updateRule(editingRule, editData);
      setEditingRule(null);
      setEditData({});
      loadRules();
      alert('Rule updated successfully!');
    } catch (err) {
      alert('Failed to update rule: ' + err.message);
    }
  };

  const handleView = async (rule) => {
    try {
      const fullRule = await ruleService.getRule(rule.ruleId);
      setViewingRule(fullRule);
    } catch (err) {
      alert('Failed to load rule details: ' + err.message);
    }
  };

  const handleEditChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const handleDelete = async (rule) => {
    if (!window.confirm(`Are you sure you want to delete rule "${rule.title}"?`)) {
      return;
    }

    try {
      await ruleService.deleteRule(rule.ruleId);
      loadRules();
      alert('Rule deleted successfully!');
    } catch (err) {
      alert('Failed to delete rule: ' + err.message);
    }
  };

  if (loading) return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div></div>;
  if (error) return <div className="text-red-500 p-4 text-center">{error}</div>;

  const handleAddRuleSuccess = () => {
    setActiveTab('view');
    loadRules();
    alert('Rule created successfully!');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <BookOpen className="w-6 h-6 text-primary-500 mr-2" />
          <h2 className="text-2xl font-bold">Rule Library</h2>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('view')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'view'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <BookOpen className="w-4 h-4 inline mr-1" />
            View Rules
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'add'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Plus className="w-4 h-4 inline mr-1" />
            Add Rule
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'upload'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Upload className="w-4 h-4 inline mr-1" />
            Upload Rules
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'view' && (
        <>
          <div className="grid gap-4">
            {rules.map((rule) => (
              <motion.div
                key={rule.ruleId}
                whileHover={{ scale: 1.01 }}
                className="bg-white rounded-lg shadow-md p-4 border border-gray-200"
              >
            {editingRule === rule.ruleId ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={editData.title || ''}
                    onChange={(e) => handleEditChange('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={editData.priority || ''}
                    onChange={(e) => handleEditChange('priority', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={editData.status || ''}
                    onChange={(e) => handleEditChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="flex items-center px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    <Save className="w-4 h-4 mr-1" />
                    Save
                  </button>
                  <button
                    onClick={() => setEditingRule(null)}
                    className="flex items-center px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{rule.title}</h3>
                  <div className="flex gap-2 mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      rule.priority === 'high' ? 'bg-red-100 text-red-800' :
                      rule.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {rule.priority}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      rule.status === 'Active' ? 'bg-green-100 text-green-800' :
                      rule.status === 'Draft' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {rule.status}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleView(rule)}
                    className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </button>
                  {(userRole === 'admin' || userRole === 'carrier') && (
                    <button
                      onClick={() => handleEdit(rule)}
                      className="flex items-center px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </button>
                  )}
                  {userRole === 'admin' && (
                    <button
                      onClick={() => handleDelete(rule)}
                      className="flex items-center px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </button>
                  )}
                </div>
              </div>
              )}
            </motion.div>
          ))}
        </div>

        {rules.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No rules found
          </div>
        )}
        </>
      )}

      {activeTab === 'add' && (
        <AddRule 
          onBack={() => setActiveTab('view')}
          onSuccess={handleAddRuleSuccess}
        />
      )}

      {activeTab === 'upload' && (
        <UploadRules />
      )}

      {/* Rule Details Modal */}
      {viewingRule && activeTab === 'view' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Rule Details</h3>
              <button
                onClick={() => setViewingRule(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-3">
              <div><strong>ID:</strong> {viewingRule.ruleId}</div>
              <div><strong>Title:</strong> {viewingRule.title}</div>
              <div><strong>Description:</strong> {viewingRule.description || 'N/A'}</div>
              <div><strong>Priority:</strong> {viewingRule.priority}</div>
              <div><strong>Outcome:</strong> {viewingRule.outcome || 'N/A'}</div>
              <div><strong>Carrier:</strong> {viewingRule.carrier || 'N/A'}</div>
              <div><strong>Product:</strong> {viewingRule.product || 'N/A'}</div>
              <div><strong>Prior Claims Allowed:</strong> {viewingRule.priorClaimsAllowed || 'N/A'}</div>
              <div><strong>Prior Claims Threshold:</strong> {viewingRule.priorClaimsThreshold || 'N/A'}</div>
              <div><strong>Created:</strong> {new Date(viewingRule.createdAt).toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default RuleLibrary;