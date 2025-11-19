import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

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
      <body className={`${inter.className} min-h-screen bg-bg text-fg antialiased selection:bg-primary selection:text-white`}>
        <div className="fixed inset-0 -z-10 h-full w-full bg-bg bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20"></div>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
