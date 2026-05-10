# Библиотека промптов HermesWorld

Ветка: `feat/asset-generation-v2`
Исходный стиль (style lock): `docs/hermesworld/STYLE-LOCK.md`

## Глобальный стиль (Global Style Lock)

Премиальное темное фэнтези с голубыми/янтарными акцентами. Используйте точную палитру:

- ЗОЛОТО (GOLD) `#F1C56D`
- БРОНЗА (BRONZE) `#B8862B`
- ПЕРГАМЕНТ (PARCHMENT) `#F4E9D3`
- ПАТИНА (VERDIGRIS) `#2E6A63`
- ПОЛНОЧЬ (MIDNIGHT) `#0F1622`
- СЛАНЕЦ (SLATE) `#1B2433`
- КАМЕНЬ (STONE) `#8A8F98`
- ОБСИДИАН (OBSIDIAN) `#0A0D12`

Освещение: теплый основной свет "золотого часа", голубая/бирюзовая контурная или заполняющая подсветка, мягкая объемная дымка, свечение факелов/фонарей, тонкие пылинки/блики.

Язык текстур: стилизованный PBR, ощущение текстур, нарисованных вручную, премиальная браузерная RPG в стиле фэнтези/сай-фай, читаемость в игровом масштабе, без читаемого текста, без водяных знаков.

Глобальный отрицательный промпт (Negative Prompt):

```text
no text, no readable letters, no logos, no watermark, no UI overlay, no modern city, no plastic mobile game look, no flat gray, no pure black void, no oversaturated neon, no cyberpunk overload, no fisheye distortion, no blurry details, no duplicate characters, no broken hands, no malformed faces, no random firearms, no sci-fi guns, no anime chibi exaggeration, no low-resolution artifacts
```

## Ключевые изображения зон (Hero Images)

Генерируйте каждое в разрешении 1920x1080. Создайте 3 варианта для каждой зоны. Выберите лучшее производственное изображение и сохраните как `zone-N.jpg`; все кандидаты сохраняйте как `zone-N-variant-{a,b,c}.jpg`. Сохраняйте любое замененное `zone-N.jpg` как `zone-N-v1.jpg`.

### Тренировочные залы (Training Grounds) / zone-1

```text
HermesWorld Training Grounds zone hero, 1920x1080 cinematic wide establishing shot, premium browser-native dark fantasy RPG, obsidian practice courtyard with parchment banners, gold-trimmed sparring rings, bronze weapon racks, low stone walls, glowing cyan agent-tech waypoint pylons, warm lantern pools, verdigris moss in stone seams, readable empty walkable center, distant academy silhouettes, golden-hour key light, cyan rim light, soft volumetric haze, subtle magic motes, stylized PBR hand-painted texture feel, no text, no logos
```

### Кузница (Forge) / zone-2

```text
HermesWorld Forge zone hero, 1920x1080 cinematic wide establishing shot, premium dark fantasy artisan foundry, obsidian basalt workshop carved into mountain stone, bronze anvils and gold filigree trim, molten amber forge light, cyan runic cooling channels, hanging chains, hammer silhouettes, sparks and smoke, sturdy dwarven craftsmanship, readable composition for game background, verdigris patina accents, stylized PBR hand-painted texture feel, no text, no logos
```

### Агора (Agora) / zone-3

```text
HermesWorld Agora zone hero, 1920x1080 cinematic wide establishing shot, civic fantasy plaza inspired by a warm social hub, circular obsidian stone forum, central caduceus/sigil monument without readable letters, gold lanterns, bronze market stalls, parchment awnings, verdigris moss, cyan portal accents, rich perimeter detail with clear walkable center, premium browser-native RPG, warm torch bloom, cyan rim light, soft haze, stylized PBR hand-painted texture feel, no text, no logos
```

### Роща (Grove) / zone-4

```text
HermesWorld Grove zone hero, 1920x1080 cinematic wide establishing shot, mystical dark fantasy grove, ancient obsidian roots and stone arches, verdigris leaves and moss, gold fireflies, parchment prayer ribbons without readable marks, cyan spirit pools and agent-tech wisps, moonlit canopy with warm amber lanterns, tranquil premium RPG mood, readable paths, stylized PBR hand-painted texture feel, no text, no logos
```

### Оракул (Oracle) / zone-5

```text
HermesWorld Oracle zone hero, 1920x1080 cinematic wide establishing shot, mystical observatory temple, obsidian and slate stone dais, bronze astrolabes, gold constellation inlays without readable text, cyan scrying pool glow, parchment scroll alcoves, hooded statues, volumetric haze, celestial particles, premium dark fantasy planning sanctuary, readable central platform, stylized PBR hand-painted texture feel, no text, no logos
```

### Арена (Arena) / zone-6

```text
HermesWorld Arena zone hero, 1920x1080 cinematic wide establishing shot, grand obsidian combat coliseum, bronze gates, gold-trimmed shield emblems without readable text, cyan barrier magic around battle floor, parchment pennants, torchlit stands, dramatic dust and haze, heroic dark fantasy RPG combat venue, readable circular arena center, stylized PBR hand-painted texture feel, no text, no logos
```

