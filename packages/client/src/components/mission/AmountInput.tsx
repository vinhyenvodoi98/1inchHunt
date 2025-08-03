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
  showMaxButton?: boolean;
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
  showMaxButton = true,
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
        {onMaxClick && showMaxButton && (
          <button
            onClick={onMaxClick}
            disabled={disabled || (maxValue !== undefined && maxValue <= 0)}
            className={`absolute right-2 top-4 px-3 py-1 text-xs font-bold rounded-lg transition-all duration-300 ${
              disabled || (maxValue !== undefined && maxValue <= 0)
                ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                : 'bg-amber-500 hover:bg-amber-400 text-black'
            }`}
            title={maxValue !== undefined && maxValue <= 0 ? 'Insufficient balance' : 'Set to maximum amount'}
          >
            MAX
          </button>
        )}
        {maxValue !== undefined && label.toLowerCase().includes('amount') && (
          <div className="mt-2 text-right text-xs text-gray-400">
            Balance: {maxValue}
          </div>
        )}
      </div>
    </motion.div>
  );
}; 