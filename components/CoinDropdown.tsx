'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, TrendingUp, TrendingDown } from 'lucide-react'
import type { CoinType, CoinPrice } from '@/lib/types'

interface CoinDropdownProps {
  selectedCoin: CoinType
  onCoinSelect: (coin: CoinType) => void
  prices: Record<CoinType, CoinPrice>
  availableCoins?: CoinType[]
}

const COIN_INFO: Record<CoinType, { name: string; icon: string }> = {
  BTC: { name: 'Bitcoin', icon: '₿' },
  SOL: { name: 'Solana', icon: '◎' },
  ETH: { name: 'Ethereum', icon: 'Ξ' },
  PUMP: { name: 'Pump.fun', icon: '🚀' },
  DOGE: { name: 'Dogecoin', icon: 'Ð' },
}

export function CoinDropdown({
  selectedCoin,
  onCoinSelect,
  prices,
  availableCoins = ['BTC', 'SOL', 'ETH', 'PUMP', 'DOGE'],
}: CoinDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const selectedPrice = prices[selectedCoin]
  const isPositive = selectedPrice.change24h >= 0

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-lg border border-white/10 bg-surface px-4 py-3 text-left transition-all hover:border-primary/50 hover:bg-surface/80"
      >
        <div className="flex items-center gap-3">
          <div className="text-2xl">{COIN_INFO[selectedCoin].icon}</div>
          <div>
            <div className="font-semibold text-fg">{selectedCoin}</div>
            <div className="text-sm text-fg/70">{COIN_INFO[selectedCoin].name}</div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="font-semibold text-fg">
              ${selectedPrice.price.toLocaleString('en-US', { 
                minimumFractionDigits: selectedPrice.price > 1 ? 2 : 6, 
                maximumFractionDigits: selectedPrice.price > 1 ? 2 : 6 
              })}
            </div>
            <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-brand-green' : 'text-brand-red'}`}>
              {isPositive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              <span>{isPositive ? '+' : ''}{selectedPrice.change24h.toFixed(2)}%</span>
            </div>
          </div>
          
          <ChevronDown
            className={`h-4 w-4 text-fg/50 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-lg border border-white/10 bg-surface shadow-2xl">
          {availableCoins.map((coin) => {
            const price = prices[coin]
            const isPositiveChange = price.change24h >= 0
            const isSelected = coin === selectedCoin
            
            return (
              <button
                key={coin}
                onClick={() => {
                  onCoinSelect(coin)
                  setIsOpen(false)
                }}
                className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-all hover:bg-primary/10 ${
                  isSelected ? 'bg-primary/20' : ''
                }`}
              >
                <div className="text-2xl">{COIN_INFO[coin].icon}</div>
                
                <div className="flex-1">
                  <div className="font-semibold text-fg">{coin}</div>
                  <div className="text-sm text-fg/70">{COIN_INFO[coin].name}</div>
                </div>
                
                <div className="text-right">
                  <div className="font-semibold text-fg">
                    ${price.price.toLocaleString('en-US', { 
                      minimumFractionDigits: price.price > 1 ? 2 : 6, 
                      maximumFractionDigits: price.price > 1 ? 2 : 6 
                    })}
                  </div>
                  <div className={`flex items-center justify-end gap-1 text-sm ${
                    isPositiveChange ? 'text-brand-green' : 'text-brand-red'
                  }`}>
                    {isPositiveChange ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    <span>{isPositiveChange ? '+' : ''}{price.change24h.toFixed(2)}%</span>
                  </div>
                </div>
                
                {isSelected && (
                  <div className="h-2 w-2 rounded-full bg-primary" />
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}