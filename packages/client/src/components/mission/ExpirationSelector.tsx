import * as React from 'react';
import { motion } from 'framer-motion';

export interface ExpirationOption {
  value: string;
  label: string;
  hours: number;
}

const expirationOptions: ExpirationOption[] = [
  { value: '10m', label: '10 Minutes', hours: 1/6 },
  { value: '1h', label: '1 Hour', hours: 1 },
  { value: '1d', label: '1 Day', hours: 24 },
  { value: '3d', label: '3 Days', hours: 72 },
  { value: '7d', label: '7 Days', hours: 168 },
  { value: '14d', label: '14 Days', hours: 336 },
  { value: '30d', label: '30 Days', hours: 720 },
];

interface ExpirationSelectorProps {
  selectedExpiration: string;
  onExpirationChange: (expiration: string) => void;
  disabled?: boolean;
  className?: string;
}

export const ExpirationSelector: React.FC<ExpirationSelectorProps> = ({
  selectedExpiration,
  onExpirationChange,
  disabled = false,
  className = '',
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className={`mb-4 ${className}`}
    >
      <label className="block text-gray-300 text-sm font-bold mb-2 uppercase tracking-wide">
        ⏰ Expires In
      </label>
      <div className="relative">
        <select
          value={selectedExpiration}
          onChange={(e) => onExpirationChange(e.target.value)}
          disabled={disabled}
          className="w-full bg-black/30 border-2 border-cyan-500/50 rounded-xl px-4 py-3 text-white font-mono text-lg focus:border-cyan-400 focus:outline-none transition-all duration-300 disabled:opacity-50"
        >
          {expirationOptions.map((option) => (
            <option key={option.value} value={option.value} className="bg-emerald-900">
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </motion.div>
  );
}; 