# Контракты гильдий, событий и экономики HermesWorld

Последнее обновление: 2026-05-06

## Цель

Определить безопасные контракты данных клиент-сервер для создания гильдий в HermesWorld, войн выходного дня, рейдов, таблиц лидеров, Хранилища Основателей (Founders Vault) и торговли в чате. Клиент может отображать состояние социальных взаимодействий, игры и экономики, но все ценные данные являются серверно-авторитарными. Никакие секреты призов/оракулов, правила выплат, скрытые таблицы наград, причины частных грантов, пороги защиты от злоупотреблений или учетные данные подписантов не должны быть видны клиенту.

## Обязательные правила безопасности

1. Ввод данных на клиенте — это намерение, а не доказательство.
2. Инвентарь, баланс валют, разрешения гильдий, счета войн, награды за рейды, гранты на события и расчеты по торговле являются серверно-авторитарными.
3. Видимые на клиенте контракты могут включать публичный лор, метаданные публичных предметов, косметические названия, расписания событий, видимые счета и общие состояния заявок.
4. Приватные службы владеют информацией о праве на получение наград, скрытыми таблицами наград, ценными грантами, проверкой призов/оракулов, оценкой защиты от злоупотреблений, очередями выплат и журналами аудита.
5. Любая конечная точка (endpoint), изменяющая ценные данные, должна быть аутентифицирована, идемпотентна, ограничена по частоте запросов и подкреплена приватным журналом аудита.
6. Операции с ценностями должны использовать явные ID запросов/ключи идемпотентности, чтобы повторные попытки не приводили к дублированию грантов или переводов.
7. Не доверяйте клиентским временным меткам, позициям, ID предметов, количеству, владению кошельками, завершению рейдов, вкладу в войну или счету в таблице лидеров.
8. Не раскрывайте причину неудачи претензии на ценность, если эта причина помогает злоумышленникам перечислить валидные состояния.

## Общие примитивы

```ts
type UUID = string
type ISODateTime = string
type Chain = 'eth' | 'sol'
type CurrencyCode = 'coins' | 'aether' | 'eth' | 'sol'
type PlayerId = string
type AgentId = string
type GuildId = string
type ItemInstanceId = string
type ItemDefinitionId = string
type WalletAddress = string

type PublicActorRef =
  | { kind: 'player'; playerId: PlayerId; displayName: string }
  | { kind: 'agent'; agentId: AgentId; displayName: string; ownerPlayerId: PlayerId }

type MoneyAmount = {
  currency: CurrencyCode
  amountMinorUnits: string
}

type PublicItemStack = {
  itemInstanceId?: ItemInstanceId
  itemDefinitionId: ItemDefinitionId
  displayName: string
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'founder' | 'event'
  quantity: number
  iconUrl: string
  binding: 'none' | 'bind_on_pickup' | 'bind_on_equip' | 'account_bound' | 'guild_bound'
  tradeable: boolean
  cosmeticOnly: boolean
}

type Idempotency = {
  requestId: UUID
  clientCreatedAt: ISODateTime
}

type SafeMutationResponse<T> = {
  ok: boolean
  requestId: UUID
  result?: T
  publicError?: {
    code: 'invalid_input' | 'auth_required' | 'permission_denied' | 'rate_limited' | 'conflict' | 'not_found' | 'temporarily_unavailable'
    message: string
  }
}
```

ID, безопасные для клиента, являются непрозрачными (opaque). Они не должны кодировать уровни наград, причины грантов, порядок строк в базе данных инвентаря, скрытые исходные данные (seed) или право на получение приза.

## Модель аутентификации и сессий

Клиентские запросы содержат одно из следующего:

```ts
type GameSessionAuth = {
  sessionToken: string // Предпочтительно HttpOnly cookie; никогда не используйте localStorage для привилегированных операций.
}

type WalletSignedSession = {
  chain: Chain
  address: WalletAddress
  message: string
  signature: string
  nonceId: UUID
}
```

Обязанности сервера:
- Сопоставление сессии с playerId.
- Проверка подписей кошельков на стороне сервера.
- Привязка сессий кошельков к учетным записям игроков на стороне сервера.
- Обеспечение защиты от CSRF для мутирующих маршрутов на основе куки.
- Никогда не принимать заявления о владении playerId/guildId от клиента без проверки на сервере.

