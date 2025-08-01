import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig } from "wagmi";
import {
    optimismGoerli,
    polygonMumbai,
    goerli
  } from 'wagmi/chains';
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { modeTestnet } from "./customChain";

const { chains, publicClient } = configureChains(
  [
    ...(process.env.NODE_ENV === "development"
      ? [optimismGoerli, polygonMumbai, goerli, modeTestnet]
      : [goerli]),
  ],
  [
    jsonRpcProvider({
      rpc: (chain) => {
        if (chain.id === goerli.id)
          return {
            http: goerli.rpcUrls.public.http[0],
          };

        if (chain.id === polygonMumbai.id)
          return {
            http: polygonMumbai.rpcUrls.public.http[0],
          };

        if (chain.id === optimismGoerli.id)
          return {
            http: optimismGoerli.rpcUrls.public.http[0],
          };

        if (chain.id === modeTestnet.id)
          return {
            http: modeTestnet.rpcUrls.public.http[0],
          };

        return null;
      },
    }),
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'RainbowKit demo',
  chains,
  projectId: `${process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID}`,
});

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

export { chains };
