import * as React from 'react';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { fetchTransactionHistory } from '@/lib/api/history';
import { 
  TransactionEvent, 
  TransactionHistoryResponse, 
  PortfolioError 
} from '@/lib/api/history';

// Fixed chain list for history selection
const HISTORY_CHAINS = [
  { id: 1, name: 'Ethereum', icon: '🔵' },
  { id: 137, name: 'Polygon', icon: '🟣' },
  { id: 10, name: 'Optimism', icon: '🔴' },
  { id: 42161, name: 'Arbitrum', icon: '🔵' },
  { id: 8453, name: 'Base', icon: '🔵' },
  { id: 56, name: 'BNB Chain', icon: '🟡' },
  { id: 43114, name: 'Avalanche', icon: '🔴' },
  { id: 100, name: 'Gnosis', icon: '🟢' },
];

export const HistoryTab: React.FC = () => {
  const { address } = useAccount();
  const [selectedChain, setSelectedChain] = React.useState(HISTORY_CHAINS[0]); // Default to Ethereum
  const [historyData, setHistoryData] = React.useState<TransactionHistoryResponse | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(1);
  const [limit] = React.useState(20);

  // Fetch transaction history when wallet address or selected chain changes
  React.useEffect(() => {
    const fetchData = async () => {
      if (!address || !selectedChain) {
        setHistoryData(null);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await fetchTransactionHistory(address, selectedChain.id, limit, page);
        setHistoryData(data);
      } catch (err) {
        const portfolioError = err as PortfolioError;
        setError(portfolioError.message);
        setHistoryData(null);
        console.error('History fetch error:', portfolioError);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [address, selectedChain, page, limit]);

  // Format timestamp to readable date
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Format transaction hash for display
  const formatTransactionHash = (hash: string) => {
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };

  // Format fee from smallest native unit
  const formatFee = (feeInSmallestNative: string) => {
    if (!feeInSmallestNative) return null;
    const feeInEth = parseFloat(feeInSmallestNative) / 1e18;
    return feeInEth.toFixed(6);
  };

  // Get transaction type icon and color
  const getTransactionTypeInfo = (type: string) => {
    switch (type.toLowerCase()) {
      case 'swap':
        return { icon: '🔄', color: 'from-blue-400 to-blue-600', label: 'Swap' };
      case 'transfer':
        return { icon: '📤', color: 'from-green-400 to-green-600', label: 'Transfer' };
      case 'approve':
        return { icon: '✅', color: 'from-purple-400 to-purple-600', label: 'Approve' };
      case 'mint':
        return { icon: '🪙', color: 'from-yellow-400 to-yellow-600', label: 'Mint' };
      case 'burn':
        return { icon: '🔥', color: 'from-red-400 to-red-600', label: 'Burn' };
      default:
        return { icon: '📋', color: 'from-gray-400 to-gray-600', label: type };
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600';
      case 'failed':
        return 'text-red-600';
      case 'pending':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-lg border border-purple-200 rounded-2xl p-6 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 font-mono">📜 Transaction History</h2>
          <p className="text-gray-600 font-mono">
            Your recent transactions on {selectedChain.name}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {/* Chain Selector */}
          <div className="relative">
            <select
              value={selectedChain.id}
              onChange={(e) => {
                const chainId = parseInt(e.target.value);
                const chain = HISTORY_CHAINS.find(c => c.id === chainId);
                if (chain) {
                  setSelectedChain(chain);
                  setPage(1); // Reset to first page when changing chains
                }
              }}
              className="px-4 py-2 bg-white border border-gray-200 rounded-xl font-mono text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 pr-8"
            >
              {HISTORY_CHAINS.map((chain) => (
                <option key={chain.id} value={chain.id}>
                  {chain.icon} {chain.name}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              ▼
            </div>
          </div>

          {/* Refresh Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (address && selectedChain) {
                setLoading(true);
                setError(null);
                fetchTransactionHistory(address, selectedChain.id, limit, page)
                  .then((data) => {
                    setHistoryData(data);
                  })
                  .catch((err) => {
                    const portfolioError = err as PortfolioError;
                    setError(portfolioError.message);
                    setHistoryData(null);
                  })
                  .finally(() => setLoading(false));
              }
            }}
            disabled={loading || !address || !selectedChain}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-mono font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '🔄' : '🔄'} Refresh
          </motion.button>

          {/* Transaction Count */}
          {historyData && (
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 text-white">
              <div className="text-sm font-mono opacity-90">Total Transactions</div>
              <div className="text-2xl font-bold font-mono">
                {historyData.total}
              </div>
            </div>
          )}
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
          <h3 className="text-xl font-bold text-gray-800 font-mono mb-2">Loading Transactions...</h3>
          <p className="text-gray-600 font-mono mb-4">Fetching your transaction history</p>
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
          <h3 className="text-xl font-bold text-gray-800 font-mono mb-2">Error Loading History</h3>
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

      {/* Transaction List */}
      {!loading && !error && historyData && historyData.events.length > 0 && (
        <div className="space-y-4">
          {historyData.events.map((transaction: TransactionEvent, index: number) => {
            const typeInfo = getTransactionTypeInfo(transaction.type);
            const formattedValue = parseFloat(transaction.value) > 0 
              ? new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(parseFloat(transaction.value))
              : 'N/A';

            return (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 hover:border-purple-300"
              >
                <div className="flex items-center justify-between">
                  {/* Transaction Info */}
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${typeInfo.color} rounded-xl flex items-center justify-center text-2xl shadow-lg`}>
                      {typeInfo.icon}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-bold text-gray-800 font-mono">{typeInfo.label}</h3>
                        <span className={`text-sm font-mono px-2 py-1 rounded-full ${getStatusColor(transaction.status)} bg-gray-100`}>
                          {transaction.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 font-mono">
                        <span className="mr-2">
                          {transaction.tokenSymbol}: {formattedValue}
                        </span>
                        <span className="text-gray-400">
                          {formatTimestamp(transaction.timestamp)}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 font-mono">
                        Block #{transaction.blockNumber} • 
                        <a 
                          href={`https://etherscan.io/tx/${transaction.transactionHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-700 underline"
                        >
                          {formatTransactionHash(transaction.transactionHash)}
                        </a>
                        {transaction.feeInSmallestNative && (
                          <span className="ml-2">
                            • Fee: {formatFee(transaction.feeInSmallestNative)} ETH
                          </span>
                        )}
                        {transaction.nonce !== undefined && (
                          <span className="ml-2">
                            • Nonce: {transaction.nonce}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Transaction Details */}
                  <div className="text-right">
                    <div className="font-bold text-gray-800 font-mono">{formattedValue}</div>
                    <div className="text-sm text-gray-600 font-mono">
                      {transaction.direction === 'out' ? 'Sent' : 
                        transaction.direction === 'in' ? 'Received' : 
                        transaction.from === address ? 'Sent' : 'Received'}
                    </div>
                    <div className="text-xs text-gray-500 font-mono">
                      {transaction.rating && `Rating: ${transaction.rating}`}
                      {transaction.orderInBlock !== undefined && (
                        <span className="ml-2">• Order: {transaction.orderInBlock}</span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && historyData && historyData.hasMore && (
        <div className="flex justify-center mt-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setPage(page + 1)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-mono font-medium hover:shadow-lg transition-all duration-300"
          >
            📄 Load More
          </motion.button>
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
                Connect your wallet to view your transaction history
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

                                {/* No transactions */}
                      {address && (!historyData || historyData.events.length === 0) && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-center py-12"
                        >
                          <div className="text-6xl mb-4">📜</div>
                          <h3 className="text-xl font-bold text-gray-800 font-mono mb-2">No Transactions</h3>
                          <p className="text-gray-600 font-mono mb-4">
                            No transactions found for this wallet on {selectedChain.name}
                          </p>
                          <div className="text-sm text-gray-500 font-mono">
                            Try selecting a different chain from the dropdown above or check if you have any recent activity
                          </div>
                        </motion.div>
                      )}
        </>
      )}
    </div>
  );
}; 