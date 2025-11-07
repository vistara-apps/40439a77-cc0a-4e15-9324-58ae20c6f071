import type { Metadata } from 'next'
import { Providers } from './providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'TradeDuel - Paper Trading Challenges on Base',
  description: 'Paper trading challenges and community on Base, powered by Farcaster.',
  icons: {
    icon: '/images/icon-256x256.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
