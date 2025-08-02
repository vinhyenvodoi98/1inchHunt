import * as React from 'react';
import { motion } from 'framer-motion';
import { useTokenInfo } from '@/hooks/useTokenInfo';

interface TokenDisplayProps {
  address: string;
  chainId?: number;
  showLogo?: boolean;
  showName?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const TokenDisplay: React.FC<TokenDisplayProps> = ({
  address,
  chainId = 1,
  showLogo = true,
  showName = true,
  className = '',
  size = 'md',
}) => {
  const { tokenInfo, isLoading } = useTokenInfo(address, chainId);

  // Common token addresses mapping (fallback)
  const commonTokens: { [key: string]: { symbol: string; name: string; logo?: string } } = {
    '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee': { symbol: 'ETH', name: 'Ethereum', logo: '⟐' },
    '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': { symbol: 'USDC', name: 'USD Coin', logo: '💎' },
    '0xdac17f958d2ee523a2206206994597c13d831ec7': { symbol: 'USDT', name: 'Tether USD', logo: '💎' },
    '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599': { symbol: 'WBTC', name: 'Wrapped Bitcoin', logo: '₿' },
    '0x6b175474e89094c44da98b954eedeac495271d0f': { symbol: 'DAI', name: 'Dai Stablecoin', logo: '🪙' },
    '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984': { symbol: 'UNI', name: 'Uniswap', logo: '🦄' },
    '0x514910771af9ca656af840dff83e8264ecf986ca': { symbol: 'LINK', name: 'Chainlink', logo: '🔗' },
    '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9': { symbol: 'AAVE', name: 'Aave', logo: '🦇' },
    '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2': { symbol: 'WETH', name: 'Wrapped Ether', logo: '⟐' },
    '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0': { symbol: 'MATIC', name: 'Polygon', logo: '🔷' },
    '0xfca59cd816ab1ead66534d82bc21e7515ce441cf': { symbol: 'RARI', name: 'Rarible', logo: '🎨' },
    '0xc52c326331e9ce41f04484d3b5e5648158028804': { symbol: 'ZRX', name: '0x Protocol', logo: '⚡' },
  };

  const getTokenInfo = () => {
    const lowerAddress = address.toLowerCase();
    
    // First check if we have API data
    if (tokenInfo) {
      return {
        symbol: tokenInfo.symbol,
        name: tokenInfo.name,
        logo: tokenInfo.logoURI,
        isCustom: true,
      };
    }
    
    // Fallback to common tokens
    const commonToken = commonTokens[lowerAddress];
    if (commonToken) {
      return {
        symbol: commonToken.symbol,
        name: commonToken.name,
        logo: commonToken.logo,
        isCustom: false,
      };
    }
    
    // Default fallback
    return {
      symbol: 'UNKNOWN',
      name: 'Unknown Token',
      logo: '❓',
      isCustom: false,
    };
  };

  const token = getTokenInfo();
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const logoSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`flex items-center space-x-2 ${className}`}
    >
      {/* Logo */}
      {showLogo && (
        <div className={`flex-shrink-0 ${logoSizeClasses[size]}`}>
          {token.isCustom && token.logo ? (
            <img
              src={token.logo}
              alt={token.symbol}
              className="w-full h-full rounded-full"
              onError={(e) => {
                // Fallback to text if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : (
            <div className={`w-full h-full rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white font-bold ${sizeClasses[size]}`}>
              {token.logo || token.symbol.charAt(0)}
            </div>
          )}
          {/* Fallback text logo */}
          {token.isCustom && token.logo && (
            <div className={`w-full h-full rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white font-bold ${sizeClasses[size]} hidden`}>
              {token.symbol.charAt(0)}
            </div>
          )}
        </div>
      )}

      {/* Symbol and Name */}
      <div className="flex flex-col">
        <span className={`text-white font-bold ${sizeClasses[size]}`}>
          {isLoading ? '...' : token.symbol}
        </span>
        {showName && (
          <span className={`text-gray-400 ${sizeClasses[size]}`}>
            {isLoading ? 'Loading...' : token.name}
          </span>
        )}
      </div>
    </motion.div>
  );
}; 