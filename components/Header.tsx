'use client'

import { Trophy, Menu } from 'lucide-react'
import { ConnectWallet } from './ConnectWallet'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-surface/80 backdrop-blur-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-fg">TradeDuel</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-fg/70 hover:text-fg transition-colors duration-200">
              Features
            </a>
            <a href="#challenges" className="text-sm text-fg/70 hover:text-fg transition-colors duration-200">
              Challenges
            </a>
            <a href="#leaderboard" className="text-sm text-fg/70 hover:text-fg transition-colors duration-200">
              Leaderboard
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <ConnectWallet />
            <button className="md:hidden p-2 rounded-lg hover:bg-surface transition-colors duration-200">
              <Menu className="h-6 w-6 text-fg" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
