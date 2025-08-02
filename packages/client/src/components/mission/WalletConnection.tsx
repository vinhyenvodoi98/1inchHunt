import * as React from 'react';
import { motion } from 'framer-motion';
import { useConnect } from 'wagmi';

interface WalletConnectionProps {
  isConnected: boolean;
  onConnect?: () => void; // Made optional since we handle connection internally
  address?: string;
  className?: string;
}

export const WalletConnection: React.FC<WalletConnectionProps> = ({
  isConnected,
  onConnect,
  address,
  className = '',
}) => {
  const { connect, connectors, isLoading, pendingConnector } = useConnect();

  const handleConnect = () => {
    if (connectors.length > 0) {
      connect({ connector: connectors[0] });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`mb-6 ${className}`}
    >
      <label className="block text-gray-300 text-sm font-bold mb-2 uppercase tracking-wide">
        🔗 Wallet Connection
      </label>
      
      {isConnected ? (
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="p-3 bg-green-500/20 border border-green-400/30 rounded-xl"
        >
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-400 text-sm font-medium">Connected</span>
          </div>
          {address && (
            <p className="text-gray-300 text-xs mt-1 font-mono">
              {address.slice(0, 6)}...{address.slice(-4)}
            </p>
          )}
        </motion.div>
      ) : (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleConnect}
          disabled={isLoading}
          className="w-full p-3 bg-red-500/20 border border-red-400/30 rounded-xl hover:bg-red-500/30 disabled:opacity-50 transition-all duration-300"
        >
          <div className="flex items-center justify-center space-x-2">
            {isLoading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-3 h-3 border border-red-400 border-t-transparent rounded-full"
                />
                <span className="text-red-400 text-sm font-medium">
                  Connecting {pendingConnector?.name}...
                </span>
              </>
            ) : (
              <>
                <div className="w-3 h-3 bg-red-400 rounded-full" />
                <span className="text-red-400 text-sm font-medium">Connect Wallet</span>
              </>
            )}
          </div>
        </motion.button>
      )}
    </motion.div>
  );
}; 