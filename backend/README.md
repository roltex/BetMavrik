# 🎰 BetMavrik Backend

A high-performance NestJS backend for the BetMavrik casino platform, featuring real-time game sessions, wallet management, and WebSocket integration.

## 🌐 Live URLs

- **🔧 Backend API**: https://betmavrik-backend.up.railway.app/
- **🎯 Health Check**: https://betmavrik-backend.up.railway.app/health
- **🎮 Games Endpoint**: https://betmavrik-backend.up.railway.app/games

---

## 🚀 Features

- **🎮 Game Management** - Fetch games from All-InGame API with comprehensive field support
- **👤 User System** - In-memory user management with Redis balance tracking
- **💰 Wallet Operations** - Real-time balance updates with transaction logging
- **🔗 Game Sessions** - Secure session creation for live game launches
- **📡 WebSocket Support** - Real-time balance updates and notifications
- **🔐 HMAC Authentication** - Secure API communication with All-InGame
- **🧪 Comprehensive Testing** - Full test suite with acceptance testing

## 🛠️ Tech Stack

- **Framework**: NestJS (TypeScript)
- **Database**: Redis (for balances and transactions)
- **WebSocket**: Socket.io
- **API Integration**: All-InGame GCP API
- **Authentication**: HMAC-SHA256
- **Testing**: Jest + Supertest

## 📁 Project Structure

```
backend/
├── src/
│   ├── common/
│   │   ├── dto/           # Data Transfer Objects
│   │   ├── services/       # Shared services (HMAC, Redis)
│   │   └── interfaces/     # TypeScript interfaces
│   ├── games/             # Game management module
│   ├── users/             # User management module
│   ├── wallet/            # Wallet and balance module
│   ├── websocket/         # WebSocket gateway
│   └── main.ts            # Application entry point
├── tests/
│   ├── integration/       # Integration tests
│   ├── unit/             # Unit tests
│   ├── e2e/              # End-to-end tests
│   └── setup/            # Setup and validation tests
├── env.example           # Environment variables template
└── package.json          # Dependencies and scripts
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- Redis server
- npm or yarn

### Installation

1. **Clone and install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Environment setup**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Start Redis server**
   ```bash
   redis-server
   ```

4. **Start development server**
   ```bash
   npm run start:dev
   ```

## 🔧 Environment Variables

```env
PORT=3000
KEY=6JVJ8CNW7NMW2FBHMB84344G1FE4VL
PRIVATE=8W5pfb0ptu6yDZlSJenQPsE01c1PaN76KTibj7a0Mx
GCP_URL=https://papiconnector.all-ingame.com/api/casino/
REDIS_URL=redis://localhost:6379
RETURN_URL=https://betmavrik-frontend.up.railway.app/casino
```

## 📡 API Endpoints

### Core Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | API status and version |
| `GET` | `/health` | Health check with uptime |
| `GET` | `/games` | Get all games with full metadata |
| `POST` | `/games` | Create game session |
| `GET` | `/users/me` | Get current user info and balance |
| `POST` | `/wallet/play` | Process bet/win transactions |
| `POST` | `/wallet/rollback` | Rollback transactions |
| `GET` | `/wallet/transactions/:userId` | Get transaction history |

### Game Fields

The games endpoint returns comprehensive game data including:

**Mandatory Fields:**
- `id`, `title`, `category`, `feature_group`
- `devices`, `licenses`, `jackpot_type`
- `forbid_bonus_play`, `accumulating`, `bonus_buy`

**Optional Fields:**
- `producer`, `theme`, `has_freespins`, `payout`
- `hit_rate`, `volatility_rating`, `has_jackpot`
- `lines`, `ways`, `description`, `has_live`
- `hd`, `multiplier`, `released_at`, `recalled_at`

**Thumbnail URLs:**
- `thumbnail`, `thumbnail_horizontal`, `thumbnail_vertical`

## 🧪 Testing

### Test Structure

- **Integration Tests**: `tests/integration/`
- **Unit Tests**: `tests/unit/`
- **E2E Tests**: `tests/e2e/`
- **Setup Tests**: `tests/setup/`

### Running Tests

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:acceptance    # Acceptance tests
npm run test:endpoints     # API endpoint tests
npm run test:game-fields   # Game fields validation
npm run test:session       # Session creation tests
npm run test:setup         # Project structure validation
npm run test:e2e          # End-to-end tests

# Run with coverage
npm run test:cov

# Run in watch mode
npm run test:watch
```

### Acceptance Test

The acceptance test validates the three main blocks:

1. **Get Games List** - Fetches games and validates structure
2. **Get User Information** - Retrieves user data and balance
3. **Launch Game Session** - Creates game session (supports `acceptance:test`)

```bash
npm run test:acceptance
```

## 🔐 Security

- **HMAC Authentication**: All GCP API calls are signed with HMAC-SHA256
- **CORS Protection**: Configured for specific origins
- **Input Validation**: Global validation pipe with whitelist
- **Error Handling**: Comprehensive error handling and logging

## 📊 Monitoring

- **Health Checks**: `/health` endpoint with uptime
- **Logging**: Structured logging with NestJS Logger
- **Error Tracking**: Graceful error handling and reporting

## 🚀 Deployment

### Railway Deployment

The backend is configured for Railway deployment with:

- **Automatic builds** from Git
- **Environment variables** management
- **Redis add-on** for production database
- **Health checks** for monitoring

### Environment Setup

1. Set environment variables in Railway dashboard
2. Deploy from Git repository
3. Monitor logs and health checks

## 🔧 Development

### Available Scripts

```bash
npm run start:dev      # Development server with hot reload
npm run start:debug    # Debug mode
npm run start:prod     # Production build
npm run build          # Build application
npm run lint           # Lint code
npm run format         # Format code
```

### Code Quality

- **TypeScript**: Strict type checking
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Validation**: Input validation with class-validator

## 📈 Performance

- **Caching**: Game list caching with TTL
- **Connection Pooling**: Redis connection optimization
- **Compression**: Response compression
- **Validation**: Efficient input validation

## 🤝 Contributing

1. Follow the existing code structure
2. Add tests for new features
3. Update documentation
4. Run the full test suite before submitting

## 📄 License

MIT License - see LICENSE file for details

---

**🎰 BetMavrik Backend** - Ready for production! 🚀 