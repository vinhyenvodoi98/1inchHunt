// Ethereum provider utility for reusable wallet interactions

export interface ProviderError extends Error {
  code?: number;
  message: string;
}

export class ProviderManager {
  private static instance: ProviderManager;
  private provider: any = null;

  private constructor() {}

  public static getInstance(): ProviderManager {
    if (!ProviderManager.instance) {
      ProviderManager.instance = new ProviderManager();
    }
    return ProviderManager.instance;
  }

  /**
   * Get the Ethereum provider
   */
  public getProvider(): any {
    if (!this.provider) {
      this.provider = (window as any).ethereum;
    }
    return this.provider;
  }

  /**
   * Check if provider is available
   */
  public isProviderAvailable(): boolean {
    return !!this.getProvider();
  }

  /**
   * Get the connected account address
   */
  public async getAccount(): Promise<string | null> {
    try {
      const provider = this.getProvider();
      if (!provider) return null;

      const accounts = await provider.request({
        method: 'eth_accounts'
      });
      
      return accounts[0] || null;
    } catch (error) {
      console.error('Error getting account:', error);
      return null;
    }
  }

  /**
   * Request account connection
   */
  public async requestAccount(): Promise<string | null> {
    try {
      const provider = this.getProvider();
      if (!provider) {
        throw new Error('No wallet provider found');
      }

      const accounts = await provider.request({
        method: 'eth_requestAccounts'
      });
      
      return accounts[0] || null;
    } catch (error) {
      console.error('Error requesting account:', error);
      throw error;
    }
  }

  /**
   * Get the current chain ID
   */
  public async getChainId(): Promise<number> {
    try {
      const provider = this.getProvider();
      if (!provider) return 1; // Default to Ethereum mainnet

      const chainId = await provider.request({
        method: 'eth_chainId'
      });
      
      return parseInt(chainId, 16);
    } catch (error) {
      console.error('Error getting chain ID:', error);
      return 1; // Default to Ethereum mainnet
    }
  }

