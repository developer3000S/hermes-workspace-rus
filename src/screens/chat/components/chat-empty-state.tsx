import { HugeiconsIcon } from '@hugeicons/react'
import { BrainIcon, CodeIcon, PuzzleIcon } from '@hugeicons/core-free-icons'
import { motion } from 'motion/react'
import { useEffect, useState } from 'react'

type ProfileSummary = {
  name: string
  model?: string
  active?: boolean
}

type SuggestionChip = {
  label: string
  prompt: string
  icon: unknown
}

const SUGGESTIONS: Array<SuggestionChip> = [
  {
    label: 'Анализ рабочего пространства',
    prompt:
      'Проанализируй структуру этого рабочего пространства и назови 3 инженерных риска. Используй инструменты и будь краток.',
    icon: CodeIcon,
  },
  {
    label: 'Сохранить предпочтение',
    prompt:
      'Сохрани в память точно: "Для демо отвечай максимум 3 пунктами и ставь риск на первое место". Затем подтверди сохранение.',
    icon: BrainIcon,
  },
  {
    label: 'Создать файл',
    prompt: 'Создай файл demo-checklist.md с 5 проверками перед запуском этого приложения.',
    icon: PuzzleIcon,
  },
]

type ChatEmptyStateProps = {
  onSuggestionClick?: (prompt: string) => void
  compact?: boolean
}

export function ChatEmptyState({
  onSuggestionClick,
  compact = false,
}: ChatEmptyStateProps) {
  const [activeProfile, setActiveProfile] = useState<ProfileSummary | null>(null)

  useEffect(() => {
    fetch('/api/profiles/list')
      .then((res) => res.json())
      .then((data) => {
        const profiles = data?.profiles as Array<ProfileSummary> | undefined
        const active = profiles?.find((p) => p.active)
        if (active) setActiveProfile(active)
      })
      .catch(() => {
        // silently ignore — profile info is cosmetic
      })
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="flex h-full flex-col items-center justify-center px-4 py-8"
    >
      <div className="flex max-w-xl flex-col items-center text-center">
        {/* Avatar in editorial frame, no glow — architectural restraint */}
        <div className="relative mb-6">
          <img
            src="/claude-avatar.webp"
            alt="Hermes Agent"
            className="relative size-20 rounded-md"
            style={{
              border: '1px solid var(--theme-border)',
              padding: '4px',
              background: 'var(--theme-card)',
            }}
          />
        </div>

        {/* Editorial micro-label */}
        <p
          className="micro-label mb-2"
          style={{ color: 'var(--theme-muted)' }}
        >
          Hermes Workspace
        </p>

        {/* Editorial display title */}
        <h2
          className="editorial-display text-3xl"
          style={{ color: 'var(--theme-text)' }}
        >
          Начать сессию
        </h2>

        {activeProfile && (
          <span className="mt-2 text-xs" style={{ color: 'var(--theme-accent)' }}>
            {activeProfile.name}
            {activeProfile.model ? ` · ${activeProfile.model}` : ''}
          </span>
        )}

        {!compact && (
          <>
            <p className="mt-3 text-sm" style={{ color: 'var(--theme-muted)' }}>
              Чат с агентом · живые инструменты · память · полная наблюдаемость
            </p>
          </>
        )}

        {/* Prompt chips */}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion.label}
              type="button"
              onClick={() => onSuggestionClick?.(suggestion.prompt)}
              className="flex cursor-pointer items-center gap-2 rounded-md px-3.5 py-2 text-xs font-medium transition-all"
              style={{
                background: 'var(--theme-card)',
                border: '1px solid var(--theme-border)',
                color: 'var(--theme-text)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--theme-card2)'
                e.currentTarget.style.borderColor = 'var(--theme-accent-border)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--theme-card)'
                e.currentTarget.style.borderColor = 'var(--theme-border)'
              }}
            >
              <HugeiconsIcon
                icon={suggestion.icon as any}
                size={14}
                strokeWidth={1.5}
                style={{ color: 'var(--theme-accent)' }}
              />
              {suggestion.label}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
