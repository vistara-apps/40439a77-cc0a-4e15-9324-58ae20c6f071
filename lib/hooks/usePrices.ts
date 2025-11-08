'use client'

import { useState, useEffect } from 'react'
import type { CoinPrice, CoinType } from '../types'

// Mock price data - in production, this would fetch from a real API
const INITIAL_PRICES = {
  BTC: 43250.00,
  SOL: 98.50,
}

export function usePrices() {
  const [prices, setPrices] = useState<Record<CoinType, CoinPrice>>({
    BTC: {
      symbol: 'BTC',
      price: INITIAL_PRICES.BTC,
      change24h: 2.5,
      timestamp: Date.now(),
    },
    SOL: {
      symbol: 'SOL',
      price: INITIAL_PRICES.SOL,
      change24h: -1.2,
      timestamp: Date.now(),
    },
  })

  useEffect(() => {
    // Simulate real-time price updates
    const interval = setInterval(() => {
      setPrices((prev) => ({
        BTC: {
          ...prev.BTC,
          price: prev.BTC.price * (1 + (Math.random() - 0.5) * 0.002), // ±0.1% change
          change24h: prev.BTC.change24h + (Math.random() - 0.5) * 0.1,
          timestamp: Date.now(),
        },
        SOL: {
          ...prev.SOL,
          price: prev.SOL.price * (1 + (Math.random() - 0.5) * 0.003), // ±0.15% change
          change24h: prev.SOL.change24h + (Math.random() - 0.5) * 0.15,
          timestamp: Date.now(),
        },
      }))
    }, 2000) // Update every 2 seconds

    return () => clearInterval(interval)
  }, [])

  return prices
}
