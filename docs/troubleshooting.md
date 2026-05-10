# Устранение неполадок — Hermes Workspace

Распространенные проблемы при настройке и способы их решения.

---

## 1. Шлюз запускается, но API-сервер не привязывается к порту (порт 8642 не слушается)

**Симптом:** команда `hermes gateway run` кажется запущенной, но `curl http://127.0.0.1:8642/health` завершается ошибкой. `ss -tlnp | grep 8642` ничего не показывает.

**Причина:** не установлена переменная `API_SERVER_ENABLED` — или она установлена с неверным именем.

**Решение:**

```bash
# Найти путь к файлу окружения claude
claude config env-path
# Обычно: ~/.hermes/.env

# Проверить наличие ключа
grep -i API_SERVER ~/.hermes/.env
```

Переменная окружения должна называться **строго** `API_SERVER_ENABLED=true` — с подчеркиваниями. Частые ошибки:

| Неверно | Верно |
|---|---|
| `APISERVERENABLED=true` | `API_SERVER_ENABLED=true` |
| `APISERVERHOST=0.0.0.0` | `API_SERVER_HOST=127.0.0.1` |
| `ApiServerEnabled=true` | `API_SERVER_ENABLED=true` |

После исправления перезапустите шлюз: `hermes gateway run --replace`

**Также:** установка `API_SERVER_HOST=0.0.0.0` без `API_SERVER_KEY` приводит к тихому отказу в запуске. Используйте `127.0.0.1` для локального доступа или установите ключ для сетевого доступа.

---

## 2. Workspace показывает "Connect Backend" / "Skip setup" (режим mode=disconnected)

**Симптом:** браузер показывает приветственный экран настройки вместо интерфейса чата. В логах сервера разработки отображается `mode=disconnected`.

**Причина:** Workspace не может связаться с HTTP API шлюза.

**Чек-лист (по порядку):**

1. Запущен ли шлюз? `pgrep -af "claude.*gateway"`
2. Привязан ли порт 8642? `curl -sf http://127.0.0.1:8642/health`
3. Верно ли настроен `.env` в Workspace? `grep HERMES_API_URL ~/hermes-workspace/.env`
   - Должно быть: `HERMES_API_URL=http://127.0.0.1:8642`
4. Перезапустите Workspace: `pnpm dev`

Если шлюз запущен и работает нормально, но Workspace всё равно отключается, проверьте конфликты портов (другой процесс на 8642) или правила брандмауэра (файервола).

---

## 3. Порт 8642 уже занят

**Симптом:** шлюз не запускается с ошибкой "Address already in use" или просто завершает работу.

**Решение:**

```bash
# Найти, что занимает порт
lsof -i :8642    # macOS
ss -tlnp | grep 8642   # Linux

# Убить зависший процесс
kill <PID>

# Перезапустить
hermes gateway run --replace
```

---

## 4. WSL: Проверка здоровья шлюза завершается по тайм-ауту при первом запуске

**Симптом:** Workspace запускается, проверяет шлюз и сообщает об отключении ("disconnected"). Но если подождать 15 секунд и обновить страницу, всё работает.

**Причина:** холодный запуск Python на WSL медленнее (8–15 сек) из-за накладных расходов файловой системы. Проверка здоровья Workspace завершается до того, как шлюз будет готов.

**Решение:** запускайте в двух отдельных терминалах:

```bash
# Терминал 1 — сначала запустите шлюз и дождитесь его готовности
hermes gateway run
# Дождитесь появления строки "Uvicorn running on http://127.0.0.1:8642"

# Терминал 2 — затем запустите рабочее пространство
cd ~/hermes-workspace && pnpm dev
```

---

## 5. Сервер разработки падает сразу после запуска

**Симптом:** `pnpm dev` запускается, показывает баннер Vite, затем падает с ошибкой ELIFECYCLE или стеком вызовов (stack trace).

**Частые причины:**

- **Маркеры конфликтов слияния в исходниках:** `grep -r "<<<<<<" src/` — если найдете, разрешите конфликты или выполните `git checkout -- <файл>`.
- **Отсутствуют node_modules:** `pnpm install`
- **Версия Node слишком старая:** `node --version` — требуется Node 22+.
- **Порт уже занят:** `lsof -i :3000` (macOS) или `ss -tlnp | grep 3000` (Linux) — убейте зависший процесс.

---

## 6. "No compatible backend detected" (совместимый бэкенд не обнаружен) при настройке

**Симптом:** нажали "Connect Backend", прошла проверка здоровья, отобразилась ошибка.

Это означает, что сервер SSR Vite попытался выполнить `GET /api/gateway-status`, который внутри себя опрашивает шлюз. Опрос не удался.

**Наиболее вероятно:** API-сервер шлюза не запущен. См. проблему №1 выше.

**Менее вероятно:** в `.env` указан неверный `HERMES_API_URL` (например, не тот порт, `https` вместо `http`, `localhost` вместо `127.0.0.1` на WSL).

---

## Диагностический пакет

Если ничего из вышеперечисленного не помогло, выполните это и поделитесь результатом:

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
