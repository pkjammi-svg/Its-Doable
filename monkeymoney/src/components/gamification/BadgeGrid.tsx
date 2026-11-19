import { clsx } from 'clsx'
import { BADGES, LEVELS } from '../../types'
import type { Level } from '../../types'

interface Props {
  earnedBadges: string[]
  bananas: number
  level: Level
}

export function BadgeGrid({ earnedBadges, bananas, level }: Props) {
  const nextLevel = LEVELS.find(l => l.minBananas > bananas)
  const progressToNext = nextLevel
    ? ((bananas - level.minBananas) / (nextLevel.minBananas - level.minBananas)) * 100
    : 100

  return (
    <div className="space-y-4">
      {/* Level card */}
      <div className="bg-white dark:bg-jungle-900 rounded-3xl p-5 shadow-sm border border-gray-200 dark:border-jungle-800">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">{level.emoji}</span>
          <div>
            <p className="font-display font-bold text-lg text-gray-800 dark:text-gray-100">{level.name}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 font-body">
              🍌 {bananas} bananas
              {nextLevel && ` · ${nextLevel.minBananas - bananas} to ${nextLevel.name}`}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-100 dark:bg-jungle-800 rounded-full h-2.5">
          <div
            className="bg-banana-400 h-2.5 rounded-full transition-all duration-700 motion-reduce:transition-none"
            style={{ width: `${Math.min(progressToNext, 100)}%` }}
          />
        </div>
        {nextLevel && (
          <div className="flex justify-between text-[10px] text-gray-600 dark:text-gray-400 font-body mt-1">
            <span>{level.name}</span>
            <span>{nextLevel.name}</span>
          </div>
        )}
      </div>

      {/* Badges */}
      <div className="bg-white dark:bg-jungle-900 rounded-3xl p-5 shadow-sm border border-gray-200 dark:border-jungle-800">
        <h3 className="font-display font-bold text-base text-gray-800 dark:text-gray-100 mb-4">Badges</h3>
        <div className="grid grid-cols-2 gap-3">
          {BADGES.map(badge => {
            const earned = earnedBadges.includes(badge.id)
            return (
              <div
                key={badge.id}
                className={clsx(
                  'flex items-start gap-3 p-3 rounded-2xl transition-all',
                  earned
                    ? 'bg-banana-50 dark:bg-banana-900/20 border border-banana-200 dark:border-banana-800'
                    : 'bg-white dark:bg-jungle-800/50 border border-gray-100 dark:border-jungle-800 opacity-50 grayscale'
                )}
              >
                <span className={clsx('text-2xl', !earned && 'opacity-40')}>{badge.emoji}</span>
                <div className="min-w-0">
                  <p className={clsx(
                    'text-xs font-semibold font-body',
                    earned ? 'text-banana-800 dark:text-banana-200' : 'text-gray-500 dark:text-gray-500'
                  )}>
                    {badge.name}
                  </p>
                  <p className="text-[10px] text-gray-600 dark:text-gray-400 font-body leading-tight mt-0.5">
                    {badge.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