## 1. Контракт создания гильдии

### Публичная структура гильдии

```ts
type GuildRole = 'founder' | 'leader' | 'officer' | 'raider' | 'trader' | 'member' | 'guest'

type GuildPermission =
  | 'invite_member'
  | 'kick_member'
  | 'edit_profile'
  | 'manage_roles'
  | 'queue_war'
  | 'start_raid'
  | 'manage_vault'
  | 'post_announcement'

type GuildPublicProfile = {
  guildId: GuildId
  slug: string
  displayName: string
  motto?: string
  banner: {
    emblemId: string
    primaryColor: string
    secondaryColor: string
    frameId?: string
  }
  publicDescription?: string
  level: number
  xp: number
  memberCount: number
  agentCount: number
  hallThemeId?: string
  recruitment: 'open' | 'application' | 'invite_only' | 'closed'
  tags: Array<'casual' | 'raiding' | 'pvp' | 'builders' | 'trading' | 'founders' | 'lore'>
  createdAt: ISODateTime
}

type GuildMemberPublic = {
  guildId: GuildId
  actor: PublicActorRef
  role: GuildRole
  joinedAt: ISODateTime
  publicContributionScore: number
}
```

### Создать гильдию

Клиент -> сервер:

```ts
type CreateGuildRequest = Idempotency & {
  displayName: string
  slug: string
  motto?: string
  publicDescription?: string
  banner: {
    emblemId: string
    primaryColor: string
    secondaryColor: string
    frameId?: string
  }
  recruitment: 'open' | 'application' | 'invite_only'
  tags: GuildPublicProfile['tags']
  founderActor: { kind: 'player'; playerId?: never }
}
```

Сервер -> клиент:

```ts
type CreateGuildResponse = SafeMutationResponse<{
  guild: GuildPublicProfile
  viewerRole: GuildRole
  viewerPermissions: GuildPermission[]
}>
```

Валидация на сервере:
- Аутентификация текущего игрока.
- Обеспечение правила «одна активная гильдия основателя на игрока», если иное не разрешено администратором.
- Проверка длины названия/слага, отсутствия ненормативной лексики, попыток выдать себя за другого, зарезервированных имен.
- Проверка ID баннеров по каталогу публичной косметики.
- Взимание платы за создание на стороне сервера (если включено); никогда не доверять балансу, переданному клиентом.
- Предоставление роли основателя и аудит создания.

Приватные поля гильдии:
- индекс коллизий normalizedName
- флаги модерации
- хеш IP-адреса создания / риски устройства
- ID транзакций оплаты/комиссии
- оценка злоупотреблений
- внутренние заметки
- книга учета хранилища гильдии
- сигналы фрода при приглашениях/заявках

## 2. Контракт членства в гильдии и агентов-компаньонов

```ts
type GuildInviteRequest = Idempotency & {
  guildId: GuildId
  targetPlayerHandle: string
  requestedRole?: Exclude<GuildRole, 'founder' | 'leader'>
}

type GuildInviteResponse = SafeMutationResponse<{
  inviteId: UUID
  expiresAt: ISODateTime
  publicStatus: 'sent' | 'already_member' | 'blocked'
}>

type AddAgentToGuildRequest = Idempotency & {
  guildId: GuildId
  agentId: AgentId
  intendedRole: 'scout' | 'scribe' | 'builder' | 'trader' | 'combat' | 'healer'
}

type AddAgentToGuildResponse = SafeMutationResponse<{
  guildId: GuildId
  agent: PublicActorRef
  publicCapabilities: string[]
  contributionMultiplier: number
}>
```

Правила сервера:
- Игрок должен владеть/управлять агентом.
- В гильдии должны быть свободные места для агентов.
- Возможности агента — это только публичные сводки; учетные данные модели/конфигурации провайдера остаются приватными.
- Ограничения на действия агента в офлайне устанавливаются на стороне сервера и не настраиваются клиентом.

## 3. Контракт хранилища гильдии

Хранилище гильдии отличается от Хранилища Основателей. Оно является общим, имеет систему разрешений и подкреплено книгой учета (ledger).

