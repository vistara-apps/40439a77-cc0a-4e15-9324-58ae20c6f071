'use client'

import type { CoinType } from '@/lib/types'

interface CoinSelectorProps {
  selectedCoin: CoinType
  onCoinSelect: (coin: CoinType) => void
  availableCoins?: CoinType[]
}

const COIN_INFO: Record<CoinType, { name: string; displayName: string }> = {
  BTC: { name: 'Bitcoin', displayName: 'Bitcoin (BTC)' },
  SOL: { name: 'Solana', displayName: 'Solana (SOL)' },
  ETH: { name: 'Ethereum', displayName: 'Ethereum (ETH)' },
  PUMP: { name: 'Pump.fun', displayName: 'Pump.fun (PUMP)' },
  DOGE: { name: 'Dogecoin', displayName: 'Dogecoin (DOGE)' },
}

export function CoinSelector({
  selectedCoin,
  onCoinSelect,
  availableCoins = ['BTC', 'SOL', 'ETH', 'PUMP', 'DOGE'],
}: CoinSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {availableCoins.map((coin) => (
        <button
          key={coin}
          onClick={() => onCoinSelect(coin)}
          className={`rounded-lg border px-4 py-3 text-sm font-semibold transition-all ${
            selectedCoin === coin
              ? 'border-primary bg-primary text-white'
              : 'border-white/10 bg-surface text-fg hover:border-primary/50'
          }`}
        >
          <div className="text-center">
            <div className="text-lg font-bold">{coin}</div>
            <div className="text-xs opacity-80">{COIN_INFO[coin].name}</div>
          </div>
        </button>
      ))}
    </div>
  )
}