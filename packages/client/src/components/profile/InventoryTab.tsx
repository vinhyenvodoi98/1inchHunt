import * as React from 'react';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { fetchAllChainsPortfolioData } from '@/lib/api/portfolioAll';
import { 
  AllChainsPortfolioResponse, 
  PortfolioResponse,
  TokenBalance, 
  PortfolioError 
} from '@/lib/1inch/api';

export const InventoryTab: React.FC = () => {
  const { address } = useAccount();
  const [allChainsData, setAllChainsData] = React.useState<AllChainsPortfolioResponse | null>(null);
  const [selectedChain, setSelectedChain] = React.useState<PortfolioResponse | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Fetch portfolio data for all chains when wallet address changes
  React.useEffect(() => {
    const fetchData = async () => {
      if (!address) {
        setAllChainsData(null);
        setSelectedChain(null);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const portfolioData = await fetchAllChainsPortfolioData(address);
        setAllChainsData(portfolioData);
        
        // Select the chain with the highest value by default
        if (portfolioData.chains.length > 0) {
          const highestValueChain = portfolioData.chains.reduce((max, chain) => 
            chain.totalValue > max.totalValue ? chain : max
          );
          setSelectedChain(highestValueChain);
        }
      } catch (err) {
        const portfolioError = err as PortfolioError;
        setError(portfolioError.message);
        setAllChainsData(null);
        setSelectedChain(null);
        console.error('Portfolio fetch error:', portfolioError);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [address]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 font-mono">🧳 Inventory</h2>
          <p className="text-gray-600 font-mono">
            Your token collection across all chains
            {selectedChain && ` • Currently viewing ${selectedChain.chainName}`}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {/* Chain Selector */}
          {allChainsData && allChainsData.chains.length > 0 && (
            <div className="relative">
              <select
                value={selectedChain?.chainId || ''}
                onChange={(e) => {
                  const chainId = parseInt(e.target.value);
                  const chain = allChainsData.chains.find((c: any) => c.chainId === chainId);
                  setSelectedChain(chain || null);
                }}
                className="px-4 py-2 bg-white border border-gray-200 rounded-xl font-mono text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 pr-8"
              >
                <option value="">Select a chain</option>
                {allChainsData.chains.map((chain: any) => (
                  <option key={chain.chainId} value={chain.chainId}>
                    {chain.chainName} - {chain.tokens.length} tokens (${chain.totalValue.toFixed(2)})
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                ▼
              </div>
            </div>
          )}
          
          {/* Refresh Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (address) {
                setLoading(true);
                setError(null);
                fetchAllChainsPortfolioData(address)
                  .then((portfolioData) => {
                    setAllChainsData(portfolioData);
                    if (portfolioData.chains.length > 0) {
                      const highestValueChain = portfolioData.chains.reduce((max, chain) => 
                        chain.totalValue > max.totalValue ? chain : max
                      );
                      setSelectedChain(highestValueChain);
                    }
                  })
                  .catch((err) => {
                    const portfolioError = err as PortfolioError;
                    setError(portfolioError.message);
                    setAllChainsData(null);
                    setSelectedChain(null);
                  })
                  .finally(() => setLoading(false));
              }
            }}
            disabled={loading || !address}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-mono font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '🔄' : '🔄'} Refresh
          </motion.button>
          
          {/* Total Value */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 text-white">
            <div className="text-sm font-mono opacity-90">Total Value</div>
            <div className="text-2xl font-bold font-mono">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(allChainsData?.totalValue || 0)}
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-4xl mb-4 animate-spin">🔄</div>
          <h3 className="text-xl font-bold text-gray-800 font-mono mb-2">Loading Portfolio...</h3>
          <p className="text-gray-600 font-mono mb-4">Fetching your token balances across all chains</p>
          <div className="flex justify-center space-x-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </motion.div>
      )}

      {/* Error State */}
      {error && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-gray-800 font-mono mb-2">Error Loading Portfolio</h3>
          <p className="text-gray-600 font-mono mb-4">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-mono font-medium hover:shadow-lg transition-all duration-300"
          >
            🔄 Retry
          </motion.button>
        </motion.div>
      )}

      {/* Portfolio Summary */}
      {!loading && !error && allChainsData && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-800 font-mono mb-4">📊 Portfolio Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 font-mono">
                {allChainsData.summary.chainsWithTokens}
              </div>
              <div className="text-sm text-gray-600 font-mono">Active Chains</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 font-mono">
                {allChainsData.summary.totalTokens}
              </div>
              <div className="text-sm text-gray-600 font-mono">Total Tokens</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 font-mono">
                {allChainsData.summary.highestValueChain.chainName}
              </div>
              <div className="text-sm text-gray-600 font-mono">Top Chain</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 font-mono">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(allChainsData.summary.highestValueChain.value)}
              </div>
              <div className="text-sm text-gray-600 font-mono">Top Chain Value</div>
            </div>
          </div>
        </div>
      )}

      {/* Token List */}
      {!loading && !error && selectedChain && (
        <div className="grid gap-4">
          {selectedChain.tokens.map((token: TokenBalance, index: number) => {
            const formattedValue = new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(token.value);

            return (
              <motion.div
                key={token.address}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 hover:border-purple-300"
              >
                <div className="flex items-center justify-between">
                  {/* Token Info */}
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${token.color || 'from-gray-400 to-gray-600'} rounded-xl flex items-center justify-center text-2xl shadow-lg`}>
                      {token.icon || '🪙'}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-bold text-gray-800 font-mono">{token.name}</h3>
                        <span className="text-sm text-gray-500 font-mono">{token.symbol}</span>
                      </div>
                      <div className="text-sm text-gray-600 font-mono">
                        {token.balance && parseFloat(token.balance) > 0 ? (
                          `${parseFloat(token.balance).toLocaleString(undefined, {
                            maximumFractionDigits: 6,
                          })} ${token.symbol}`
                        ) : (
                          `Native ${token.symbol}`
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Value and Change */}
                  <div className="text-right">
                    <div className="font-bold text-gray-800 font-mono">{formattedValue}</div>
                    <div className={`text-sm font-mono ${
                      token.change24h && token.change24h > 0 ? 'text-green-600' : 
                      token.change24h && token.change24h < 0 ? 'text-red-600' : 'text-gray-500'
                    }`}>
                      {token.change24h ? (
                        <>
                          {token.change24h > 0 ? '+' : ''}{token.change24h.toFixed(2)}%
                        </>
                      ) : (
                        'N/A'
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && (
        <>
          {/* No wallet connected */}
          {!address && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">🔗</div>
              <h3 className="text-xl font-bold text-gray-800 font-mono mb-2">Connect Your Wallet</h3>
              <p className="text-gray-600 font-mono mb-4">
                Connect your wallet to view your portfolio across all chains
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-mono font-medium hover:shadow-lg transition-all duration-300"
              >
                🔗 Connect Wallet
              </motion.button>
            </motion.div>
          )}

          {/* No data available */}
          {address && !allChainsData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-gray-800 font-mono mb-2">No Portfolio Data</h3>
              <p className="text-gray-600 font-mono">
                Unable to fetch portfolio data. Please try again later.
              </p>
            </motion.div>
          )}

          {/* No tokens in selected chain */}
          {address && allChainsData && selectedChain && selectedChain.tokens.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">🎒</div>
              <h3 className="text-xl font-bold text-gray-800 font-mono mb-2">Empty Chain</h3>
              <p className="text-gray-600 font-mono mb-4">
                No tokens found on {selectedChain.chainName}
              </p>
              <div className="text-sm text-gray-500 font-mono">
                Try selecting a different chain from the dropdown above
              </div>
            </motion.div>
          )}

          {/* No tokens across all chains */}
          {address && allChainsData && allChainsData.summary.totalTokens === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">🎒</div>
              <h3 className="text-xl font-bold text-gray-800 font-mono mb-2">Empty Portfolio</h3>
              <p className="text-gray-600 font-mono mb-4">
                No tokens found across all supported chains
              </p>
              <div className="text-sm text-gray-500 font-mono">
                Your wallet might be empty or contain unsupported tokens
              </div>
            </motion.div>
          )}
        </>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl font-mono font-medium hover:shadow-lg transition-all duration-300"
        >
          <div className="text-2xl mb-2">💸</div>
          <div>Buy Tokens</div>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl font-mono font-medium hover:shadow-lg transition-all duration-300"
        >
          <div className="text-2xl mb-2">🔄</div>
          <div>Swap Tokens</div>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-xl font-mono font-medium hover:shadow-lg transition-all duration-300"
        >
          <div className="text-2xl mb-2">📊</div>
          <div>View Charts</div>
        </motion.button>
      </div>
    </div>
  );
}; 