  /**
   * Switch to a specific network
   */
  public async switchNetwork(chainId: number): Promise<void> {
    try {
      const provider = this.getProvider();
      if (!provider) {
        throw new Error('No wallet provider found');
      }

      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }]
      });
    } catch (error) {
      console.error('Error switching network:', error);
      throw error;
    }
  }

  /**
   * Add a new network
   */
  public async addNetwork(networkConfig: {
    chainId: string;
    chainName: string;
    nativeCurrency: {
      name: string;
      symbol: string;
      decimals: number;
    };
    rpcUrls: string[];
    blockExplorerUrls?: string[];
  }): Promise<void> {
    try {
      const provider = this.getProvider();
      if (!provider) {
        throw new Error('No wallet provider found');
      }

      await provider.request({
        method: 'wallet_addEthereumChain',
        params: [networkConfig]
      });
    } catch (error) {
      console.error('Error adding network:', error);
      throw error;
    }
  }

  /**
   * Sign a message
   */
  public async signMessage(message: string): Promise<string> {
    try {
      const provider = this.getProvider();
      if (!provider) {
        throw new Error('No wallet provider found');
      }

      const account = await this.getAccount();
      if (!account) {
        throw new Error('No account connected');
      }

      const signature = await provider.request({
        method: 'personal_sign',
        params: [message, account]
      });

      return signature;
    } catch (error) {
      console.error('Error signing message:', error);
      throw error;
    }
  }

  /**
   * Sign typed data (EIP-712)
   */
  public async signTypedData(
    address: string,
    typedData: {
      types: any;
      primaryType: string;
      domain: any;
      message: any;
    }
  ): Promise<string> {
    try {
      const provider = this.getProvider();
      if (!provider) {
        throw new Error('No wallet provider found');
      }

      const signature = await provider.request({
        method: 'eth_signTypedData_v4',
        params: [
          address,
          JSON.stringify(typedData)
        ]
      });

      return signature;
    } catch (error) {
      console.error('Error signing typed data:', error);
      throw error;
    }
  }

  /**
   * Make a contract call (eth_call)
   */
  public async callContract(
    to: string,
    data: string,
    from?: string
  ): Promise<string> {
    try {
      const provider = this.getProvider();
      if (!provider) {
        throw new Error('No wallet provider found');
      }

      const params: any = {
        to,
        data
      };

      if (from) {
        params.from = from;
      }

      const result = await provider.request({
        method: 'eth_call',
        params: [params]
      });

      return result;
    } catch (error) {
      console.error('Error calling contract:', error);
      throw error;
    }
  }

  /**
   * Send a transaction (eth_sendTransaction)
   */
  public async sendTransaction(
    to: string,
    data: string,
    from: string,
    value?: string,
    gasLimit?: string
  ): Promise<string> {
    try {
      const provider = this.getProvider();
      if (!provider) {
        throw new Error('No wallet provider found');
      }

      const params: any = {
        to,
        data,
        from
      };

      if (value) {
        params.value = value;
      }

      if (gasLimit) {
        params.gasLimit = gasLimit;
      }

      const txHash = await provider.request({
        method: 'eth_sendTransaction',
        params: [params]
      });

      return txHash;
    } catch (error) {
      console.error('Error sending transaction:', error);
      throw error;
    }
  }

  /**
   * Wait for transaction receipt
   */
  public async waitForTransaction(txHash: string, confirmations: number = 1): Promise<any> {
    try {
      const provider = this.getProvider();
      if (!provider) {
        throw new Error('No wallet provider found');
      }

      // Poll for transaction receipt
      let receipt = null;
      let attempts = 0;
      const maxAttempts = 50; // 50 seconds max wait

      while (!receipt && attempts < maxAttempts) {
        try {
          receipt = await provider.request({
            method: 'eth_getTransactionReceipt',
            params: [txHash]
          });

          if (receipt && receipt.blockNumber) {
            // Check confirmations if needed
            if (confirmations > 1) {
              const currentBlock = await provider.request({
                method: 'eth_blockNumber'
              });
              const confirmationsCount = parseInt(currentBlock, 16) - parseInt(receipt.blockNumber, 16);
              
              if (confirmationsCount >= confirmations) {
                break;
              }
            } else {
              break;
            }
          }
        } catch (error) {
          console.warn('Error getting transaction receipt:', error);
        }

        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
        attempts++;
      }

      if (!receipt) {
        throw new Error('Transaction receipt not found after maximum attempts');
      }

      return receipt;
    } catch (error) {
      console.error('Error waiting for transaction:', error);
      throw error;
    }
  }

  /**
   * Get transaction receipt
   */
  public async getTransactionReceipt(txHash: string): Promise<any> {
    try {
      const provider = this.getProvider();
      if (!provider) {
        throw new Error('No wallet provider found');
      }

      const receipt = await provider.request({
        method: 'eth_getTransactionReceipt',
        params: [txHash]
      });

      return receipt;
    } catch (error) {
      console.error('Error getting transaction receipt:', error);
      throw error;
    }
  }

  /**
   * Get gas price
   */
  public async getGasPrice(): Promise<string> {
    try {
      const provider = this.getProvider();
      if (!provider) {
        throw new Error('No wallet provider found');
      }

      const gasPrice = await provider.request({
        method: 'eth_gasPrice'
      });

      return gasPrice;
    } catch (error) {
      console.error('Error getting gas price:', error);
      throw error;
    }
  }

  /**
   * Estimate gas for a transaction
   */
  public async estimateGas(
    to: string,
    data: string,
    from?: string,
    value?: string
  ): Promise<string> {
    try {
      const provider = this.getProvider();
      if (!provider) {
        throw new Error('No wallet provider found');
      }

      const params: any = {
        to,
        data
      };

      if (from) {
        params.from = from;
      }

      if (value) {
        params.value = value;
      }

      const gasEstimate = await provider.request({
        method: 'eth_estimateGas',
        params: [params]
      });

      return gasEstimate;
    } catch (error) {
      console.error('Error estimating gas:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const providerManager = ProviderManager.getInstance();

// Export convenience functions
export const getProvider = () => providerManager.getProvider();
export const isProviderAvailable = () => providerManager.isProviderAvailable();
export const getAccount = () => providerManager.getAccount();
export const requestAccount = () => providerManager.requestAccount();
export const getChainId = () => providerManager.getChainId();
export const switchNetwork = (chainId: number) => providerManager.switchNetwork(chainId);
export const addNetwork = (networkConfig: any) => providerManager.addNetwork(networkConfig);
export const signMessage = (message: string) => providerManager.signMessage(message);
export const signTypedData = (address: string, typedData: any) => providerManager.signTypedData(address, typedData);
export const callContract = (to: string, data: string, from?: string) => providerManager.callContract(to, data, from);
export const sendTransaction = (to: string, data: string, from: string, value?: string, gasLimit?: string) => 
  providerManager.sendTransaction(to, data, from, value, gasLimit);
export const waitForTransaction = (txHash: string, confirmations?: number) => 
  providerManager.waitForTransaction(txHash, confirmations);
export const getTransactionReceipt = (txHash: string) => providerManager.getTransactionReceipt(txHash);
export const getGasPrice = () => providerManager.getGasPrice();
export const estimateGas = (to: string, data: string, from?: string, value?: string) => 
  providerManager.estimateGas(to, data, from, value); 