## Портреты NPC

Генерируйте портреты 1024x1024. Атмосферный или кажущийся прозрачным фон. Сохраняйте в `public/avatars/v2/`.

### Разведчик Атлас (Atlas Scout)

```text
HermesWorld NPC companion portrait, Atlas Scout, 1024x1024 square, blue-cyan robed scout with wide-brim traveler's hat, calm clever expression, leather satchel and compass charm, gold #F1C56D trim, obsidian/slate cloak shadows, verdigris accent stitching, warm key light and cyan rim light, premium stylized fantasy RPG portrait, atmospheric dark background, no text, no watermark
```

### Строитель Кузницы (Forge Builder)

```text
HermesWorld NPC companion portrait, Forge Builder, 1024x1024 square, armored dwarf warrior artisan, broad silhouette, bronze plate armor, gold #F1C56D engraved edges, hammer motif, warm forge glow, cyan runic highlights, expressive determined face, premium stylized fantasy RPG portrait, atmospheric foundry background, no text, no watermark
```

### Планировщик Оракула (Oracle Planner)

```text
HermesWorld NPC companion portrait, Oracle Planner, 1024x1024 square, hooded mystical strategist, slate and obsidian robes, gold #F1C56D astrolabe jewelry, parchment scroll details, cyan scrying light on face, calm prophetic expression, soft volumetric haze, premium stylized fantasy RPG portrait, atmospheric temple background, no text, no watermark
```

### Афина (Athena)

```text
HermesWorld NPC companion portrait, Athena onboarding guide, 1024x1024 square, wise tactical mentor, elegant obsidian and parchment armor-robes, gold #F1C56D laurel/caduceus accents, bronze shoulder detail, cyan rim light, confident welcoming expression, premium stylized fantasy RPG portrait, atmospheric academy background, no text, no watermark
```

### Аполлон (Apollo)

```text
HermesWorld NPC companion portrait, Apollo healer, 1024x1024 square, radiant healer companion, parchment and gold-trimmed robes, bronze sun charm, gentle expression, warm amber healing light, cyan restorative sigils, obsidian/slate background for contrast, premium stylized fantasy RPG portrait, no text, no watermark
```

### Гермес (Hermes)

```text
HermesWorld NPC companion portrait, Hermes guide, 1024x1024 square, charismatic messenger-guide, obsidian travel cloak, gold #F1C56D caduceus pin and wing accents, verdigris scarf detail, cyan portal rim light, clever welcoming expression, premium stylized fantasy RPG portrait, atmospheric portal background, no text, no watermark
```

## Лист спрайтов иконок UI

Сгенерируйте прозрачный лист спрайтов 6x4, 24 иконки, каждая в ячейке 64x64. Только золотой контур (line art), обводка #F1C56D, прозрачный фон, согласованная закругленная обводка 3px, тонкая бронзовая (#B8862B) тень/свечение только при необходимости. Экспортируйте `sprite-v1.png` и соответствующий манифест JSON с координатами ячеек каждой иконки.

Порядок иконок:

1. компас (compass)
2. молот (hammer)
3. глаз (eye)
4. весы (scales)
5. меч (sword)
6. щит (shield)
7. свиток (scroll)
8. карта (map)
9. сумка (bag)
10. шестерня (gear)
11. сигил (sigil)
12. квест (quest)
13. мир (world)
14. портал (portal)
15. инвентарь (inventory)
16. чат (chat)
17. сердце (heart)
18. звезда (star)
19. пламя (flame)
20. ключ (key)
21. корона (crown)
22. монета (coin)
23. книга (book)
24. искра (spark)

```text
HermesWorld UI icon sprite sheet, transparent background, 6 columns by 4 rows, 24 fantasy RPG line-art icons, each icon centered in a 64x64 cell, gold #F1C56D stroke, consistent rounded 3px line weight, subtle bronze #B8862B glow, no text, no labels, no filled background, premium dark fantasy UI icon language, compass, hammer, eye, scales, sword, shield, scroll, map, bag, gear, caduceus sigil, quest lightbulb, geodesic world, portal arch, satchel inventory, chat bubble, heart, star, flame, key, crown, coin, book, spark
```

## Постер видео

Генерируйте в разрешении 1280x720 и сохраняйте как `public/assets/hermesworld/video/world-demo-poster-v2.jpg`. Сохраняйте замененный `world-demo-poster.jpg` как `world-demo-poster-v1.jpg`, если он существует.

```text
HermesWorld world-demo video poster, 1280x720 cinematic frame, portal/sigil hero composition, obsidian stone portal arch with caduceus-inspired circular sigil, gold #F1C56D engraved strokes, bronze #B8862B metal trim, parchment light rays, verdigris moss and patina, cyan #2E6A63 portal energy, warm lantern foreground, premium dark fantasy RPG world reveal, strong center composition with negative space for play button overlay, stylized PBR hand-painted texture feel, no text, no watermark, no logo letters
```
