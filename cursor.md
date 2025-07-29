
# 🎰 All-InGame Casino Project – Cursor AI Instructions

## 🧠 PROJECT CONTEXT

You are building a fullstack casino platform using:

- **Backend**: NestJS + Redis + WebSocket
- **Frontend**: NextJS (Stake-style UI)
- **Integration**: All-InGame API (secured with HMAC)
- **Live Testing**: Real credentials provided
- **Deployment**: Railway (backend), Vercel (frontend)

The system will include live session launching, balance tracking, and bet/win/rollback handling.

---

## ⚙️ TECH STACK

| Layer        | Technology          |
|--------------|---------------------|
| Frontend     | NextJS (TypeScript) |
| Backend      | NestJS (TypeScript) |
| State Store  | Redis               |
| WebSocket    | NestJS Gateway      |
| Deployment   | Railway / Vercel    |
| Auth         | HMAC-SHA256 Headers |
| Tests        | Jest + Supertest    |

---

## 🔑 AUTHENTICATION

All outbound GCP API calls must include signed headers.

### Provided Credentials:

```env
KEY=6JVJ8CNW7NMW2FBHMB84344G1FE4VL
PRIVATE=8W5pfb0ptu6yDZlSJenQPsE01c1PaN76KTibj7a0Mx
GCP_URL=https://papiconnector.all-ingame.com/api/casino/
```

Use this in every request:
```ts
X-REQUEST-SIGN: <HMAC_SHA256(PRIVATE, body)>
allingame-key: <KEY>
```

---

## ✅ BACKEND TASKS (NestJS)

### 👤 User System
- [x] In-memory user management (`Map`)
- [x] GET `/me`: returns user info + Redis balance

### 💰 Balance System
- [x] Redis: store balance per `user:balance:<id>`
- [x] Redis: track transactions `user:transactions:<id>`

### 🎮 Game Logic
- [x] GET `/games`: fetch from GCP `/games`, cache with TTL
- [x] POST `/games`: call GCP `/session`, return game URL
- [x] POST `/wallet/play`: apply `bet`/`win` actions and return balance
- [x] POST `/wallet/rollback`: reverse transaction

### 🔔 WebSocket
- [x] Notify all connected clients of balance changes

### 🧪 Tests
- [ ] GET `/games`
- [ ] GET `/me`
- [ ] GET `/transactions`
- [ ] POST `/wallet/play`
- [ ] POST `/wallet/rollback`
- [ ] HMAC validation test
- [ ] Simulated test for `game_id: 58322`

---

## ✅ FRONTEND TASKS (NextJS)

### 🖥️ `/casino` Page
- [x] Stake-style layout (no sidebar)
- [x] List games from backend `/games`
- [x] On click → POST `/games`, open returned URL

### 📈 Header
- [x] On mount → GET `/me`
- [x] Show balance live via WebSocket

### 🔧 Services
- [x] `api.ts` → wraps Axios + WebSocket for `/me`, `/games`, etc.

---

## 🚀 DEPLOYMENT

### 🛠️ Railway (NestJS Backend)
- Hosted at: `https://mtf-nestjs.up.railway.app`
- Required `.env`:
```env
PORT=3000
KEY=6JVJ8CNW7NMW2FBHMB84344G1FE4VL
PRIVATE=8W5pfb0ptu6yDZlSJenQPsE01c1PaN76KTibj7a0Mx
GCP_URL=https://papiconnector.all-ingame.com/api/casino/
REDIS_URL=redis://localhost:6379
```

### 🌐 Vercel (NextJS Frontend)
- Add `.env`:
```env
API_URL=https://mtf-nestjs.up.railway.app
WS_URL=wss://mtf-nestjs.up.railway.app
```

---

## 🧪 ACCEPTANCE TEST (Live)

- Start session using: `POST /games` with `game_id: 7328`
- GCP will trigger:
  - `POST /wallet/play`
  - `POST /wallet/rollback`
- You must handle both correctly (balance + tx log)

---

## 🔁 REQUIRED ENDPOINTS

| Method | Path                | Purpose                         |
|--------|---------------------|---------------------------------|
| GET    | /games              | List games from GCP             |
| POST   | /games              | Start game session              |
| GET    | /me                 | Get user and current balance    |
| GET    | /transactions       | Get transaction history         |
| POST   | /wallet/play        | Handle game bets and wins       |
| POST   | /wallet/rollback    | Handle rollbacks                |

---

## 📜 RULES FOR CURSOR.AI

- 🟢 Use TypeScript
- 🟢 Use Redis for all balances and transactions
- 🟢 Validate all inputs with DTOs
- 🟢 Use Axios for all HTTP requests
- 🟢 Sign all outbound GCP requests using HMAC
- 🟢 Use WebSocket Gateway in NestJS for live sync
- 🔴 Do NOT use mock data — all requests are now real
- 🔴 Do NOT skip transaction logging
- 🔴 Do NOT mutate balance outside of `BalanceService`

---

## 🗂️ ENV TEMPLATE (.env.example)

```env
PORT=3000
KEY=6JVJ8CNW7NMW2FBHMB84344G1FE4VL
PRIVATE=8W5pfb0ptu6yDZlSJenQPsE01c1PaN76KTibj7a0Mx
GCP_URL=https://papiconnector.all-ingame.com/api/casino/
REDIS_URL=redis://localhost:6379
```

---

## 🧩 GAME THUMBNAILS

- Default: `https://thumb.all-ingame.com/iv2/{game_id}.png`
- Horizontal: `https://thumb.all-ingame.com/horizontal/{game_id}.png`
- Vertical: `https://thumb.all-ingame.com/vertical/{game_id}.png`

---

## ✅ READY TO BUILD

- Real credentials are active
- Use `localhost:3000` for local tests
- Use Railway/Vercel for public URLs
- No mock mode — only live API integration
