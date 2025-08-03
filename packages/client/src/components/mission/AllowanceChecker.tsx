import * as React from 'react';
import { motion } from 'framer-motion';
import { useAccount, useContractRead } from 'wagmi';
import { erc20ABI } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { Token } from '@/constant/tokens';
import { checkAndApproveToken } from '@/utils/approval';
import { getLimitOrderV4Domain } from "@1inch/limit-order-sdk";

interface AllowanceCheckerProps {
  fromToken: Token;
  amount: string;
  onAllowanceChecked: (isApproved: boolean) => void;
  disabled?: boolean;
  className?: string;
  chainId?: number;
}

export const AllowanceChecker: React.FC<AllowanceCheckerProps> = ({
  fromToken,
  amount,
  onAllowanceChecked,
  disabled = false,
  className = '',
  chainId = 1, // Default to Ethereum mainnet
}) => {
  const { address } = useAccount();
  const [isApproving, setIsApproving] = React.useState(false);
  const [allowance, setAllowance] = React.useState<bigint>(BigInt(0));
  const [isApproved, setIsApproved] = React.useState(false);

  // Parse amount to wei
  const amountInWei = React.useMemo(() => {
    if (!amount || parseFloat(amount) <= 0) return BigInt(0);
    try {
      return parseUnits(amount, fromToken.decimals);
    } catch {
      return BigInt(0);
    }
  }, [amount, fromToken.decimals]);

  // Get the limit order contract address dynamically
  const limitOrderContractAddress = React.useMemo(() => {
    try {
      const domain = getLimitOrderV4Domain(chainId);
      return domain.verifyingContract;
    } catch {
      // Fallback to a default address if SDK fails
      return '0x111111125421cA6dc452d289314280a0f8842A65';
    }
  }, [chainId]);

  // Read current allowance
  const { data: currentAllowance, refetch: refetchAllowance } = useContractRead({
    address: fromToken.address as `0x${string}`,
    abi: erc20ABI,
    functionName: 'allowance',
    args: [address as `0x${string}`, limitOrderContractAddress as `0x${string}`],
    enabled: !!address && !!fromToken.address && amountInWei > BigInt(0),
    watch: true,
  });

  // Check allowance when it changes
  React.useEffect(() => {
    if (currentAllowance !== undefined) {
      setAllowance(currentAllowance);
      const approved = currentAllowance >= amountInWei;
      setIsApproved(approved);
      onAllowanceChecked(approved);
    }
  }, [currentAllowance, amountInWei, onAllowanceChecked]);

  // Handle approve button click using 1inch SDK
  const handleApprove = async () => {
    if (!address || !fromToken.address || amountInWei <= BigInt(0)) return;
    
    setIsApproving(true);
    
    try {
      // Get the wallet provider
      const provider = (window as any).ethereum;
      if (!provider) {
        throw new Error('No wallet provider found');
      }

      // Use the approval utility function
      await checkAndApproveToken({
        tokenAddress: fromToken.address,
        amount: amount,
        decimals: fromToken.decimals,
        userAddress: address,
        provider: provider,
        chainId: chainId
      });
      
      // Update allowance and approval status
      refetchAllowance();
      setIsApproved(true);
      onAllowanceChecked(true);
      
    } catch (error) {
      console.error('Approval failed:', error);
      // Handle error appropriately
    } finally {
      setIsApproving(false);
    }
  };

  // Format allowance for display
  const formatAllowance = (allowance: bigint) => {
    try {
      return formatUnits(allowance, fromToken.decimals);
    } catch {
      return '0';
    }
  };

  if (!address || !fromToken.address || amountInWei <= BigInt(0)) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`mb-4 ${className}`}
    >
      <div className="bg-black/20 border border-white/10 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-white font-bold text-sm">🔐 Token Allowance</h4>
          {isApproved && (
            <span className="text-green-400 text-xs font-bold">✓ APPROVED</span>
          )}
        </div>
        
        <div className="space-y-2 text-xs text-gray-300">
          <div className="flex justify-between">
            <span>Current Allowance:</span>
            <span className="font-mono">{formatAllowance(allowance)} {fromToken.symbol}</span>
          </div>
          <div className="flex justify-between">
            <span>Required Amount:</span>
            <span className="font-mono">{amount} {fromToken.symbol}</span>
          </div>
        </div>

        {!isApproved && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleApprove}
            disabled={disabled || isApproving}
            className={`w-full mt-3 py-2 px-4 rounded-lg font-bold text-sm transition-all duration-300 ${
              disabled || isApproving
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-500 text-white'
            }`}
          >
            {isApproving ? (
              <div className="flex items-center justify-center space-x-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                />
                <span>Approving...</span>
              </div>
            ) : (
              `Approve ${fromToken.symbol}`
            )}
          </motion.button>
        )}

        {isApproved && (
          <div className="mt-3 p-2 bg-green-500/20 border border-green-500/30 rounded-lg">
            <p className="text-green-400 text-xs text-center">
              ✓ Token approved for limit order
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}; 