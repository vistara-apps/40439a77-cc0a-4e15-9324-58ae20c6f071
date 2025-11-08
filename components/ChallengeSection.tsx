'use client'

import { Clock, Target, TrendingDown } from 'lucide-react'

const challengeTypes = [
  {
    title: 'Regular Paper Trading',
    subtitle: 'Solo Mode',
    description: 'Practice trading at your own pace. Set goals, track progress, and build confidence without pressure.',
    icon: Target,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    title: '1v1 Challenge',
    subtitle: 'Duel Mode',
    description: 'Challenge friends to head-to-head trading duels. Set profit goals, loss limits, and compete for bragging rights.',
    icon: Clock,
    color: 'text-accent',
    bgColor: 'bg-accent/10',
  },
  {
    title: 'Group Battle',
    subtitle: 'Team Mode',
    description: 'Join group competitions with friends. Collaborate on strategy and compete for maximum profit within time limits.',
    icon: TrendingDown,
    color: 'text-brand-green',
    bgColor: 'bg-brand-green/10',
  },
]

export function ChallengeSection() {
  return (
    <section id="challenges" className="py-20 md:py-32 bg-surface/30">
      <div className="container mx-auto px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-fg md:text-4xl">
            Choose your challenge mode
          </h2>
          <p className="text-lg text-fg/70">
            From solo practice to team battles, find the perfect way to compete
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {challengeTypes.map((challenge, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-lg border border-white/10 bg-surface p-8 shadow-trading transition-all duration-300 hover:border-primary/30 hover:shadow-card"
            >
              <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-gradient-to-br from-primary/20 to-transparent blur-2xl" />
              
              <div className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-lg ${challenge.bgColor} transition-transform duration-300 group-hover:scale-110`}>
                <challenge.icon className={`h-7 w-7 ${challenge.color}`} />
              </div>

              <div className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary">
                {challenge.subtitle}
              </div>
              
              <h3 className="mb-3 text-2xl font-bold text-fg">{challenge.title}</h3>
              
              <p className="mb-6 text-sm text-fg/70">{challenge.description}</p>

              <a
                href={
                  challenge.title === 'Regular Paper Trading'
                    ? '/trade'
                    : challenge.title === '1v1 Challenge'
                    ? '/vs'
                    : '/battle'
                }
                className="block w-full rounded-lg border border-primary/20 bg-primary/5 px-6 py-3 text-center text-sm font-semibold text-primary transition-all duration-200 hover:bg-primary hover:text-white"
              >
                Start Challenge
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
