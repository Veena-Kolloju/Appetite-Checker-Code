import React from 'react';
import { motion } from 'framer-motion';

const PieChart = ({ data, title }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let cumulativePercentage = 0;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      <h3 className="font-semibold mb-4 text-gray-800">{title}</h3>
      <div className="relative w-48 h-48 mx-auto">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const strokeDasharray = `${percentage} ${100 - percentage}`;
            const strokeDashoffset = -cumulativePercentage;
            cumulativePercentage += percentage;

            return (
              <motion.circle
                key={index}
                cx="50"
                cy="50"
                r="15.915"
                fill="transparent"
                stroke={item.color}
                strokeWidth="8"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                initial={{ strokeDasharray: "0 100" }}
                animate={{ strokeDasharray }}
                transition={{ duration: 1, delay: index * 0.2 }}
                className="drop-shadow-sm"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">{total}</div>
            <div className="text-xs text-gray-500">Total</div>
          </div>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        {data.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between text-sm"
          >
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: item.color }}></div>
              <span className="text-gray-700">{item.label}</span>
            </div>
            <span className="font-semibold text-gray-800">{item.value}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const BarChart = ({ data, title }) => {
  const maxValue = Math.max(...data.map(item => item.value));

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      <h3 className="font-semibold mb-4 text-gray-800">{title}</h3>
      <div className="space-y-3">
        {data.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center space-x-3"
          >
            <div className="w-20 text-sm text-gray-600 text-right">{item.label}</div>
            <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: item.color }}
                initial={{ width: 0 }}
                animate={{ width: `${(item.value / maxValue) * 100}%` }}
                transition={{ duration: 1, delay: index * 0.2 }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white">
                {item.value}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const LineChart = ({ data, title }) => {
  const maxValue = Math.max(...data.map(item => item.value));
  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 280;
    const y = 120 - (item.value / maxValue) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      <h3 className="font-semibold mb-4 text-gray-800">{title}</h3>
      <div className="relative">
        <svg className="w-full h-32" viewBox="0 0 280 120">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3"/>
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0"/>
            </linearGradient>
          </defs>
          <motion.polyline
            fill="none"
            stroke="#3B82F6"
            strokeWidth="3"
            points={points}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2 }}
            className="drop-shadow-sm"
          />
          <motion.polygon
            fill="url(#lineGradient)"
            points={`${points} 280,120 0,120`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
          />
          {data.map((item, index) => {
            const x = (index / (data.length - 1)) * 280;
            const y = 120 - (item.value / maxValue) * 100;
            return (
              <motion.circle
                key={index}
                cx={x}
                cy={y}
                r="4"
                fill="#3B82F6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 1.5 + index * 0.1 }}
                className="drop-shadow-sm"
              />
            );
          })}
        </svg>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          {data.map((item, index) => (
            <span key={index}>{item.label}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

const DonutChart = ({ data, title }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let cumulativePercentage = 0;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      <h3 className="font-semibold mb-4 text-gray-800">{title}</h3>
      <div className="relative w-48 h-48 mx-auto">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const strokeDasharray = `${percentage} ${100 - percentage}`;
            const strokeDashoffset = -cumulativePercentage;
            cumulativePercentage += percentage;

            return (
              <motion.circle
                key={index}
                cx="50"
                cy="50"
                r="15.915"
                fill="transparent"
                stroke={item.color}
                strokeWidth="12"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                initial={{ strokeDasharray: "0 100" }}
                animate={{ strokeDasharray }}
                transition={{ duration: 1.5, delay: index * 0.3 }}
                className="drop-shadow-sm"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-xl font-bold text-gray-800">{total}</div>
            <div className="text-xs text-gray-500">Rules</div>
          </div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        {data.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center space-x-1"
          >
            <div className={`w-2 h-2 rounded-full`} style={{ backgroundColor: item.color }}></div>
            <span className="text-gray-600 truncate">{item.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export { PieChart, BarChart, LineChart, DonutChart };