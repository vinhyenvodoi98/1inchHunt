import { useState, useEffect, useCallback } from 'react';

interface TokenInfo {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  logoURI?: string;
  tags?: string[];
}

// Cache for token information
const tokenCache = new Map<string, TokenInfo>();

export const useTokenInfo = (address: string, chainId = 1) => {
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTokenInfo = useCallback(async () => {
    if (!address) return;

    // Check cache first
    const cacheKey = `${chainId}-${address.toLowerCase()}`;
    if (tokenCache.has(cacheKey)) {
      setTokenInfo(tokenCache.get(cacheKey) || null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/token-info?address=${address}&chainId=${chainId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch token info');
      }

      const data = await response.json();
      
      if (data.token) {
        // Cache the token info
        tokenCache.set(cacheKey, data.token);
        setTokenInfo(data.token);
      } else {
        setTokenInfo(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch token info');
      setTokenInfo(null);
    } finally {
      setIsLoading(false);
    }
  }, [address, chainId]);

  useEffect(() => {
    fetchTokenInfo();
  }, [fetchTokenInfo]);

  return {
    tokenInfo,
    isLoading,
    error,
    refetch: fetchTokenInfo,
  };
}; 