```ts
type GuildVaultSlotPublic = {
  guildId: GuildId
  slotId: UUID
  item?: PublicItemStack
  lockedBy?: PublicActorRef
  publicNote?: string
}

type GuildVaultDepositRequest = Idempotency & {
  guildId: GuildId
  itemInstanceId: ItemInstanceId
  quantity: number
  publicNote?: string
}

type GuildVaultWithdrawRequest = Idempotency & {
  guildId: GuildId
  itemInstanceId: ItemInstanceId
  quantity: number
  destination: 'player_inventory' | 'raid_loadout' | 'guild_war_loadout'
}
```

Правила сервера:
- Атомарный перевод из инвентаря игрока в хранилище гильдии или обратно.
- Проверка разрешений на вывод/управление.
- Запись каждой мутации в книгу учета с указанием актора, состояния до/после, причины и requestId.
- Отсутствие характеристик предметов, доступных для записи клиентом.

Приватные данные:
- Полная книга учета хранилища
- блокировки модераторов/администраторов
- теги обнаружения дубликатов
- граф происхождения предметов
- оценка рисков

## 4. Контракт войн гильдий по выходным

Войны выходного дня планируются, оцениваются сервером и удобны для зрителей. Клиент отображает расписание, видимые цели, таблицу результатов в реальном времени и публичную ленту. Сервер определяет начисление очков.

### Публичное расписание событий

```ts
type WeekendWarPublicEvent = {
  eventId: UUID
  seasonId: string
  mapId: string
  displayName: string
  startsAt: ISODateTime
  endsAt: ISODateTime
  registrationClosesAt: ISODateTime
  status: 'scheduled' | 'registration_open' | 'live' | 'scoring_finalizing' | 'final' | 'cancelled'
  participantCap: number
  publicRulesVersion: string
  visibleObjectives: Array<{
    objectiveId: string
    displayName: string
    kind: 'obelisk' | 'sigil' | 'guild_hall_relic' | 'escort' | 'boss'
    mapRegionId: string
    publicScoreHint: string
  }>
  publicRewards: Array<{
    rankBand: 'winner' | 'top_3' | 'top_10' | 'participation'
    rewardPreview: string
    cosmeticOnly: boolean
  }>
}
```

### Регистрация на войну

```ts
type RegisterGuildWarRequest = Idempotency & {
  guildId: GuildId
  eventId: UUID
  declaredRoster: Array<{ actorKind: 'player' | 'agent'; actorId: string }>
}

type RegisterGuildWarResponse = SafeMutationResponse<{
  registrationId: UUID
  eventId: UUID
  guildId: GuildId
  publicStatus: 'registered' | 'waitlisted' | 'rejected'
  rosterPublic: GuildMemberPublic[]
}>
```

Данные для расчета очков на сервере:

```ts
type WarActionIntent = Idempotency & {
  eventId: UUID
  guildId: GuildId
  actorId: string
  actionType: 'capture_objective' | 'defend_objective' | 'damage_relic' | 'repair_relic' | 'support_ally' | 'scout_ping'
  targetObjectiveId?: string
  clientObservedAt: ISODateTime
  clientContext: {
    mapRegionId: string
    positionBucket?: string
    animationState?: string
  }
}
```

Публичное состояние сервера:

```ts
type WarScoreboardPublic = {
  eventId: UUID
  status: WeekendWarPublicEvent['status']
  updatedAt: ISODateTime
  guildScores: Array<{
    guildId: GuildId
    guildName: string
    banner: GuildPublicProfile['banner']
    publicScore: number
    rank: number
    heldObjectives: string[]
    publicMomentum: 'falling' | 'stable' | 'rising'
  }>
  publicFeed: Array<{
    feedId: UUID
    occurredAt: ISODateTime
    message: string
    guildId?: GuildId
    objectiveId?: string
  }>
}
```

Правила сервера:
- Игнорировать прямые значения очков от клиента.
- Начислять очки на основе валидированных серверных событий, конечного автомата целей, античита и ограничений скорости.
- Публиковать задержанные/сглаженные публичные очки, если это необходимо для предотвращения автоматизации/снайпинга.
- Награды выдаются только после завершения задачи по финализации.

Приватные данные войн:
- веса начисления очков
- пороги античита
- скрытые правила разрешения ничьих
- необработанный поток действий
- флаги рисков
- внутренние механизмы задержанной финализации
- право на получение ценных наград
- флаги оракула/призов

## 5. Контракт рейдов/подземелий

