# Production Environment Variables

## Backend Service Environment Variables
**Service**: `betmavrik-backend`
**URL**: https://betmavrik-backend.up.railway.app

```env
PORT=8080
KEY=6JVJ8CNW7NMW2FBHMB84344G1FE4VL
PRIVATE=8W5pfb0ptu6yDZlSJenQPsE01c1PaN76KTibj7a0Mx
GCP_URL=https://papiconnector.all-ingame.com/api/casino/
RETURN_URL=https://betmavrik-frontend.up.railway.app/casino
REDIS_URL=redis://default:password@redis-service:6379
NODE_ENV=production
```

## Frontend Service Environment Variables  
**Service**: `betmavrik-frontend`
**URL**: https://betmavrik-frontend.up.railway.app

```env
NEXT_PUBLIC_API_URL=https://betmavrik-backend.up.railway.app
NEXT_PUBLIC_WS_URL=wss://betmavrik-backend.up.railway.app
NODE_ENV=production
```

## Required Railway Services

### 1. Backend Service
- **Name**: `betmavrik-backend`
- **Root Directory**: `backend`
- **Environment Variables**: See above

### 2. Frontend Service  
- **Name**: `betmavrik-frontend`
- **Root Directory**: `frontend`
- **Environment Variables**: See above

### 3. Redis Service (REQUIRED)
- **Template**: Redis
- **Name**: `betmavrik-redis`
- **Connect to**: `betmavrik-backend`

## Production URLs

- **Frontend**: https://betmavrik-frontend.up.railway.app
- **Backend API**: https://betmavrik-backend.up.railway.app
- **WebSocket**: wss://betmavrik-backend.up.railway.app
- **Casino Page**: https://betmavrik-frontend.up.railway.app/casino

## Local Development URLs (for reference)

- **Frontend**: http://localhost:3001
- **Backend**: http://localhost:3000
- **WebSocket**: ws://localhost:3000 