import { useState } from 'react'
import { LessonList } from '../components/learn/LessonList'
import { LessonView } from '../components/learn/LessonView'
import { useLessonProgress } from '../hooks/useDB'
import { LESSONS } from '../data/lessons'

export function LearnPage() {
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
      <LessonList progress={progress} onSelect={setSelectedId} />
    </div>
  )
}
