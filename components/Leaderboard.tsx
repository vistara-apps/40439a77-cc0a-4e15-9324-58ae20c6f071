'use client'

import { Trophy, TrendingUp, Medal } from 'lucide-react'

const leaderboardData = [
    { rank: 1, username: 'crypto_king', pnl: 12500.50, pnlPercent: 125.5, trades: 45 },
    { rank: 2, username: 'base_trader', pnl: 8400.20, pnlPercent: 84.0, trades: 32 },
    { rank: 3, username: 'moon_walker', pnl: 5600.75, pnlPercent: 56.1, trades: 28 },
    { rank: 4, username: 'diamond_hands', pnl: 3200.00, pnlPercent: 32.0, trades: 15 },
    { rank: 5, username: 'paper_hands', pnl: 1500.10, pnlPercent: 15.0, trades: 12 },
]

export function Leaderboard() {
    return (
        <section id="leaderboard" className="py-20 md:py-32 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-surface/30 -z-10" />
            <div className="absolute top-1/2 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -z-10" />

            <div className="container mx-auto px-6">
                <div className="mb-16 text-center">
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
                        <Trophy className="h-4 w-4" />
                        <span>Top Traders</span>
                    </div>
                    <h2 className="mb-6 text-3xl font-bold tracking-tight text-fg md:text-5xl">
                        Global Leaderboard
                    </h2>
                    <p className="text-lg text-fg/60 max-w-2xl mx-auto">
                        Compete with traders worldwide and earn your spot on the wall of fame.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto">
                    <div className="rounded-2xl border border-white/10 bg-surface/50 backdrop-blur-xl overflow-hidden shadow-2xl">
                        {/* Header */}
                        <div className="grid grid-cols-12 gap-4 p-6 border-b border-white/10 bg-white/5 text-sm font-semibold text-fg/60 uppercase tracking-wider">
                            <div className="col-span-2 md:col-span-1 text-center">Rank</div>
                            <div className="col-span-4 md:col-span-5">Trader</div>
                            <div className="col-span-3 md:col-span-3 text-right">P&L</div>
                            <div className="col-span-3 md:col-span-3 text-right">Trades</div>
                        </div>

                        {/* Rows */}
                        <div className="divide-y divide-white/5">
                            {leaderboardData.map((user) => (
                                <div
                                    key={user.rank}
                                    className="grid grid-cols-12 gap-4 p-6 items-center hover:bg-white/5 transition-colors duration-200"
                                >
                                    <div className="col-span-2 md:col-span-1 flex justify-center">
                                        {user.rank === 1 ? (
                                            <div className="h-8 w-8 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500">
                                                <Medal className="h-5 w-5" />
                                            </div>
                                        ) : user.rank === 2 ? (
                                            <div className="h-8 w-8 rounded-full bg-gray-400/20 flex items-center justify-center text-gray-400">
                                                <Medal className="h-5 w-5" />
                                            </div>
                                        ) : user.rank === 3 ? (
                                            <div className="h-8 w-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500">
                                                <Medal className="h-5 w-5" />
                                            </div>
                                        ) : (
                                            <span className="text-fg/60 font-mono font-bold">#{user.rank}</span>
                                        )}
                                    </div>

                                    <div className="col-span-4 md:col-span-5 flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm">
                                            {user.username.substring(0, 2).toUpperCase()}
                                        </div>
                                        <span className="font-semibold text-fg">{user.username}</span>
                                    </div>

                                    <div className="col-span-3 md:col-span-3 text-right">
                                        <div className="font-bold text-success">
                                            +${user.pnl.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </div>
                                        <div className="text-xs text-success/70">
                                            +{user.pnlPercent}%
                                        </div>
                                    </div>

                                    <div className="col-span-3 md:col-span-3 text-right text-fg/70 font-mono">
                                        {user.trades}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
