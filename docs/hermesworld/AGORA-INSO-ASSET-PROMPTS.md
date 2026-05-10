# Промпты для ассетов и манифест Agora Inso

Статус: визуальная цель заблокирована для следующего цикла реализма HermesWorld
Основная ссылка: `docs/hermesworld/reference-images/agora-center-inso-reference.jpeg`
Исходная спецификация: `docs/hermesworld/AGORA-INSO-IMPLEMENTATION.md`

## Визуальная цель

Использовать референс Agora Inso в качестве основной визуальной цели для площади Агора в HermesWorld.

Цель — это скомпонованный экран браузерной игры, а не отдельные красивые ассеты:

- изометрическая камера / камера от третьего лица сверху, направленная вниз на круглую социальную площадь
- центральный каменный хаб с обелиском / монументом строителей
- теплые пулы света от факелов и фонарей вокруг кольца
- холодная циановая/синяя крыша, портал и акценты фракций
- плотные края: лавки, скамейки, ящики, баннеры, цветы, горшки, швы тропинок
- чистое открытое пространство для ходьбы в центре
- читаемые группы NPC и подписи
- компактные "островки" HUD, а не громоздкие панели в стиле SaaS

Стилевая блокировка:

- премиальный стилизованный реализм
- читаемые силуэты с низким/средним количеством полигонов, богатые рисованные материалы
- темный обсидиан + моховой камень + теплый янтарный свет огня + циановые акценты агентских технологий
- качество концепт-листа игровых ассетов
- отсутствие текста, логотипов и мок-текста UI в генерируемых ассетах
- сгенерированный арт — это исходный материал; финальная компоновка должна размещаться и оцениваться на скриншотах из браузера

## Глобальный негативный промпт

Используйте его при каждой генерации, если у инструмента нет отдельного поля для негативного промпта:

```text
no text, no readable letters, no logos, no watermark, no photoreal modern city, no cyberpunk neon overload, no cartoon toy style, no plastic mobile-game asset look, no huge empty flat floor, no fisheye distortion, no blurry details, no overexposed bloom, no UI text, no duplicate limbs, no broken hands, no random weapons, no sci-fi guns, no anime chibi proportions
```

## Глобальный суффикс стиля

Добавляйте это к каждому промпту:

```text
HermesWorld Agora Inso visual target, premium browser-native fantasy/sci-fi RPG, stylized realism, isometric game readability, dark obsidian stone, mossy civic plaza, warm amber torchlight, controlled cyan agent-tech glow, clear silhouettes, optimized for 3D game asset interpretation, high detail but readable at gameplay camera distance, no text, no logo
```

---

# 1. Центральный монумент / обелиск

## Промпт: финальный концепт-лист

```text
Создайте центральный монумент для HermesWorld Agora: общественный обелиск строителей, возвышающийся на круглом каменном постаменте, древний резной темный базальт и бронзовая отделка, тонкие циановые вены агентской сети, проходящие по выгравированным каналам, теплые янтарные фонари у основания, небольшие ступени для подношений и радиальные каменные кольца вокруг. Силуэт должен быть читаемым с изометрической игровой камеры. Язык форм: предпринимательская общественная площадь встречается с древним алтарем управления ИИ. Включите вид 3/4, вид спереди, вставку с планом сверху и указания по материалам, но без читаемого текста. Монумент должен ощущаться как якорь появления и социальный центр многопользовательской площади. HermesWorld Agora Inso visual target, premium browser-native fantasy/sci-fi RPG, stylized realism, isometric game readability, dark obsidian stone, mossy civic plaza, warm amber torchlight, controlled cyan agent-tech glow, clear silhouettes, optimized for 3D game asset interpretation, high detail but readable at gameplay camera distance, no text, no logo.
```

Рекомендуемые настройки генерации:

- соотношение сторон: 16:9 или 4:3
- количество: 4 вариации
- выбирайте в первую очередь по силуэту, во вторую — по орнаменту