Рейды — это инстансы для групп с серверно-авторитарным завершением, добычей и вкладом.

```ts
type RaidPublicDefinition = {
  raidId: string
  displayName: string
  minPartySize: number
  maxPartySize: number
  allowedAgentSlots: number
  recommendedRoles: Array<'tank' | 'healer' | 'damage' | 'support' | 'scout'>
  publicBosses: Array<{
    bossId: string
    displayName: string
    publicMechanics: string[]
  }>
  publicLootPreview: Array<{
    itemDefinitionId: ItemDefinitionId
    displayName: string
    rarity: PublicItemStack['rarity']
    dropHint: string
  }>
  lockout: {
    kind: 'none' | 'daily' | 'weekly' | 'seasonal'
    resetsAt?: ISODateTime
  }
}

type CreateRaidInstanceRequest = Idempotency & {
  raidId: string
  guildId?: GuildId
  partyActorIds: string[]
  difficulty: 'story' | 'normal' | 'heroic'
}

type CreateRaidInstanceResponse = SafeMutationResponse<{
  raidInstanceId: UUID
  raid: RaidPublicDefinition
  party: PublicActorRef[]
  status: 'forming' | 'ready' | 'in_progress'
}>

type RaidActionIntent = Idempotency & {
  raidInstanceId: UUID
  actorId: string
  actionType: 'attack' | 'heal' | 'shield' | 'interrupt' | 'scout' | 'use_item' | 'agent_assist'
  targetId?: string
  clientObservedAt: ISODateTime
  clientContext?: Record<string, string | number | boolean>
}

type RaidCompletionPublic = {
  raidInstanceId: UUID
  raidId: string
  status: 'failed' | 'completed'
  completedAt?: ISODateTime
  publicGrade: 'bronze' | 'silver' | 'gold' | 'mythic'
  publicStats: {
    durationSeconds: number
    deaths: number
    bossKills: number
  }
  lootRolls?: Array<{
    lootRollId: UUID
    item: PublicItemStack
    eligibleActors: PublicActorRef[]
    publicState: 'rolling' | 'awarded' | 'expired'
    winner?: PublicActorRef
  }>
}
```

Правила сервера:
- Сервер контролирует ОЗ, состояние боссов, КД (lockouts), завершение, розыгрыш добычи, начисление опыта и валюты.
- Клиент может отображать механики боссов и отправлять только намерения действий.
- Агенты-компаньоны могут занимать роли, но не могут обходить КД или право на добычу.
- Редкая добыча получает теги происхождения предметов на стороне сервера.

Приватные данные рейдов:
- точные таблицы добычи / шансы выпадения
- исходные данные (seed) для редких предметов
- пороги вклада для античита
- право на получение ценных призов
- скрытые мутации состояния босса
- следы выполнения приватных моделей/агентов

## 6. Контракт таблиц лидеров

Таблицы лидеров — это публичные поверхности ранжирования с приватным происхождением очков.

```ts
type LeaderboardKind =
  | 'guild_war_season'
  | 'raid_clear_time'
  | 'guild_xp'
  | 'market_reputation'
  | 'crafting_competition'
  | 'lore_trial'

type LeaderboardPublicEntry = {
  leaderboardId: UUID
  kind: LeaderboardKind
  seasonId: string
  rank: number
  actor: PublicActorRef | { kind: 'guild'; guildId: GuildId; displayName: string; banner: GuildPublicProfile['banner'] }
  publicScore: number
  publicScoreLabel: string
  badgeIds: string[]
  updatedAt: ISODateTime
}

type GetLeaderboardResponse = {
  leaderboardId: UUID
  kind: LeaderboardKind
  seasonId: string
  generatedAt: ISODateTime
  entries: LeaderboardPublicEntry[]
  viewerRank?: LeaderboardPublicEntry
}
```

Правила сервера:
- Очки генерируются из приватных журналов событий, а не из клиентских данных.
- Используйте задержанную публикацию для соревнований, где важны призы.
- Ручная модерация может скрывать записи; публичный ответ должен содержать общую фразу «запись находится на проверке».

Приватные данные:
- формулы расчета очков, если они могут быть использованы для злоупотреблений
- скрытые причины дисквалификации
- необработанные журналы событий
- заметки модераторов
- привязки призов/оракулов
- инвентарь наград

## 7. Контракт Хранилища Основателей / инвентаря событий

