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
    <section id="challenges" className="py-20 md:py-32 relative">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-7xl pointer-events-none opacity-30">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[120px]" />
      </div>

      <div className="container relative mx-auto px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-6 text-3xl font-bold tracking-tight text-fg md:text-5xl">
            Choose your challenge mode
          </h2>
          <p className="text-lg text-fg/60 max-w-2xl mx-auto">
            From solo practice to team battles, find the perfect way to compete and prove your trading skills.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {challengeTypes.map((challenge, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-surface/50 backdrop-blur-sm p-8 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-primary/10 hover:bg-surface/80"
            >
              <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-gradient-to-br from-primary/20 to-transparent blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl ${challenge.bgColor} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                <challenge.icon className={`h-7 w-7 ${challenge.color}`} />
              </div>

              <div className="mb-2 text-xs font-bold uppercase tracking-wider text-primary/80">
                {challenge.subtitle}
              </div>

              <h3 className="mb-4 text-2xl font-bold text-fg">{challenge.title}</h3>

              <p className="mb-8 text-sm leading-relaxed text-fg/60">{challenge.description}</p>

              <a
                href={
                  challenge.title === 'Regular Paper Trading'
                    ? '/trade'
                    : challenge.title === '1v1 Challenge'
                      ? '/vs'
                      : '/battle'
                }
                className="block w-full rounded-xl border border-white/10 bg-white/5 px-6 py-4 text-center text-sm font-bold text-fg transition-all duration-200 hover:bg-primary hover:border-primary hover:text-white hover:shadow-lg hover:shadow-primary/25"
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
