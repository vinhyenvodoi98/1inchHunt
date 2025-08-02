import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Token } from './TokenSelector';

interface OrderPreviewProps {
  isVisible: boolean;
  fromToken: Token;
  toToken: Token;
  amount: string;
  price: string;
  expiration: string;
  orderType: 'buy' | 'sell';
  onConfirm: () => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const OrderPreview: React.FC<OrderPreviewProps> = ({
  isVisible,
  fromToken,
  toToken,
  amount,
  price,
  expiration,
  orderType,
  onConfirm,
  onCancel,
  isSubmitting = false,
}) => {
  const getOrderValue = () => {
    if (!amount || !price) return '0';
    return (parseFloat(amount) * parseFloat(price)).toFixed(2);
  };

  const getExpirationDate = () => {
    const now = new Date();
    const hours = parseInt(expiration.replace(/[^0-9]/g, ''));
    const unit = expiration.includes('d') ? 24 : 1;
    const totalHours = hours * unit;
    const expirationDate = new Date(now.getTime() + totalHours * 60 * 60 * 1000);
    return expirationDate.toLocaleString();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6 p-4 bg-black/20 border border-white/10 rounded-xl"
        >
          <h4 className="text-white font-bold mb-3 flex items-center">
            🔍 Order Preview
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-300">Amount:</span>
              <span className="text-white font-mono">{amount} {fromToken.symbol}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Price:</span>
              <span className="text-cyan-400 font-mono">{price} {toToken.symbol}/{fromToken.symbol}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Total Value:</span>
              <span className="text-emerald-400 font-mono">{getOrderValue()} {toToken.symbol}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Expiration:</span>
              <span className="text-yellow-400 font-mono">{expiration}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Expires At:</span>
              <span className="text-orange-400 font-mono text-xs">{getExpirationDate()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Status:</span>
              <span className="text-yellow-400 font-mono">PENDING</span>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onConfirm}
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold rounded-xl transition-all duration-300 uppercase tracking-wide"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  <span>⚡ Creating Order...</span>
                </div>
              ) : (
                '⚔️ Submit Limit Order'
              )}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onCancel}
              disabled={isSubmitting}
              className="w-full py-2 bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 text-white font-bold rounded-xl transition-all duration-300 uppercase tracking-wide"
            >
              📝 Edit Order
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 