Примечания по реализации:

- Сначала создайте простую геометрию: цилиндры, скошенные кубы (bevelled boxes), конус/обелиск, эмиссионные полосы.
- Не импортируйте огромные меши, если они не оптимизированы.
- Коллизия основания (collision footprint) не должна быть шире 20-24% диаметра площади.

---

# 2. Набор факелов / фонарей

## Промпт: лист пропсов

```text
Создайте модульный набор пропсов факелов и фонарей для HermesWorld Agora: 8 небольших пропсов на нейтральном темном фоне, включая каменные жаровни по пояс, подвесные фонарные столбы, настенные фонари, фонари для торговых лавок, группы напольных свечей и сине-циановые лампы-маяки агентских технологий. Материалы: темный базальт, состаренная бронза, теплое янтарное стекло пламени, небольшие циановые рунические акценты. Каждый проп должен иметь четкий простой силуэт, готовую для игры читаемую форму и вписываться в круглую изометрическую площадь. Без персонажей, без текста, без подписей. HermesWorld Agora Inso visual target, premium browser-native fantasy/sci-fi RPG, stylized realism, isometric game readability, dark obsidian stone, mossy civic plaza, warm amber torchlight, controlled cyan agent-tech glow, clear silhouettes, optimized for 3D game asset interpretation, high detail but readable at gameplay camera distance, no text, no logo.
```

## Промпт: референс освещения в сцене

```text
Создайте изометрический этюд освещения в сумерках/ночью для круглой фэнтезийной общественной площади с пулами теплого света факелов по кольцу и тонкими циановыми лампами порталов у входов. Сосредоточьтесь на размещении света, тенях и читаемости: чистый центр для ходьбы, оживленные края рынка, контраст теплого и холодного, без персонажей, без текста. Сцена должна показывать, как фонари направляют движение игрока и обрамляют центральный монумент. HermesWorld Agora Inso visual target, premium browser-native fantasy/sci-fi RPG, stylized realism, dark obsidian stone, mossy civic plaza, warm amber torchlight, controlled cyan agent-tech glow, clear silhouettes, no text, no logo.
```

Примечания по реализации:

- Используйте небольшой набор повторяющихся источников света с "запеченными" эмиссионными материалами.
- Отдавайте предпочтение фейковым плоскостям свечения (glow planes) / эмиссионным мешам вместо множества дорогих реальных источников света.
- Цель для браузера: держите количество динамических источников света низким; используйте ambient + key + выборочные point lights.

---

# 3. Рыночные лавки / киоски

## Промпт: модульный набор лавок

```text
Создайте модульный набор рыночных лавок в стиле фэнтези/сай-фай для HermesWorld Agora, вдохновленный плотной изометрической общественной площадью. Покажите 10 переиспользуемых ассетов лавок: купеческий навес с синей крышей, янтарный тканевый киоск строителя, лавка с верстаком, будка со свитками/данными, стенд с зельями/энергией, группа ящиков, группа бочек, скамейка, группа цветочных горшков, небольшая будка по продаже билетов в портал. Материалы: темное дерево, базальтовый камень, бронза, тканевые навесы приглушенного глубокого синего и янтарного цветов, тонкая отделка циановыми агентскими технологиями. Должно ощущаться предпринимательским, социальным и оживленным, но без хаоса. Лист ассетов, вид 3/4 (ортографический), нейтральный фон, без текста, без подписей. HermesWorld Agora Inso visual target, premium browser-native fantasy/sci-fi RPG, stylized realism, isometric game readability, dark obsidian stone, mossy civic plaza, warm amber torchlight, controlled cyan agent-tech glow, clear silhouettes, optimized for 3D game asset interpretation, high detail but readable at gameplay camera distance, no text, no logo.
```

## Промпт: композиция края площади

