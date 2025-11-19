'use client'

import { useEffect, useState } from 'react'
import { sdk } from '@farcaster/miniapp-sdk'
import { Hero } from '@/components/Hero'
import { Features } from '@/components/Features'
import { ChallengeSection } from '@/components/ChallengeSection'
import { Header } from '@/components/Header'
import { Leaderboard } from '@/components/Leaderboard'

export default function Home() {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // CRITICAL: Call sdk.actions.ready() to prevent infinite loading
    sdk.actions.ready()
    setIsReady(true)
  }, [])

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="animate-pulse">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-bg">
      <Header />
      <Hero />
      <Features />
      <ChallengeSection />
      <Leaderboard />
    </main>
  )
}
