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

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-gradient-to-br from-purple-900/95 via-indigo-900/95 to-blue-900/95 backdrop-blur-xl border-2 border-white/20 rounded-3xl p-8 max-w-md w-full"
        >
          {/* Modal Header */}
          <div className="text-center mb-6">
            <motion.h2
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-3xl font-bold text-white mb-2"
            >
              🔍 Order Preview
            </motion.h2>
            <motion.p
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-gray-300 text-sm"
            >
              Review your limit order before submission
            </motion.p>
          </div>

          {/* Order Details */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-4 mb-6"
          >
            <div className="bg-black/30 rounded-xl p-4 border border-white/10">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Amount:</span>
                  <span className="text-white font-mono font-bold">{amount} {fromToken.symbol}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Price:</span>
                  <span className="text-cyan-400 font-mono font-bold">{price} {toToken.symbol}/{fromToken.symbol}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Total Value:</span>
                  <span className="text-emerald-400 font-mono font-bold">{getOrderValue()} {toToken.symbol}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Expiration:</span>
                  <span className="text-yellow-400 font-mono font-bold">{expiration}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Expires At:</span>
                  <span className="text-orange-400 font-mono text-xs">{getExpirationDate()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Status:</span>
                  <span className="text-yellow-400 font-mono font-bold">PENDING</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-3"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onConfirm}
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold rounded-xl transition-all duration-300 uppercase tracking-wide text-lg"
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
              className="w-full py-3 bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 text-white font-bold rounded-xl transition-all duration-300 uppercase tracking-wide"
            >
              📝 Edit Order
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}; 