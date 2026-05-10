/**
 * Универсальная заглушка для функций, необходимые эндпоинты которых недоступны.
 * Отображает состояние в корпоративном стиле с указанием:
 *   - Причины недоступности
 *   - Действий, которые может предпринять пользователь (обновить сервис, проверить соединение и т.д.)
 *   - Ссылки «подробнее» на соответствующую задачу или документацию
 *
 * Используйте через <FeatureNotReady>, когда проверка возможностей возвращает false.
 */
import { HugeiconsIcon } from '@hugeicons/react'
import { Alert02Icon } from '@hugeicons/core-free-icons'

export type FeatureNotReadyProps = {
  /** Понятное название — например, «Проводник». */
  feature: string
  /** Причина недоступности. */
  reason: string
  /** Что пользователю следует сделать дальше. */
  action?: string
  /** Необязательная ссылка на задачу или документацию внешнего сервиса. */
  learnMoreUrl?: string
  /** Необязательное переопределение метки «подробнее». */
  learnMoreLabel?: string
}

export function FeatureNotReady({
  feature,
  reason,
  action,
  learnMoreUrl,
  learnMoreLabel = 'Подробнее',
}: FeatureNotReadyProps) {
  return (
    <div className="flex h-full min-h-[480px] items-center justify-center p-8">
      <div
        className="w-full max-w-xl rounded-2xl border-2 p-8 text-center"
        style={{
          borderColor: 'var(--theme-border, rgba(255,255,255,0.1))',
          background:
            'linear-gradient(180deg, rgba(8,12,20,0.6), rgba(0,0,0,0.6))',
          color: 'var(--theme-text, white)',
        }}
      >
        <div
          className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full"
          style={{
            background: 'rgba(251,191,36,0.12)',
            color: '#fbbf24',
            border: '2px solid rgba(251,191,36,0.35)',
          }}
        >
          <HugeiconsIcon icon={Alert02Icon} size={26} strokeWidth={1.6} />
        </div>
        <div className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-amber-300/80">
          Внешний сервис не готов
        </div>
        <div className="mb-3 text-2xl font-extrabold">{feature}</div>
        <p className="mb-4 text-sm leading-relaxed text-white/75">{reason}</p>
        {action && (
          <p className="mb-5 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left text-[12px] leading-relaxed text-white/85">
            <span className="mr-1 font-bold uppercase tracking-[0.14em] text-white/55">
              Далее:
            </span>
            {action}
          </p>
        )}
        {learnMoreUrl && (
          <a
            href={learnMoreUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-[12px] font-semibold text-white/80 transition hover:border-white/30 hover:bg-white/10"
          >
            {learnMoreLabel}
            <span aria-hidden>↗</span>
          </a>
        )}
      </div>
    </div>
  )
}
