'use client'

import { Wallet } from 'lucide-react'

export function ConnectWallet() {
  return (
    <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-card transition-all duration-200 hover:bg-accent hover:shadow-lg">
      <Wallet className="h-4 w-4" />
      <span className="hidden sm:inline">Connect Wallet</span>
    </button>
  )
}
