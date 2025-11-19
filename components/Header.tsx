'use client'

import Link from 'next/link'
import { Trophy, Menu } from 'lucide-react'
import { ConnectWallet } from './ConnectWallet'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-bg/50 backdrop-blur-xl supports-[backdrop-filter]:bg-bg/50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group cursor-pointer">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/20 transition-all duration-300 group-hover:shadow-primary/40 group-hover:scale-105">
              <Trophy className="h-5 w-5 text-white" />
              <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">TradeDuel</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {['Features', 'Challenges', 'Leaderboard'].map((item) => (
              <Link
                key={item}
                href={`/#${item.toLowerCase()}`}
                className="text-sm font-medium text-fg/60 hover:text-white transition-colors duration-200 relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <ConnectWallet />
            <button className="md:hidden p-2 rounded-lg hover:bg-white/5 text-fg/70 hover:text-white transition-colors duration-200">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
