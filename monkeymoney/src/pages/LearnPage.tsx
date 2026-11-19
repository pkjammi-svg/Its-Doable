import { useState } from 'react'
import { LessonList } from '../components/learn/LessonList'
import { LessonView } from '../components/learn/LessonView'
import { CompoundCalculator } from '../components/learn/CompoundCalculator'
import { SIPCalculator } from '../components/learn/SIPCalculator'
import { SWPCalculator } from '../components/learn/SWPCalculator'
import { useLessonProgress } from '../hooks/useDB'
import { LESSONS } from '../data/lessons'

type Tab = 'lessons' | 'calculators'

export function LearnPage() {
  const [tab, setTab] = useState<Tab>('lessons')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const progress = useLessonProgress()

  const lesson = selectedId ? LESSONS.find(l => l.id === selectedId) ?? null : null
  const isComplete = selectedId ? (progress.find(p => p.lessonId === selectedId)?.completed ?? false) : false

  if (lesson) {
    return (
      <LessonView
        lesson={lesson}
        completed={isComplete}
        onBack={() => setSelectedId(null)}
      />
    )
  }

  return (
    <div className="space-y-4">
      <h1 className="font-display font-bold text-xl text-gray-800 dark:text-gray-100">Learn money</h1>

      {/* Tab switcher */}
      <div className="flex bg-gray-100 dark:bg-jungle-800 rounded-2xl p-1 gap-1">
        {(['lessons', 'calculators'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-xl text-sm font-medium font-body capitalize transition-colors ${
              tab === t
                ? 'bg-white dark:bg-jungle-700 text-gray-900 dark:text-gray-100 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'lessons' && (
        <LessonList progress={progress} onSelect={setSelectedId} />
      )}

      {tab === 'calculators' && (
        <div className="space-y-4">
          <SIPCalculator />
          <SWPCalculator />
          <CompoundCalculator />
        </div>
      )}
    </div>
  )
}
