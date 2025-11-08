'use client'

import { useState, useEffect, useRef } from 'react'
import type { CoinPrice, CoinType } from '../types'

// Mapping for API symbols
const COINGECKO_IDS = {
  BTC: 'bitcoin',
  SOL: 'solana',
}

const BINANCE_SYMBOLS = {
  BTC: 'BTCUSDT',
  SOL: 'SOLUSDT',
}

interface CoinGeckoResponse {
  [key: string]: {
    usd: number
    usd_24h_change: number
  }
}

export function usePrices() {
  const [prices, setPrices] = useState<Record<CoinType, CoinPrice>>({
    BTC: {
      symbol: 'BTC',
      price: 0,
      change24h: 0,
      timestamp: Date.now(),
    },
    SOL: {
      symbol: 'SOL',
      price: 0,
      change24h: 0,
      timestamp: Date.now(),
    },
  })
  const [isLoading, setIsLoading] = useState(true)
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Fetch initial prices from CoinGecko
  const fetchInitialPrices = async () => {
    try {
      const ids = Object.values(COINGECKO_IDS).join(',')
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`,
        { cache: 'no-store' }
      )
      
      if (!response.ok) {
        throw new Error('Failed to fetch prices from CoinGecko')
      }

      const data: CoinGeckoResponse = await response.json()

      setPrices({
        BTC: {
          symbol: 'BTC',
          price: data[COINGECKO_IDS.BTC]?.usd || 0,
          change24h: data[COINGECKO_IDS.BTC]?.usd_24h_change || 0,
          timestamp: Date.now(),
        },
        SOL: {
          symbol: 'SOL',
          price: data[COINGECKO_IDS.SOL]?.usd || 0,
          change24h: data[COINGECKO_IDS.SOL]?.usd_24h_change || 0,
          timestamp: Date.now(),
        },
      })
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching initial prices:', error)
      // Fallback to reasonable default prices if API fails
      setPrices({
        BTC: {
          symbol: 'BTC',
          price: 95000,
          change24h: 0,
          timestamp: Date.now(),
        },
        SOL: {
          symbol: 'SOL',
          price: 185,
          change24h: 0,
          timestamp: Date.now(),
        },
      })
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Fetch initial prices
    fetchInitialPrices()

    // Setup real-time updates via WebSocket
    const setupWebSocketConnection = () => {
      try {
        // Close existing connection if any
        if (wsRef.current) {
          wsRef.current.close()
        }

        // Create streams for both BTC and SOL
        const streams = [BINANCE_SYMBOLS.BTC, BINANCE_SYMBOLS.SOL]
          .map((s) => `${s.toLowerCase()}@ticker`)
          .join('/')

        const ws = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streams}`)

        ws.onopen = () => {
          console.log('Binance WebSocket connected')
        }

        ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data)
            if (message.data) {
              const ticker = message.data
              const symbol = ticker.s // BTCUSDT or SOLUSDT
              const price = parseFloat(ticker.c) // Current price
              const change24h = parseFloat(ticker.P) // 24h percentage change

              setPrices((prev) => {
                if (symbol === BINANCE_SYMBOLS.BTC) {
                  return {
                    ...prev,
                    BTC: {
                      ...prev.BTC,
                      price,
                      change24h,
                      timestamp: Date.now(),
                    },
                  }
                } else if (symbol === BINANCE_SYMBOLS.SOL) {
                  return {
                    ...prev,
                    SOL: {
                      ...prev.SOL,
                      price,
                      change24h,
                      timestamp: Date.now(),
                    },
                  }
                }
                return prev
              })
            }
          } catch (error) {
            console.error('Error parsing WebSocket message:', error)
          }
        }

        ws.onerror = (error) => {
          console.error('WebSocket error:', error)
        }

        ws.onclose = () => {
          console.log('WebSocket closed, attempting to reconnect in 5s...')
          // Attempt to reconnect after 5 seconds
          reconnectTimeoutRef.current = setTimeout(() => {
            setupWebSocketConnection()
          }, 5000)
        }

        wsRef.current = ws
      } catch (error) {
        console.error('Error setting up WebSocket:', error)
      }
    }

    setupWebSocketConnection()

    // Cleanup function
    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
    }
  }, [])

  return { prices, isLoading }
}
