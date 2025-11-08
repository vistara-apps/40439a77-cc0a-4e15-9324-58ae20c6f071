'use client'

import { Wallet, TrendingUp, TrendingDown } from 'lucide-react'
import type { Position } from '@/lib/types'

interface PortfolioProps {
  balance: number
  startBalance: number
  positions: Position[]
  pnl: number
  pnlPercentage: number
}

export function Portfolio({ balance, positions, pnl, pnlPercentage }: PortfolioProps) {
  const totalValue = balance + positions.reduce((sum, p) => sum + p.amount * p.currentPrice, 0)
  const isProfit = pnl >= 0

  return (
    <div className="space-y-4">
      {/* Balance Overview */}
      <div className="rounded-lg border border-white/10 bg-surface p-6">
        <div className="mb-4 flex items-center gap-2">
          <Wallet className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-fg">Portfolio</h3>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-fg/70">Total Value</span>
            <span className="text-2xl font-bold text-fg">${totalValue.toFixed(2)}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-fg/70">Cash Balance</span>
            <span className="text-lg font-semibold text-fg">${balance.toFixed(2)}</span>
          </div>

          <div className="flex items-center justify-between border-t border-white/10 pt-3">
            <span className="text-sm text-fg/70">P&L</span>
            <div className="text-right">
              <div className={`text-lg font-bold ${isProfit ? 'text-brand-green' : 'text-brand-red'}`}>
                {isProfit ? '+' : ''}${pnl.toFixed(2)}
              </div>
              <div className={`flex items-center gap-1 text-sm ${isProfit ? 'text-brand-green' : 'text-brand-red'}`}>
                {isProfit ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span>{isProfit ? '+' : ''}{pnlPercentage.toFixed(2)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Positions */}
      {positions.length > 0 && (
        <div className="rounded-lg border border-white/10 bg-surface p-6">
          <h3 className="mb-4 text-lg font-semibold text-fg">Open Positions</h3>
          <div className="space-y-3">
            {positions.map((position) => {
              const isPositionProfit = position.pnl >= 0
              return (
                <div
                  key={position.coin}
                  className="flex items-center justify-between rounded-lg border border-white/10 bg-bg p-3"
                >
                  <div>
                    <div className="font-semibold text-fg">{position.coin}</div>
                    <div className="text-xs text-fg/60">
                      {position.amount.toFixed(4)} @ ${position.averagePrice.toFixed(2)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-fg">
                      ${(position.amount * position.currentPrice).toFixed(2)}
                    </div>
                    <div className={`text-xs ${isPositionProfit ? 'text-brand-green' : 'text-brand-red'}`}>
                      {isPositionProfit ? '+' : ''}{position.pnlPercentage.toFixed(2)}%
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
