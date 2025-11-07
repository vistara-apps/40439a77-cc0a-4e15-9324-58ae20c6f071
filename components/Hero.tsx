'use client'

import { TrendingUp, Users } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
      
      <div className="container relative mx-auto px-6">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm text-primary">
            <TrendingUp className="h-4 w-4" />
            <span>Paper Trading on Base</span>
          </div>

          <h1 className="mb-6 text-4xl font-bold leading-tight text-fg md:text-6xl">
            Challenge friends to paper trading duels
          </h1>

          <p className="mb-8 text-lg text-fg/70 md:text-xl">
            Practice trading strategies, compete with friends, and build your reputation on Base. 
            No real money at risk, all the excitement.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <button className="rounded-lg bg-primary px-8 py-4 text-base font-semibold text-white shadow-card transition-all duration-200 hover:bg-accent hover:shadow-lg">
              Start Trading
            </button>
            <button className="rounded-lg border border-primary/20 bg-surface px-8 py-4 text-base font-semibold text-fg transition-all duration-200 hover:bg-surface/80">
              Create Challenge
            </button>
          </div>

          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-fg/60">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <span>1,234 Active Traders</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-brand-green" />
              <span>5,678 Challenges</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
