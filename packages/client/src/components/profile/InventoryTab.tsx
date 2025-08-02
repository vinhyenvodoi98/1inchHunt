import * as React from 'react';
import { motion } from 'framer-motion';
import { useAccount, useNetwork } from 'wagmi';
import { 
  fetchPortfolioData, 
  getTokenIcon, 
  getTokenColor, 
  TokenBalance, 
  PortfolioError 
} from '@/lib/1inch/portfolio';

export const InventoryTab: React.FC = () => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const [tokens, setTokens] = React.useState<TokenBalance[]>([]);
  const [totalValue, setTotalValue] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Fetch portfolio data when wallet address or chain changes
  React.useEffect(() => {
    const fetchData = async () => {
      if (!address || !chain?.id) {
        setTokens([]);
        setTotalValue(0);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const portfolioData = await fetchPortfolioData(address, chain.id);
        setTokens(portfolioData.tokens);
        setTotalValue(portfolioData.totalValue);
      } catch (err) {
        const portfolioError = err as PortfolioError;
        setError(portfolioError.message);
        setTokens([]);
        setTotalValue(0);
        console.error('Portfolio fetch error:', portfolioError);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [address, chain?.id]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 font-mono">🧳 Inventory</h2>
          <p className="text-gray-600 font-mono">
            Your token collection {chain && `on ${chain.name}`}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {/* Refresh Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (address && chain?.id) {
                setLoading(true);
                setError(null);
                fetchPortfolioData(address, chain.id)
                  .then((portfolioData) => {
                    setTokens(portfolioData.tokens);
                    setTotalValue(portfolioData.totalValue);
                  })
                  .catch((err) => {
                    const portfolioError = err as PortfolioError;
                    setError(portfolioError.message);
                    setTokens([]);
                    setTotalValue(0);
                  })
                  .finally(() => setLoading(false));
              }
            }}
            disabled={loading || !address || !chain?.id}
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
              }).format(totalValue)}
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
          <p className="text-gray-600 font-mono">Fetching your token balances</p>
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

      {/* Token List */}
      {!loading && !error && (
        <div className="grid gap-4">
          {tokens.map((token, index) => {
            const tokenIcon = getTokenIcon(token.symbol, token.name);
            const tokenColor = getTokenColor(token.symbol, token.name);
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
                    <div className={`w-12 h-12 bg-gradient-to-r ${tokenColor} rounded-xl flex items-center justify-center text-2xl shadow-lg`}>
                      {tokenIcon}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-bold text-gray-800 font-mono">{token.name}</h3>
                        <span className="text-sm text-gray-500 font-mono">{token.symbol}</span>
                      </div>
                      <div className="text-sm text-gray-600 font-mono">
                        {parseFloat(token.balance).toLocaleString(undefined, {
                          maximumFractionDigits: 6,
                        })} {token.symbol}
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

      {/* Empty State (hidden when tokens exist) */}
      {!loading && !error && tokens.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-6xl mb-4">🎒</div>
          <h3 className="text-xl font-bold text-gray-800 font-mono mb-2">Empty Inventory</h3>
          <p className="text-gray-600 font-mono">
            {address ? 'No tokens found in your wallet' : 'Connect your wallet to view tokens'}
          </p>
        </motion.div>
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