```text
Создайте концепт изометрического окружения для края площади HermesWorld Agora: круглая каменная дорожка на переднем плане, плотные рыночные лавки и скамейки по краям, синие навесы, теплые фонари, ящики, цветы, горшки, силуэт небольших ворот портала, виден чистый центральный путь, без персонажей. Композиция должна показывать, как пропсы группируются вокруг края площади, сохраняя пространство для ходьбы. Премиальный стилизованный реализм, читаемость браузерной RPG, без текста, без логотипа.
```

Примечания по реализации:

- Лавки должны собираться из набора (kitbash): навес + прилавок + ящики + фонарь.
- Используйте максимум 3 цвета навесов: приглушенный синий, янтарный, ненасыщенный бирюзовый.
- Размещайте с поворотом 30-45 градусов по кругу.

---

# 4. Плитка пола / материал радиальной площади

## Промпт: лист плитки вид сверху

```text
Создайте бесшовный модульный лист плитки для пола HermesWorld Agora: радиальные камни круглой площади, клиновидные брусчатки, моховые швы, пучки цветов, истертые края тропинок, небольшие выгравированные циановые каналы агентской сети, темный базальт и теплый серый камень. Вид сверху (ортографический). Включите вариации: чистая центральная плитка, плитка внешнего кольца, треснувшая плитка, плитка с моховым швом, бордюр, небольшой декаль цветка/травы, бронзовая инкрустированная полоса. Без текста, без подписей, без слишком сильно запеченных теней. Референс игровой текстуры/материала, читаемый с расстояния камеры изометрической браузерной RPG. HermesWorld Agora Inso visual target, premium stylized realism, no text, no logo.
```

## Промпт: материал крупным планом

```text
Создайте референс материала крупным планом для камней радиальной площади HermesWorld Agora: темные моховые базальтовые плиты, вырезанные вручную круговые швы, тонкие потертые края, крошечная трава и цветы в трещинах, тонкие циановые выгравированные каналы, отражения янтарных фонарей на камне. Реалистичная детализация материала, но стилизованная для легкой браузерной игры. Без текста, без логотипа.
```

Примечания по реализации:

- Сначала используйте вариации процедурной геометрии/материала; генерация изображений — это референс материала.
- Держите контраст плитки достаточно низким, чтобы метки NPC и подписи оставались читаемыми.
- Используйте декали/плоскости для цветов/швов вместо массивного атласа текстур для ускорения работы.

---

# 5. Портреты NPC

Цель набора NPC: пять социальных ролей Агоры, единообразное кадрирование бюста, квадратные портреты.

Общий суффикс портретов:

```text
RPG NPC bust portrait, centered square composition, readable face, premium stylized realism, dark obsidian civic plaza background, warm amber key light, cyan rim light, detailed but not noisy clothing, no text, no logo, no frame, same camera distance and lighting across the set.
```

## NPC 1 — Распорядитель Агоры / Хост Оркестратора

```text
Создайте портрет NPC HermesWorld Agora: Распорядитель Агоры, спокойный общественный оркестратор, приветствующий игроков в социальном хабе. Средних лет, умные глаза, темный плащ с бронзовой отделкой, тонкая брошь агентской сети цианового цвета, теплый свет фонаря на лице, сдержанное выражение, энергия основателя города-предпринимателя. RPG NPC bust portrait, centered square composition, readable face, premium stylized realism, dark obsidian civic plaza background, warm amber key light, cyan rim light, detailed but not noisy clothing, no text, no logo, no frame, same camera distance and lighting across the set.
```

## NPC 2 — Строитель рынка / Инструментальщик

```text
Создайте портрет NPC HermesWorld Agora: Строитель рынка Инструментальщик, практичный мейкер и инженер стартапов, засученные рукава, кожаный фартук поверх темной туники, небольшие светящиеся амулеты в виде инструментов, сдвинутые вверх бронзовые очки, дружелюбное уверенное выражение, теплый свет кузнечного фонаря и циановые контурные акценты. RPG NPC bust portrait, centered square composition, readable face, premium stylized realism, dark obsidian civic plaza background, warm amber key light, cyan rim light, detailed but not noisy clothing, no text, no logo, no frame, same camera distance and lighting across the set.
```

