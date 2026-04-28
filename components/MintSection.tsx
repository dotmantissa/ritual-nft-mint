"use client";

import { useAccount, useSwitchChain } from "wagmi";
import { toast } from "react-hot-toast";
import { ritualChain } from "@/lib/chain";
import { useMint } from "@/hooks/useMint";
import { useMintProgress } from "@/hooks/useMintProgress";
import { MAX_SUPPLY, MINT_PRICE_ETH, NFT_CONTRACT_ADDRESS } from "@/lib/contract";

/** MintSection — progress bar, mint button, stats panel */
export function MintSection() {
  const { isConnected, chain } = useAccount();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const isWrongChain = isConnected && chain?.id !== ritualChain.id;

  const { minted, remaining, isSoldOut, progress, isLoading: isProgressLoading, refresh } =
    useMintProgress();

  const { mint, status, txHash, mintedNft, errorMessage, isLoading } = useMint({
    isSoldOut,
    onSuccess: () => {
      // Immediately refresh supply after a mint
      setTimeout(() => refresh(), 3000);
    },
  });

  const downloadMintedNft = async () => {
    if (!mintedNft?.image) return;
    const response = await fetch(mintedNft.image);
    if (!response.ok) throw new Error("Could not download NFT image.");
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = `ritual-genesis-${mintedNft.tokenId}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(objectUrl);
  };

  const xShareUrl = mintedNft
    ? `https://x.com/intent/tweet?text=${encodeURIComponent(
        `I just minted ${mintedNft.name ?? `Ritual Genesis #${mintedNft.tokenId}`} on Ritual Chain.`
      )}&url=${encodeURIComponent(`https://explorer.ritualfoundation.org/address/${NFT_CONTRACT_ADDRESS}`)}`
    : "#";

  return (
    <section id="mint" className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
      <div className="bg-ritual-elevated border border-gray-800 rounded-2xl overflow-hidden shadow-card">
        {/* Top banner */}
        <div className="h-1 w-full bg-gradient-to-r from-ritual-green via-ritual-lime to-ritual-green/30" />

        <div className="p-8 sm:p-10">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            {/* Left: Mint info + button */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <img src="/ritual-logo.jpg" alt="Ritual Logo" className="w-6 h-6 object-contain" />
                <h2 className="font-display text-white text-2xl">Mint Your NFT</h2>
              </div>

              {/* Price + supply grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <StatCard label="Mint Price" value={`${MINT_PRICE_ETH} RITUAL`} accent="green" />
                <StatCard
                  label="Minted"
                  value={isProgressLoading ? "…" : `${minted} / ${MAX_SUPPLY}`}
                  accent={isSoldOut ? "red" : "lime"}
                />
                <StatCard label="Remaining" value={isProgressLoading ? "…" : `${remaining}`} />
                <StatCard label="Per Wallet" value="1 NFT" />
              </div>

              {/* Mint button area */}
              <div className="space-y-3">
                {!isConnected && (
                  <p className="text-sm text-gray-500 mb-2">
                    Connect your wallet to mint.
                  </p>
                )}

                {isWrongChain ? (
                  <button
                    id="switch-chain-btn"
                    onClick={() => switchChain({ chainId: ritualChain.id })}
                    disabled={isSwitching}
                    className="w-full py-4 text-base font-body font-semibold rounded-xl border border-ritual-gold/50 text-ritual-gold hover:bg-ritual-gold/10 transition-all duration-200 disabled:opacity-50"
                  >
                    {isSwitching ? "Switching…" : "⚠ Switch to Ritual Chain"}
                  </button>
                ) : (
                  <button
                    id="mint-btn"
                    onClick={mint}
                    disabled={!isConnected || isSoldOut || isLoading}
                    className={`
                      w-full py-4 text-base font-body font-semibold rounded-xl border
                      transition-all duration-200 relative overflow-hidden
                      ${isSoldOut
                        ? "border-gray-700 text-gray-600 cursor-not-allowed"
                        : isLoading
                        ? "border-ritual-green/40 text-ritual-green/70 cursor-wait"
                        : !isConnected
                        ? "border-gray-700 text-gray-500 cursor-not-allowed"
                        : "border-ritual-green text-ritual-green hover:bg-ritual-green/10 hover:shadow-glow-green active:scale-[0.98]"
                      }
                    `}
                  >
                    {/* Shimmer overlay while loading */}
                    {isLoading && (
                      <span className="absolute inset-0 animate-shimmer pointer-events-none" />
                    )}

                    <span className="relative">
                      {isSoldOut
                        ? "✗ Sold Out"
                        : isLoading
                        ? status === "confirming"
                          ? "⟳ Confirming…"
                          : "⟳ Minting…"
                        : status === "success"
                        ? "✓ Minted! Mint Another"
                        : "Mint NFT →"}
                    </span>
                  </button>
                )}

                {/* Transaction hash link */}
                {txHash && (
                  <a
                    href={`https://explorer.ritualfoundation.org/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center text-xs font-mono text-gray-500 hover:text-ritual-green transition-colors truncate"
                  >
                    TX: {txHash.slice(0, 20)}…{txHash.slice(-8)} ↗
                  </a>
                )}

                {/* Error message */}
                {errorMessage && status === "error" && (
                  <div
                    role="alert"
                    className="flex items-start gap-2 p-3 bg-red-500/5 border border-red-500/20 rounded-lg text-sm text-red-400"
                  >
                    <span className="mt-0.5">✗</span>
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Post-mint NFT preview */}
                {mintedNft && status === "success" && (
                  <div className="mt-4 p-4 bg-black/30 border border-ritual-green/30 rounded-xl space-y-4">
                    <p className="text-sm font-semibold text-ritual-green">Your Minted NFT</p>

                    {mintedNft.image ? (
                      <img
                        src={mintedNft.image}
                        alt={mintedNft.name ?? `Ritual Genesis #${mintedNft.tokenId}`}
                        className="w-full max-w-sm rounded-lg border border-gray-800"
                      />
                    ) : (
                      <div className="w-full max-w-sm aspect-square rounded-lg border border-gray-800 bg-black/40 flex items-center justify-center text-gray-500">
                        Image unavailable
                      </div>
                    )}

                    <div>
                      <p className="text-white font-semibold">
                        {mintedNft.name ?? `Ritual Genesis #${mintedNft.tokenId}`}
                      </p>
                      <p className="text-xs text-gray-500 font-mono">Token ID: {mintedNft.tokenId}</p>
                    </div>

                    {mintedNft.attributes.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-xs uppercase tracking-wide text-gray-500">Traits</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {mintedNft.attributes.map((trait) => (
                            <div
                              key={`${trait.trait_type}-${trait.value}`}
                              className="rounded-lg border border-gray-800 bg-black/40 px-3 py-2"
                            >
                              <p className="text-[11px] text-gray-500">{trait.trait_type}</p>
                              <p className="text-sm text-gray-200">{trait.value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => {
                          downloadMintedNft().catch(() => {
                            toast.error("Could not download image. Try again in a moment.");
                          });
                        }}
                        disabled={!mintedNft.image}
                        className="px-4 py-2 rounded-lg border border-ritual-green text-ritual-green hover:bg-ritual-green/10 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold"
                      >
                        Download NFT
                      </button>
                      <a
                        href={xShareUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-lg border border-gray-700 text-gray-200 hover:bg-gray-800/40 text-sm font-semibold"
                      >
                        Post on X
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Progress bar */}
            <div>
              <div className="bg-black/40 border border-gray-800 rounded-xl p-6">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      Mint Progress
                    </p>
                    <p className="font-display text-white text-3xl">
                      {isProgressLoading ? (
                        <span className="text-gray-600">…</span>
                      ) : (
                        <>
                          <span style={{ color: "#19D184" }}>{minted}</span>
                          <span className="text-gray-600 text-xl"> / {MAX_SUPPLY}</span>
                        </>
                      )}
                    </p>
                  </div>
                  <p className="text-2xl font-display text-gray-600">
                    {isProgressLoading ? "" : `${Math.round(progress)}%`}
                  </p>
                </div>

                {/* Progress track */}
                <div
                  role="progressbar"
                  aria-valuenow={minted}
                  aria-valuemax={MAX_SUPPLY}
                  aria-label="Mint progress"
                  className="ritual-progress-track"
                >
                  <div
                    className="ritual-progress-fill"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* Sub-labels */}
                <div className="flex justify-between mt-3 text-xs font-mono text-gray-600">
                  <span>0%</span>
                  <span>25%</span>
                  <span>50%</span>
                  <span>75%</span>
                  <span>100%</span>
                </div>

                {/* Auto-refresh indicator */}
                <div className="mt-6 flex items-center gap-2 text-xs text-gray-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-700 animate-pulse" />
                  Auto-refreshes every 30s
                </div>

                {/* Sold-out state */}
                {isSoldOut && (
                  <div className="mt-4 p-3 bg-red-500/5 border border-red-500/20 rounded-lg text-center">
                    <span className="text-sm text-red-400 font-semibold">
                      ✗ Sold Out — All {MAX_SUPPLY} NFTs have been minted
                    </span>
                  </div>
                )}

                {/* Contract info */}
                <div className="mt-6 pt-4 border-t border-gray-800 space-y-2">
                  <InfoRow label="Contract">
                    <a
                      href={`https://explorer.ritualfoundation.org/address/${NFT_CONTRACT_ADDRESS}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs text-gray-500 hover:text-ritual-green transition-colors"
                    >
                      {NFT_CONTRACT_ADDRESS.slice(0, 10)}…
                      {NFT_CONTRACT_ADDRESS.slice(-8)} ↗
                    </a>
                  </InfoRow>
                  <InfoRow label="Network">
                    <span className="font-mono text-xs text-gray-400">Ritual Chain (1979)</span>
                  </InfoRow>
                  <InfoRow label="Standard">
                    <span className="font-mono text-xs text-gray-400">ERC-721</span>
                  </InfoRow>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: "green" | "lime" | "red" | "gold";
}) {
  const colors = {
    green: "text-ritual-green",
    lime: "text-ritual-lime",
    red: "text-red-400",
    gold: "text-ritual-gold",
  };

  return (
    <div className="bg-black/30 border border-gray-800 rounded-xl p-4">
      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{label}</p>
      <p
        className={`font-body font-semibold text-base ${accent ? colors[accent] : "text-gray-300"}`}
      >
        {value}
      </p>
    </div>
  );
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-xs text-gray-600 uppercase tracking-wider">{label}</span>
      {children}
    </div>
  );
}
