import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, Search, Eye, Trash2, X } from 'lucide-react';
import { carrierService } from '../services/carrierService';

const CarrierList = ({ onCreateCarrier }) => {
  const [carriers, setCarriers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [viewingCarrier, setViewingCarrier] = useState(null);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      setUserRole(userData.roles?.[0] || 'user');
    }
  }, []);

  useEffect(() => {
    loadCarriers();
  }, [page]);

  const loadCarriers = async () => {
    try {
      setLoading(true);
      const result = await carrierService.getCarriers(page, 25);
      setCarriers(result.data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (carrier) => {
    try {
      const fullCarrier = await carrierService.getCarrierDetails(carrier.carrierId);
      setViewingCarrier(fullCarrier);
    } catch (err) {
      alert('Failed to load carrier details: ' + err.message);
    }
  };

  const handleDelete = async (carrier) => {
    if (!window.confirm(`Are you sure you want to delete carrier "${carrier.legalName}"?`)) {
      return;
    }

    try {
      await carrierService.deleteCarrier(carrier.carrierId);
      loadCarriers();
      alert('Carrier deleted successfully!');
    } catch (err) {
      alert('Failed to delete carrier: ' + err.message);
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
          <Users className="w-6 h-6 text-primary-500 mr-2" />
          <h2 className="text-2xl font-bold">Carriers</h2>
        </div>
        {userRole === 'admin' && (
          <button
            onClick={onCreateCarrier}
            className="flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Carrier
          </button>
        )}
      </div>

      <div className="grid gap-4">
        {carriers.map((carrier) => (
          <motion.div
            key={carrier.carrierId}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-lg shadow-md p-4 border border-gray-200"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{carrier.legalName}</h3>
                <p className="text-gray-600">{carrier.displayName}</p>
                <p className="text-gray-500 text-sm">{carrier.primaryContactEmail}</p>
                {carrier.country && (
                  <div className="flex gap-2 mt-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {carrier.country}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleView(carrier)}
                    className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </button>
                  {userRole === 'admin' && (
                    <button
                      onClick={() => handleDelete(carrier)}
                      className="flex items-center px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {carriers.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No carriers found
        </div>
      )}

      {/* Carrier Details Modal */}
      {viewingCarrier && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Carrier Details</h3>
              <button
                onClick={() => setViewingCarrier(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-3">
              <div><strong>ID:</strong> {viewingCarrier.carrierId}</div>
              <div><strong>Legal Name:</strong> {viewingCarrier.legalName}</div>
              <div><strong>Display Name:</strong> {viewingCarrier.displayName}</div>
              {viewingCarrier.country && <div><strong>Country:</strong> {viewingCarrier.country}</div>}
              {viewingCarrier.primaryContactName && <div><strong>Primary Contact:</strong> {viewingCarrier.primaryContactName}</div>}
              {viewingCarrier.primaryContactEmail && <div><strong>Email:</strong> {viewingCarrier.primaryContactEmail}</div>}
              {viewingCarrier.primaryContactPhone && <div><strong>Phone:</strong> {viewingCarrier.primaryContactPhone}</div>}
              <div><strong>Created:</strong> {new Date(viewingCarrier.createdAt).toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default CarrierList;