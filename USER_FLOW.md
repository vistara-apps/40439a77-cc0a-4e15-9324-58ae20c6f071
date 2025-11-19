# TradeDuel User Flow

## 1. Landing Page
- **URL**: `/`
- **Action**: User arrives at the landing page.
- **Content**:
  - Hero section with "Start Trading" and "Create Challenge" buttons.
  - Features overview.
  - Challenge modes (Solo, 1v1, Group).
  - Global Leaderboard.
- **Navigation**:
  - Click "Start Trading" -> Go to `/trade` (Regular Mode).
  - Click "Create Challenge" -> Go to `/vs` (Challenge Mode).
  - Click "Connect Wallet" -> Connects Farcaster/Coinbase wallet.

## 2. Trading Interface (Regular Mode)
- **URL**: `/trade`
- **Action**: User enters the paper trading session.
- **Initialization**:
  - A new trading session is created in Supabase (`tduel_trading_sessions`).
  - User starts with $10,000 virtual balance.
- **Trading**:
  - **Select Coin**: Choose from BTC, ETH, SOL, etc.
  - **Analyze**: View real-time price chart.
  - **Execute Trade**:
    - Enter amount.
    - Click "Buy" or "Sell".
    - Trade is saved to Supabase (`tduel_trades`).
    - Portfolio and positions update in real-time.
- **End Session**:
  - Click "End Session".
  - Session status updates to `completed`.
  - P&L Summary modal appears.

## 3. Results & Sharing
- **Action**: User views session performance.
- **Content**:
  - Total P&L (Profit/Loss).
  - Percentage gain/loss.
  - Performance badge (e.g., "Legendary Trader").
  - Generated image of results.
- **Share**:
  - Click "Copy Stats" to share text summary on Farcaster.
  - Click "Download" to save the result image.
- **Next Steps**:
  - Click "Start New Session" to trade again.
  - Click "Close" to return to the trading page.

## 4. Leaderboard
- **URL**: `/` (Leaderboard section)
- **Action**: View top traders.
- **Content**:
  - Ranked list of traders by P&L.
  - Shows username, total P&L, and trade count.
