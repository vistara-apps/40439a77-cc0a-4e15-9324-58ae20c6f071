'use client'

import { TrendingUp, Users } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] opacity-50 animate-pulse-slow" />
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[100px] opacity-50 animate-pulse-slow [animation-delay:2s]" />
      </div>

      <div className="container relative mx-auto px-6">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-sm">
            <TrendingUp className="h-4 w-4" />
            <span>Paper Trading on Base</span>
          </div>

          <h1 className="mb-8 text-5xl font-bold leading-tight tracking-tight text-fg md:text-7xl">
            Challenge friends to <br />
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              paper trading duels
            </span>
          </h1>

          <p className="mb-10 text-lg text-fg/60 md:text-xl max-w-2xl mx-auto leading-relaxed">
            Practice trading strategies, compete with friends, and build your reputation on Base.
            No real money at risk, all the excitement.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <a
              href="/trade"
              className="group relative inline-flex items-center justify-center rounded-xl bg-primary px-8 py-4 text-base font-semibold text-white shadow-lg shadow-primary/25 transition-all duration-200 hover:bg-primary/90 hover:scale-105 hover:shadow-primary/40"
            >
              Start Trading
              <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/20" />
            </a>
            <a
              href="/vs"
              className="group inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-8 py-4 text-base font-semibold text-fg backdrop-blur-sm transition-all duration-200 hover:bg-white/10 hover:scale-105"
            >
              Create Challenge
            </a>
          </div>

          <div className="mt-16 flex items-center justify-center gap-8 text-sm font-medium text-fg/50 border-t border-white/5 pt-8 max-w-lg mx-auto">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <span>1,234 Active Traders</span>
            </div>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-success" />
              <span>5,678 Challenges</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
