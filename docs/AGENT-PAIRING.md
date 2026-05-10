# Руководство по сопряжению Агента — Workspace ↔ Шлюз Claude

> **Для кого:** ИИ-агенты, помогающие пользователям настроить Hermes Workspace.
> Выполняйте эти шаги по порядку. У каждого шага есть команда проверки — не
> переходите к следующему, пока проверка не будет пройдена.

## Архитектура (30-секундная версия)

```
┌─────────────────┐       HTTP :8642        ┌────────────────────────┐
│   Шлюз Claude   │◄──────────────────────►│    Hermes Workspace    │
│ (Python, FastAPI)│  /health, /v1/chat,    │      (Node, Vite)      │
│  hermes gateway  │  /api/sessions и др.   │      pnpm dev          │
│  run             │                        │      порт 3000         │
└─────────────────┘                        └────────────────────────┘
```

Workspace общается со шлюзом по протоколу HTTP. Никаких WebSocket. Никакой магии.
Если `curl http://127.0.0.1:8642/health` возвращает JSON, они могут работать в паре.

---

## Шаг 1 — Установлен ли hermes-agent?

```bash
claude --version
```

**Успех:** выводит `Hermes Agent vX.Y.Z`.
**Ошибка:** `command not found` (команда не найдена).

### Исправление (если hermes-agent не установлен)

```bash
# Официальный установщик Nous — работает на macOS, Linux, WSL
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash
```

После установки перезапустите оболочку или выполните:
```bash
export PATH="$HOME/.local/bin:$PATH"
claude --version
```

---

## Шаг 2 — Включен ли API-сервер?

Шлюз предоставляет HTTP API на порту 8642, но только если в файле окружения claude установлено `API_SERVER_ENABLED=true`.

```bash
# Найти файл окружения
CLAUDE_ENV="$(claude config env-path 2>/dev/null || echo "$HOME/.claude/.env")"
echo "Файл окружения Claude: $CLAUDE_ENV"

# Проверить наличие ключа
grep -i "API_SERVER" "$CLAUDE_ENV" 2>/dev/null || echo "КЛЮЧИ API_SERVER НЕ НАЙДЕНЫ"
```

**Успех:** вывод включает `API_SERVER_ENABLED=true` (с подчеркиваниями).

**Частая ошибка — неверные имена переменных:**
```
# ❌ НЕВЕРНО (отсутствуют подчеркивания — шлюз просто проигнорирует их)
APISERVERENABLED=true
APISERVERHOST=0.0.0.0

# ✅ ВЕРНО
API_SERVER_ENABLED=true
API_SERVER_HOST=127.0.0.1
```

> **Важно:** имена переменных окружения ДОЛЖНЫ содержать подчеркивания. `APISERVERENABLED` ≠
> `API_SERVER_ENABLED`. Шлюз считывает точные имена через `os.getenv()`.
> Опечатки молча игнорируются — никаких предупреждений или ошибок, просто API-сервер не запустится.

### Исправление

```bash
CLAUDE_ENV="$(claude config env-path 2>/dev/null || echo "$HOME/.claude/.env")"
mkdir -p "$(dirname "$CLAUDE_ENV")"

# Сначала удаляем версии с опечатками
sed -i.bak '/^APISERVERENABLED/d; /^APISERVERHOST/d; /^APISERVERKEY/d; /^APISERVERPORT/d' "$CLAUDE_ENV" 2>/dev/null || true

# Записываем правильные ключи (идемпотентно — обновляет существующие или добавляет новые)
grep -q '^API_SERVER_ENABLED=' "$CLAUDE_ENV" 2>/dev/null && \
  sed -i.bak 's/^API_SERVER_ENABLED=.*/API_SERVER_ENABLED=true/' "$CLAUDE_ENV" || \
  echo 'API_SERVER_ENABLED=true' >> "$CLAUDE_ENV"
```

**НЕ устанавливайте `API_SERVER_HOST=0.0.0.0`**, если только пользователю явно не требуется
сетевой доступ И он не установил `API_SERVER_KEY=<какой-то-секрет>`. Шлюз отказывается
привязываться к внешним интерфейсам без ключа (тихая ошибка). По умолчанию `127.0.0.1` —
правильный вариант для локального Workspace.

---

## Шаг 3 — Запущен ли процесс шлюза?

```bash
pgrep -af "claude.*gateway" || echo "НЕ ЗАПУЩЕН"
```

**Успех:** показывает процесс `hermes gateway run` (или похожий).
**Ошибка:** ничего не найдено.

### Исправление

```bash
# Запуск на переднем плане (рекомендуется для отладки — вы видите весь вывод)
hermes gateway run

# ИЛИ если используете systemd
hermes gateway install   # создает сервис
systemctl --user start claude-gateway
```

**Первый запуск:** claude может запросить начальную настройку (провайдер, модель). Завершите
интерактивную настройку перед продолжением.

---

## Шаг 4 — Привязан ли порт 8642?

```bash
# Linux / WSL
ss -tlnp | grep 8642 || echo "ПОРТ НЕ ПРИВЯЗАН"

# macOS
lsof -iTCP:8642 -sTCP:LISTEN || echo "ПОРТ НЕ ПРИВЯЗАН"

# Универсальный запасной вариант
curl -sf http://127.0.0.1:8642/health && echo "OK" || echo "НЕ ДОСТУПЕН"
```

**Успех:** порт привязан И `curl /health` возвращает `{"status": "ok", "platform": "hermes-agent"}`.

**Ошибка — шлюз запущен, но порт не привязан:** API-сервер не запустился.
Вернитесь к Шагу 2 и убедитесь, что в переменных окружения есть подчеркивания.

