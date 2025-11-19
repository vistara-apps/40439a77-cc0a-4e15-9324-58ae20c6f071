'use client'

import { useState } from 'react'
import { ArrowDownUp, Plus, Minus } from 'lucide-react'
import type { CoinType } from '@/lib/types'

interface TradePanelProps {
  coin: CoinType
  price: number
  balance: number
  position?: number
  onTrade: (coin: CoinType, type: 'buy' | 'sell', amount: number) => void
}

export function TradePanel({ coin, price, balance, position = 0, onTrade }: TradePanelProps) {
  const [amount, setAmount] = useState<string>('0.01')
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy')

  const handleTrade = () => {
    const amountNum = parseFloat(amount)
    if (amountNum > 0) {
      onTrade(coin, activeTab, amountNum)
      setAmount('0.01')
    }
  }

  const maxBuy = balance / price
  const maxSell = position

  const estimatedCost = parseFloat(amount) * price

  return (
    <div className="rounded-xl border border-white/10 bg-surface/50 backdrop-blur-xl p-6 shadow-glass">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <ArrowDownUp className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-fg">Trade {coin}</h3>
          <p className="text-xs text-fg/50">Market Order</p>
        </div>
      </div>

      {/* Buy/Sell Tabs */}
      <div className="mb-6 flex p-1 bg-surface-highlight/50 rounded-xl border border-white/5">
        <button
          onClick={() => setActiveTab('buy')}
          className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-bold transition-all duration-200 ${activeTab === 'buy'
              ? 'bg-success text-white shadow-lg shadow-success/20'
              : 'text-fg/60 hover:text-fg hover:bg-white/5'
            }`}
        >
          <Plus className="inline h-4 w-4 mr-1.5" />
          Buy
        </button>
        <button
          onClick={() => setActiveTab('sell')}
          className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-bold transition-all duration-200 ${activeTab === 'sell'
              ? 'bg-danger text-white shadow-lg shadow-danger/20'
              : 'text-fg/60 hover:text-fg hover:bg-white/5'
            }`}
        >
          <Minus className="inline h-4 w-4 mr-1.5" />
          Sell
        </button>
      </div>

      {/* Amount Input */}
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <label className="text-xs font-medium text-fg/70">Amount ({coin})</label>
          <span className="text-xs text-fg/50">
            Available: <span className="text-fg font-medium">{activeTab === 'buy' ? `$${balance.toFixed(2)}` : `${position.toFixed(4)} ${coin}`}</span>
          </span>
        </div>
        <div className="relative group">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            step="0.01"
            min="0"
            max={activeTab === 'buy' ? maxBuy : maxSell}
            className="w-full rounded-xl border border-white/10 bg-surface-highlight px-4 py-3 text-fg placeholder:text-fg/30 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-200 font-mono text-lg"
            placeholder="0.00"
          />
          <button
            onClick={() => setAmount((activeTab === 'buy' ? maxBuy : maxSell).toFixed(4))}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-primary hover:text-accent bg-primary/10 hover:bg-primary/20 px-2 py-1 rounded-md transition-colors"
          >
            MAX
          </button>
        </div>
      </div>

      {/* Estimated Cost */}
      <div className="mb-6 rounded-xl border border-white/5 bg-bg/30 p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-fg/60">Estimated {activeTab === 'buy' ? 'Cost' : 'Return'}</span>
          <span className="font-mono font-semibold text-fg">${estimatedCost.toFixed(2)}</span>
        </div>
      </div>

      {/* Trade Button */}
      <button
        onClick={handleTrade}
        disabled={parseFloat(amount) <= 0 || estimatedCost > (activeTab === 'buy' ? balance : Infinity)}
        className={`w-full rounded-xl px-6 py-4 font-bold text-white shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${activeTab === 'buy'
          ? 'bg-gradient-to-r from-success to-emerald-600 shadow-success/25 hover:shadow-success/40'
          : 'bg-gradient-to-r from-danger to-red-600 shadow-danger/25 hover:shadow-danger/40'
          } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none`}
      >
        {activeTab === 'buy' ? 'Buy' : 'Sell'} {coin}
      </button>
    </div>
  )
}
