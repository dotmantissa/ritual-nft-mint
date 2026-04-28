import { http, createConfig } from "wagmi";
import { walletConnect } from "wagmi/connectors";
import { ritualChain } from "./chain";

/**
 * wagmi config for Ritual Chain.
 * Supports MetaMask and WalletConnect.
 */
export const wagmiConfig = createConfig({
  chains: [ritualChain],
  connectors: [
    ...(process.env.NEXT_PUBLIC_WC_PROJECT_ID
      ? [walletConnect({ projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID })]
      : []),
  ],
  transports: {
    [ritualChain.id]: http(
      process.env.NEXT_PUBLIC_RPC_URL ?? "https://rpc.ritualfoundation.org"
    ),
  },
});
