import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Building, Calendar, MapPin } from 'lucide-react';

const UserTooltip = ({ currentUser, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, right: 0 });

  const userDetails = {
    name: currentUser?.username || 'Demo User',
    email: currentUser?.carrierName ? `${currentUser.username}@${currentUser.carrierName.toLowerCase().replace(/\s+/g, '')}.com` : 'demo@example.com',
    company: currentUser?.carrierName || 'Demo Insurance Co.',
    role: currentUser?.username?.includes('admin') ? 'Admin' : (currentUser?.role || 'User'),
    joinDate: 'January 2024',
    location: 'New York, USA',
    lastLogin: 'Just now'
  };

  const handleMouseEnter = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({
      top: rect.bottom + 8,
      right: window.innerWidth - rect.right
    });
    setIsVisible(true);
  };

  return (
    <>
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsVisible(false)}
        className="cursor-pointer"
      >
        {children}
      </div>

      {isVisible && createPortal(
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 z-[99999]"
            style={{ 
              top: position.top,
              right: position.right,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
          >
            {/* Header */}
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-800">{userDetails.name}</h3>
              <p className="text-sm text-gray-600">{userDetails.role}</p>
              <div className="flex items-center space-x-1 mt-1">
                <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-success-600 font-medium">Online</span>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-gray-500">Email</p>
                  <p className="text-gray-800 font-medium">{userDetails.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-sm">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Building className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-gray-500">Company</p>
                  <p className="text-gray-800 font-medium">{userDetails.company}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-sm">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-gray-500">Member since</p>
                  <p className="text-gray-800 font-medium">{userDetails.joinDate}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-sm">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-gray-500">Location</p>
                  <p className="text-gray-800 font-medium">{userDetails.location}</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Last login: <span className="text-gray-700 font-medium">{userDetails.lastLogin}</span>
              </p>
            </div>

            {/* Arrow */}
            <div className="absolute -top-2 right-6 w-4 h-4 bg-white border-l border-t border-gray-200 transform rotate-45"></div>
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

export default UserTooltip;