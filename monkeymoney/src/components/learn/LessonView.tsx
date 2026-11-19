import { useState } from 'react'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import { clsx } from 'clsx'
import { db } from '../../db/db'
import { useToast } from '../ui/Toast'
import { CompoundCalculator } from './CompoundCalculator'
import type { Lesson } from '../../data/lessons'

interface Props {
  lesson: Lesson
  completed: boolean
  onBack: () => void
}

export function LessonView({ lesson, completed, onBack }: Props) {
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const { showToast } = useToast()

  async function submitQuiz(optionIndex: number) {
    if (submitted) return
    setQuizAnswer(optionIndex)
    setSubmitted(true)
    const isCorrect = lesson.quiz.options[optionIndex].correct
    if (isCorrect && !completed) {
      await db.lessonProgress.put({ lessonId: lesson.id, completed: true, completedAt: new Date().toISOString() })
      showToast('🍌 +20 bananas! Lesson complete!', { type: 'success' })
    }
  }

  const paragraphs = lesson.content.split('\n\n').filter(Boolean)

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white dark:bg-jungle-900 rounded-3xl p-5 shadow-sm border border-gray-200 dark:border-jungle-800">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-4 transition-colors focus-visible:ring-2 ring-jungle-500 rounded-lg"
        >
          <ArrowLeft size={16} /> Back to lessons
        </button>
        <div className="flex items-center gap-3">
          <span className="text-4xl">{lesson.emoji}</span>
          <div>
            <h2 className="font-display font-bold text-xl text-gray-800 dark:text-gray-100">{lesson.title}</h2>
            <p className="text-xs text-gray-600 dark:text-gray-400 font-body">{lesson.estimatedMinutes} min · {completed && <span className="text-green-500">✓ Complete</span>}</p>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl px-4 py-3">
        <p className="text-xs text-blue-800 dark:text-blue-200 font-body">
          <strong>Learning only.</strong> Not financial advice. Talk to a registered financial adviser or a trusted adult for decisions about your own money.
        </p>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-jungle-900 rounded-3xl p-5 shadow-sm border border-gray-200 dark:border-jungle-800 space-y-4">
        {paragraphs.map((para, i) => (
          <p key={i} className="text-sm text-gray-700 dark:text-gray-200 font-body leading-relaxed">
            {para}
          </p>
        ))}
      </div>

      {/* Compound calculator */}
      {lesson.hasCalculator && <CompoundCalculator />}

      {/* Quiz */}
      <div className="bg-white dark:bg-jungle-900 rounded-3xl p-5 shadow-sm border border-gray-200 dark:border-jungle-800">
        <h3 className="font-display font-bold text-base text-gray-800 dark:text-gray-100 mb-4">Quick check</h3>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-200 font-body mb-4">{lesson.quiz.question}</p>
        <div className="space-y-2">
          {lesson.quiz.options.map((opt, i) => {
            const isSelected = quizAnswer === i
            const showResult = submitted && isSelected
            return (
              <button
                key={i}
                onClick={() => submitQuiz(i)}
                disabled={submitted}
                className={clsx(
                  'w-full text-left px-4 py-3 rounded-2xl text-sm font-body transition-all border focus-visible:ring-2 ring-jungle-500',
                  !submitted && 'border-gray-200 dark:border-jungle-700 bg-white dark:bg-jungle-800 hover:bg-gray-100 dark:hover:bg-jungle-700 text-gray-700 dark:text-gray-200',
                  submitted && !isSelected && 'border-gray-200 dark:border-jungle-700 bg-white dark:bg-jungle-800 text-gray-600 dark:text-gray-400 opacity-60',
                  showResult && opt.correct && 'border-green-400 dark:border-green-600 bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200',
                  showResult && !opt.correct && 'border-red-400 dark:border-red-700 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200',
                )}
              >
                <div className="flex items-center gap-2">
                  <span className={clsx(
                    'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0',
                    !submitted && 'bg-gray-200 dark:bg-jungle-700 text-gray-600 dark:text-gray-300',
                    showResult && opt.correct && 'bg-green-500 text-white',
                    showResult && !opt.correct && 'bg-red-500 text-white',
                    submitted && !isSelected && 'bg-gray-100 dark:bg-jungle-700 text-gray-400',
                  )}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt.text}
                  {showResult && opt.correct && <CheckCircle2 size={16} className="ml-auto text-green-500 shrink-0" />}
                </div>
              </button>
            )
          })}
        </div>
        {submitted && (
          <p className={clsx(
            'mt-3 text-sm font-medium font-body',
            lesson.quiz.options[quizAnswer!]?.correct ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          )}>
            {lesson.quiz.options[quizAnswer!]?.correct
              ? '🎉 Correct! +20 bananas earned!'
              : '❌ Not quite. The lesson is still here to re-read.'}
          </p>
        )}
      </div>
    </div>
  )
}
