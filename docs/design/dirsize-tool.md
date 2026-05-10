# Технический дизайн: Инструмент статистики размера директорий (dirsize-tool)

## 1. Обзор

Легкий CLI-инструмент на Python, рекурсивно подсчитывающий общий размер всех файлов в указанной директории. Цель разработки: только чтение, высокая скорость, структурированный вывод; может использоваться как инструмент проверки для тестов исправления @mention.

## 2. Интерфейс CLI

```bash
python scripts/dirsize.py <path> [options]
```

### Параметры

| Параметр | Тип | Значение по умолчанию | Описание |
|------|------|--------|------|
| `path` | Позиционный | Обязателен | Путь к целевой директории |
| `--unit`, `-u` | Строка | `auto` | Единицы измерения: `auto`, `B`, `KB`, `MB`, `GB` |
| `--exclude` | Список строк | Нет | Шаблоны исключения (можно использовать несколько раз), например: `--exclude node_modules --exclude .git` |
| `--json` | Флаг | `false` | Вывод в формате JSON для автоматизации |
| `--max-depth` | Целое число | Без ограничений | Максимальная глубина рекурсии |
| `--ignore-permission-denied` | Флаг | `false` | Пропускать директории с недостаточными правами доступа |
| `--disk-usage` | Флаг | `false` | Использовать `stat.st_blocks` для расчета занимаемого места на диске вместо видимого размера (apparent size) |

### Коды выхода

| Код выхода | Значение |
|--------|------|
| 0 | Успешно |
| 1 | Ошибка в параметрах |
| 2 | Путь не существует |
| 3 | Недостаточно прав (без использования `--ignore-permission-denied`) |

### Примеры использования

```bash
# Обычный вывод
python scripts/dirsize.py /some/dir
# Total: 117.7 MB (42 files)

# Формат JSON для автоматизации
python scripts/dirsize.py /some/dir --json
# {"path":"/some/dir","total_bytes":123456789,"human_size":"117.7 MB",...}

# Исключение node_modules и .git
python scripts/dirsize.py . --exclude node_modules --exclude .git

# Ограничение глубины
python scripts/dirsize.py /deep/tree --max-depth 3

# Занимаемое место на диске (вместо видимого размера)
python scripts/dirsize.py /some/dir --disk-usage
```

### Формат вывода

**По умолчанию (человекочитаемый)**:
```
Total: 117.7 MB (42 files)
```

**Режим JSON**:
```json
{
  "path": "/path/to/dir",
  "total_bytes": 123456789,
  "human_size": "117.7 MB",
  "file_count": 42,
  "elapsed_ms": 15,
  "errors": []
}
```

## 3. Основной алгоритм

```python
import os

def get_dir_size(path, follow_symlinks=False, disk_usage=False):
    total = 0
    count = 0
    for dirpath, dirnames, filenames in os.walk(path, followlinks=follow_symlinks):
        for f in filenames:
            fp = os.path.join(dirpath, f)
            try:
                st = os.lstat(fp) if not follow_symlinks else os.stat(fp)
                if not stat.S_ISREG(st.st_mode):
                    continue
                total += st.st_blocks * 512 if disk_usage else st.st_size
                count += 1
            except PermissionError:
                if not ignore_permission_denied:
                    raise
    return total, count
```

**Оптимизация производительности**:
- Для больших директорий можно использовать `os.scandir` + рекурсию вместо `os.walk`, чтобы уменьшить количество вызовов stat.
- Ограничение глубины рекурсии `--max-depth` позволяет избежать непреднамеренного глубокого обхода.

## 4. Ожидаемая производительность

| Количество файлов | Затраченное время |
|--------|------|
| 1,000 | < 10ms |
| 100,000 | ~200ms |
| 1,000,000 | ~2s |
| 10,000,000 | ~20s (рекомендуется использовать `--max-depth`) |

## 5. Расположение файла

```bash
scripts/dirsize.py
```

Принадлежность пути ожидает подтверждения от Carlo (`~/hermes-workspace/scripts/` или глобально `~/.hermes/scripts/`).

## 6. План реализации

1. Создать файл `scripts/dirsize.py`
2. Реализовать базовый функционал `os.walk` + `argparse`
3. Добавить вывод `--json`
4. Добавить поддержку `--exclude`, `--max-depth`, `--ignore-permission-denied` и других функций
5. Добавить опцию `--disk-usage`
6. Отправить PR / выполнить слияние напрямую (в зависимости от подтвержденного пути)

Оценочный объем работ: 15-30 минут.
