'use client'

import { useEffect, useRef, memo } from 'react'
import type { CoinType } from '@/lib/types'

interface TradingViewWidgetProps {
  coin: CoinType
  interval?: string
  theme?: 'light' | 'dark'
  height?: number
  showDetails?: boolean
}

function TradingViewWidget({
  coin,
  interval = 'D',
  theme = 'dark',
  height = 400,
  showDetails = true,
}: TradingViewWidgetProps) {
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const containerElement = container.current
    if (!containerElement) return

    // Clear previous content
    containerElement.innerHTML = ''

    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js'
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
      symbols: [[symbol]],
      chartOnly: !showDetails,
      width: '100%',
      height: height,
      locale: 'en',
      colorTheme: theme,
      autosize: true,
      showVolume: true,
      showMA: false,
      hideDateRanges: false,
      hideMarketStatus: true,
      hideSymbolLogo: false,
      scalePosition: 'right',
      scaleMode: 'Normal',
      fontFamily: '-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif',
      fontSize: '10',
      noTimeScale: false,
      valuesTracking: '1',
      changeMode: 'price-and-percent',
      chartType: 'area',
      maLineColor: '#2962FF',
      maLineWidth: 1,
      maLength: 9,
      lineWidth: 2,
      lineType: 0,
      dateRanges: ['1d|1', '1m|30', '3m|60', '12m|1D', '60m|1W', 'all|1M'],
      upColor: '#22ab94',
      downColor: '#f7525f',
      borderUpColor: '#22ab94',
      borderDownColor: '#f7525f',
      wickUpColor: '#22ab94',
      wickDownColor: '#f7525f'
    })

    containerElement.appendChild(script)

    return () => {
      if (containerElement) {
        containerElement.innerHTML = ''
      }
    }
  }, [coin, interval, theme, height, showDetails])

  return (
    <div className="tradingview-widget-container" ref={container}>
      <div className="tradingview-widget-container__widget"></div>
    </div>
  )
}

export default memo(TradingViewWidget)