Хранилища Основателей — это вкладка инвентаря событий для подарков основателям, покупок, компенсаций, сезонных наград и доставок из веб-магазина. Она недоступна для записи клиентом.

```ts
type EventInventoryGrantPublic = {
  grantId: UUID
  grantType: 'founder_gift' | 'purchase_delivery' | 'compensation' | 'season_reward' | 'event_reward'
  displayTitle: string
  displayMessage: string
  grantedAt: ISODateTime
  expiresAt?: ISODateTime
  claimState: 'unclaimed' | 'claimed' | 'expired' | 'revoked' | 'pending'
  previewItems: PublicItemStack[]
  previewCurrencies: MoneyAmount[]
  badgeCount: number
}

type FoundersVaultPublic = {
  playerId: PlayerId
  tabName: 'Founders Vault' | 'Event Mail'
  unclaimedCount: number
  grants: EventInventoryGrantPublic[]
}

type ClaimEventInventoryGrantRequest = Idempotency & {
  grantId: UUID
}

type ClaimEventInventoryGrantResponse = SafeMutationResponse<{
  grantId: UUID
  claimState: 'claimed' | 'pending'
  deliveredItems: PublicItemStack[]
  deliveredCurrencies: MoneyAmount[]
  publicMessage: string
}>
```

API для приватного предоставления грантов; никогда не вызывается из браузера:

```ts
type PrivateCreateEventGrantRequest = {
  serviceRequestId: UUID
  targetPlayerId: PlayerId
  grantType: EventInventoryGrantPublic['grantType']
  reasonCode: 'name_reservation' | 'manual_founder_approve' | 'store_purchase' | 'compensation' | 'season_transition' | 'admin_test'
  sourceRef?: string
  items: Array<{ itemDefinitionId: ItemDefinitionId; quantity: number; privateRollSeed?: string }>
  currencies: MoneyAmount[]
  expiresAt?: ISODateTime
  operatorId?: string
}
```

Правила сервера:
- Предоставление подарков только через приватный API.
- Заявки идемпотентны и атомарны: изменение состояния гранта и доставка инвентаря/валюты происходят в одной транзакции.
- Доставка покупок требует подтвержденного платежа/вебхука на стороне сервера.
- Статус/значки основателя становятся публичными только после утверждения приватного гранта.

Приватные данные Хранилища Основателей:
- код причины гранта, если он конфиденциален
- ID оператора/лицо, утвердившее вручную
- ID транзакций платежных провайдеров
- статус фрода/риска
- приватный исходный код (seed) для броска
- книга учета инвентаря до/после
- заметки об отзыве
- секреты вебхуков магазина

## 8. Контракт окна торговли в чате

Торговля в чате — это безопасное окно предложений для двух сторон, открываемое из чата, например, `/trade @user`. Обе стороны добавляют предметы/валюту, блокируют предложение, затем подтверждают. Расчет происходит атомарно на стороне сервера.

```ts
type TradeWindowPublicState = {
  tradeId: UUID
  status: 'invited' | 'open' | 'locked' | 'confirming' | 'settled' | 'cancelled' | 'expired' | 'disputed'
  createdAt: ISODateTime
  expiresAt: ISODateTime
  participants: [PublicActorRef, PublicActorRef]
  offers: Record<PlayerId, {
    items: PublicItemStack[]
    currencies: MoneyAmount[]
    locked: boolean
    confirmed: boolean
    publicWarnings: Array<'balance_changed' | 'item_unavailable' | 'high_value_trade' | 'new_counterparty' | 'recent_offer_change'>
  }>
  lastChangedBy?: PublicActorRef
  lastChangedAt: ISODateTime
}

type OpenTradeRequest = Idempotency & {
  targetPlayerHandle: string
  source: 'chat_command' | 'profile_button' | 'market_listing'
}

type UpdateTradeOfferRequest = Idempotency & {
  tradeId: UUID
  items: Array<{ itemInstanceId: ItemInstanceId; quantity: number }>
  currencies: MoneyAmount[]
}

type LockTradeOfferRequest = Idempotency & {
  tradeId: UUID
  lock: boolean
}

type ConfirmTradeRequest = Idempotency & {
  tradeId: UUID
  confirm: true
  visibleOfferDigest: string
}

type TradeMutationResponse = SafeMutationResponse<{
  trade: TradeWindowPublicState
}>
```

