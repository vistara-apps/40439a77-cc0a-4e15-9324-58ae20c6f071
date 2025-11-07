'use client'

import { Swords, Users2, Trophy, TrendingUp } from 'lucide-react'

const features = [
  {
    icon: TrendingUp,
    title: 'Paper Trading Platform',
    description: 'Practice with real-time market data on Base without financial risk. Build confidence and refine strategies.',
  },
  {
    icon: Swords,
    title: '1v1 Challenge Mode',
    description: 'Challenge friends to head-to-head trading duels. Set profit goals, loss limits, and timeframes.',
  },
  {
    icon: Users2,
    title: 'Group Battle Mode',
    description: 'Join group competitions and compete for prizes. Strategize with your team and dominate the leaderboard.',
  },
  {
    icon: Trophy,
    title: 'Onchain Reputation',
    description: 'Build verifiable trading reputation with onchain badges and leaderboard rankings tied to your Farcaster profile.',
  },
]

export function Features() {
  return (
    <section id="features" className="py-20 md:py-32">
      <div className="container mx-auto px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-fg md:text-4xl">
            Everything you need to compete
          </h2>
          <p className="text-lg text-fg/70">
            Social-native paper trading with competitive features built for Base
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group rounded-lg border border-white/10 bg-surface p-6 shadow-trading transition-all duration-300 hover:border-primary/30 hover:shadow-card"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-fg">{feature.title}</h3>
              <p className="text-sm text-fg/70">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
