"use client";

import { useReadContract, useWatchBlockNumber } from "wagmi";
import { NFT_ABI, NFT_CONTRACT_ADDRESS, MAX_SUPPLY } from "@/lib/contract";

/**
 * useMintProgress — polls totalSupply() from the NFT contract.
 *
 * - Fetches on mount and every 30 seconds (auto-refresh)
 * - Also exposes a `refresh()` fn for immediate post-mint updates
 */
export function useMintProgress() {
  const {
    data: totalSupply,
    isLoading,
    isError,
    refetch,
  } = useReadContract({
    address: NFT_CONTRACT_ADDRESS,
    abi: NFT_ABI,
    functionName: "totalSupply",
    query: {
      // Auto-refresh every 10 seconds as a fallback
      refetchInterval: 10_000,
      // Show stale data while refetching
      staleTime: 8_000,
    },
  });

  // Keep progress reactive to mints from other wallets by refetching on each new block.
  useWatchBlockNumber({
    onBlockNumber: () => {
      void refetch();
    },
  });

  const minted = totalSupply ? Number(totalSupply) : 0;
  const remaining = MAX_SUPPLY - minted;
  const isSoldOut = minted >= MAX_SUPPLY;
  const progress = Math.min((minted / MAX_SUPPLY) * 100, 100);

  return {
    minted,
    remaining,
    isSoldOut,
    progress,
    isLoading,
    isError,
    refresh: refetch,
  };
}
