import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Database, LogIn, UserPlus, Sparkles, Shield, Zap } from 'lucide-react';
import ParticleBackground from '../components/ParticleBackground';
import LoginForm from '../components/LoginForm';
import RegistrationForm from '../components/RegistrationForm';
import Chatbot from '../components/Chatbot';

const AuthPage = () => {
  const [currentView, setCurrentView] = useState('options'); // 'options', 'login', 'register'
  const navigate = useNavigate();

  const handleLogin = (formData) => {
    // Store user data (in real app, this would be handled by authentication service)
    localStorage.setItem('currentUser', JSON.stringify({
      username: formData.username,
      type: 'login'
    }));
    navigate('/dashboard');
  };

  const handleRegister = (formData) => {
    // Store user data (in real app, this would be handled by authentication service)
    localStorage.setItem('currentUser', JSON.stringify({
      username: formData.username,
      carrierName: formData.carrierName,
      type: 'registration'
    }));
    navigate('/dashboard');
  };

  const OptionsView = () => (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full max-w-4xl space-y-6"
    >
      {/* Hero Section */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 150, damping: 10 }}
          className="relative mx-auto mb-4"
        >
          <div className="w-20 h-20 bg-gradient-to-r from-primary-500 via-accent-500 to-primary-600 rounded-full flex items-center justify-center mx-auto shadow-2xl">
            <Database className="w-10 h-10 text-white" />
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-2 border-2 border-dashed border-primary-300 rounded-full opacity-30"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-black mb-3">
            <span className="bg-gradient-to-r from-gray-800 via-primary-700 to-gray-900 bg-clip-text text-transparent animate-gradient bg-300% bg-pos-0">
              Canvas Portal
            </span>
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-lg text-gray-700 font-light mb-3"
          >
            Rule Management System
          </motion.p>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 1, duration: 0.8 }}
            className="h-0.5 bg-gradient-to-r from-primary-600 to-accent-600 rounded-full mx-auto max-w-xs"
          />
        </motion.div>
      </div>

      {/* Features Preview */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="grid grid-cols-3 gap-3 mb-6"
      >
        {[
          { icon: Shield, title: "Secure", desc: "Enterprise-grade" },
          { icon: Zap, title: "Fast", desc: "Lightning-fast" },
          { icon: Sparkles, title: "Smart", desc: "AI-powered" }
        ].map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 + index * 0.2 }}
            whileHover={{ y: -3, scale: 1.02 }}
            className="text-center p-3 bg-white/60 backdrop-blur-lg rounded-xl border border-gray-200/50 shadow-lg"
          >
            <feature.icon className="w-5 h-5 text-primary-600 mx-auto mb-2" />
            <h3 className="font-bold text-gray-800 mb-1 text-sm">{feature.title}</h3>
            <p className="text-xs text-gray-600">{feature.desc}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.button
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.8, type: "spring", stiffness: 100 }}
          whileHover={{ scale: 1.03, y: -3 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setCurrentView('login')}
          className="group relative overflow-hidden bg-gradient-to-r from-primary-500 to-primary-600 text-white py-5 px-6 rounded-2xl shadow-xl hover:shadow-primary-500/25 transition-all duration-500"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10 flex flex-col items-center space-y-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <LogIn className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold mb-1">Login</h3>
              <p className="text-primary-100 text-sm">Access your account</p>
            </div>
          </div>
          <motion.div
            className="absolute inset-0 bg-white/10"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.6 }}
          />
        </motion.button>

        <motion.button
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 2, type: "spring", stiffness: 100 }}
          whileHover={{ scale: 1.03, y: -3 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setCurrentView('register')}
          className="group relative overflow-hidden bg-gradient-to-r from-accent-500 to-accent-600 text-white py-5 px-6 rounded-2xl shadow-xl hover:shadow-accent-500/25 transition-all duration-500"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-accent-600 to-accent-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10 flex flex-col items-center space-y-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <UserPlus className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold mb-1">Register</h3>
              <p className="text-accent-100 text-sm">Create new account</p>
            </div>
          </div>
          <motion.div
            className="absolute inset-0 bg-white/10"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.6 }}
          />
        </motion.button>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary-100/30 via-transparent to-accent-100/30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-200/20 via-transparent to-transparent" />
      </div>
      
      {/* Particle Background */}
      <ParticleBackground />
      
      {/* Floating Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-primary-200/40 to-accent-200/40 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -150, 0],
            y: [0, 100, 0],
            scale: [1.2, 1, 1.2],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5
          }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-accent-200/30 to-primary-200/30 rounded-full blur-3xl"
        />
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <AnimatePresence mode="wait">
          {currentView === 'options' && <OptionsView key="options" />}
          {currentView === 'login' && (
            <LoginForm
              key="login"
              onBack={() => setCurrentView('options')}
              onLogin={handleLogin}
            />
          )}
          {currentView === 'register' && (
            <RegistrationForm
              key="register"
              onBack={() => setCurrentView('options')}
              onRegister={handleRegister}
            />
          )}
        </AnimatePresence>
      </div>
      
      {/* Chatbot */}
      <Chatbot />
      
      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-100/30 to-transparent pointer-events-none" />
    </div>
  );
};

export default AuthPage;