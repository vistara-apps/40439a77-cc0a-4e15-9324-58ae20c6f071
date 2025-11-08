'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import type { CoinType, CoinPrice } from '@/lib/types'

interface TradingChartProps {
  coin: CoinType
  price: CoinPrice
}

export function TradingChart({ coin, price }: TradingChartProps) {
  const [priceHistory, setPriceHistory] = useState<number[]>([])

  useEffect(() => {
    setPriceHistory((prev) => {
      const newHistory = [...prev, price.price]
      return newHistory.slice(-50) // Keep last 50 price points
    })
  }, [price.price])

  const isPositive = price.change24h >= 0

  return (
    <div className="rounded-lg border border-white/10 bg-surface p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-fg">{coin}</h3>
          <p className="text-sm text-fg/60">
            {coin === 'BTC' ? 'Bitcoin' : 'Solana'}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-fg">
            ${price.price.toFixed(2)}
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

      {/* Simple price chart visualization */}
      <div className="relative h-32 w-full">
        <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polyline
            fill="none"
            stroke={isPositive ? 'hsl(140, 60%, 45%)' : 'hsl(0, 70%, 55%)'}
            strokeWidth="2"
            points={priceHistory
              .map((p, i) => {
                const x = (i / (priceHistory.length - 1)) * 100
                const minPrice = Math.min(...priceHistory)
                const maxPrice = Math.max(...priceHistory)
                const y = 100 - ((p - minPrice) / (maxPrice - minPrice || 1)) * 100
                return `${x},${y}`
              })
              .join(' ')}
          />
        </svg>
      </div>
    </div>
  )
}
