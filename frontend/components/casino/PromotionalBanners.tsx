'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { Game } from '@/types';
import 'swiper/css';
import 'swiper/css/pagination';

interface PromotionalBannersProps {
  games: Game[];
  onPlayGame?: (gameId: number) => void;
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
  
  // Final fallback: Use horizontal URL format
  return `https://thumb.all-ingame.com/vertical/${game.id}.png`;
};

const getBackgroundColor = (gameId: number) => {
  const colors = [
    'bg-gradient-to-r from-purple-900 to-purple-700',
    'bg-gradient-to-r from-pink-900 to-red-700',
    'bg-gradient-to-r from-blue-900 to-cyan-700',
    'bg-gradient-to-r from-green-900 to-teal-700',
    'bg-gradient-to-r from-orange-900 to-red-700',
    'bg-gradient-to-r from-indigo-900 to-purple-700',
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

export default function PromotionalBanners({ games, onPlayGame }: PromotionalBannersProps) {
  // Use the first 10 games from the API
  const promotionalGames = games.slice(0, 10);
  
  if (promotionalGames.length === 0) {
    return (
      <div className="w-full h-48 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg flex items-center justify-center">
        <p className="text-white text-lg">Loading games...</p>
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
            <div 
              className={`relative h-48 rounded-lg overflow-hidden ${getBackgroundColor(game.id)} p-6 cursor-pointer group`}
              style={{
                backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.7), rgba(0,0,0,0.4)), url(${getGameThumbnail(game)})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="relative z-10">
                <div className="text-xs text-gray-300 uppercase tracking-wider mb-1">
                  {game.producer || game.category || 'Game'}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{game.title}</h3>
                <p className="text-sm text-gray-200 mb-4">{getGameDescription(game)}</p>
                <button 
                  className="px-4 py-2 bg-white/20 backdrop-blur text-white rounded hover:bg-white/30 transition-colors"
                  onClick={() => {
                    if (onPlayGame) {
                      onPlayGame(game.id);
                    }
                  }}
                >
                  Play Now
                </button>
              </div>
              <div className="absolute right-0 bottom-0 w-32 h-32 opacity-20 transform translate-x-8 translate-y-8">
                <div className="w-full h-full bg-white/10 rounded-full"></div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
} 