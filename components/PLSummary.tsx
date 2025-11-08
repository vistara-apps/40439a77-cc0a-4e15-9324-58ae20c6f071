'use client'

import { useRef, useEffect } from 'react'
import { Download, TrendingUp, TrendingDown, Clock, DollarSign } from 'lucide-react'
import type { TradingSession } from '@/lib/types'

interface PLSummaryProps {
  session: TradingSession
  onClose: () => void
  onNewSession: () => void
}

export function PLSummary({ session, onClose, onNewSession }: PLSummaryProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isProfit = session.pnl >= 0

  const duration = session.endTime
    ? Math.floor((session.endTime - session.startTime) / 1000 / 60)
    : 0

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // Set canvas size
      canvas.width = 1200
      canvas.height = 630

      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, '#0f1419')
      gradient.addColorStop(1, '#1a1f2e')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Title
      ctx.fillStyle = '#f5f5f5'
      ctx.font = 'bold 48px Arial'
      ctx.fillText('TradeDuel - Trading Summary', 60, 80)

      // P&L Box
      ctx.fillStyle = isProfit ? '#22c55e' : '#ef4444'
      ctx.fillRect(60, 120, 1080, 200)

      // P&L Text
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 72px Arial'
      const pnlText = `${isProfit ? '+' : ''}$${session.pnl.toFixed(2)}`
      ctx.fillText(pnlText, 80, 220)

      ctx.font = '36px Arial'
      const percentText = `${isProfit ? '+' : ''}${session.pnlPercentage.toFixed(2)}%`
      ctx.fillText(percentText, 80, 280)

      // Stats
      ctx.fillStyle = '#f5f5f5'
      ctx.font = '28px Arial'
      ctx.fillText(`Starting Balance: $${session.startBalance.toFixed(2)}`, 60, 380)
      ctx.fillText(`Final Balance: $${session.currentBalance.toFixed(2)}`, 60, 430)
      ctx.fillText(`Total Trades: ${session.trades.length}`, 60, 480)
      ctx.fillText(`Duration: ${duration} minutes`, 60, 530)

      // Footer
      ctx.font = '24px Arial'
      ctx.fillStyle = '#888888'
      ctx.fillText('Trade on Base with TradeDuel', 60, 590)
    }
  }, [session, isProfit, duration])

  const downloadImage = () => {
    if (canvasRef.current) {
      const link = document.createElement('a')
      link.download = `tradeduel-summary-${Date.now()}.png`
      link.href = canvasRef.current.toDataURL()
      link.click()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="w-full max-w-4xl rounded-lg border border-white/10 bg-surface p-8">
        <h2 className="mb-6 text-3xl font-bold text-fg">Session Complete!</h2>

        {/* Summary Stats */}
        <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-white/10 bg-bg p-4">
            <div className="mb-2 flex items-center gap-2 text-fg/70">
              <DollarSign className="h-4 w-4" />
              <span className="text-sm">P&L</span>
            </div>
            <div className={`text-2xl font-bold ${isProfit ? 'text-brand-green' : 'text-brand-red'}`}>
              {isProfit ? '+' : ''}${session.pnl.toFixed(2)}
            </div>
            <div className={`text-sm ${isProfit ? 'text-brand-green' : 'text-brand-red'}`}>
              {isProfit ? '+' : ''}{session.pnlPercentage.toFixed(2)}%
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-bg p-4">
            <div className="mb-2 flex items-center gap-2 text-fg/70">
              {isProfit ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span className="text-sm">Result</span>
            </div>
            <div className="text-2xl font-bold text-fg">
              {isProfit ? 'Profit' : 'Loss'}
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-bg p-4">
            <div className="mb-2 flex items-center gap-2 text-fg/70">
              <Clock className="h-4 w-4" />
              <span className="text-sm">Duration</span>
            </div>
            <div className="text-2xl font-bold text-fg">{duration}m</div>
          </div>

          <div className="rounded-lg border border-white/10 bg-bg p-4">
            <div className="mb-2 text-sm text-fg/70">Total Trades</div>
            <div className="text-2xl font-bold text-fg">{session.trades.length}</div>
          </div>
        </div>

        {/* Canvas for image generation */}
        <div className="mb-6 overflow-hidden rounded-lg border border-white/10">
          <canvas
            ref={canvasRef}
            className="w-full"
            style={{ maxHeight: '400px', objectFit: 'contain' }}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={downloadImage}
            className="flex items-center gap-2 rounded-lg border border-primary bg-primary/10 px-6 py-3 font-semibold text-primary transition-all hover:bg-primary hover:text-white"
          >
            <Download className="h-4 w-4" />
            Download Image
          </button>
          <button
            onClick={onNewSession}
            className="flex-1 rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-all hover:bg-accent"
          >
            Start New Session
          </button>
          <button
            onClick={onClose}
            className="rounded-lg border border-white/10 px-6 py-3 font-semibold text-fg transition-all hover:bg-surface/80"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
