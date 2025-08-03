import { Address, getLimitOrderV4Domain } from "@1inch/limit-order-sdk";
import { parseUnits } from "viem";

// Function to get limit order contract address dynamically
export const getLimitOrderContractAddress = (chainId: number): string => {
  const domain = getLimitOrderV4Domain(chainId);
  return domain.verifyingContract;
};

export interface ApprovalParams {
  tokenAddress: string;
  amount: string;
  decimals: number;
  userAddress: string;
  provider: any;
  chainId: number;
}

export const checkAndApproveToken = async (params: ApprovalParams): Promise<boolean> => {
  const { tokenAddress, amount, decimals, userAddress, provider, chainId } = params;
  
  // Get the limit order contract address dynamically
  const limitOrderContractAddress = getLimitOrderContractAddress(chainId);
  
  try {
    // Parse amount to wei
    const amountInWei = parseUnits(amount, decimals);
    
    // Create contract instance for the token
    const tokenContract = {
      address: tokenAddress as unknown as Address,
      abi: [
        {
          inputs: [
            { name: 'owner', type: 'address' },
            { name: 'spender', type: 'address' }
          ],
          name: 'allowance',
          outputs: [{ name: '', type: 'uint256' }],
          stateMutability: 'view',
          type: 'function'
        },
        {
          inputs: [
            { name: 'spender', type: 'address' },
            { name: 'amount', type: 'uint256' }
          ],
          name: 'approve',
          outputs: [{ name: '', type: 'bool' }],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ]
    };

    // Check current allowance
    const currentAllowance = await provider.request({
      method: 'eth_call',
      params: [{
        to: tokenAddress,
        data: `0xdd62ed3e${userAddress.slice(2).padStart(64, '0')}${limitOrderContractAddress.slice(2).padStart(64, '0')}`
      }]
    });

    const currentAllowanceBigInt = BigInt(currentAllowance);
    
    if (currentAllowanceBigInt < amountInWei) {
      // Approve the necessary amount
      const approveData = `0x095ea7b3${limitOrderContractAddress.slice(2).padStart(64, '0')}${amountInWei.toString(16).padStart(64, '0')}`;
      
      const txHash = await provider.request({
        method: 'eth_sendTransaction',
        params: [{
          to: tokenAddress,
          data: approveData,
          from: userAddress
        }]
      });

      // Wait for transaction confirmation
      await waitForTransaction(txHash, provider);
      
      return true;
    }
    
    return true; // Already approved
  } catch (error) {
    console.error('Approval failed:', error);
    throw error;
  }
};

const waitForTransaction = async (txHash: string, provider: any): Promise<void> => {
  return new Promise((resolve, reject) => {
    const checkTransaction = async () => {
      try {
        const receipt = await provider.request({
          method: 'eth_getTransactionReceipt',
          params: [txHash]
        });
        
        if (receipt) {
          if (receipt.status === '0x1') {
            resolve();
          } else {
            reject(new Error('Transaction failed'));
          }
        } else {
          setTimeout(checkTransaction, 1000);
        }
      } catch (error) {
        reject(error);
      }
    };
    
    checkTransaction();
  });
}; 