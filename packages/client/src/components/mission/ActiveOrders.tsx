import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Token } from './TokenSelector';

export interface LimitOrderType {
  id: string;
  fromToken: Token;
  toToken: Token;
  amount: string;
  price: string;
  type: 'buy' | 'sell';
  status: 'pending' | 'filled' | 'cancelled';
  createdAt: Date;
  expiration: string;
}

interface ActiveOrdersProps {
  orders: LimitOrderType[];
  onCancelOrder: (orderId: string) => void;
  className?: string;
}

export const ActiveOrders: React.FC<ActiveOrdersProps> = ({
  orders,
  onCancelOrder,
  className = '',
}) => {
  if (orders.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`mt-6 ${className}`}
    >
      <h4 className="text-white font-bold mb-3">📋 Active Orders</h4>
      <div className="space-y-2 max-h-40 overflow-y-auto">
        <AnimatePresence>
          {orders.map((order) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="p-3 bg-black/20 border border-white/10 rounded-lg"
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs ${
                  order.status === 'pending' ? 'text-yellow-400' :
                  order.status === 'filled' ? 'text-green-400' :
                  'text-red-400'
                }`}>
                  {order.status.toUpperCase()}
                </span>
              </div>
              <div className="text-xs text-gray-300 mb-2">
                {order.amount} {order.fromToken.symbol} @ {order.price} {order.toToken.symbol}/{order.fromToken.symbol}
              </div>
              <div className="text-xs text-gray-400 mb-2">
                Expires: {order.expiration} • Created: {order.createdAt.toLocaleTimeString()}
              </div>
              {order.status === 'pending' && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onCancelOrder(order.id)}
                  className="w-full py-1 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded transition-all duration-300"
                >
                  Cancel Order
                </motion.button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}; 