## NPC 3 — Торговец сигналами / Брокер данных

```text
Создайте портрет NPC HermesWorld Agora: Торговец сигналами Брокер данных, элегантный социальный оператор, торгующий слухами, квестами и сигналами агентов. Изящные многослойные робы, темно-синяя ткань, бронзовая застежка, небольшие полупрозрачные циановые токены данных, едва заметно парящие у плеча, острый наблюдательный взгляд, раздельное теплое/холодное освещение. RPG NPC bust portrait, centered square composition, readable face, premium stylized realism, dark obsidian civic plaza background, warm amber key light, cyan rim light, detailed but not noisy clothing, no text, no logo, no frame, same camera distance and lighting across the set.
```

## NPC 4 — Страж фонаря / Часовой площади

```text
Создайте портрет NPC HermesWorld Agora: Страж фонаря Часовой площади, защищающий, но доступный общественный охранник, наплечники из темного металла, посох с янтарным фонарем виден у плеча, синий тканевый пояс, приземленное выражение лица, сильный силуэт, теплый свет факела и циановое контурное свечение. RPG NPC bust portrait, centered square composition, readable face, premium stylized realism, dark obsidian civic plaza background, warm amber key light, cyan rim light, detailed but not noisy clothing, no text, no logo, no frame, same camera distance and lighting across the set.
```

## NPC 5 — Подмастерье основателя / Новичок

```text
Создайте портрет NPC HermesWorld Agora: Подмастерье основателя Новичок, молодой амбициозный строитель, прибывающий на площадь, дорожный плащ, сумка со свитками и небольшими устройствами, едва заметная нервная уверенность, отражение янтарного фонаря в глазах, циановый кулон-токен, полное надежды выражение лица. RPG NPC bust portrait, centered square composition, readable face, premium stylized realism, dark obsidian civic plaza background, warm amber key light, cyan rim light, detailed but not noisy clothing, no text, no logo, no frame, same camera distance and lighting across the set.
```

Примечания по реализации:

- Генерируйте портреты в разрешении 1024x1024, обрезайте до единообразного кадрирования бюста.
- Уменьшайте до 512 и 256 для использования в рантайме.
- Используйте один и тот же фон/диапазон яркости; несоответствие мгновенно будет выглядеть дешево.

---

# 6. Стиль миникарты

## Промпт: арт-дирекшн миникарты

```text
Создайте стилизованный дизайн миникарты для HermesWorld Agora, в стиле "островка" HUD в правом верхнем углу. Покажите карту круглой площади видом сверху: иконка центрального обелиска, радиальные каменные кольца, точки NPC по кольцу, блоки рыночных лавок, маркеры ворот портала, стрелка игрока, подложка из тонкой темной обсидиановой панели, бронзовая рамка, циановые акценты маршрутов, янтарные точки интереса. Чистый игровой UI, читаемый в малом размере, без читаемого текста, без подписей, без логотипа. Премиальный фэнтези/сай-фай RPG HUD, компактная панель-островок, а не дашборд SaaS.
```

## Промпт: лист иконок-глифов миникарты

```text
Создайте небольшой лист глифов для миникарты HermesWorld Agora: стрелка игрока, точка NPC, звезда квеста, арка портала, рыночная лавка, центральный монумент, скамейка/точка отдыха, узел чата/социального взаимодействия, маркер опасности/блокировки. Стиль: простые глифы игровой карты видом сверху, палитра темная бронза/циан/янтарь, высокая контрастность, читаемость в размере 16-24px, без текста, без подписей, прозрачно выглядящий темный фон.
```

