import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNetwork, useSwitchNetwork } from 'wagmi';

interface NetworkSelectorProps {
  className?: string;
}

export const NetworkSelector: React.FC<NetworkSelectorProps> = ({ className = '' }) => {
  const { chain } = useNetwork();
  const { chains, switchNetwork } = useSwitchNetwork();
  const [isOpen, setIsOpen] = useState(false);

  const popularNetworks = [
    { id: 1, name: 'Ethereum', icon: '🔵' },
    { id: 137, name: 'Polygon', icon: '🟣' },
    { id: 10, name: 'Optimism', icon: '🔴' },
    { id: 42161, name: 'Arbitrum', icon: '🔵' },
    { id: 8453, name: 'Base', icon: '🔵' },
    { id: 56, name: 'BNB Chain', icon: '🟡' },
    { id: 43114, name: 'Avalanche', icon: '🔴' },
    { id: 100, name: 'Gnosis', icon: '🟢' },
  ];

  const handleNetworkSwitch = (targetChainId: number) => {
    if (switchNetwork) {
      switchNetwork(targetChainId);
    }
    setIsOpen(false);
  };

  const currentNetwork = popularNetworks.find(n => n.id === chain?.id);
  const currentChain = chains.find((c: any) => c.id === chain?.id);

  return (
    <div className={`relative ${className}`}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center px-4 py-2 bg-black/30 backdrop-blur-lg border border-white/20 rounded-xl text-white hover:bg-white/10 transition-all duration-300 shadow-lg"
        style={{
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        }}
      >
        <span className="mr-2 text-lg">
          {currentNetwork?.icon || '🌐'}
        </span>
        <span className="text-sm font-medium">
          {currentChain?.name || currentNetwork?.name || 'Select Network'}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="ml-2 text-xs"
        >
          ▼
        </motion.span>
      </motion.button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="absolute top-full mt-2 w-64 bg-black/30 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl overflow-hidden z-50"
          style={{
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          }}
        >
          <div className="p-2">
            <div className="text-xs text-gray-400 px-3 py-2 font-medium">
              Popular Networks
            </div>
            {popularNetworks.map((network) => (
              <motion.button
                key={network.id}
                onClick={() => handleNetworkSwitch(network.id)}
                whileHover={{ scale: 1.02, x: 5 }}
                className={`w-full flex items-center px-3 py-2 text-white hover:bg-white/10 rounded-xl transition-all duration-300 ${
                  chain?.id === network.id ? 'bg-white/10' : ''
                }`}
              >
                <span className="mr-3 text-lg">{network.icon}</span>
                <span className="font-medium">{network.name}</span>
                {chain?.id === network.id && (
                  <span className="ml-auto text-green-400">✓</span>
                )}
              </motion.button>
            ))}
            
            <div className="border-t border-white/10 my-2"></div>
            
            <div className="text-xs text-gray-400 px-3 py-2 font-medium">
              All Networks
            </div>
            {chains.map((chainOption: any) => (
              <motion.button
                key={chainOption.id}
                onClick={() => handleNetworkSwitch(chainOption.id)}
                whileHover={{ scale: 1.02, x: 5 }}
                className={`w-full flex items-center px-3 py-2 text-white hover:bg-white/10 rounded-xl transition-all duration-300 ${
                  chain?.id === chainOption.id ? 'bg-white/10' : ''
                }`}
              >
                {chainOption.hasIcon && (
                  <div
                    className="mr-3 rounded-full overflow-hidden"
                    style={{
                      background: chainOption.iconBackground,
                      width: 20,
                      height: 20,
                    }}
                  >
                    {chainOption.iconUrl && (
                      <img
                        alt={chainOption.name ?? 'Chain icon'}
                        src={chainOption.iconUrl}
                        style={{ width: 20, height: 20 }}
                      />
                    )}
                  </div>
                )}
                <span className="font-medium">{chainOption.name}</span>
                {chain?.id === chainOption.id && (
                  <span className="ml-auto text-green-400">✓</span>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}; 