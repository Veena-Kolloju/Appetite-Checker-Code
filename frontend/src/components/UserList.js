import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { userService } from '../services/userService';

const UserList = ({ onCreateUser }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const result = await userService.getUsers();
      setUsers(result.data || []);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user.id);
    setEditData({ ...user });
  };

  const handleSave = async () => {
    try {
      await userService.updateUser(editingUser, editData);
      setEditingUser(null);
      setEditData({});
      loadUsers();
      alert('User updated successfully!');
    } catch (err) {
      alert('Failed to update user: ' + err.message);
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Are you sure you want to delete user "${user.name}"?`)) {
      return;
    }

    try {
      await userService.deleteUser(user.id);
      loadUsers();
      alert('User deleted successfully!');
    } catch (err) {
      alert('Failed to delete user: ' + err.message);
    }
  };

  const handleEditChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
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
          <User className="w-6 h-6 text-primary-500 mr-2" />
          <h2 className="text-2xl font-bold">Users ({users.length})</h2>
        </div>
        <button
          onClick={onCreateUser}
          className="flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </button>
      </div>

      <div className="grid gap-4">
        {users.map((user) => (
          <motion.div
            key={user.id}
            whileHover={{ scale: 1.01 }}
            className="bg-white rounded-lg shadow-md p-4 border border-gray-200"
          >
            {editingUser === user.id ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={editData.name || ''}
                      onChange={(e) => handleEditChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={editData.email || ''}
                      onChange={(e) => handleEditChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select
                      value={editData.role || ''}
                      onChange={(e) => handleEditChange('role', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      <option value="carrier">Carrier</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
                    <input
                      type="text"
                      value={editData.organizationName || ''}
                      onChange={(e) => handleEditChange('organizationName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Organization ID</label>
                    <input
                      type="text"
                      value={editData.orgnId || ''}
                      onChange={(e) => handleEditChange('orgnId', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="flex items-center px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingUser(null)}
                    className="flex items-center px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-start">
                <div className="flex-1 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Name</label>
                    <span className="text-lg font-semibold text-gray-900">{user.name}</span>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                    <span className="text-gray-700">{user.email}</span>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Role</label>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                      user.roles?.[0] === 'admin' ? 'bg-red-100 text-red-800' :
                      user.roles?.[0] === 'carrier' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {user.roles?.[0] || 'No Role'}
                    </span>
                  </div>
                  
                  {user.organizationName && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Organization</label>
                      <span className="text-gray-700">{user.organizationName}</span>
                    </div>
                  )}
                  
                  {user.orgnId && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Organization ID</label>
                      <span className="text-gray-700">{user.orgnId}</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(user)}
                    className="flex items-center px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user)}
                    className="flex items-center px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {users.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No users found
        </div>
      )}
    </motion.div>
  );
};

export default UserList;