Примечания по реализации:

- Финальная миникарта должна быть на векторе/CSS/canvas, где это возможно, а не статичным сгенерированным изображением.
- Используйте результат генерации как стилевой референс для цветов, рамок и пропорций глифов.
- Не используйте подписи на самой карте; текст обрабатывается через ховеры/тултипы в UI.

---

# 7. Набор иконок HUD

## Промпт: набор из 24 иконок действий/HUD

```text
Создайте целостный набор из 24 иконок HUD для HermesWorld Agora, интерфейсные иконки премиальной фэнтези/сай-фай RPG. Необходимые иконки: движение, осмотр, разговор, торговля, квест, карта, инвентарь, навыки, память, агенты, диспетчеризация, строительство, обзор, ремонт, портал, группа, чат, отчет, входящие, факел, монумент, рынок, настройки, помощь. Стиль: светящиеся циановые и теплые янтарные линейные иконки на круглых или со скругленными углами подложках из темного обсидиана/бронзы, читаемые в размерах 32px и 64px, единая толщина линий, простые силуэты, без текста, без букв, без логотипов, без водяных знаков.
```

## Промпт: материал кнопки панели действий

```text
Создайте лист стиля/материала кнопки панели действий HUD для HermesWorld: кнопки из темного обсидианового стекла и металла, бронзовый скос (bevel), тонкий внутренний блик, циановое активное свечение, янтарное свечение ховера/квеста, приглушенное состояние отключения, состояние нажатия. Покажите 8 пустых слотов для иконок в разных состояниях, без текста, без логотипов. Премиальный фэнтези/сай-фай RPG UI, компактная панель действий в нижней центральной части, а не тулбар SaaS.
```

Примечания по реализации:

- Финальные иконки должны быть в формате SVG или маленьких прозрачных спрайтов PNG.
- Генерируйте для получения направления, затем обводите/упрощайте при необходимости.
- Не выпускайте растровые иконки со случайными текстовыми артефактами.

---

# Черновик манифеста ассетов

