# 🎰 BetMavrik Casino Platform

A fullstack casino platform built with NestJS backend and real All-InGame API integration.

## 🚀 Live URLs

- **🌐 Frontend**: https://betmavrik-frontend.up.railway.app/
- **🔧 Backend API**: https://betmavrik-backend.up.railway.app/
- **🎮 Casino Page**: https://betmavrik-frontend.up.railway.app/casino

---

## 🚀 Features

- **Real GCP API Integration**: Direct integration with All-InGame API
- **Dynamic Session Creation**: Real game sessions with working currency (TRY)
- **Live Balance Tracking**: Redis-based balance management
- **WebSocket Support**: Real-time balance updates
- **Transaction Logging**: Complete bet/win/rollback tracking
- **Clean Architecture**: Optimized, maintainable codebase

## 🛠️ Tech Stack

- **Backend**: NestJS (TypeScript)
- **Database**: Redis
- **Real-time**: WebSocket (Socket.IO)
- **API**: All-InGame GCP API with HMAC authentication
- **Testing**: Jest + Supertest

## 📋 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Server health check |
| `GET` | `/` | Root endpoint |
| `GET` | `/users/me` | Get current user info |
| `GET` | `/games` | List available games |
| `POST` | `/games` | Create game session |
| `GET` | `/wallet/transactions/:userId` | Get transaction history |
| `POST` | `/wallet/play` | Handle bets and wins |
| `POST` | `/wallet/rollback` | Rollback transactions |

## 🔧 Setup

### Prerequisites

- Node.js 18+
- Redis server
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd BetMavrik/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   PORT=3000
   KEY=6JVJ8CNW7NMW2FBHMB84344G1FE4VL
   PRIVATE=8W5pfb0ptu6yDZlSJenQPsE01c1PaN76KTibj7a0Mx
   GCP_URL=https://papiconnector.all-ingame.com/api/casino/
   REDIS_URL=redis://localhost:6379
   BASE_URL=http://localhost:3000
   ```

4. **Start Redis**
   ```bash
   redis-server
   ```

5. **Run the application**
   ```bash
   npm run start:dev
   ```

## 🧪 Testing

### Run all tests
```bash
npm run test
```

### Test endpoints manually
```bash
node test-endpoints.js
```

### Test session creation
```bash
node test-session.js
```

## 🎮 Game Integration

### Working Configuration
- **Currency**: TRY (Turkish Lira)
- **Working Game ID**: 58322
- **Session URLs**: Dynamic localhost URLs
- **User Data**: Real-time from API

### Session Creation Flow
1. User requests game session
2. System gets current user data
3. Creates session with GCP API
4. Returns real game URL
5. User can play immediately

## 📊 Architecture

```
backend/
├── src/
│   ├── common/
│   │   ├── dto/           # Data Transfer Objects
│   │   └── services/      # Shared services (HMAC, Redis)
│   ├── games/             # Game management
│   ├── users/             # User management
│   ├── wallet/            # Balance and transactions
│   └── websocket/         # Real-time updates
├── test-*.js              # Test scripts
└── package.json
```

## 🔐 Security

- **HMAC Authentication**: All GCP API calls are signed
- **Input Validation**: DTO-based validation
- **Error Handling**: Comprehensive error management
- **Rate Limiting**: Built-in protection

## 🚀 Production Ready

The backend is production-ready with:
- ✅ Real API integration (no mocks)
- ✅ Dynamic URL configuration
- ✅ Clean, optimized code
- ✅ Comprehensive error handling
- ✅ Full transaction logging
- ✅ WebSocket real-time updates

## 📝 License

MIT License 