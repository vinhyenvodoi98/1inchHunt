import * as React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { useAccount } from 'wagmi';

import Wallet from '@/components/Providers/wallet';
import { UserLevel } from '@/components/UserLevel';

export default function Header() {
  const router = useRouter();
  const { address } = useAccount();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className='sticky top-0 z-50'
      >
        <div className='px-6 py-4'>
          <motion.div
            className="bg-black/20 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl"
            style={{
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 30px rgba(168, 85, 247, 0.2)',
            }}
          >
            <div className="flex items-center justify-between px-6 py-4">
              {/* Left Side - Brand + Character Info */}
              <div className="flex items-center space-x-6">
                {/* Brand Logo */}
                <motion.div 
                  className="flex items-center space-x-4 cursor-pointer group"
                  onClick={() => router.push('/')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  title="Go to Home"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.3 }}
                    className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-xl shadow-lg group-hover:shadow-2xl"
                    style={{
                      boxShadow: '0 0 20px rgba(168, 85, 247, 0.4)',
                    }}
                  >
                    🏰
                  </motion.div>

                  <motion.h1
                    whileHover={{ scale: 1.05 }}
                    className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
                  >
                    1inchHunt
                  </motion.h1>
                </motion.div>

                {/* Character Avatar + Stats */}
                <div className="hidden lg:flex items-center space-x-4 border-l border-white/20 pl-6">
                  <UserLevel 
                    showLevelUpButton={true}
                    compact={false}
                  />
                </div>
              </div>

              {/* Right Side - Health/Mana + Actions */}
              <div className="flex items-center space-x-4">
                {/* Health and Mana - Hidden on small screens */}
                <div className="hidden xl:flex items-center space-x-2">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="px-3 py-2 bg-green-600/80 text-white rounded-lg font-medium backdrop-blur-sm text-sm"
                  >
                    💚 100%
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="px-3 py-2 bg-blue-600/80 text-white rounded-lg font-medium backdrop-blur-sm text-sm"
                  >
                    💙 85%
                  </motion.div>
                </div>

                {/* Notifications */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
                  style={{
                    boxShadow: '0 0 15px rgba(59, 130, 246, 0.3)',
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"
                  />
                </motion.button>

                {/* Wallet Connection */}
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <Wallet />
                </motion.div>

                {/* Mobile Menu Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="md:hidden w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg"
                  style={{
                    boxShadow: '0 0 15px rgba(245, 158, 11, 0.3)',
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h7"
                    />
                  </svg>
                </motion.button>
              </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="md:hidden border-t border-white/10 bg-black/10 backdrop-blur-sm"
              >
                <div className="p-4 space-y-2">
                  {/* Mobile Character Info */}
                  <div className="lg:hidden flex items-center space-x-4 mb-4 pb-4 border-b border-white/10">
                    <UserLevel 
                      showLevelUpButton={true}
                      compact={true}
                    />
                  </div>

                  {/* Mobile Navigation */}
                  {['Home', 'Quests', 'Inventory', 'Leaderboard'].map((item, index) => (
                    <motion.button
                      key={item}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 10 }}
                      className="block w-full text-left px-4 py-3 text-white hover:text-purple-300 rounded-lg hover:bg-white/10 transition-all duration-300 font-medium"
                    >
                      {item}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Floating Particles Effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-purple-400 rounded-full opacity-20"
              animate={{
                y: [0, -50, 0],
                x: [0, Math.random() * 30 - 15, 0],
                opacity: [0, 0.3, 0],
              }}
              transition={{
                duration: 2 + Math.random() * 1,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
      </motion.header>


    </>
  );
}
