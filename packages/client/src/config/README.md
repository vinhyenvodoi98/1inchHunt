# Network Configuration

This directory contains the wagmi configuration for 1inchHunt, supporting multiple blockchain networks.

## Supported Networks

### Core Networks (wagmiConfig.ts)
The main configuration includes these essential networks:

- **Ethereum Mainnet** - The main Ethereum blockchain
- **Arbitrum** - Layer 2 scaling solution
- **Avalanche** - High-performance blockchain platform
- **BNB Chain** - Binance Smart Chain
- **Gnosis** - Decentralized infrastructure
- **Optimism** - Layer 2 optimistic rollup
- **Polygon** - Layer 2 scaling solution
- **Base** - Coinbase's Layer 2 network

### Extended Networks (wagmiConfigExtended.ts)
For users who want additional networks, we also support:

- **Polygon zkEVM** - Zero-knowledge rollup
- **Mantle** - Modular Layer 2
- **Linea** - Consensys Layer 2
- **Scroll** - zkEVM Layer 2

## Configuration Files

### wagmiConfig.ts
Main configuration with core networks. Used by default in the application.

```typescript
import { wagmiConfig, chains } from "@/config/wagmiConfig";
```

### wagmiConfigExtended.ts
Extended configuration with additional networks. Can be used for advanced users.

```typescript
import { wagmiConfigExtended, chainsExtended } from "@/config/wagmiConfigExtended";
```

### customChain.ts
Custom chain definitions for networks not included in wagmi's default chains.

## RPC Endpoints

Each network uses optimized RPC endpoints for better performance:

- **Ethereum**: Alchemy demo endpoint
- **Arbitrum**: Official RPC
- **Avalanche**: Official RPC
- **BNB Chain**: Binance RPC
- **Gnosis**: Official RPC
- **Optimism**: Official RPC
- **Polygon**: Official RPC
- **Base**: Official RPC

## Usage

### Default Configuration
The application uses the default configuration with core networks:

```tsx
import { wagmiConfig, chains } from "@/config/wagmiConfig";

<WagmiConfig config={wagmiConfig}>
  <RainbowKitProvider chains={chains}>
    {children}
  </RainbowKitProvider>
</WagmiConfig>
```

### Extended Configuration
To use the extended configuration with additional networks:

```tsx
import { wagmiConfigExtended, chainsExtended } from "@/config/wagmiConfigExtended";

<WagmiConfig config={wagmiConfigExtended}>
  <RainbowKitProvider chains={chainsExtended}>
    {children}
  </RainbowKitProvider>
</WagmiConfig>
```

## Adding New Networks

To add a new network:

1. **Add to wagmi/chains** (if available):
```typescript
import { newNetwork } from 'wagmi/chains';
```

2. **Add custom chain** (if not in wagmi):
```typescript
// In customChain.ts
export const newNetwork = {
  id: 12345,
  name: "New Network",
  network: "new-network",
  // ... other properties
} as Chain;
```

3. **Add RPC endpoint**:
```typescript
// In wagmiConfig.ts
case newNetwork.id:
  return {
    http: "https://rpc.new-network.com",
  };
```

4. **Add to chains array**:
```typescript
const { chains, publicClient } = configureChains(
  [
    // ... existing chains
    newNetwork,
  ],
  // ... providers
);
```

## Network Information

| Network | Chain ID | Native Token | Explorer |
|---------|----------|--------------|----------|
| Ethereum | 1 | ETH | [Etherscan](https://etherscan.io) |
| Arbitrum | 42161 | ETH | [Arbiscan](https://arbiscan.io) |
| Avalanche | 43114 | AVAX | [Snowtrace](https://snowtrace.io) |
| BNB Chain | 56 | BNB | [BscScan](https://bscscan.com) |
| Gnosis | 100 | XDAI | [GnosisScan](https://gnosisscan.io) |
| Optimism | 10 | ETH | [Optimistic Etherscan](https://optimistic.etherscan.io) |
| Polygon | 137 | MATIC | [PolygonScan](https://polygonscan.com) |
| Base | 8453 | ETH | [BaseScan](https://basescan.org) |
| Polygon zkEVM | 1101 | ETH | [PolygonScan](https://zkevm.polygonscan.com) |
| Mantle | 5000 | MNT | [Mantle Explorer](https://explorer.mantle.xyz) |
| Linea | 59144 | ETH | [LineaScan](https://lineascan.build) |
| Scroll | 534352 | ETH | [ScrollScan](https://scrollscan.com) |

## Environment Variables

Make sure to set the following environment variable:

```env
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_project_id
```

You can get a WalletConnect project ID from [WalletConnect Cloud](https://cloud.walletconnect.com/). 