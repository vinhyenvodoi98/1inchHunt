import { ConnectButton } from '@rainbow-me/rainbowkit';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const Wallet = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<any>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event: any) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
      }}
    >
      <ConnectButton.Custom>
        {({
          account,
          chain,
          openAccountModal,
          openChainModal,
          openConnectModal,
          authenticationStatus,
          mounted,
        }) => {
          // Note: If your app doesn't use authentication, you
          // can remove all 'authenticationStatus' checks
          const ready = mounted && authenticationStatus !== 'loading';
          const connected =
            ready &&
            account &&
            chain &&
            (!authenticationStatus ||
              authenticationStatus === 'authenticated');

          return (
            <div
              {...(!ready && {
                'aria-hidden': true,
                'style': {
                  opacity: 0,
                  pointerEvents: 'none',
                  userSelect: 'none',
                },
              })}
            >
              {(() => {
                if (!connected) {
                  return (
                    <motion.button
                      onClick={openConnectModal}
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm border border-white/20"
                      style={{
                        boxShadow: '0 0 25px rgba(168, 85, 247, 0.4)',
                      }}
                    >
                      🔗 Connect Wallet
                    </motion.button>
                  );
                }

                if (chain.unsupported) {
                  return (
                    <motion.button
                      onClick={openChainModal}
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm border border-white/20"
                      style={{
                        boxShadow: '0 0 25px rgba(239, 68, 68, 0.4)',
                      }}
                    >
                      ⚠️ Wrong Network
                    </motion.button>
                  );
                }

                return (
                  <div className="flex items-center space-x-3">
                    {/* Chain Button */}
                    <motion.button
                      onClick={openChainModal}
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center px-4 py-2 bg-black/30 backdrop-blur-lg border border-white/20 rounded-xl text-white hover:bg-white/10 transition-all duration-300 shadow-lg"
                      style={{
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                      }}
                    >
                      {chain.hasIcon && (
                        <div
                          className="mr-2 rounded-full overflow-hidden"
                          style={{
                            background: chain.iconBackground,
                            width: 20,
                            height: 20,
                          }}
                        >
                          {chain.iconUrl && (
                            <img
                              alt={chain.name ?? 'Chain icon'}
                              src={chain.iconUrl}
                              style={{ width: 20, height: 20 }}
                            />
                          )}
                        </div>
                      )}
                      <span className="text-sm font-medium">{chain.name}</span>
                    </motion.button>

                    {/* Account Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                      <motion.button
                        onClick={toggleDropdown}
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm border border-white/20"
                        style={{
                          boxShadow: '0 0 20px rgba(245, 158, 11, 0.4)',
                        }}
                        id="dropdown-menu-button"
                        aria-expanded={isOpen ? 'true' : 'false'}
                        aria-haspopup="true"
                      >
                        <div className="mr-3 text-sm font-bold">
                          {account.ensName || account.displayName}
                        </div>
                        <motion.div
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.5 }}
                          className="relative"
                        >
                          {account.ensAvatar ? (
                            <Image
                              src={account.ensAvatar}
                              style={{ borderRadius: '50%' }}
                              width={24}
                              height={24}
                              alt="Account Avatar"
                              className="ring-2 ring-amber-300/50"
                            />
                          ) : (
                            <img
                              src={`https://robohash.org/${account.address}&200x200`}
                              className="w-6 h-6 rounded-full ring-2 ring-amber-300/50"
                              alt="Generated Avatar"
                            />
                          )}
                        </motion.div>
                      </motion.button>

                      {/* Dropdown Menu */}
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 mt-2 w-56 bg-black/30 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl overflow-hidden"
                          style={{
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                          }}
                          role="menu"
                          aria-orientation="vertical"
                          aria-labelledby="dropdown-menu-button"
                          tabIndex={-1}
                        >
                          <div className="p-2 space-y-1">
                            <Link href={`/profile/${account.address}`}>
                              <motion.div
                                whileHover={{ scale: 1.02, x: 5 }}
                                className="flex items-center px-4 py-3 text-white hover:bg-white/10 rounded-xl transition-all duration-300 cursor-pointer"
                              >
                                <span className="mr-3 text-lg">👤</span>
                                <span className="font-medium">Profile</span>
                              </motion.div>
                            </Link>
                            
                            <motion.div
                              whileHover={{ scale: 1.02, x: 5 }}
                              className="flex items-center px-4 py-3 text-white hover:bg-white/10 rounded-xl transition-all duration-300 cursor-pointer"
                              onClick={openAccountModal}
                            >
                              <span className="mr-3 text-lg">🔌</span>
                              <span className="font-medium">Disconnect</span>
                            </motion.div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          );
        }}
      </ConnectButton.Custom>
    </div>
  );
};

export default Wallet;
