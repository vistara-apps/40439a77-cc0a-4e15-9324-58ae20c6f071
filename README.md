# TradeDuel - Paper Trading Challenges on Base

A social-native paper trading platform built with Next.js, OnchainKit, and Farcaster MiniKit.

## Features

- 🎯 Paper trading with real-time market data
- ⚔️ 1v1 challenge mode for head-to-head competition
- 👥 Group battle mode for team competitions
- 🏆 Onchain reputation and leaderboards
- 🔗 Farcaster Frame integration for social sharing
- 💰 Gas-sponsored transactions via OnchainKit

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` file:
```bash
cp .env.local.example .env.local
```

3. Add your OnchainKit API key to `.env.local`

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Blockchain**: Base (L2 on Ethereum)
- **Wallet**: OnchainKit + Coinbase Wallet
- **Social**: Farcaster MiniKit
- **Styling**: Tailwind CSS
- **TypeScript**: Full type safety

## Project Structure

```
app/
├── layout.tsx          # Root layout with providers
├── page.tsx            # Main landing page
├── providers.tsx       # OnchainKit + React Query providers
└── globals.css         # Global styles with BASE theme

components/
├── Header.tsx          # Navigation header
├── Hero.tsx            # Hero section
├── Features.tsx        # Features grid
├── ChallengeSection.tsx # Challenge modes
└── ConnectWallet.tsx   # Wallet connection button

public/
└── .well-known/
    └── farcaster.json  # Farcaster manifest
```

## Deployment

Deploy to Vercel:

```bash
npm run build
```

Make sure to set environment variables in your deployment platform.

## License

MIT
