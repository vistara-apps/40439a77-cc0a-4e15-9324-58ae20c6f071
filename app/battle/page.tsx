'use client'

import { useState, useEffect, useCallback } from 'react'
import { ArrowLeft, Users2, Clock, Trophy, Medal, Crown } from 'lucide-react'
import Link from 'next/link'
import { useAccount } from 'wagmi'
import { TradingChart } from '@/components/TradingChart'
import { TradePanel } from '@/components/TradePanel'
import { Portfolio } from '@/components/Portfolio'
import { ChallengeSettingsComponent } from '@/components/ChallengeSettings'
import { PLSummary } from '@/components/PLSummary'
import { useTradingSession } from '@/lib/hooks/useTradingSession'
import { Header } from '@/components/Header'
import type { CoinType, ChallengeSettings, LeaderboardEntry } from '@/lib/types'

export default function BattlePage() {
  const { address } = useAccount()
  const [challengeSettings, setChallengeSettings] = useState<ChallengeSettings>({
    startingBalance: 10000,
    duration: 60,
  })
  const [showSettings, setShowSettings] = useState(false)
  const [battleStarted, setBattleStarted] = useState(false)
  const [groupName, setGroupName] = useState('')
  const [prizes, setPrizes] = useState(['100', '50', '25'])
  const [selectedCoin, setSelectedCoin] = useState<CoinType>('BTC')
  const [showSummary, setShowSummary] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)

  // Mock leaderboard data
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([
    {
      address: address || '0x1234...5678',
      username: 'You',
      pnl: 0,
      pnlPercentage: 0,
      rank: 1,
    },
    {
      address: '0xabcd...ef01',
      username: 'Trader2',
      pnl: 150,
      pnlPercentage: 1.5,
      rank: 2,
    },
    {
      address: '0x9876...5432',
      username: 'Trader3',
      pnl: -80,
      pnlPercentage: -0.8,
      rank: 3,
    },
  ])

  const { session, prices, executeTrade, updatePositions, endSession, resetSession } =
    useTradingSession(challengeSettings.startingBalance)

  useEffect(() => {
    updatePositions()
  }, [prices, updatePositions])

  const handleEndBattle = useCallback(() => {
    endSession()
    setShowSummary(true)
  }, [endSession])

  // Update leaderboard with current user's P&L
  useEffect(() => {
    if (battleStarted) {
      setLeaderboard((prev) =>
        prev
          .map((entry) =>
            entry.address === address
              ? { ...entry, pnl: session.pnl, pnlPercentage: session.pnlPercentage }
              : entry
          )
          .sort((a, b) => b.pnl - a.pnl)
          .map((entry, index) => ({ ...entry, rank: index + 1 }))
      )
    }
  }, [session.pnl, session.pnlPercentage, battleStarted, address])

  // Timer
  useEffect(() => {
    if (battleStarted && challengeSettings.duration) {
      setTimeRemaining(challengeSettings.duration * 60)
      
      const interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleEndBattle()
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [battleStarted, challengeSettings.duration, handleEndBattle])

  const handleStartBattle = () => {
    if (!address) {
      alert('Please connect your wallet first')
      return
    }
    if (!groupName) {
      alert('Please enter group name')
      return
    }
    setBattleStarted(true)
  }

  const handleNewBattle = () => {
    resetSession()
    setBattleStarted(false)
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

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Medal className="h-5 w-5 text-amber-700" />
      default:
        return <span className="text-sm text-fg/60">#{rank}</span>
    }
  }

  if (!battleStarted) {
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
              <h1 className="text-3xl font-bold text-fg">Group Battle</h1>
              <p className="text-sm text-fg/70">Compete with your community for prizes</p>
            </div>
          </div>

          <div className="mx-auto max-w-2xl space-y-6">
            {/* Battle Setup */}
            <div className="rounded-lg border border-white/10 bg-surface p-6">
              <div className="mb-4 flex items-center gap-2">
                <Users2 className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-fg">Battle Setup</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm text-fg/70">Group/Community Name</label>
                  <input
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="e.g., NFT Community, Trading Guild"
                    className="w-full rounded-lg border border-white/10 bg-bg px-4 py-2 text-fg focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-fg/70">Prize Pool (ETH)</label>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="number"
                      value={prizes[0]}
                      onChange={(e) => setPrizes([e.target.value, prizes[1], prizes[2]])}
                      placeholder="1st"
                      min="0"
                      step="0.01"
                      className="rounded-lg border border-white/10 bg-bg px-4 py-2 text-fg focus:border-primary focus:outline-none"
                    />
                    <input
                      type="number"
                      value={prizes[1]}
                      onChange={(e) => setPrizes([prizes[0], e.target.value, prizes[2]])}
                      placeholder="2nd"
                      min="0"
                      step="0.01"
                      className="rounded-lg border border-white/10 bg-bg px-4 py-2 text-fg focus:border-primary focus:outline-none"
                    />
                    <input
                      type="number"
                      value={prizes[2]}
                      onChange={(e) => setPrizes([prizes[0], prizes[1], e.target.value])}
                      placeholder="3rd"
                      min="0"
                      step="0.01"
                      className="rounded-lg border border-white/10 bg-bg px-4 py-2 text-fg focus:border-primary focus:outline-none"
                    />
                  </div>
                  <p className="mt-1 text-xs text-fg/60">1st, 2nd, and 3rd place prizes</p>
                </div>

                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="flex items-center gap-2 text-primary hover:text-accent"
                >
                  <Trophy className="h-4 w-4" />
                  {showSettings ? 'Hide' : 'Show'} Battle Settings
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

            {/* Prize Preview */}
            <div className="rounded-lg border border-white/10 bg-surface p-6">
              <h3 className="mb-4 text-lg font-semibold text-fg">Prize Distribution</h3>
              <div className="space-y-3">
                {prizes.map((prize, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border border-white/10 bg-bg p-3"
                  >
                    <div className="flex items-center gap-3">
                      {getRankIcon(index + 1)}
                      <span className="font-semibold text-fg">{index + 1}st Place</span>
                    </div>
                    <span className="text-lg font-bold text-primary">{prize} ETH</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-between border-t border-white/10 pt-3">
                <span className="font-semibold text-fg">Total Prize Pool</span>
                <span className="text-xl font-bold text-primary">
                  {prizes.reduce((sum, p) => sum + parseFloat(p || '0'), 0).toFixed(2)} ETH
                </span>
              </div>
            </div>

            <button
              onClick={handleStartBattle}
              disabled={!address || !groupName}
              className="w-full rounded-lg bg-primary px-6 py-4 text-lg font-semibold text-white transition-all hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trophy className="mr-2 inline h-5 w-5" />
              Start Battle
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg">
      <Header />
      
      <div className="container mx-auto px-6 py-8">
        {/* Battle Header */}
        <div className="mb-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-fg">Group Battle: {groupName}</h1>
              <p className="text-sm text-fg/70">Compete for prizes</p>
            </div>
            <div className="flex items-center gap-4">
              {challengeSettings.duration && (
                <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-surface px-4 py-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <span className="text-lg font-semibold text-fg">{formatTime(timeRemaining)}</span>
                </div>
              )}
              <button
                onClick={handleEndBattle}
                className="rounded-lg border border-brand-red bg-brand-red/10 px-6 py-2 font-semibold text-brand-red transition-all hover:bg-brand-red hover:text-white"
              >
                End Battle
              </button>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="rounded-lg border border-white/10 bg-surface p-6">
            <div className="mb-4 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold text-fg">Live Leaderboard</h3>
            </div>
            <div className="space-y-2">
              {leaderboard.map((entry) => (
                <div
                  key={entry.address}
                  className={`flex items-center justify-between rounded-lg border p-3 ${
                    entry.address === address
                      ? 'border-primary bg-primary/10'
                      : 'border-white/10 bg-bg'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {getRankIcon(entry.rank)}
                    <div>
                      <div className="font-semibold text-fg">{entry.username || entry.address.slice(0, 10)}</div>
                      {entry.address === address && (
                        <span className="text-xs text-primary">You</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${entry.pnl >= 0 ? 'text-brand-green' : 'text-brand-red'}`}>
                      {entry.pnl >= 0 ? '+' : ''}${entry.pnl.toFixed(2)}
                    </div>
                    <div className={`text-xs ${entry.pnl >= 0 ? 'text-brand-green' : 'text-brand-red'}`}>
                      {entry.pnl >= 0 ? '+' : ''}{entry.pnlPercentage.toFixed(2)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trading Interface */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
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

      {showSummary && (
        <PLSummary
          session={session}
          onClose={() => setShowSummary(false)}
          onNewSession={handleNewBattle}
        />
      )}
    </div>
  )
}
