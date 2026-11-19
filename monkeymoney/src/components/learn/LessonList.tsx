import { ChevronRight, CheckCircle2 } from 'lucide-react'
import { clsx } from 'clsx'
import { LESSONS } from '../../data/lessons'
import type { LessonProgress } from '../../types'

interface Props {
  progress: LessonProgress[]
  onSelect: (lessonId: string) => void
}

export function LessonList({ progress, onSelect }: Props) {
  const progressMap = new Map(progress.map(p => [p.lessonId, p]))

  return (
    <div className="space-y-3">
      {/* Disclaimer */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl px-4 py-3">
        <p className="text-xs text-blue-800 dark:text-blue-200 font-body leading-relaxed">
          <strong>Learning only.</strong> Not financial advice. Talk to a registered financial adviser or a trusted adult for decisions about your own money.
        </p>
      </div>

      {/* Lessons */}
      <div className="bg-gray-100 dark:bg-jungle-900 rounded-3xl overflow-hidden shadow-sm border border-gray-200 dark:border-jungle-800">
        <div className="divide-y divide-gray-200 dark:divide-jungle-800">
          {LESSONS.map((lesson, i) => {
            const done = progressMap.get(lesson.id)?.completed ?? false
            return (
              <button
                key={lesson.id}
                onClick={() => onSelect(lesson.id)}
                className="w-full flex items-center gap-3 px-4 py-4 text-left hover:bg-gray-50 dark:hover:bg-jungle-800/50 transition-colors focus-visible:ring-2 ring-inset ring-jungle-500"
              >
                <span className="text-2xl shrink-0">{lesson.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className={clsx(
                    'text-sm font-semibold font-body',
                    done ? 'text-green-700 dark:text-green-400' : 'text-gray-800 dark:text-gray-100'
                  )}>
                    <span className="text-gray-600 dark:text-gray-400 font-normal mr-1">{String(i + 1).padStart(2, '0')}.</span>
                    {lesson.title}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-body mt-0.5">{lesson.estimatedMinutes} min</p>
                </div>
                {done
                  ? <CheckCircle2 size={18} className="text-green-500 shrink-0" />
                  : <ChevronRight size={18} className="text-gray-400 dark:text-gray-500 shrink-0" />
                }
              </button>
            )
          })}
        </div>
      </div>

      {/* Progress summary */}
      <div className="text-center text-xs text-gray-600 dark:text-gray-400 font-body">
        {progress.filter(p => p.completed).length} / {LESSONS.length} lessons done
      </div>
    </div>
  )
}
