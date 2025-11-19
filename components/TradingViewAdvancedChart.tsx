'use client'

import { useEffect, useRef, memo } from 'react'
import type { CoinType } from '@/lib/types'

interface TradingViewAdvancedChartProps {
  coin: CoinType
  theme?: 'light' | 'dark'
  height?: number
  interval?: string
}

function TradingViewAdvancedChart({
  coin,
  theme = 'dark',
  height = 500,
  interval = 'D',
}: TradingViewAdvancedChartProps) {
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const containerElement = container.current
    if (!containerElement) return

    // Clear previous content
    containerElement.innerHTML = ''

    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js'
    script.type = 'text/javascript'
    script.async = true
    
    const getSymbol = (coin: CoinType) => {
      switch (coin) {
        case 'BTC':
          return 'BINANCE:BTCUSDT'
        case 'SOL':
          return 'BINANCE:SOLUSDT'
        case 'ETH':
          return 'BINANCE:ETHUSDT'
        case 'PUMP':
          return 'MEXC:PUMPUSDT'
        case 'DOGE':
          return 'BINANCE:DOGEUSDT'
        default:
          return 'BINANCE:BTCUSDT'
      }
    }
    
    const symbol = getSymbol(coin)
    
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: symbol,
      interval: interval,
      timezone: 'Etc/UTC',
      theme: theme,
      style: '1',
      locale: 'en',
      backgroundColor: 'rgba(0, 0, 0, 0)',
      gridColor: 'rgba(255, 255, 255, 0.06)',
      allow_symbol_change: false,
      calendar: false,
      support_host: 'https://www.tradingview.com',
      height: height,
      hide_side_toolbar: true,
      hide_top_toolbar: false,
      toolbar_bg: '#1a1a1a',
      enable_publishing: false,
      withdateranges: true,
      range: '1D',
      hide_legend: true,
      save_image: false,
      container_id: 'tradingview_chart'
    })

    containerElement.appendChild(script)

    return () => {
      if (containerElement) {
        containerElement.innerHTML = ''
      }
    }
  }, [coin, theme, height, interval])

  return (
    <div className="tradingview-widget-container" ref={container} style={{ height: `${height}px` }}>
      <div className="tradingview-widget-container__widget" id="tradingview_chart"></div>
    </div>
  )
}

export default memo(TradingViewAdvancedChart)