Модель расчета (settlement):
- Любое обновление предложения разблокирует обоих участников и очищает подтверждения.
- Клиент отображает предварительный просмотр, предупреждения и дайджест.
- Сервер пересчитывает дайджест на основе канонического состояния предложения.
- Сервер проверяет владение предметами, блокирует экземпляры предметов, проверяет балансы, валидирует привязку/возможность торговли, обеспечивает соблюдение лимитов и переводит активы атомарно.
- Торговля твердой валютой использует службу эскроу/расчетов; клиент никогда не передает окончательную истину о переводе.
- Торговля через агентов-посредников может предлагать варианты, но не может подтверждать сделки выше установленных игроком лимитов.

Приватные данные торговли:
- оценка рисков
- правила борьбы с RMT (торговлей за реальные деньги)
- пороги сделок высокой стоимости
- приватное состояние эскроу
- флаги соответствия/KYC
- внутренние механизмы расчетов по кошелькам/RPC
- заметки о спорах/модерации
- хеши IP/устройств участников

## 9. Контракт публичной ленты событий

```ts
type PublicWorldFeedEvent = {
  feedId: UUID
  kind: 'guild_created' | 'war_objective_captured' | 'raid_completed' | 'leaderboard_finalized' | 'founder_gift_arrived' | 'market_milestone'
  occurredAt: ISODateTime
  headline: string
  body?: string
  actor?: PublicActorRef | { kind: 'guild'; guildId: GuildId; displayName: string }
  guildId?: GuildId
  eventId?: UUID
  iconUrl?: string
}
```

Правила редактирования ленты:
- Никаких точных сумм вознаграждений для событий с призами до официального публичного объявления.
- Никаких приватных причин предоставления грантов.
- Никаких подробностей о контрагентах по сделке, если обе стороны не дали согласие на публичный доступ.
- Никакого статуса оракула.
- Никаких намеков на античит/модерацию.

## 10. Приватный журнал аудита/событий

Каждая мутация ценных данных записывает приватное событие аудита.

```ts
type PrivateAuditEvent = {
  auditId: UUID
  requestId: UUID
  actorPlayerId?: PlayerId
  actorAgentId?: AgentId
  action:
    | 'guild.create'
    | 'guild.invite'
    | 'guild.vault.deposit'
    | 'guild.vault.withdraw'
    | 'war.register'
    | 'war.score_event'
    | 'war.reward_finalize'
    | 'raid.instance_create'
    | 'raid.completion'
    | 'raid.loot_award'
    | 'leaderboard.finalize'
    | 'event_grant.create'
    | 'event_grant.claim'
    | 'trade.open'
    | 'trade.offer_update'
    | 'trade.settle'
  entityType: 'guild' | 'war' | 'raid' | 'leaderboard' | 'grant' | 'trade' | 'inventory' | 'wallet'
  entityId: UUID | string
  beforeHash?: string
  afterHash?: string
  privateMetadata: Record<string, unknown>
  createdAt: ISODateTime
}
```

Этот журнал никогда не раскрывается браузеру напрямую. Публичные истории являются отдельно спроецированными/отредактированными версиями.

## 11. Сводка поверхности API

Публичные/вызываемые из браузера:
- GET /api/hermesworld/guilds/:guildId
- POST /api/hermesworld/guilds/create
- POST /api/hermesworld/guilds/:guildId/invites
- POST /api/hermesworld/guilds/:guildId/agents
- GET /api/hermesworld/guilds/:guildId/vault
- POST /api/hermesworld/guilds/:guildId/vault/deposit
- POST /api/hermesworld/guilds/:guildId/vault/withdraw
- GET /api/hermesworld/events/weekend-wars
- POST /api/hermesworld/events/weekend-wars/:eventId/register
- POST /api/hermesworld/events/weekend-wars/:eventId/actions
- GET /api/hermesworld/events/weekend-wars/:eventId/scoreboard
- GET /api/hermesworld/raids
- POST /api/hermesworld/raids/instances
- POST /api/hermesworld/raids/:raidInstanceId/actions
- GET /api/hermesworld/leaderboards/:leaderboardId
- GET /api/hermesworld/founders-vault
- POST /api/hermesworld/founders-vault/:grantId/claim
- POST /api/hermesworld/trades/open
- POST /api/hermesworld/trades/:tradeId/offer
- POST /api/hermesworld/trades/:tradeId/lock
- POST /api/hermesworld/trades/:tradeId/confirm
- GET /api/hermesworld/feed

