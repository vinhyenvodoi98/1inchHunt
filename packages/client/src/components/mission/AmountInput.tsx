import * as React from 'react';
import { motion } from 'framer-motion';

interface AmountInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxValue?: number;
  onMaxClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export const AmountInput: React.FC<AmountInputProps> = ({
  label,
  value,
  onChange,
  placeholder = "0.0",
  maxValue,
  onMaxClick,
  disabled = false,
  className = '',
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className={`mb-4 ${className}`}
    >
      <label className="block text-gray-300 text-sm font-bold mb-2 uppercase tracking-wide">
        {label}
      </label>
      <div className="relative">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full bg-black/30 border-2 border-teal-500/50 rounded-xl px-4 py-3 text-white font-mono text-xl focus:border-teal-400 focus:outline-none transition-all duration-300 disabled:opacity-50"
        />
        {onMaxClick && maxValue && (
          <button
            onClick={onMaxClick}
            disabled={disabled}
            className="absolute right-2 top-2 px-3 py-1 bg-amber-500 hover:bg-amber-400 disabled:bg-gray-500 text-black text-xs font-bold rounded-lg transition-all duration-300"
          >
            MAX
          </button>
        )}
      </div>
    </motion.div>
  );
}; 