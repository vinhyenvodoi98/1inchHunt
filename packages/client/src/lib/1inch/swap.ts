import axios from 'axios';
import { 
  SwapParams, 
  SwapTransactionData, 
  OneInchSwapResponse,
  SwapAPIError 
} from './types';
import { getApiHeaders, validateSwapParams, handleApiError } from './utils';

/**
 * Get a swap quote and transaction data from 1inch API
 * @param params - Swap parameters
 * @returns Transaction data compatible with viem's sendTransaction
 */
export async function get1inchSwap(params: SwapParams): Promise<SwapTransactionData> {
  const {
    fromTokenAddress,
    toTokenAddress,
    amount,
    fromAddress,
    slippage
  } = params;

  // Validate all parameters
  validateSwapParams(fromTokenAddress, toTokenAddress, fromAddress, amount, slippage);

  try {
    // Prepare API request
    const url = 'https://api.1inch.dev/swap/v5.2/1/swap';
    const requestParams = {
      src: fromTokenAddress,
      dst: toTokenAddress,
      amount: amount,
      from: fromAddress,
      slippage: slippage.toString(),
      disableEstimate: 'false',
      allowPartialFill: 'false'
    };

    const response = await axios.get<OneInchSwapResponse>(url, {
      params: requestParams,
      headers: getApiHeaders(),
      timeout: 10000 // 10 second timeout
    });

    const data = response.data;

    // Validate response data
    if (!data.tx) {
      throw new SwapAPIError('Invalid response: missing transaction data');
    }

    const { tx } = data;

    // Convert to viem-compatible format
    const transactionData: SwapTransactionData = {
      to: tx.to as `0x${string}`,
      data: tx.data as `0x${string}`,
      value: BigInt(tx.value || '0'),
      gas: BigInt(tx.gas),
      gasPrice: BigInt(tx.gasPrice)
    };

    return transactionData;

  } catch (error: unknown) {
    handleApiError(error, 'swap');
  }
}

/**
 * Get token allowance for 1inch router
 * @param tokenAddress - Token contract address
 * @param ownerAddress - Wallet address
 * @returns Current allowance amount
 */
export async function get1inchAllowance(
  tokenAddress: string,
  ownerAddress: string
): Promise<string> {
  try {
    const url = 'https://api.1inch.dev/swap/v5.2/1/approve/allowance';
    const response = await axios.get(url, {
      params: {
        tokenAddress,
        walletAddress: ownerAddress
      },
      headers: getApiHeaders()
    });

    return response.data.allowance;
  } catch (error: unknown) {
    handleApiError(error, 'allowance check');
  }
}

/**
 * Get approval transaction data for 1inch router
 * @param tokenAddress - Token contract address
 * @param amount - Amount to approve (optional, defaults to unlimited)
 * @returns Transaction data for token approval
 */
export async function get1inchApproval(
  tokenAddress: string,
  amount?: string
): Promise<SwapTransactionData> {
  try {
    const url = 'https://api.1inch.dev/swap/v5.2/1/approve/transaction';
    const requestParams: any = { tokenAddress };
    if (amount) {
      requestParams.amount = amount;
    }

    const response = await axios.get(url, {
      params: requestParams,
      headers: getApiHeaders()
    });

    const { data, to, gasPrice, value } = response.data;

    return {
      to: to as `0x${string}`,
      data: data as `0x${string}`,
      value: BigInt(value || '0'),
      gas: BigInt('100000'), // Standard gas limit for approvals
      gasPrice: BigInt(gasPrice)
    };
  } catch (error: unknown) {
    handleApiError(error, 'approval');
  }
}