```yaml
version: 1
zone: agora
visual_target: agora-inso
reference_image: docs/hermesworld/reference-images/agora-center-inso-reference.jpeg
source_spec: docs/hermesworld/AGORA-INSO-IMPLEMENTATION.md
art_direction:
  camera: изометрическая / камера от третьего лица сверху, направленная вниз
  mood: премиальная общественная фэнтези/сай-фай социальная площадь
  palette:
    obsidian: '#080F14'
    panel: '#18212B'
    stone: '#3D4542'
    moss: '#516B4B'
    bronze: '#9B7442'
    amber: '#F2C768'
    cyan: '#78A8C8'
  constraints:
    - чистый центр для ходьбы
    - плотный оживленный периметр
    - отсутствие сгенерированного текста/логотипов
    - оптимизированные для браузера ассеты
    - финальная компоновка оценивается по скриншотам из браузера

assets:
  - id: agora_monument_obelisk_v01
    category: environment/landmark
    priority: P0
    prompt_section: центральный монумент / обелиск
    expected_outputs:
      - concept_sheet_png
      - simplified_glb_or_procedural_component
      - material_reference_png
    runtime_target:
      component: AgoraMonument
      approximate_footprint_m: 5.5
      lod: 1
      collision: simple_cylinder
      lights: emissive_cyan_strips + 2 amber fake-glow planes
    acceptance:
      - читаемость с отдаленной камеры
      - роль якоря появления/социального взаимодействия
      - не блокирует навигацию в центре

  - id: agora_lantern_brazier_set_v01
    category: environment/lighting-props
    priority: P0
    prompt_section: набор факелов / фонарей
    expected_outputs:
      - prop_sheet_png
      - 6-8 optimized prop meshes or procedural variants
      - flame_glow_sprite_png
    runtime_target:
      component: AgoraLanternSet
      placements: радиальное кольцо, углы лавок, края портала
      dynamic_lights_budget: 4 max
      preferred_fx: emissive material + billboards
    acceptance:
      - контраст теплого/холодного виден на скриншоте
      - направляет движение по кольцу площади
      - отсутствие скачков производительности от избытка источников света

  - id: agora_market_stall_kit_v01
    category: environment/props
    priority: P0
    prompt_section: рыночные лавки / киоски
    expected_outputs:
      - modular_prop_sheet_png
      - awning/counter/crate/barrel/bench/pot variants
      - color_variant_manifest
    runtime_target:
      component: AgoraMarketKit
      placements: группы только по периметру
      max_unique_meshes: 12
      instancing: preferred
    acceptance:
      - края выглядят оживленными
      - центр остается свободным для игры
      - варианты китбаша не выглядят скопированными

  - id: agora_ground_tiles_radial_v01
    category: environment/materials
    priority: P0
    prompt_section: плитка пола / материал радиальной площади
    expected_outputs:
      - tile_sheet_png
      - material_reference_png
      - optional_decal_atlas_png
    runtime_target:
      component: AgoraGroundTiles
      technique: procedural radial geometry + decal planes
      texture_budget: <= 2048 atlas if rasterized
    acceptance:
      - круглая форма площади считывается мгновенно
      - подписи NPC остаются читаемыми
      - швы/цветы добавляют богатства без визуального шума

  - id: agora_npc_portraits_v01
    category: characters/portraits
    priority: P0
    prompt_section: портреты NPC
    expected_outputs:
      - steward_1024_png
      - toolsmith_1024_png
      - data_broker_1024_png
      - lantern_guard_1024_png
      - apprentice_founder_1024_png
      - 512_runtime_versions
      - 256_thumbnail_versions
    runtime_target:
      component: NpcDialogueCard / NpcInspector
      format: webp preferred
      framing: единообразный портрет-бюст
    acceptance:
      - пять портретов выглядят как единый набор
      - читаемость в размере карточки диалога
      - каждая роль отличима по силуэту/аксессуарам

  - id: agora_minimap_style_v01
    category: ui/minimap
    priority: P1
    prompt_section: стиль миникарты
    expected_outputs:
      - minimap_style_reference_png
      - minimap_glyph_sheet_png
      - vector_glyph_trace_svg
    runtime_target:
      component: PlaygroundMinimap
      technique: сгенерированный референс стиля + реализация SVG/canvas
      placement: островок HUD вверху справа
    acceptance:
      - центральный монумент, NPC, порталы, лавки читаемы в малом размере
      - текст не требуется
      - визуально соответствует материалам HUD/панели действий

  - id: agora_hud_icon_pack_v01
    category: ui/icons
    priority: P1
    prompt_section: набор иконок HUD
    expected_outputs:
      - 24_icon_contact_sheet_png
      - traced_svg_icon_set
      - action_button_state_sheet_png
    runtime_target:
      component: PlaygroundActionBar / островки HUD
      sizes_px: [32, 48, 64]
      format: svg предпочтительно, png как фоллбэк
    acceptance:
      - иконки читаемы в размере 32px
      - отсутствие случайных букв/текстовых артефактов
      - состояния active/hover/disabled соответствуют языку материалов Агоры
```

## Разделение сборки для Swarm

- Направление Арт (Art): генерация концепт-листов и портретов по промптам выше.
- Направление Строитель (Builder): процедурная реализация `AgoraMonument`, `AgoraLanternSet`, `AgoraMarketKit` и `AgoraGroundTiles`.
- Направление UI: перевод промптов миникарты/HUD в компоненты SVG/CSS/canvas.
- Направление QA: скриншоты десктопной/мобильной версий, сравнение с `agora-center-inso-reference.jpeg`, фиксация пробелов.
- Направление Ревьюер (Reviewer): проверка размеров ассетов, происхождения сгенерированного арта и влияния на бандл.
