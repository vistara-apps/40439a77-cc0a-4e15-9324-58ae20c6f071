# TradeDuel - Paper Trading Dapp Implementation

## Overview

TradeDuel is a comprehensive paper trading dapp built on Base with 3 distinct trading modes. Users can practice trading strategies, compete with friends, and build their reputation without financial risk.

## Features Implemented

### ✅ 1. Wallet Integration
- **OnchainKit Integration**: Full wallet connectivity using Coinbase OnchainKit
- **Wagmi Configuration**: Smart wallet support with Coinbase Wallet
- **User Identity**: Avatar, Name, and Address display with ENS/Basename support
- **Wallet Dropdown**: Easy access to wallet details and disconnect functionality

### ✅ 2. Real-Time Price Data
- **Bitcoin (BTC) & Solana (SOL)**: Live price tracking with simulated market data
- **Price Charts**: Visual price history with 50-point rolling display
- **24h Change**: Percentage change indicators with color-coded trends
- **Auto-Updates**: Prices update every 2 seconds to simulate real-time market conditions

### ✅ 3. Trading Interface
- **Interactive Charts**: Visual price history for both BTC and SOL
- **Trade Panel**: 
  - Buy/Sell tabs with amount input
  - Balance and position tracking
  - Max buy/sell buttons
  - Estimated cost/return calculation
- **Portfolio View**:
  - Total portfolio value
  - Cash balance
  - P&L tracking (absolute and percentage)
  - Open positions with individual P&L

### ✅ 4. Regular Paper Trading Mode (`/trade`)
- **Solo Practice**: Trade at your own pace without competition
- **Starting Balance**: $10,000 default
- **Position Management**: Buy and sell BTC and SOL
- **P&L Tracking**: Real-time profit/loss calculation
- **Trade History**: View recent trades with details
- **Session Management**: Start and end trading sessions
- **P&L Summary**: Modal with detailed session statistics

### ✅ 5. 1v1 Challenge Mode (`/vs`)
- **Opponent Selection**: Enter opponent wallet address
- **Wager System**: Set ETH wager amount
- **Challenge Settings**:
  - Starting balance configuration
  - Max profit goal (auto-end when reached)
  - Max loss limit (auto-end when exceeded)
  - Time duration (countdown timer)
- **Live Trading**: Full trading interface during active challenge
- **Win Conditions**: Multiple ways to win (profit goal, time limit, opponent loses max)
- **Progress Indicators**: Visual bars showing progress toward goals

### ✅ 6. Group Battle Mode (`/battle`)
- **Community Competition**: Create battles for NFT communities or trading guilds
- **Prize Pool**: Configure prizes for 1st, 2nd, and 3rd place
- **Live Leaderboard**: 
  - Real-time ranking updates
  - P&L display for all participants
  - Crown/medal icons for top 3
  - Highlighted user position
- **Group Settings**: Name your battle and set rules
- **Same Trading Interface**: Full BTC/SOL trading capabilities
- **Rank Tracking**: Automatic position updates based on P&L

### ✅ 7. Challenge Settings Component
- **Configurable Parameters**:
  - Starting Balance (default: $10,000)
  - Max Profit Goal (optional)
  - Max Loss Limit (optional)
  - Duration in minutes (optional)
- **Validation**: Input validation for all settings
- **Preview**: Rules display before starting challenges

### ✅ 8. P&L Image Generation
- **Canvas-Based**: HTML5 Canvas for image generation
- **Branded Graphics**: TradeDuel branding with Base theme
- **Session Statistics**:
  - P&L amount and percentage
  - Starting and final balance
  - Total trades count
  - Session duration
- **Download Functionality**: One-click download as PNG
- **Shareable**: Perfect for social media sharing

## Technical Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Web3**: 
  - OnchainKit 0.38.19
  - Wagmi 2.14.11
  - Viem 2.27.2
- **State Management**: React Hooks
- **Icons**: Lucide React
- **Blockchain**: Base (Coinbase L2)
- **Farcaster**: Miniapp SDK integration

## File Structure

```
/workspace
├── app/
│   ├── trade/page.tsx          # Regular paper trading
│   ├── vs/page.tsx              # 1v1 Challenge mode
│   ├── battle/page.tsx          # Group Battle mode
│   ├── page.tsx                 # Landing page
│   ├── layout.tsx               # Root layout
│   ├── providers.tsx            # Wagmi + OnchainKit providers
│   └── globals.css              # Global styles
├── components/
│   ├── TradingChart.tsx         # Price chart component
│   ├── TradePanel.tsx           # Buy/Sell interface
│   ├── Portfolio.tsx            # Portfolio display
│   ├── PLSummary.tsx            # P&L summary modal
│   ├── ChallengeSettings.tsx   # Settings configuration
│   ├── Hero.tsx                 # Landing page hero
│   ├── Features.tsx             # Features section
│   ├── ChallengeSection.tsx    # Mode selection
│   ├── Header.tsx               # Navigation header
│   └── ConnectWallet.tsx        # Wallet button
├── lib/
│   ├── types.ts                 # TypeScript interfaces
│   └── hooks/
│       ├── usePrices.ts         # Price data hook
│       └── useTradingSession.ts # Trading logic hook
└── package.json
```

## Key Components

### useTradingSession Hook
Manages all trading logic including:
- Position tracking (buy/sell)
- Balance management
- P&L calculation
- Trade history
- Session lifecycle

### usePrices Hook
Provides real-time price simulation:
- BTC and SOL price tracking
- Simulated price movements (±0.1-0.15%)
- 2-second update interval
- 24h change tracking

### Trading Interface
Reusable across all modes:
- Coin selection (BTC/SOL tabs)
- Price charts with history
- Trade execution panel
- Portfolio overview
- Recent trades list

## Routes

1. **`/`** - Landing page with mode selection
2. **`/trade`** - Regular paper trading
3. **`/vs`** - 1v1 Challenge mode
4. **`/battle`** - Group Battle mode

## Usage

### Starting Regular Trading
1. Connect wallet
2. Click "Start Trading" or navigate to `/trade`
3. Select BTC or SOL
4. Enter amount and click Buy/Sell
5. View portfolio and P&L updates
6. End session to view summary and download P&L image

### Creating a 1v1 Challenge
1. Connect wallet
2. Navigate to `/vs`
3. Enter opponent address
4. Set wager amount
5. Configure challenge settings (optional)
6. Start challenge
7. Trade against opponent
8. Winner determined by profit goal, time limit, or loss limit

### Starting a Group Battle
1. Connect wallet
2. Navigate to `/battle`
3. Enter group/community name
4. Configure prize pool (1st, 2nd, 3rd place)
5. Set battle duration and rules
6. Start battle
7. Compete on live leaderboard
8. Top 3 traders win prizes

## Future Enhancements

Potential additions for production:
- Real price data from CoinGecko/CoinMarketCap API
- Backend for challenge coordination
- Smart contracts for wager escrow
- NFT badges for achievements
- Historical session tracking
- Social sharing integration
- Mobile responsive improvements
- More coins (ETH, MATIC, etc.)

## Testing

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Start production server
npm start
```

## Deployment

The app is deployed on Vercel:
- Production: https://tradeduel-n2dm.vercel.app
- Preview deployments on PR commits

## Notes

- Price data is currently simulated - integrate real API for production
- Wagers and prizes are UI-only - implement smart contracts for real functionality
- Challenges are local - add backend for multiplayer coordination
- All trading is paper (simulated) - no real funds at risk

## License

Built for Base trading competition
