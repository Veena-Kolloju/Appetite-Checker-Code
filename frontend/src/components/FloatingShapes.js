import React from 'react';
import { motion } from 'framer-motion';

const FloatingShapes = () => {
  return (
    <div className="floating-shapes">
      <motion.div
        className="shape w-32 h-32 bg-gradient-to-r from-primary-400 to-accent-400 rounded-full"
        animate={{
          y: [0, -30, 0],
          x: [0, 20, 0],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="shape w-24 h-24 bg-gradient-to-r from-accent-300 to-primary-300 rounded-lg"
        animate={{
          y: [0, 40, 0],
          x: [0, -25, 0],
          rotate: [0, -180, -360],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />
      <motion.div
        className="shape w-20 h-20 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
        animate={{
          y: [0, -25, 0],
          x: [0, 15, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4
        }}
      />
    </div>
  );
};

export default FloatingShapes;