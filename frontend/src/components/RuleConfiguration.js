import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Search, Trash2 } from 'lucide-react';
import { ruleService } from '../services/ruleService';

const RuleConfiguration = () => {
  const [ruleId, setRuleId] = useState('');
  const [rule, setRule] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGetRule = async () => {
    if (!ruleId.trim()) {
      alert('Please enter a Rule ID');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const result = await ruleService.getRule(ruleId);
      setRule(result);
    } catch (err) {
      setError(err.message);
      setRule(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRule = async () => {
    if (!rule) {
      alert('No rule loaded to delete');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete rule "${rule.title}"?`)) {
      return;
    }

    try {
      setLoading(true);
      await ruleService.deleteRule(rule.ruleId);
      alert('Rule deleted successfully!');
      setRule(null);
      setRuleId('');
      setError('');
    } catch (err) {
      alert('Failed to delete rule: ' + err.message);
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
        <Settings className="w-6 h-6 text-primary-500 mr-2" />
        <h2 className="text-2xl font-bold">Rule Configuration</h2>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
              <label className="block text-lg font-semibold text-gray-800 mb-3">
                🔍 Rule Search
              </label>
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={ruleId}
                    onChange={(e) => setRuleId(e.target.value)}
                    placeholder="Enter Rule ID (e.g., rul-123)"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 font-medium"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <Search className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
                <button
                  onClick={handleGetRule}
                  disabled={loading}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Get Rule
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {rule && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <h3 className="font-bold text-xl text-green-800">Rule Found</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-white rounded-lg p-3 border border-green-200">
                    <span className="text-xs font-semibold text-green-600 uppercase tracking-wide">Rule ID</span>
                    <p className="font-bold text-gray-800">{rule.ruleId}</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-green-200">
                    <span className="text-xs font-semibold text-green-600 uppercase tracking-wide">Title</span>
                    <p className="font-bold text-gray-800">{rule.title}</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-green-200">
                    <span className="text-xs font-semibold text-green-600 uppercase tracking-wide">Priority</span>
                    <p className="font-bold text-gray-800">{rule.priority}</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-green-200">
                    <span className="text-xs font-semibold text-green-600 uppercase tracking-wide">Outcome</span>
                    <p className="font-bold text-gray-800">{rule.outcome || 'N/A'}</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-green-200">
                    <span className="text-xs font-semibold text-green-600 uppercase tracking-wide">Carrier</span>
                    <p className="font-bold text-gray-800">{rule.carrier || 'N/A'}</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-green-200">
                    <span className="text-xs font-semibold text-green-600 uppercase tracking-wide">Product</span>
                    <p className="font-bold text-gray-800">{rule.product || 'N/A'}</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-green-200">
                    <span className="text-xs font-semibold text-green-600 uppercase tracking-wide">Prior Claims Allowed</span>
                    <p className="font-bold text-gray-800">{rule.priorClaimsAllowed || 'N/A'}</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-green-200">
                    <span className="text-xs font-semibold text-green-600 uppercase tracking-wide">Prior Claims Threshold</span>
                    <p className="font-bold text-gray-800">{rule.priorClaimsThreshold || 'N/A'}</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-green-200 md:col-span-2">
                    <span className="text-xs font-semibold text-green-600 uppercase tracking-wide">Description</span>
                    <p className="font-bold text-gray-800">{rule.description || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <button
                    onClick={handleDeleteRule}
                    disabled={loading}
                    className="flex items-center px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                  >
                    <Trash2 className="w-5 h-5 mr-2" />
                    Delete Rule
                  </button>
                </div>
              </div>
            )}

            {loading && (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RuleConfiguration;