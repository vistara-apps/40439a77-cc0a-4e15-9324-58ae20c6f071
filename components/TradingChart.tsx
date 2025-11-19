'use client'

import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import dynamic from 'next/dynamic'
import type { CoinType, CoinPrice } from '@/lib/types'

// Dynamically import TradingView components to avoid SSR issues
const TradingViewWidget = dynamic(() => import('./TradingViewWidget'), {
  ssr: false,
  loading: () => <div className="h-[300px] bg-surface rounded-lg animate-pulse" />
})

interface TradingChartProps {
  coin: CoinType
  price: CoinPrice
}

export function TradingChart({ coin, price }: TradingChartProps) {
  const isPositive = price.change24h >= 0

  const getCoinName = (coin: CoinType) => {
    switch (coin) {
      case 'BTC':
        return 'Bitcoin'
      case 'SOL':
        return 'Solana'
      case 'ETH':
        return 'Ethereum'
      case 'PUMP':
        return 'Pump.fun'
      case 'DOGE':
        return 'Dogecoin'
      default:
        return coin
    }
  }

  return (
    <div className="rounded-lg border border-white/10 bg-surface p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-fg">{coin}</h3>
          <p className="text-sm text-fg/60">
            {getCoinName(coin)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-fg">
            ${price.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-brand-green' : 'text-brand-red'}`}>
            {isPositive ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            <span>{isPositive ? '+' : ''}{price.change24h.toFixed(2)}%</span>
          </div>
        </div>
      </div>

      {/* TradingView Chart */}
      <div className="relative h-[300px] w-full">
        <TradingViewWidget
          coin={coin}
          theme="dark"
          height={300}
          showDetails={false}
        />
      </div>
    </div>
  )
}
