import { useState, useEffect, useCallback } from 'react';
import { 
  providerManager, 
  getAccount, 
  getChainId, 
  getGasPrice, 
  signMessage, 
  callContract,
  sendTransaction,
  waitForTransaction,
  isProviderAvailable
} from '@/utils/provider';

export interface ProviderState {
  isConnected: boolean;
  account: string | null;
  chainId: number | null;
  gasPrice: string | null;
  isProviderAvailable: boolean;
}

export interface ProviderActions {
  connect: () => Promise<string | null>;
  disconnect: () => void;
  signMessage: (message: string) => Promise<string>;
  callContract: (to: string, data: string, from?: string) => Promise<string>;
  sendTransaction: (to: string, data: string, from: string, value?: string, gasLimit?: string) => Promise<string>;
  waitForTransaction: (txHash: string, confirmations?: number) => Promise<any>;
  refreshGasPrice: () => Promise<void>;
  switchNetwork: (chainId: number) => Promise<void>;
}

export const useProvider = (): ProviderState & ProviderActions => {
  const [state, setState] = useState<ProviderState>({
    isConnected: false,
    account: null,
    chainId: null,
    gasPrice: null,
    isProviderAvailable: false,
  });

  // Check provider availability
  useEffect(() => {
    const available = isProviderAvailable();
    setState(prev => ({ ...prev, isProviderAvailable: available }));
  }, []);

  // Get account and chain ID
  const refreshAccountInfo = useCallback(async () => {
    try {
      const account = await getAccount();
      const chainId = await getChainId();
      
      setState(prev => ({
        ...prev,
        isConnected: !!account,
        account,
        chainId,
      }));
    } catch (error) {
      console.error('Error refreshing account info:', error);
      setState(prev => ({
        ...prev,
        isConnected: false,
        account: null,
        chainId: null,
      }));
    }
  }, []);

  // Refresh account info on mount and when provider changes
  useEffect(() => {
    if (state.isProviderAvailable) {
      refreshAccountInfo();
    }
  }, [state.isProviderAvailable, refreshAccountInfo]);

  // Connect wallet
  const connect = useCallback(async (): Promise<string | null> => {
    try {
      const account = await providerManager.requestAccount();
      await refreshAccountInfo();
      return account;
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  }, [refreshAccountInfo]);

  // Disconnect wallet
  const disconnect = useCallback(() => {
    setState(prev => ({
      ...prev,
      isConnected: false,
      account: null,
      chainId: null,
    }));
  }, []);

  // Sign message
  const signMessageAction = useCallback(async (message: string): Promise<string> => {
    if (!state.account) {
      throw new Error('No account connected');
    }
    return await signMessage(message);
  }, [state.account]);

  // Call contract
  const callContractAction = useCallback(async (to: string, data: string, from?: string): Promise<string> => {
    return await callContract(to, data, from || state.account || undefined);
  }, [state.account]);

  // Send transaction
  const sendTransactionAction = useCallback(async (
    to: string, 
    data: string, 
    from: string, 
    value?: string, 
    gasLimit?: string
  ): Promise<string> => {
    return await sendTransaction(to, data, from, value, gasLimit);
  }, []);

  // Wait for transaction
  const waitForTransactionAction = useCallback(async (txHash: string, confirmations?: number): Promise<any> => {
    return await waitForTransaction(txHash, confirmations);
  }, []);

  // Refresh gas price
  const refreshGasPrice = useCallback(async (): Promise<void> => {
    try {
      const gasPrice = await getGasPrice();
      setState(prev => ({ ...prev, gasPrice }));
    } catch (error) {
      console.error('Error fetching gas price:', error);
    }
  }, []);

  // Switch network
  const switchNetwork = useCallback(async (chainId: number): Promise<void> => {
    try {
      await providerManager.switchNetwork(chainId);
      await refreshAccountInfo();
    } catch (error) {
      console.error('Error switching network:', error);
      throw error;
    }
  }, [refreshAccountInfo]);

  // Listen for account changes
  useEffect(() => {
    if (!state.isProviderAvailable) return;

    const provider = providerManager.getProvider();
    
    const handleAccountsChanged = (accounts: string[]) => {
      const account = accounts[0] || null;
      setState(prev => ({
        ...prev,
        isConnected: !!account,
        account,
      }));
    };

    const handleChainChanged = () => {
      refreshAccountInfo();
    };

    const handleDisconnect = () => {
      setState(prev => ({
        ...prev,
        isConnected: false,
        account: null,
        chainId: null,
      }));
    };

    // Add event listeners
    provider.on('accountsChanged', handleAccountsChanged);
    provider.on('chainChanged', handleChainChanged);
    provider.on('disconnect', handleDisconnect);

    // Cleanup
    return () => {
      provider.removeListener('accountsChanged', handleAccountsChanged);
      provider.removeListener('chainChanged', handleChainChanged);
      provider.removeListener('disconnect', handleDisconnect);
    };
  }, [state.isProviderAvailable, refreshAccountInfo]);

  return {
    ...state,
    connect,
    disconnect,
    signMessage: signMessageAction,
    callContract: callContractAction,
    sendTransaction: sendTransactionAction,
    waitForTransaction: waitForTransactionAction,
    refreshGasPrice,
    switchNetwork,
  };
};

// Example usage in a component:
/*
import { useProvider } from '@/hooks/useProvider';

const MyComponent = () => {
  const {
    isConnected,
    account,
    chainId,
    gasPrice,
    isProviderAvailable,
    connect,
    disconnect,
    signMessage,
    callContract,
    sendTransaction,
    waitForTransaction,
    refreshGasPrice,
    switchNetwork,
  } = useProvider();

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      console.error('Failed to connect:', error);
    }
  };

  const handleSignMessage = async () => {
    try {
      const signature = await signMessage('Hello, World!');
      console.log('Signature:', signature);
    } catch (error) {
      console.error('Failed to sign message:', error);
    }
  };

  const handleCallContract = async () => {
    try {
      const result = await callContract(
        '0x1234...', // contract address
        '0x12345678', // function data
        account // from address
      );
      console.log('Contract call result:', result);
    } catch (error) {
      console.error('Failed to call contract:', error);
    }
  };

  return (
    <div>
      {!isConnected ? (
        <button onClick={handleConnect}>Connect Wallet</button>
      ) : (
        <div>
          <p>Connected: {account}</p>
          <p>Chain ID: {chainId}</p>
          <p>Gas Price: {gasPrice}</p>
          <button onClick={handleSignMessage}>Sign Message</button>
          <button onClick={handleCallContract}>Call Contract</button>
          <button onClick={disconnect}>Disconnect</button>
        </div>
      )}
    </div>
  );
};
*/ 