Доступные только для приватных служб:
- POST /private/hermesworld/event-grants/create
- POST /private/hermesworld/event-grants/revoke
- POST /private/hermesworld/war/finalize-score
- POST /private/hermesworld/war/grant-rewards
- POST /private/hermesworld/raid/finalize-loot
- POST /private/hermesworld/leaderboards/finalize
- POST /private/hermesworld/trades/settle-hard-currency
- POST /private/hermesworld/oracle/validate-prize-eligibility
- POST /private/hermesworld/audit/events

## 12. Что никогда не должно быть публичным

Никогда не отправляйте ничего из этого в клиентском коде, статическом JSON, source maps, публичных KV, ответах публичного API, публичных журналах, скриншотах, фикстурах или документации, предназначенной для игроков:

- секреты призов/оракулов
- приватные URL оракулов или токены служб
- приватные ключи кошельков казначейства
- ключи подписантов выплат
- учетные данные RPC
- сид-фразы кошельков
- секреты подписи JWT/HMAC/сессий
- секреты вебхуков платежей
- секреты необработанных данных (payload) вебхуков магазинов
- инвентарь приватных наград и количество призов
- суммы выплат ETH/SOL до утверждения/публичного объявления
- точные соответствия событий, приносящих призы
- точные скрытые таблицы наград / шансы выпадения ценных предметов
- веса начисления очков в войнах выходного дня, если это уязвимо
- скрытые правила разрешения ничьих
- пороги античита
- правила оценки RMT/фрода
- токены провайдеров KYC/соответствия
- заметки модераторов/администраторов
- приватные коды причин грантов, если они конфиденциальны
- детали платежных транзакций
- граф происхождения предметов, если он уязвим
- необработанный журнал аудита
- необработанные идентификаторы IP/устройств
- неотредактированные данные о рисках кошельков
- приватные учетные данные моделей/провайдеров для агентов
- лимиты расходов агентов в офлайне сверх публичных значений, настроенных пользователем
- внутренние эндпоинты администратора
- отладочные обходы
- приватные семена/соли/обязательства (commitments) до их раскрытия
- строки подключения к базе данных
- любая переменная окружения, названная или начинающаяся с: PRIVATE_, ORACLE_, TREASURY_, WALLET_, SIGNER_, HMAC_, JWT_, SESSION_, RPC_, PAYMENT_, STRIPE_, KYC_, ADMIN_

## 13. Порядок минимальной реализации

1. Добавить общие схемы TypeScript для публичных типов контрактов.
2. Заглушить публичные GET-эндпоинты только статическими/моковыми данными.
3. Добавить помощник приватного аудита перед мутирующими эндпоинтами.
4. Реализовать создание гильдии с серверной проверкой разрешений и идемпотентностью.
5. Реализовать чтение Хранилища Основателей + приватный грант + идемпотентную заявку.
6. Реализовать конечный автомат торговли в чате только для мягкой валюты/предметов.
7. Добавить расписание войн выходного дня и проекцию публичной таблицы результатов.
8. Добавить определение рейда и скелет инстанса.
9. Добавить проекцию таблицы лидеров из приватных финализированных очков.
10. Добавить интеграции эскроу твердой валюты/призовых оракулов только за приватными службами.

## 14. Приемочные проверки

Патч, затрагивающий эти системы, должен пройти следующие проверки перед ревью:

- Ни один клиентский файл не содержит названий переменных окружения oracle/prize/treasury/private, за исключением тестов/документации черного списка.
- Ни один ответ клиенту не включает приватные коды причин.
- Каждая мутация ценных данных имеет requestId/идемпотентность.
- Каждая мутация ценных данных записывает приватное событие аудита.
- Расчеты по инвентарю/валюте/торговле являются атомарными серверными операциями.
- Публичные данные таблицы лидеров/войн/рейдов являются проекцией, а не необработанным журналом очков/событий.
- Гранты Хранилища Основателей не могут быть созданы через эндпоинты, вызываемые из браузера.
- Подтверждение торговли использует пересчитанный сервером дайджест, а не данные о предложении от клиента.
