'use client'

import { useState } from 'react'
import { Settings, Target, AlertCircle, Clock, TrendingUp } from 'lucide-react'
import type { ChallengeSettings } from '@/lib/types'

interface ChallengeSettingsProps {
  onSave: (settings: ChallengeSettings) => void
  defaultSettings?: ChallengeSettings
}

export function ChallengeSettingsComponent({ onSave, defaultSettings }: ChallengeSettingsProps) {
  const [settings, setSettings] = useState<ChallengeSettings>(
    defaultSettings || {
      startingBalance: 10000,
      maxProfitGoal: undefined,
      maxLoss: undefined,
      duration: undefined,
    }
  )

  const handleSave = () => {
    onSave(settings)
  }

  return (
    <div className="rounded-lg border border-white/10 bg-surface p-6">
      <div className="mb-4 flex items-center gap-2">
        <Settings className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-fg">Challenge Settings</h3>
      </div>

      <div className="space-y-4">
        {/* Starting Balance */}
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm text-fg/70">
            <Target className="h-4 w-4" />
            Starting Balance ($)
          </label>
          <input
            type="number"
            value={settings.startingBalance}
            onChange={(e) =>
              setSettings({ ...settings, startingBalance: parseFloat(e.target.value) || 10000 })
            }
            min="1000"
            step="1000"
            className="w-full rounded-lg border border-white/10 bg-bg px-4 py-2 text-fg focus:border-primary focus:outline-none"
          />
        </div>

        {/* Max Profit Goal */}
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm text-fg/70">
            <TrendingUp className="h-4 w-4" />
            Max Profit Goal ($)
          </label>
          <input
            type="number"
            value={settings.maxProfitGoal || ''}
            onChange={(e) =>
              setSettings({
                ...settings,
                maxProfitGoal: e.target.value ? parseFloat(e.target.value) : undefined,
              })
            }
            placeholder="Optional"
            min="0"
            step="100"
            className="w-full rounded-lg border border-white/10 bg-bg px-4 py-2 text-fg focus:border-primary focus:outline-none"
          />
          <p className="mt-1 text-xs text-fg/60">Challenge ends when this profit is reached</p>
        </div>

        {/* Max Loss */}
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm text-fg/70">
            <AlertCircle className="h-4 w-4" />
            Max Loss ($)
          </label>
          <input
            type="number"
            value={settings.maxLoss || ''}
            onChange={(e) =>
              setSettings({
                ...settings,
                maxLoss: e.target.value ? parseFloat(e.target.value) : undefined,
              })
            }
            placeholder="Optional"
            min="0"
            step="100"
            className="w-full rounded-lg border border-white/10 bg-bg px-4 py-2 text-fg focus:border-primary focus:outline-none"
          />
          <p className="mt-1 text-xs text-fg/60">Challenge ends when this loss is reached</p>
        </div>

        {/* Duration */}
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm text-fg/70">
            <Clock className="h-4 w-4" />
            Duration (minutes)
          </label>
          <input
            type="number"
            value={settings.duration || ''}
            onChange={(e) =>
              setSettings({
                ...settings,
                duration: e.target.value ? parseFloat(e.target.value) : undefined,
              })
            }
            placeholder="Optional"
            min="1"
            step="5"
            className="w-full rounded-lg border border-white/10 bg-bg px-4 py-2 text-fg focus:border-primary focus:outline-none"
          />
          <p className="mt-1 text-xs text-fg/60">Challenge ends after this time</p>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-all hover:bg-accent"
        >
          Save Settings
        </button>
      </div>
    </div>
  )
}
