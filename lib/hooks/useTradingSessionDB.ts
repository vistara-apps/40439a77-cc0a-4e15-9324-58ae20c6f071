'use client'
// @ts-nocheck

import { useState, useCallback, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { supabase } from '@/lib/supabase/client'
import type { TradingSession, Trade, CoinType } from '../types'
import { usePrices } from './usePrices'

export function useTradingSessionDB(initialBalance: number = 10000) {
  const { address } = useAccount()
  const { prices, isLoading: pricesLoading } = usePrices()
  const [session, setSession] = useState<TradingSession>({
    id: '',
    mode: 'regular',
    startBalance: initialBalance,
    currentBalance: initialBalance,
    startTime: Date.now(),
    trades: [],
    positions: [],
    pnl: 0,
    pnlPercentage: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  // Load existing session or create new one
  useEffect(() => {
    const loadOrCreateSession = async () => {
      try {
        setIsLoading(true)
        
        // Try to find an active session for this user
        let sessionData: { id: string } | null = null
        if (address) {
          const { data } = await supabase
            .from('tduel_trading_sessions')
            .select('*')
            .eq('user_address', address)
            .eq('status', 'active')
            .eq('mode', 'regular')
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle()
            
          sessionData = data as { id: string } | null
        }

        if (sessionData?.id) {
          // Load existing session
          await loadSession(sessionData.id)
        } else {
          // Create new session
          await createNewSession()
        }
      } catch (error) {
        console.error('Error loading session:', error)
        // Fallback to local state
        setSession(prev => ({ ...prev, id: Date.now().toString() }))
      } finally {
        setIsLoading(false)
      }
    }

    loadOrCreateSession()
  }, [address, initialBalance])

  const createNewSession = useCallback(async () => {
    try {
      const { data: sessionData, error } = await supabase
        .from('tduel_trading_sessions')
        .insert({
          user_address: address,
          mode: 'regular',
          start_balance: initialBalance,
          current_balance: initialBalance,
          start_time: new Date().toISOString(),
          pnl: 0,
          pnl_percentage: 0,
          status: 'active'
        })
        .select()
        .single()

      if (error) throw error

      setSession({
        id: sessionData.id,
        mode: 'regular',
        startBalance: initialBalance,
        currentBalance: initialBalance,
        startTime: Date.now(),
        trades: [],
        positions: [],
        pnl: 0,
        pnlPercentage: 0,
      })
    } catch (error) {
      console.error('Error creating session:', error)
      // Fallback to local state
      setSession(prev => ({ ...prev, id: Date.now().toString() }))
    }
  }, [address, initialBalance])

  const loadSession = async (sessionId: string) => {
    try {
      // Load session data
      const { data: sessionData, error: sessionError } = await supabase
        .from('tduel_trading_sessions')
        .select('*')
        .eq('id', sessionId)
        .single()

      if (sessionError) throw sessionError

      // Load trades
      const { data: tradesData, error: tradesError } = await supabase
        .from('tduel_trades')
        .select('*')
        .eq('session_id', sessionId)
        .order('timestamp', { ascending: true })

      if (tradesError) throw tradesError

      // Load positions
      const { data: positionsData, error: positionsError } = await supabase
        .from('tduel_positions')
        .select('*')
        .eq('session_id', sessionId)

      if (positionsError) throw positionsError

      // Convert to local format
      const trades: Trade[] = tradesData?.map(trade => ({
        id: trade.id,
        coin: trade.coin as CoinType,
        type: trade.type as 'buy' | 'sell',
        amount: Number(trade.amount),
        price: Number(trade.price),
        timestamp: new Date(trade.timestamp).getTime()
      })) || []

      const positions = positionsData?.map(pos => ({
        coin: pos.coin as CoinType,
        amount: Number(pos.amount),
        averagePrice: Number(pos.average_price),
        currentPrice: Number(pos.current_price),
        pnl: Number(pos.pnl),
        pnlPercentage: Number(pos.pnl_percentage)
      })) || []

      setSession({
        id: sessionData.id,
        mode: sessionData.mode as 'regular' | 'vs' | 'battle',
        startBalance: Number(sessionData.start_balance),
        currentBalance: Number(sessionData.current_balance),
        startTime: new Date(sessionData.start_time).getTime(),
        endTime: sessionData.end_time ? new Date(sessionData.end_time).getTime() : undefined,
        trades,
        positions,
        pnl: Number(sessionData.pnl),
        pnlPercentage: Number(sessionData.pnl_percentage),
      })
    } catch (error) {
      console.error('Error loading session:', error)
    }
  }

  const saveTrade = useCallback(async (trade: Trade) => {
    if (!session.id) return

    try {
      await supabase
        .from('tduel_trades')
        .insert({
          session_id: session.id,
          coin: trade.coin,
          type: trade.type,
          amount: trade.amount,
          price: trade.price,
          total_cost: trade.amount * trade.price,
          timestamp: new Date(trade.timestamp).toISOString()
        })
    } catch (error) {
      console.error('Error saving trade:', error)
    }
  }, [session.id])

  const savePositions = useCallback(async (positions: Array<{
    coin: CoinType
    amount: number
    averagePrice: number
    currentPrice: number
    pnl: number
    pnlPercentage: number
  }>) => {
    if (!session.id) return

    try {
      // Delete existing positions
      await supabase
        .from('tduel_positions')
        .delete()
        .eq('session_id', session.id)

      // Insert new positions
      if (positions.length > 0) {
        await supabase
          .from('tduel_positions')
          .insert(
            positions.map(pos => ({
              session_id: session.id,
              coin: pos.coin,
              amount: pos.amount,
              average_price: pos.averagePrice,
              current_price: pos.currentPrice,
              pnl: pos.pnl,
              pnl_percentage: pos.pnlPercentage
            }))
          )
      }
    } catch (error) {
      console.error('Error saving positions:', error)
    }
  }, [session.id])

  const updateSession = useCallback(async (updates: Partial<TradingSession>) => {
    if (!session.id) return

    try {
      await supabase
        .from('tduel_trading_sessions')
        .update({
          current_balance: updates.currentBalance,
          pnl: updates.pnl,
          pnl_percentage: updates.pnlPercentage,
          status: updates.endTime ? 'completed' : 'active',
          end_time: updates.endTime ? new Date(updates.endTime).toISOString() : null
        })
        .eq('id', session.id)
    } catch (error) {
      console.error('Error updating session:', error)
    }
  }, [session.id])

  const executeTrade = useCallback(async (coin: CoinType, type: 'buy' | 'sell', amount: number) => {
    const currentPrice = prices[coin].price
    const cost = amount * currentPrice

    setSession((prev) => {
      // Check if user has enough balance or coins
      if (type === 'buy' && cost > prev.currentBalance) {
        return prev // Insufficient balance
      }

      const existingPosition = prev.positions.find((p) => p.coin === coin)
      if (type === 'sell' && (!existingPosition || existingPosition.amount < amount)) {
        return prev // Insufficient position
      }

      // Create trade
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
          const totalAmount = existingPosition.amount + amount
          const newAveragePrice = ((existingPosition.amount * existingPosition.averagePrice) + cost) / totalAmount
          newPositions = newPositions.map((p) => 
            p.coin === coin 
              ? { 
                  ...p, 
                  amount: totalAmount, 
                  averagePrice: newAveragePrice,
                  currentPrice,
                  pnl: (currentPrice - newAveragePrice) * totalAmount,
                  pnlPercentage: ((currentPrice - newAveragePrice) / newAveragePrice) * 100
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
        // Sell
        if (existingPosition) {
          if (existingPosition.amount === amount) {
            // Close position completely
            newPositions = newPositions.filter((p) => p.coin !== coin)
          } else {
            // Partial sell
            const remainingAmount = existingPosition.amount - amount
            newPositions = newPositions.map((p) =>
              p.coin === coin
                ? {
                    ...p,
                    amount: remainingAmount,
                    currentPrice,
                    pnl: (currentPrice - p.averagePrice) * remainingAmount,
                    pnlPercentage: ((currentPrice - p.averagePrice) / p.averagePrice) * 100
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

      const updatedSession = {
        ...prev,
        currentBalance: newBalance,
        trades: [...prev.trades, trade],
        positions: newPositions,
        pnl,
        pnlPercentage,
      }

      // Save to database
      saveTrade(trade)
      savePositions(newPositions)
      updateSession(updatedSession)

      return updatedSession
    })
  }, [prices, session.id, saveTrade, savePositions, updateSession])

  const updatePositions = useCallback(() => {
    setSession((prev) => {
      const updatedPositions = prev.positions.map((position) => {
        const currentPrice = prices[position.coin]?.price || position.currentPrice
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

      const updatedSession = {
        ...prev,
        positions: updatedPositions,
        pnl,
        pnlPercentage,
      }

      // Save positions to database
      savePositions(updatedPositions)
      updateSession(updatedSession)

      return updatedSession
    })
  }, [prices, session.id, savePositions, updateSession])

  const endSession = useCallback(() => {
    setSession((prev) => {
      const endedSession = {
        ...prev,
        endTime: Date.now(),
      }
      updateSession(endedSession)
      return endedSession
    })
  }, [session.id, updateSession])

  const resetSession = useCallback(() => {
    createNewSession()
  }, [createNewSession])

  return {
    session,
    prices,
    isLoading: isLoading || pricesLoading,
    executeTrade,
    updatePositions,
    endSession,
    resetSession,
  }
}