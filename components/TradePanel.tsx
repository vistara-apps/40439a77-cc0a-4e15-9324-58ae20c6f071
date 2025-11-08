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
    <div className="rounded-lg border border-white/10 bg-surface p-6">
      <div className="mb-4 flex items-center gap-2">
        <ArrowDownUp className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-fg">Trade {coin}</h3>
      </div>

      {/* Buy/Sell Tabs */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setActiveTab('buy')}
          className={`flex-1 rounded-lg px-4 py-2 font-semibold transition-all ${
            activeTab === 'buy'
              ? 'bg-brand-green text-white'
              : 'bg-surface border border-white/10 text-fg/70 hover:text-fg'
          }`}
        >
          <Plus className="inline h-4 w-4 mr-1" />
          Buy
        </button>
        <button
          onClick={() => setActiveTab('sell')}
          className={`flex-1 rounded-lg px-4 py-2 font-semibold transition-all ${
            activeTab === 'sell'
              ? 'bg-brand-red text-white'
              : 'bg-surface border border-white/10 text-fg/70 hover:text-fg'
          }`}
        >
          <Minus className="inline h-4 w-4 mr-1" />
          Sell
        </button>
      </div>

      {/* Amount Input */}
      <div className="mb-4">
        <label className="mb-2 block text-sm text-fg/70">Amount ({coin})</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          step="0.01"
          min="0"
          max={activeTab === 'buy' ? maxBuy : maxSell}
          className="w-full rounded-lg border border-white/10 bg-bg px-4 py-2 text-fg focus:border-primary focus:outline-none"
        />
        <div className="mt-2 flex items-center justify-between text-xs text-fg/60">
          <span>Available: {activeTab === 'buy' ? `$${balance.toFixed(2)}` : `${position.toFixed(4)} ${coin}`}</span>
          <button
            onClick={() => setAmount((activeTab === 'buy' ? maxBuy : maxSell).toFixed(4))}
            className="text-primary hover:text-accent"
          >
            Max
          </button>
        </div>
      </div>

      {/* Estimated Cost */}
      <div className="mb-4 rounded-lg bg-bg p-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-fg/70">Estimated {activeTab === 'buy' ? 'Cost' : 'Return'}</span>
          <span className="font-semibold text-fg">${estimatedCost.toFixed(2)}</span>
        </div>
      </div>

      {/* Trade Button */}
      <button
        onClick={handleTrade}
        disabled={parseFloat(amount) <= 0 || estimatedCost > (activeTab === 'buy' ? balance : Infinity)}
        className={`w-full rounded-lg px-6 py-3 font-semibold text-white transition-all ${
          activeTab === 'buy'
            ? 'bg-brand-green hover:opacity-90'
            : 'bg-brand-red hover:opacity-90'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {activeTab === 'buy' ? 'Buy' : 'Sell'} {coin}
      </button>
    </div>
  )
}
