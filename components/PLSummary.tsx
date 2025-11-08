'use client'

import { useRef, useEffect, useState } from 'react'
import { Download, TrendingDown, Clock, DollarSign, Copy, Trophy, Zap, Target, Award } from 'lucide-react'
import type { TradingSession } from '@/lib/types'

interface PLSummaryProps {
  session: TradingSession
  onClose: () => void
  onNewSession: () => void
}

export function PLSummary({ session, onClose, onNewSession }: PLSummaryProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [copied, setCopied] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const isProfit = session.pnl >= 0

  const duration = session.endTime
    ? Math.floor((session.endTime - session.startTime) / 1000 / 60)
    : 0

  // Show confetti for big wins
  useEffect(() => {
    if (isProfit && session.pnlPercentage > 5) {
      setShowConfetti(true)
      const timer = setTimeout(() => setShowConfetti(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [isProfit, session.pnlPercentage])

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // Set canvas size (optimized for social media)
      canvas.width = 1200
      canvas.height = 630

      // Create stunning gradient background
      const bgGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      if (isProfit) {
        bgGradient.addColorStop(0, '#0a1628')
        bgGradient.addColorStop(0.5, '#0d1b2a')
        bgGradient.addColorStop(1, '#1b263b')
      } else {
        bgGradient.addColorStop(0, '#1a0a0f')
        bgGradient.addColorStop(0.5, '#2d0f1a')
        bgGradient.addColorStop(1, '#1f0f15')
      }
      ctx.fillStyle = bgGradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Add decorative circles
      const circleGradient1 = ctx.createRadialGradient(200, 150, 0, 200, 150, 300)
      circleGradient1.addColorStop(0, isProfit ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)')
      circleGradient1.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = circleGradient1
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const circleGradient2 = ctx.createRadialGradient(1000, 500, 0, 1000, 500, 400)
      circleGradient2.addColorStop(0, isProfit ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)')
      circleGradient2.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = circleGradient2
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Add glow effect for P&L box
      ctx.shadowBlur = 40
      ctx.shadowColor = isProfit ? 'rgba(34, 197, 94, 0.5)' : 'rgba(239, 68, 68, 0.5)'

      // P&L Box with gradient
      const pnlBoxGradient = ctx.createLinearGradient(60, 180, 60, 380)
      if (isProfit) {
        pnlBoxGradient.addColorStop(0, '#22c55e')
        pnlBoxGradient.addColorStop(1, '#16a34a')
      } else {
        pnlBoxGradient.addColorStop(0, '#ef4444')
        pnlBoxGradient.addColorStop(1, '#dc2626')
      }
      ctx.fillStyle = pnlBoxGradient
      ctx.roundRect(60, 180, 1080, 220, 20)
      ctx.fill()

      // Reset shadow
      ctx.shadowBlur = 0

      // Title with glow
      ctx.shadowBlur = 20
      ctx.shadowColor = '#0052ff'
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 56px system-ui, -apple-system, sans-serif'
      ctx.fillText('🎯 TradeDuel Results', 60, 130)
      ctx.shadowBlur = 0

      // Emoji based on result
      const emoji = isProfit 
        ? session.pnlPercentage > 10 ? '🚀' 
          : session.pnlPercentage > 5 ? '🔥' 
          : '✨'
        : '😤'
      ctx.font = 'bold 80px system-ui'
      ctx.fillText(emoji, 950, 280)

      // P&L Text with shadow
      ctx.shadowBlur = 15
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 90px system-ui, -apple-system, sans-serif'
      const pnlText = `${isProfit ? '+' : ''}$${Math.abs(session.pnl).toFixed(2)}`
      ctx.fillText(pnlText, 100, 290)

      // Percentage
      ctx.font = 'bold 48px system-ui, -apple-system, sans-serif'
      const percentText = `${isProfit ? '+' : ''}${session.pnlPercentage.toFixed(2)}%`
      ctx.fillText(percentText, 100, 360)

      ctx.shadowBlur = 0

      // Stats section with modern design
      const statsY = 450
      const statSpacing = 270

      // Starting Balance
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
      ctx.font = '22px system-ui, -apple-system, sans-serif'
      ctx.fillText('Starting', 60, statsY)
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 32px system-ui, -apple-system, sans-serif'
      ctx.fillText(`$${session.startBalance.toFixed(0)}`, 60, statsY + 35)

      // Final Balance
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
      ctx.font = '22px system-ui, -apple-system, sans-serif'
      ctx.fillText('Final', 60 + statSpacing, statsY)
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 32px system-ui, -apple-system, sans-serif'
      ctx.fillText(`$${session.currentBalance.toFixed(0)}`, 60 + statSpacing, statsY + 35)

      // Total Trades
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
      ctx.font = '22px system-ui, -apple-system, sans-serif'
      ctx.fillText('Trades', 60 + statSpacing * 2, statsY)
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 32px system-ui, -apple-system, sans-serif'
      ctx.fillText(`${session.trades.length}`, 60 + statSpacing * 2, statsY + 35)

      // Duration
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
      ctx.font = '22px system-ui, -apple-system, sans-serif'
      ctx.fillText('Duration', 60 + statSpacing * 3, statsY)
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 32px system-ui, -apple-system, sans-serif'
      ctx.fillText(`${duration}m`, 60 + statSpacing * 3, statsY + 35)

      // Footer with style
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'
      ctx.font = '24px system-ui, -apple-system, sans-serif'
      ctx.fillText('tradeduel-pmao.vercel.app • Trade on Base', 60, 590)

      // Add decorative corner accent
      ctx.fillStyle = '#0052ff'
      ctx.beginPath()
      ctx.arc(1140, 70, 40, 0, Math.PI * 2)
      ctx.fill()
    }
  }, [session, isProfit, duration])

  const downloadImage = () => {
    if (canvasRef.current) {
      const link = document.createElement('a')
      link.download = `tradeduel-${isProfit ? 'profit' : 'loss'}-${Date.now()}.png`
      link.href = canvasRef.current.toDataURL()
      link.click()
    }
  }

  const copyStats = () => {
    const stats = `🎯 TradeDuel Results\n\n${isProfit ? '✅' : '❌'} P&L: ${isProfit ? '+' : ''}$${session.pnl.toFixed(2)} (${isProfit ? '+' : ''}${session.pnlPercentage.toFixed(2)}%)\n💰 Starting: $${session.startBalance.toFixed(2)}\n💵 Final: $${session.currentBalance.toFixed(2)}\n📊 Trades: ${session.trades.length}\n⏱️ Duration: ${duration}m\n\nTrade on Base: tradeduel-pmao.vercel.app`
    
    navigator.clipboard.writeText(stats)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getPerformanceLevel = () => {
    if (!isProfit) return { title: 'Better Luck Next Time', icon: TrendingDown, color: 'text-brand-red' }
    if (session.pnlPercentage > 20) return { title: 'Legendary Trader! 🏆', icon: Trophy, color: 'text-yellow-400' }
    if (session.pnlPercentage > 10) return { title: 'Outstanding Performance! 🔥', icon: Zap, color: 'text-orange-400' }
    if (session.pnlPercentage > 5) return { title: 'Great Trading! ⭐', icon: Award, color: 'text-primary' }
    return { title: 'Profitable Session', icon: Target, color: 'text-brand-green' }
  }

  const performance = getPerformanceLevel()
  const PerformanceIcon = performance.icon

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm">
      {/* Confetti effect for big wins */}
      {showConfetti && (
        <div className="pointer-events-none fixed inset-0 z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `ping ${1 + Math.random()}s cubic-bezier(0, 0, 0.2, 1) infinite`,
              }}
            >
              {['🎉', '⭐', '🚀', '💰', '🔥'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}

      <div className="w-full max-w-5xl animate-in fade-in zoom-in-95 duration-300">
        {/* Header with performance level */}
        <div className="mb-6 text-center">
          <div className={`mb-2 inline-flex items-center gap-2 rounded-full bg-surface/80 px-6 py-3 backdrop-blur-sm ${performance.color}`}>
            <PerformanceIcon className="h-6 w-6" />
            <span className="text-xl font-bold">{performance.title}</span>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-surface via-surface to-bg shadow-2xl">
          {/* Main Content */}
          <div className="p-8">
            {/* Hero Stats */}
            <div className={`relative mb-8 overflow-hidden rounded-2xl p-8 ${
              isProfit 
                ? 'bg-gradient-to-br from-brand-green/20 via-brand-green/10 to-transparent border border-brand-green/30' 
                : 'bg-gradient-to-br from-brand-red/20 via-brand-red/10 to-transparent border border-brand-red/30'
            }`}>
              <div className="absolute right-4 top-4 text-6xl opacity-20">
                {isProfit ? '📈' : '📉'}
              </div>
              <div className="relative">
                <div className="mb-2 flex items-center gap-2 text-fg/60">
                  <DollarSign className="h-5 w-5" />
                  <span className="text-sm font-medium uppercase tracking-wider">Total P&L</span>
                </div>
                <div className={`text-6xl font-black tracking-tight ${isProfit ? 'text-brand-green' : 'text-brand-red'}`}>
                  {isProfit ? '+' : ''}${Math.abs(session.pnl).toFixed(2)}
                </div>
                <div className={`mt-2 text-3xl font-bold ${isProfit ? 'text-brand-green/80' : 'text-brand-red/80'}`}>
                  {isProfit ? '+' : ''}{session.pnlPercentage.toFixed(2)}%
                </div>
              </div>
            </div>

            {/* Detailed Stats Grid */}
            <div className="mb-8 grid gap-4 md:grid-cols-4">
              <div className="group rounded-xl border border-white/10 bg-bg/50 p-5 transition-all hover:border-primary/50 hover:bg-bg/80">
                <div className="mb-3 flex items-center gap-2 text-fg/60">
                  <DollarSign className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-wider">Starting</span>
                </div>
                <div className="text-2xl font-bold text-fg">${session.startBalance.toFixed(2)}</div>
              </div>

              <div className="group rounded-xl border border-white/10 bg-bg/50 p-5 transition-all hover:border-primary/50 hover:bg-bg/80">
                <div className="mb-3 flex items-center gap-2 text-fg/60">
                  <DollarSign className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-wider">Final</span>
                </div>
                <div className="text-2xl font-bold text-fg">${session.currentBalance.toFixed(2)}</div>
              </div>

              <div className="group rounded-xl border border-white/10 bg-bg/50 p-5 transition-all hover:border-primary/50 hover:bg-bg/80">
                <div className="mb-3 flex items-center gap-2 text-fg/60">
                  <Target className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-wider">Trades</span>
                </div>
                <div className="text-2xl font-bold text-fg">{session.trades.length}</div>
              </div>

              <div className="group rounded-xl border border-white/10 bg-bg/50 p-5 transition-all hover:border-primary/50 hover:bg-bg/80">
                <div className="mb-3 flex items-center gap-2 text-fg/60">
                  <Clock className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-wider">Duration</span>
                </div>
                <div className="text-2xl font-bold text-fg">{duration}m</div>
              </div>
            </div>

            {/* Canvas for image generation */}
            <div className="mb-8 overflow-hidden rounded-xl border border-white/20 shadow-xl">
              <canvas
                ref={canvasRef}
                className="w-full"
                style={{ maxHeight: '420px', objectFit: 'contain', backgroundColor: '#000' }}
              />
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={downloadImage}
                className="flex items-center gap-2 rounded-xl border border-primary/50 bg-primary/10 px-6 py-3.5 font-semibold text-primary transition-all hover:scale-105 hover:border-primary hover:bg-primary hover:text-white hover:shadow-lg hover:shadow-primary/50"
              >
                <Download className="h-5 w-5" />
                Download
              </button>
              
              <button
                onClick={copyStats}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-surface px-6 py-3.5 font-semibold text-fg transition-all hover:scale-105 hover:border-white/20 hover:bg-surface/80"
              >
                <Copy className="h-5 w-5" />
                {copied ? 'Copied!' : 'Copy Stats'}
              </button>

              <button
                onClick={onNewSession}
                className="flex-1 rounded-xl bg-gradient-to-r from-primary to-accent px-6 py-3.5 font-semibold text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-primary/50"
              >
                <Zap className="mr-2 inline h-5 w-5" />
                Start New Session
              </button>

              <button
                onClick={onClose}
                className="rounded-xl border border-white/10 px-6 py-3.5 font-semibold text-fg transition-all hover:border-white/20 hover:bg-surface/50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
