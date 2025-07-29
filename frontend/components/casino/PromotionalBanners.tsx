'use client';

import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { Game } from '@/types';
import { PromotionalBannerSkeleton } from '@/components/ui/SkeletonLoader';
import 'swiper/css';
import 'swiper/css/pagination';

interface PromotionalBannersProps {
  games: Game[];
  onPlayGame?: (gameId: number) => void;
  isLoading?: boolean;
}

const getGameThumbnail = (game: Game) => {
  // First priority: Use horizontal thumbnail from API response
  if (game.thumbnail_horizontal) {
    return game.thumbnail_horizontal;
  }
  
  // Second priority: Use regular thumbnail from API
  if (game.thumbnail) {
    return game.thumbnail;
  }
  
  // Final fallback: Use vertical URL format (user requested vertical)
  return `https://thumb.all-ingame.com/vertical/${game.id}.png`;
};

const getBackgroundColor = (gameId: number) => {
  const colors = [
    'from-purple-900 to-purple-700',
    'from-pink-900 to-red-700',
    'from-blue-900 to-cyan-700',
    'from-green-900 to-teal-700',
    'from-orange-900 to-red-700',
    'from-indigo-900 to-purple-700',
  ];
  return colors[gameId % colors.length];
};

const getGameDescription = (game: Game) => {
  const features = [];
  
  if (game.has_jackpot) {
    features.push('Jackpot Available');
  }
  if (game.has_freespins) {
    features.push('Free Spins');
  }
  if (game.volatility_rating) {
    features.push(`${game.volatility_rating} Volatility`);
  }
  if (game.payout) {
    features.push(`${game.payout}% RTP`);
  }
  
  return features.length > 0 ? features.slice(0, 2).join(' • ') : 'Play this exciting game now!';
};

// Component for handling individual promotional banner with image loading
function PromotionalBanner({ game, onPlayGame }: { game: Game; onPlayGame?: (gameId: number) => void }) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [fallbackAttempt, setFallbackAttempt] = useState(0);

  const handleImageError = () => {
    // Try next fallback
    if (fallbackAttempt < 2) {
      setFallbackAttempt(prev => prev + 1);
      setImageError(false);
      setImageLoaded(false);
    } else {
      setImageError(true);
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const getCurrentImageUrl = () => {
    if (fallbackAttempt === 0) {
      // First attempt: use the main thumbnail logic
      return getGameThumbnail(game);
    } else if (fallbackAttempt === 1) {
      // Second attempt: try vertical format (user requested)
      return `https://thumb.all-ingame.com/vertical/${game.id}.png`;
    } else {
      // Third attempt: use horizontal format
      return `https://thumb.all-ingame.com/horizontal/${game.id}.png`;
    }
  };

  const getFinalFallback = () => {
    // Final fallback when all image attempts fail
    return '/placeholder-game.png';
  };

  return (
    <div className={`relative h-48 rounded-lg overflow-hidden bg-gradient-to-r ${getBackgroundColor(game.id)} cursor-pointer group`}>
      {/* Background Image */}
      {!imageError && (
        <img
          key={fallbackAttempt} // Force re-render when fallback changes
          src={getCurrentImageUrl()}
          alt={game.title}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onError={handleImageError}
          onLoad={handleImageLoad}
          style={{ objectPosition: 'center' }}
        />
      )}
      
      {/* Final fallback image when all attempts fail */}
      {imageError && (
        <img
          src={getFinalFallback()}
          alt={game.title}
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          style={{ objectPosition: 'center' }}
        />
      )}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
      
      {/* Loading skeleton */}
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 bg-gray-700 animate-pulse">
          <div className="w-full h-full bg-gradient-to-r from-gray-600 to-gray-500"></div>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 p-6 h-full flex flex-col justify-between">
        <div>
          <div className="text-xs text-gray-300 uppercase tracking-wider mb-1">
            {game.producer || game.category || 'Game'}
          </div>
          <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{game.title}</h3>
          <p className="text-sm text-gray-200 mb-4 line-clamp-2">{getGameDescription(game)}</p>
        </div>
        
        <button 
          className="px-4 py-2 bg-white/20 backdrop-blur text-white rounded hover:bg-white/30 transition-all duration-200 hover:scale-105 self-start"
          onClick={() => {
            if (onPlayGame) {
              onPlayGame(game.id);
            }
          }}
        >
          Play Now
        </button>
      </div>

      {/* Decorative element */}
      <div className="absolute right-0 bottom-0 w-32 h-32 opacity-10 transform translate-x-8 translate-y-8">
        <div className="w-full h-full bg-white/20 rounded-full"></div>
      </div>
    </div>
  );
}

export default function PromotionalBanners({ games, onPlayGame, isLoading = false }: PromotionalBannersProps) {
  // Use the first 10 games from the API
  const promotionalGames = games.slice(0, 10);
  
  if (isLoading || promotionalGames.length === 0) {
    return (
      <div className="w-full">
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={20}
          slidesPerView={1}
          pagination={{ clickable: true }}
          breakpoints={{
            640: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
          }}
          className="promotional-swiper"
        >
          {Array.from({ length: 3 }).map((_, index) => (
            <SwiperSlide key={index}>
              <PromotionalBannerSkeleton />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={20}
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        breakpoints={{
          640: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
        }}
        className="promotional-swiper"
      >
        {promotionalGames.map((game) => (
          <SwiperSlide key={game.id}>
            <PromotionalBanner game={game} onPlayGame={onPlayGame} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
} 