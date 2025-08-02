import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig } from "wagmi";
import {
  mainnet,
  arbitrum,
  avalanche,
  bsc,
  gnosis,
  optimism,
  polygon,
  base
} from 'wagmi/chains';
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { publicProvider } from "wagmi/providers/public";

const { chains, publicClient } = configureChains(
  [
    mainnet,
    arbitrum,
    avalanche,
    bsc,
    gnosis,
    optimism,
    polygon,
    base
  ],
  [
    publicProvider(),
    jsonRpcProvider({
      rpc: (chain) => {
        // Custom RPC endpoints for better performance
        switch (chain.id) {
          case mainnet.id:
            return {
              http: mainnet.rpcUrls.default.http[0],
            };
          case arbitrum.id:
            return {
              http: arbitrum.rpcUrls.default.http[0],
            };
          case avalanche.id:
            return {
              http: avalanche.rpcUrls.default.http[0],
            };
          case bsc.id:
            return {
              http: bsc.rpcUrls.default.http[0],
            };
          case gnosis.id:
            return {
              http: gnosis.rpcUrls.default.http[0],
            };
          case optimism.id:
            return {
              http: optimism.rpcUrls.default.http[0],
            };
          case polygon.id:
            return {
              http: polygon.rpcUrls.default.http[0],
            };
          case base.id:
            return {
              http: base.rpcUrls.default.http[0],
            };
          default:
            return null;
        }
      },
    }),
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'HashHunt',
  chains,
  projectId: `${process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID}`,
});

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

export { chains };
