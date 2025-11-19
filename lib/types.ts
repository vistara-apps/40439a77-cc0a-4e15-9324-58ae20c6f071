export type CoinType = 'BTC' | 'SOL' | 'ETH' | 'PUMP' | 'DOGE'

export interface CoinPrice {
  symbol: CoinType
  price: number
  change24h: number
  timestamp: number
}

export interface Trade {
  id: string
  coin: CoinType
  type: 'buy' | 'sell'
  amount: number
  price: number
  timestamp: number
}

export interface Position {
  coin: CoinType
  amount: number
  averagePrice: number
  currentPrice: number
  pnl: number
  pnlPercentage: number
}

export interface TradingSession {
  id: string
  mode: 'regular' | 'vs' | 'battle'
  startBalance: number
  currentBalance: number
  startTime: number
  endTime?: number
  trades: Trade[]
  positions: Position[]
  pnl: number
  pnlPercentage: number
}

export interface Challenge {
  id: string
  mode: 'vs' | 'battle'
  creator: string
  participants: string[]
  wager?: number
  prizes?: number[]
  settings: ChallengeSettings
  status: 'pending' | 'active' | 'completed'
  startTime?: number
  endTime?: number
  winner?: string
  leaderboard?: LeaderboardEntry[]
}

export interface ChallengeSettings {
  maxProfitGoal?: number
  maxLoss?: number
  duration?: number // in minutes
  startingBalance: number
}

export interface LeaderboardEntry {
  address: string
  username?: string
  pnl: number
  pnlPercentage: number
  rank: number
}
