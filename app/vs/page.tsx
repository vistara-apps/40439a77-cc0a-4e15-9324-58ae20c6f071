'use client'

import { useState, useEffect, useCallback } from 'react'
import { ArrowLeft, Users, Clock, Trophy, Settings } from 'lucide-react'
import Link from 'next/link'
import { useAccount } from 'wagmi'
import { TradingChart } from '@/components/TradingChart'
import { TradePanel } from '@/components/TradePanel'
import { Portfolio } from '@/components/Portfolio'
import { ChallengeSettingsComponent } from '@/components/ChallengeSettings'
import { PLSummary } from '@/components/PLSummary'
import { CoinDropdown } from '@/components/CoinDropdown'
import { useTradingSessionDB } from '@/lib/hooks/useTradingSessionDB'
import { Header } from '@/components/Header'
import type { CoinType, ChallengeSettings } from '@/lib/types'

export default function VsPage() {
  const { address } = useAccount()
  const [challengeSettings, setChallengeSettings] = useState<ChallengeSettings>({
    startingBalance: 10000,
    maxProfitGoal: 1000,
    maxLoss: 2000,
    duration: 30,
  })
  const [showSettings, setShowSettings] = useState(false)
  const [challengeStarted, setChallengeStarted] = useState(false)
  const [opponent, setOpponent] = useState('')
  const [wager, setWager] = useState('10')
  const [selectedCoin, setSelectedCoin] = useState<CoinType>('BTC')
  const [showSummary, setShowSummary] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)

  const { session, prices, isLoading, executeTrade, updatePositions, endSession, resetSession } =
    useTradingSessionDB(challengeSettings.startingBalance)

  useEffect(() => {
    updatePositions()
  }, [prices, updatePositions])

  const handleEndChallenge = useCallback(() => {
    endSession()
    setShowSummary(true)
  }, [endSession])

  // Timer for duration-based challenges
  useEffect(() => {
    if (challengeStarted && challengeSettings.duration) {
      setTimeRemaining(challengeSettings.duration * 60)
      
      const interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleEndChallenge()
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [challengeStarted, challengeSettings.duration, handleEndChallenge])

  // Check win/loss conditions
  useEffect(() => {
    if (challengeStarted) {
      if (challengeSettings.maxProfitGoal && session.pnl >= challengeSettings.maxProfitGoal) {
        handleEndChallenge()
      } else if (challengeSettings.maxLoss && Math.abs(session.pnl) >= challengeSettings.maxLoss) {
        handleEndChallenge()
      }
    }
  }, [session.pnl, challengeStarted, challengeSettings, handleEndChallenge])

  const handleStartChallenge = () => {
    if (!address) {
      alert('Please connect your wallet first')
      return
    }
    if (!opponent) {
      alert('Please enter opponent address')
      return
    }
    setChallengeStarted(true)
  }

  const handleNewChallenge = () => {
    resetSession()
    setChallengeStarted(false)
    setShowSummary(false)
    setTimeRemaining(0)
  }

  const getPosition = (coin: CoinType) => {
    return session.positions.find((p) => p.coin === coin)?.amount || 0
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!challengeStarted) {
    return (
      <div className="min-h-screen bg-bg">
        <Header />
        
        <div className="container mx-auto px-6 py-8">
          <div className="mb-6 flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-fg/70 transition-colors hover:text-fg"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back</span>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-fg">1v1 Challenge</h1>
              <p className="text-sm text-fg/70">Challenge a friend to a trading duel</p>
            </div>
          </div>

          <div className="mx-auto max-w-2xl space-y-6">
            {/* Challenge Setup */}
            <div className="rounded-lg border border-white/10 bg-surface p-6">
              <div className="mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-fg">Challenge Setup</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm text-fg/70">Opponent Address</label>
                  <input
                    type="text"
                    value={opponent}
                    onChange={(e) => setOpponent(e.target.value)}
                    placeholder="0x..."
                    className="w-full rounded-lg border border-white/10 bg-bg px-4 py-2 text-fg focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-fg/70">Wager Amount (ETH)</label>
                  <input
                    type="number"
                    value={wager}
                    onChange={(e) => setWager(e.target.value)}
                    min="0"
                    step="0.01"
                    className="w-full rounded-lg border border-white/10 bg-bg px-4 py-2 text-fg focus:border-primary focus:outline-none"
                  />
                </div>

                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="flex items-center gap-2 text-primary hover:text-accent"
                >
                  <Settings className="h-4 w-4" />
                  {showSettings ? 'Hide' : 'Show'} Challenge Settings
                </button>
              </div>
            </div>

            {/* Settings */}
            {showSettings && (
              <ChallengeSettingsComponent
                defaultSettings={challengeSettings}
                onSave={(settings) => {
                  setChallengeSettings(settings)
                  setShowSettings(false)
                }}
              />
            )}

            {/* Current Settings Preview */}
            <div className="rounded-lg border border-white/10 bg-surface p-6">
              <h3 className="mb-4 text-lg font-semibold text-fg">Challenge Rules</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-fg/70">Starting Balance:</span>
                  <span className="font-semibold text-fg">${challengeSettings.startingBalance}</span>
                </div>
                {challengeSettings.maxProfitGoal && (
                  <div className="flex justify-between">
                    <span className="text-fg/70">Win at Profit:</span>
                    <span className="font-semibold text-brand-green">
                      ${challengeSettings.maxProfitGoal}
                    </span>
                  </div>
                )}
                {challengeSettings.maxLoss && (
                  <div className="flex justify-between">
                    <span className="text-fg/70">Lose at Loss:</span>
                    <span className="font-semibold text-brand-red">
                      ${challengeSettings.maxLoss}
                    </span>
                  </div>
                )}
                {challengeSettings.duration && (
                  <div className="flex justify-between">
                    <span className="text-fg/70">Duration:</span>
                    <span className="font-semibold text-fg">
                      {challengeSettings.duration} minutes
                    </span>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleStartChallenge}
              disabled={!address || !opponent}
              className="w-full rounded-lg bg-primary px-6 py-4 text-lg font-semibold text-white transition-all hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trophy className="mr-2 inline h-5 w-5" />
              Start Challenge
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg">
      <Header />
      
      {isLoading ? (
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="text-lg text-fg/70">Loading real-time prices...</p>
          </div>
        </div>
      ) : (
      <div className="container mx-auto px-6 py-8">
        {/* Challenge Header */}
        <div className="mb-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-fg">1v1 Challenge Active</h1>
              <p className="text-sm text-fg/70">Trading against {opponent.slice(0, 6)}...</p>
            </div>
            <div className="flex items-center gap-4">
              {challengeSettings.duration && (
                <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-surface px-4 py-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <span className="text-lg font-semibold text-fg">{formatTime(timeRemaining)}</span>
                </div>
              )}
              <button
                onClick={handleEndChallenge}
                className="rounded-lg border border-brand-red bg-brand-red/10 px-6 py-2 font-semibold text-brand-red transition-all hover:bg-brand-red hover:text-white"
              >
                End Challenge
              </button>
            </div>
          </div>

          {/* Progress Indicators */}
          <div className="grid gap-4 md:grid-cols-3">
            {challengeSettings.maxProfitGoal && (
              <div className="rounded-lg border border-white/10 bg-surface p-4">
                <div className="mb-2 text-sm text-fg/70">Profit Goal</div>
                <div className="mb-1 text-xl font-bold text-brand-green">
                  ${challengeSettings.maxProfitGoal}
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-bg">
                  <div
                    className="h-full bg-brand-green transition-all"
                    style={{
                      width: `${Math.min((session.pnl / challengeSettings.maxProfitGoal) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            )}
            {challengeSettings.maxLoss && (
              <div className="rounded-lg border border-white/10 bg-surface p-4">
                <div className="mb-2 text-sm text-fg/70">Max Loss</div>
                <div className="mb-1 text-xl font-bold text-brand-red">
                  ${challengeSettings.maxLoss}
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-bg">
                  <div
                    className="h-full bg-brand-red transition-all"
                    style={{
                      width: `${Math.min((Math.abs(session.pnl) / challengeSettings.maxLoss) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Trading Interface */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <CoinDropdown
              selectedCoin={selectedCoin}
              onCoinSelect={setSelectedCoin}
              prices={prices}
            />

            <TradingChart coin={selectedCoin} price={prices[selectedCoin]} />
            <TradePanel
              coin={selectedCoin}
              price={prices[selectedCoin].price}
              balance={session.currentBalance}
              position={getPosition(selectedCoin)}
              onTrade={executeTrade}
            />
          </div>

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
      </div>
      )}

      {showSummary && (
        <PLSummary
          session={session}
          onClose={() => setShowSummary(false)}
          onNewSession={handleNewChallenge}
        />
      )}
    </div>
  )
}
