# Ritual Genesis — NFT Minting dApp

> 99 unique genesis artifacts forged on **Ritual Chain** (Chain ID 1979) — the first L1 with enshrined AI precompiles.

## ✨ Features

- **Wallet Connection** — MetaMask (injected) + WalletConnect support
- **Mint Button** — calls `mint()` on the ERC-721 contract, handles approval, loading, and result
- **Progress Bar** — live `minted / 99` with smooth fill animation, auto-refreshes every 30s
- **Gallery** — preview grid of minted NFTs with generative placeholder art
- **Toast Notifications** — success / error toasts
- **Chain Guard** — detects wrong network and prompts switch to Ritual Chain
- **Dark-mode UI** — Ritual design system (Archivo Black + Barlow + JetBrains Mono)
- **Error Handling** — user rejection, insufficient funds, sold-out, wrong network

## 🏗 Project Structure

```
ritual-nft-mint/
├── app/
│   ├── layout.tsx          # Root layout — fonts + metadata
│   ├── page.tsx            # Home page composition
│   ├── globals.css         # Ritual design tokens + animations
│   └── providers.tsx       # wagmi + react-query + toast providers
├── components/
│   ├── Header.tsx          # Logo + wallet connect / disconnect
│   ├── HeroSection.tsx     # Collection name + stats
│   ├── MintSection.tsx     # Mint button + progress bar + contract info
│   └── GallerySection.tsx  # NFT preview grid
├── hooks/
│   ├── useMint.ts          # Mint transaction lifecycle
│   └── useMintProgress.ts  # totalSupply() polling (30s interval)
├── lib/
│   ├── chain.ts            # Ritual Chain viem definition
│   ├── wagmi.ts            # wagmi config (injected + WalletConnect)
│   └── contract.ts         # ABI + address + collection constants
├── contracts/
│   ├── src/RitualGenesis.sol   # ERC-721 smart contract
│   ├── script/Deploy.s.sol     # Foundry deploy script
│   └── foundry.toml            # Foundry config for Ritual Chain
├── .env.example            # Environment variable template
└── tailwind.config.ts      # Ritual color tokens + fonts
```

## 🚀 Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
# Your deployed NFT contract address
NEXT_PUBLIC_NFT_CONTRACT=0xYourContractAddress

# Ritual Chain RPC (public endpoint works out of the box)
NEXT_PUBLIC_RPC_URL=https://rpc.ritualfoundation.org

# Optional: WalletConnect project ID
NEXT_PUBLIC_WC_PROJECT_ID=your_project_id
```

### 3. Start the frontend

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📦 Smart Contract Deployment

### Prerequisites
- [Foundry](https://book.getfoundry.sh/getting-started/installation) installed
- Funded wallet on Ritual Chain ([faucet](https://faucet.ritualfoundation.org))
- OpenZeppelin contracts installed

### Deploy

```bash
cd contracts

# Install OpenZeppelin
forge install OpenZeppelin/openzeppelin-contracts

# Create .env with your private key
echo "PRIVATE_KEY=0xYourPrivateKey" > .env
source .env

# Deploy to Ritual Chain
forge script script/Deploy.s.sol:Deploy \
  --rpc-url https://rpc.ritualfoundation.org \
  --broadcast \
  -vvvv
```

Copy the deployed address and set `NEXT_PUBLIC_NFT_CONTRACT` in your frontend `.env.local`.

### Verify on Explorer

```bash
forge verify-contract \
  --chain 1979 \
  --watch \
  --verifier custom \
  --verifier-url "https://rpc.ritualfoundation.org/api/verify" \
  --verifier-api-key unused \
  0xYourContractAddress \
  src/RitualGenesis.sol:RitualGenesis
```

---

## 🔌 Plugging In Real Data

### Real Contract
1. Deploy `RitualGenesis.sol` to Ritual Chain
2. Set `NEXT_PUBLIC_NFT_CONTRACT` in `.env.local`

### Real NFT Images (IPFS)
1. Upload 99 images + metadata JSON files to IPFS (Pinata, NFT.Storage)
2. Call `setBaseURI("ipfs://YourCID/")` on the deployed contract
3. The `tokenURI(tokenId)` function returns `baseURI + tokenId + ".json"`
4. Replace placeholder art in `GallerySection.tsx` with real `<img>` tags

### WalletConnect
1. Get a project ID at [cloud.walletconnect.com](https://cloud.walletconnect.com)
2. Set `NEXT_PUBLIC_WC_PROJECT_ID` in `.env.local`

---

## ⛓ Chain Reference

| Property | Value |
|----------|-------|
| Chain ID | `1979` |
| Currency | `RITUAL` (18 decimals, testnet) |
| RPC HTTP | `https://rpc.ritualfoundation.org` |
| RPC WS | `wss://rpc.ritualfoundation.org/ws` |
| Explorer | `https://explorer.ritualfoundation.org` |
| Faucet | `https://faucet.ritualfoundation.org` |

---

## 🧑‍💻 Key Technical Decisions

### Why `useSendTransaction` instead of `useWriteContract`?

Ritual Chain uses precompile-based execution. `useWriteContract` internally calls `eth_call` (simulation) before sending, which fails on precompile addresses. Using `useSendTransaction` with `encodeFunctionData` skips simulation entirely — this is the **Ritual-safe** pattern for all contract writes.

### Auto-refresh
`useMintProgress` uses wagmi's `refetchInterval: 30_000` on `useReadContract`. Post-mint, we call `refresh()` after a 3-second delay to give the chain time to index the transaction.

### Error parsing
`useMint` parses common wallet errors (user rejection, insufficient funds, sold-out, wrong chain) into human-readable messages. Raw hex errors are never shown to users.
