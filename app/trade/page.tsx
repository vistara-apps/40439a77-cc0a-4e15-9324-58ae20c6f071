'use client'

import { useEffect, useState } from 'react'
import { ArrowLeft, X } from 'lucide-react'
import Link from 'next/link'
import { TradingChart } from '@/components/TradingChart'
import { TradePanel } from '@/components/TradePanel'
import { Portfolio } from '@/components/Portfolio'
import { PLSummary } from '@/components/PLSummary'
import { useTradingSession } from '@/lib/hooks/useTradingSession'
import { Header } from '@/components/Header'
import type { CoinType } from '@/lib/types'

export default function TradePage() {
  const { session, prices, executeTrade, updatePositions, endSession, resetSession } =
    useTradingSession(10000)
  const [showSummary, setShowSummary] = useState(false)
  const [selectedCoin, setSelectedCoin] = useState<CoinType>('BTC')

  // Update positions when prices change
  useEffect(() => {
    updatePositions()
  }, [prices, updatePositions])

  const handleEndSession = () => {
    endSession()
    setShowSummary(true)
  }

  const handleNewSession = () => {
    resetSession()
    setShowSummary(false)
  }

  const getPosition = (coin: CoinType) => {
    return session.positions.find((p) => p.coin === coin)?.amount || 0
  }

  return (
    <div className="min-h-screen bg-bg">
      <Header />
      
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-fg/70 transition-colors hover:text-fg"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back</span>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-fg">Regular Paper Trading</h1>
              <p className="text-sm text-fg/70">Practice trading without risk</p>
            </div>
          </div>
          <button
            onClick={handleEndSession}
            className="rounded-lg border border-brand-red bg-brand-red/10 px-6 py-2 font-semibold text-brand-red transition-all hover:bg-brand-red hover:text-white"
          >
            <X className="mr-2 inline h-4 w-4" />
            End Session
          </button>
        </div>

        {/* Trading Interface */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Charts and Trading */}
          <div className="space-y-6 lg:col-span-2">
            {/* Coin Selector */}
            <div className="flex gap-4">
              <button
                onClick={() => setSelectedCoin('BTC')}
                className={`flex-1 rounded-lg border px-6 py-3 font-semibold transition-all ${
                  selectedCoin === 'BTC'
                    ? 'border-primary bg-primary text-white'
                    : 'border-white/10 bg-surface text-fg hover:border-primary/50'
                }`}
              >
                Bitcoin (BTC)
              </button>
              <button
                onClick={() => setSelectedCoin('SOL')}
                className={`flex-1 rounded-lg border px-6 py-3 font-semibold transition-all ${
                  selectedCoin === 'SOL'
                    ? 'border-primary bg-primary text-white'
                    : 'border-white/10 bg-surface text-fg hover:border-primary/50'
                }`}
              >
                Solana (SOL)
              </button>
            </div>

            {/* Chart */}
            <TradingChart coin={selectedCoin} price={prices[selectedCoin]} />

            {/* Trade Panel */}
            <TradePanel
              coin={selectedCoin}
              price={prices[selectedCoin].price}
              balance={session.currentBalance}
              position={getPosition(selectedCoin)}
              onTrade={executeTrade}
            />
          </div>

          {/* Right Column - Portfolio */}
          <div className="lg:col-span-1">
            <Portfolio
              balance={session.currentBalance}
              startBalance={session.startBalance}
              positions={session.positions}
              pnl={session.pnl}
              pnlPercentage={session.pnlPercentage}
            />
          </div>
        </div>

        {/* Recent Trades */}
        {session.trades.length > 0 && (
          <div className="mt-6 rounded-lg border border-white/10 bg-surface p-6">
            <h3 className="mb-4 text-lg font-semibold text-fg">Recent Trades</h3>
            <div className="space-y-2">
              {session.trades.slice(-5).reverse().map((trade) => (
                <div
                  key={trade.id}
                  className="flex items-center justify-between rounded-lg border border-white/10 bg-bg p-3"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`rounded px-2 py-1 text-xs font-semibold ${
                        trade.type === 'buy'
                          ? 'bg-brand-green/20 text-brand-green'
                          : 'bg-brand-red/20 text-brand-red'
                      }`}
                    >
                      {trade.type.toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-fg">
                        {trade.amount.toFixed(4)} {trade.coin}
                      </div>
                      <div className="text-xs text-fg/60">
                        @ ${trade.price.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-fg">
                      ${(trade.amount * trade.price).toFixed(2)}
                    </div>
                    <div className="text-xs text-fg/60">
                      {new Date(trade.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* P&L Summary Modal */}
      {showSummary && (
        <PLSummary
          session={session}
          onClose={() => setShowSummary(false)}
          onNewSession={handleNewSession}
        />
      )}
    </div>
  )
}
