'use client'

import { useState, useCallback } from 'react'
import type { TradingSession, Trade, CoinType } from '../types'
import { usePrices } from './usePrices'

export function useTradingSession(initialBalance: number = 10000) {
  const { prices, isLoading } = usePrices()
  const [session, setSession] = useState<TradingSession>({
    id: Date.now().toString(),
    mode: 'regular',
    startBalance: initialBalance,
    currentBalance: initialBalance,
    startTime: Date.now(),
    trades: [],
    positions: [],
    pnl: 0,
    pnlPercentage: 0,
  })

  const executeTrade = useCallback((coin: CoinType, type: 'buy' | 'sell', amount: number) => {
    const currentPrice = prices[coin].price
    const cost = amount * currentPrice

    setSession((prev) => {
      // Check if user has enough balance or coins
      if (type === 'buy' && cost > prev.currentBalance) {
        return prev // Insufficient balance
      }

      const existingPosition = prev.positions.find((p) => p.coin === coin)
      if (type === 'sell' && (!existingPosition || existingPosition.amount < amount)) {
        return prev // Insufficient coins
      }

      // Create new trade
      const trade: Trade = {
        id: Date.now().toString(),
        coin,
        type,
        amount,
        price: currentPrice,
        timestamp: Date.now(),
      }

      // Update balance
      const newBalance = type === 'buy' 
        ? prev.currentBalance - cost 
        : prev.currentBalance + cost

      // Update positions
      let newPositions = [...prev.positions]
      
      if (type === 'buy') {
        if (existingPosition) {
          // Update existing position
          const newAmount = existingPosition.amount + amount
          const newAveragePrice = 
            (existingPosition.averagePrice * existingPosition.amount + currentPrice * amount) / newAmount
          
          newPositions = newPositions.map((p) =>
            p.coin === coin
              ? {
                  ...p,
                  amount: newAmount,
                  averagePrice: newAveragePrice,
                  currentPrice,
                  pnl: (currentPrice - newAveragePrice) * newAmount,
                  pnlPercentage: ((currentPrice - newAveragePrice) / newAveragePrice) * 100,
                }
              : p
          )
        } else {
          // Create new position
          newPositions.push({
            coin,
            amount,
            averagePrice: currentPrice,
            currentPrice,
            pnl: 0,
            pnlPercentage: 0,
          })
        }
      } else {
        // Sell position
        if (existingPosition) {
          const newAmount = existingPosition.amount - amount
          if (newAmount <= 0) {
            // Remove position
            newPositions = newPositions.filter((p) => p.coin !== coin)
          } else {
            // Update position
            newPositions = newPositions.map((p) =>
              p.coin === coin
                ? {
                    ...p,
                    amount: newAmount,
                    currentPrice,
                    pnl: (currentPrice - p.averagePrice) * newAmount,
                    pnlPercentage: ((currentPrice - p.averagePrice) / p.averagePrice) * 100,
                  }
                : p
            )
          }
        }
      }

      // Calculate total P&L
      const totalValue = newBalance + newPositions.reduce(
        (sum, p) => sum + p.amount * p.currentPrice, 
        0
      )
      const pnl = totalValue - prev.startBalance
      const pnlPercentage = (pnl / prev.startBalance) * 100

      return {
        ...prev,
        currentBalance: newBalance,
        trades: [...prev.trades, trade],
        positions: newPositions,
        pnl,
        pnlPercentage,
      }
    })
  }, [prices])

  const updatePositions = useCallback(() => {
    setSession((prev) => {
      const updatedPositions = prev.positions.map((position) => {
        const currentPrice = prices[position.coin].price
        const pnl = (currentPrice - position.averagePrice) * position.amount
        const pnlPercentage = ((currentPrice - position.averagePrice) / position.averagePrice) * 100

        return {
          ...position,
          currentPrice,
          pnl,
          pnlPercentage,
        }
      })

      const totalValue = prev.currentBalance + updatedPositions.reduce(
        (sum, p) => sum + p.amount * p.currentPrice,
        0
      )
      const pnl = totalValue - prev.startBalance
      const pnlPercentage = (pnl / prev.startBalance) * 100

      return {
        ...prev,
        positions: updatedPositions,
        pnl,
        pnlPercentage,
      }
    })
  }, [prices])

  const endSession = useCallback(() => {
    setSession((prev) => ({
      ...prev,
      endTime: Date.now(),
    }))
  }, [])

  const resetSession = useCallback(() => {
    setSession({
      id: Date.now().toString(),
      mode: 'regular',
      startBalance: initialBalance,
      currentBalance: initialBalance,
      startTime: Date.now(),
      trades: [],
      positions: [],
      pnl: 0,
      pnlPercentage: 0,
    })
  }, [initialBalance])

  return {
    session,
    prices,
    isLoading,
    executeTrade,
    updatePositions,
    endSession,
    resetSession,
  }
}