**Ошибка — порт занят чем-то другим:**
```bash
# Найти, что занимает порт
lsof -i :8642   # macOS
ss -tlnp | grep 8642   # Linux
# Убить зависший процесс, затем перезапустить шлюз
```

---

## Шаг 5 — Указывает ли Workspace на шлюз?

```bash
# В директории hermes-workspace
cat .env | grep HERMES_API_URL
```

**Успех:** `HERMES_API_URL=http://127.0.0.1:8642`

**Ошибка или отсутствует:**
```bash
# В директории hermes-workspace
echo 'HERMES_API_URL=http://127.0.0.1:8642' >> .env
```

Если файла `.env` не существует:
```bash
cp .env.example .env
# Затем установите HERMES_API_URL, как описано выше
```

---

## Шаг 6 — Запустите Workspace и проверьте сопряжение

```bash
cd ~/hermes-workspace   # или там, где он установлен
pnpm dev
```

**Ищите это в выводе при запуске:**
```
[claude-api] Configured API: http://127.0.0.1:8642
[gateway] gateway=http://127.0.0.1:8642 ... mode=enhanced-fork core=[health, chatCompletions, models, streaming]
```

**`mode=enhanced-fork`** = сопряжение успешно. Сессии, память, навыки — всё доступно.

**`mode=disconnected`** = сопряжение не удалось. Вернитесь к Шагу 4.

---

## Шпаргалка для быстрого исправления (блок для копирования)

Для пользователей, которые просто хотят, чтобы всё заработало — выполните весь этот блок:

```bash
# 1. Найти окружение claude
CLAUDE_ENV="$(claude config env-path 2>/dev/null || echo "$HOME/.claude/.env")"
mkdir -p "$(dirname "$CLAUDE_ENV")"

# 2. Включить API-сервер (идемпотентно)
grep -q '^API_SERVER_ENABLED=' "$CLAUDE_ENV" 2>/dev/null && \
  sed -i.bak 's/^API_SERVER_ENABLED=.*/API_SERVER_ENABLED=true/' "$CLAUDE_ENV" || \
  echo 'API_SERVER_ENABLED=true' >> "$CLAUDE_ENV"

# 3. Исправить частые опечатки
sed -i.bak '/^APISERVERENABLED/d; /^APISERVERHOST/d' "$CLAUDE_ENV" 2>/dev/null || true

# 4. Перезапустить шлюз
hermes gateway stop 2>/dev/null; sleep 2; hermes gateway run &
sleep 8

# 5. Проверить
curl -sf http://127.0.0.1:8642/health && echo "✅ API Шлюза работает" || echo "❌ API Шлюза не доступен"

# 6. Настроить окружение workspace
cd ~/hermes-workspace 2>/dev/null || cd "$(find ~ -maxdepth 2 -name hermes-workspace -type d | head -1)"
grep -q '^HERMES_API_URL=' .env 2>/dev/null && \
  sed -i.bak 's|^HERMES_API_URL=.*|HERMES_API_URL=http://127.0.0.1:8642|' .env || \
  echo 'HERMES_API_URL=http://127.0.0.1:8642' >> .env

echo "✅ Готово. Запускайте: pnpm dev"
```

---

## Примечания для конкретных платформ

### WSL (Windows Subsystem for Linux)

- Холодный запуск Python на WSL медленнее из-за задержек ввода-вывода файловой системы.
  Шлюзу может потребоваться 10–15 секунд для привязки порта 8642.
- Если проверка здоровья (health check) Workspace завершается по тайм-ауту до того, как шлюз будет готов,
  сначала запустите шлюз отдельно (`hermes gateway run`), дождитесь привязки порта,
  а затем запустите Workspace во втором терминале.
- Используйте `127.0.0.1`, а не `localhost` — WSL2 иногда разрешает `localhost`
  как хост Windows вместо виртуалки WSL.

### macOS

- Особых требований нет. Стандартная настройка работает.
- Если используете Python из Homebrew, убедитесь, что `claude` есть в PATH:
  `export PATH="$HOME/.local/bin:$PATH"`

### Linux (нативный)

- Пользователи systemd: `hermes gateway install` создает пользовательский сервис.
  Проверьте статус с помощью `systemctl --user status claude-gateway`.
- Если используется другой `$HOME` для сервиса systemd (например, запуск от
  другого пользователя), расположение файла `.env` изменится. Используйте
  `claude config env-path`, чтобы найти его.

---

## Всё еще не работает?

Соберите этот диагностический пакет и поделитесь им:

```bash
echo "=== claude version ===" && claude --version 2>&1
echo "=== claude env path ===" && claude config env-path 2>&1
echo "=== claude env (redacted) ===" && grep -E "^(API_SERVER|CLAUDE_)" "$(claude config env-path 2>/dev/null || echo ~/.hermes/.env)" 2>&1
echo "=== gateway process ===" && pgrep -af "claude.*gateway" 2>&1 || echo "not running"
echo "=== port 8642 ===" && (ss -tlnp 2>/dev/null || lsof -iTCP:8642 -sTCP:LISTEN 2>/dev/null) | grep 8642 || echo "not bound"
echo "=== health check ===" && curl -sf http://127.0.0.1:8642/health 2>&1 || echo "not reachable"
echo "=== workspace .env ===" && grep CLAUDE ~/hermes-workspace/.env 2>&1 || echo "no .env"
echo "=== OS ===" && uname -a
echo "=== Node ===" && node --version
echo "=== Python ===" && python3 --version 2>&1
```

Это даст любому человеку или агенту достаточно контекста, чтобы диагностировать проблему за один раз.
