import { Address, getLimitOrderV4Domain } from "@1inch/limit-order-sdk";
import { parseUnits } from "viem";
import { callContract, sendTransaction, waitForTransaction } from "./provider";

export const getLimitOrderContractAddress = (chainId: number): string => {
  const domain = getLimitOrderV4Domain(chainId);
  return domain.verifyingContract;
};

export interface ApprovalParams {
  tokenAddress: string;
  amount: string;
  decimals: number;
  userAddress: string;
  chainId: number;
}

export const checkAndApproveToken = async (params: ApprovalParams): Promise<boolean> => {
  const { tokenAddress, amount, decimals, userAddress, chainId } = params;
  const limitOrderContractAddress = getLimitOrderContractAddress(chainId);

  try {
    const amountInWei = parseUnits(amount, decimals);
    
    // Check current allowance using eth_call
    const allowanceData = `0xdd62ed3e${userAddress.slice(2).padStart(64, '0')}${limitOrderContractAddress.slice(2).padStart(64, '0')}`;
    const currentAllowance = await callContract(tokenAddress, allowanceData, userAddress);
    const currentAllowanceBigInt = BigInt(currentAllowance);

    if (currentAllowanceBigInt < amountInWei) {
      // Approve using eth_sendTransaction
      const approveData = `0x095ea7b3${limitOrderContractAddress.slice(2).padStart(64, '0')}${amountInWei.toString(16).padStart(64, '0')}`;
      const txHash = await sendTransaction(tokenAddress, approveData, userAddress);
      await waitForTransaction(txHash);
      return true;
    }
    return true; // Already approved
  } catch (error) {
    console.error('Approval failed:', error);
    throw error;
  }
}; 