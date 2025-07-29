# Stake Casino Frontend

A modern casino frontend built with Next.js 15, TypeScript, and Tailwind CSS, designed to replicate the Stake.com casino interface.

## Features

- 🎰 **Casino Games Display**: Browse and play various casino games
- 🔍 **Search Functionality**: Real-time game search
- 💰 **Live Balance Updates**: WebSocket integration for real-time balance updates
- 🎨 **Stake-like UI**: Dark theme matching Stake.com design
- 📱 **Responsive Design**: Works on all device sizes
- 🎮 **Game Categories**: Organized by Stake Originals, Slots, and Providers
- 🎯 **Promotional Banners**: Swiper-based carousel for promotions

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **WebSocket**: Socket.io-client
- **Carousel**: Swiper
- **Icons**: Lucide React

## Project Structure

```
frontend/
├── app/                    # Next.js app directory
│   ├── casino/            # Casino page
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── casino/           # Casino-specific components
│   │   ├── GameCard.tsx
│   │   ├── GameSection.tsx
│   │   ├── NavigationTabs.tsx
│   │   └── PromotionalBanners.tsx
│   ├── layout/           # Layout components
│   │   └── Header.tsx
│   └── ui/               # UI components
│       └── SearchBar.tsx
├── services/             # API services
│   └── api.ts           # API and WebSocket service
├── types/               # TypeScript types
│   ├── game.ts
│   └── user.ts
└── public/              # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend server running on http://localhost:3000

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment variables:
```bash
# Create .env.local file
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3001](http://localhost:3001) in your browser

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:3000` |
| `NEXT_PUBLIC_WS_URL` | WebSocket server URL | `ws://localhost:3000` |

## API Integration

The frontend integrates with the backend API for:

- **GET /games**: Fetch available games
- **GET /users/me**: Get current user info
- **POST /games**: Start a game session
- **WebSocket**: Real-time balance updates

## Component Overview

### Header
- Displays user balance and authentication status
- Real-time balance updates via WebSocket
- Login/Register buttons for unauthenticated users

### PromotionalBanners
- Swiper-based carousel
- Auto-play promotional content
- Responsive breakpoints

### GameSection
- Horizontal scrolling game display
- Different layouts for game types (originals vs slots)
- Smooth scroll navigation

### GameCard
- Interactive game thumbnails
- Hover effects with play button
- Player count display
- Fallback to placeholder images

## Styling

The app uses a custom Tailwind CSS configuration with:
- Dark theme matching Stake.com
- Custom color palette using HSL values
- Smooth transitions and hover effects
- Custom scrollbar styling

## Production Build

```bash
# Build for production
npm run build

# Start production server
npm run start
```

## Deployment

### Vercel Deployment

1. Push to GitHub
2. Import project in Vercel
3. Set environment variables:
   - `NEXT_PUBLIC_API_URL`: Your production API URL
   - `NEXT_PUBLIC_WS_URL`: Your production WebSocket URL
4. Deploy

## Features to Add

- [ ] User authentication flow
- [ ] Favorites system
- [ ] Game filters and sorting
- [ ] Transaction history
- [ ] Mobile app navigation
- [ ] Game providers filter
- [ ] Live casino section

## License

This project is for educational purposes only.
