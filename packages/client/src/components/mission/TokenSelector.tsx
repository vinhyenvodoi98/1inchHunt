import * as React from 'react';
import { motion } from 'framer-motion';

export interface Token {
  symbol: string;
  name: string;
  icon: string;
  balance: number;
  decimals: number;
  price: number;
  logo?: string;
}

interface TokenSelectorProps {
  label: string;
  selectedToken: Token;
  onTokenChange: (token: Token) => void;
  availableTokens: Token[];
  disabled?: boolean;
  className?: string;
}

export const TokenSelector: React.FC<TokenSelectorProps> = ({
  label,
  selectedToken,
  onTokenChange,
  availableTokens,
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
        <select
          value={selectedToken.symbol}
          onChange={(e) => {
            const newToken = availableTokens.find(t => t.symbol === e.target.value);
            if (newToken) onTokenChange(newToken);
          }}
          disabled={disabled}
          className="w-full bg-black/30 border-2 border-emerald-500/50 rounded-xl px-4 py-3 text-white font-mono text-lg focus:border-emerald-400 focus:outline-none transition-all duration-300 disabled:opacity-50"
        >
          {availableTokens.map((token) => (
            <option key={token.symbol} value={token.symbol} className="bg-emerald-900">
              {token.icon} {token.symbol} - {token.name}
            </option>
          ))}
        </select>
        <div className="mt-2 text-right text-xs text-gray-400">
          Balance: {selectedToken.balance} {selectedToken.symbol}
        </div>
      </div>
    </motion.div>
  );
}; 