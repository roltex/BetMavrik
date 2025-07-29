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
  return `https://thumb.all-ingame.com/horizontal/${game.id}.png`;
};

const getPromotionalContent = (game: Game, index: number) => {
  const promotionalTexts = [
    {
      subtitle: 'Featured Game',
      description: 'Experience the thrill of this amazing game!',
      buttonText: 'Play Now',
      bgColor: 'bg-gradient-to-r from-purple-900 to-purple-700',
    },
    {
      subtitle: 'Hot Game',
      description: 'Join thousands of players in this popular game!',
      buttonText: 'Join Now',
      bgColor: 'bg-gradient-to-r from-pink-900 to-red-700',
    },
    {
      subtitle: 'New Release',
      description: 'Try out this exciting new addition to our casino!',
      buttonText: 'Try Now',
      bgColor: 'bg-gradient-to-r from-blue-900 to-cyan-700',
    },
    {
      subtitle: 'Popular Choice',
      description: 'One of our most played games this week!',
      buttonText: 'Play Now',
      bgColor: 'bg-gradient-to-r from-green-900 to-teal-700',
    },
    {
      subtitle: 'Staff Pick',
      description: 'Highly recommended by our gaming experts!',
      buttonText: 'Try It',
      bgColor: 'bg-gradient-to-r from-orange-900 to-red-700',
    },
    {
      subtitle: 'Trending Now',
      description: 'Currently trending among our players!',
      buttonText: 'Join In',
      bgColor: 'bg-gradient-to-r from-indigo-900 to-purple-700',
    },
    {
      subtitle: 'Must Play',
      description: 'A game you absolutely must try!',
      buttonText: 'Play Now',
      bgColor: 'bg-gradient-to-r from-pink-900 to-purple-700',
    },
    {
      subtitle: 'Big Winner',
      description: 'Recent big wins reported on this game!',
      buttonText: 'Win Big',
      bgColor: 'bg-gradient-to-r from-yellow-900 to-orange-700',
    },
    {
      subtitle: 'Fan Favorite',
      description: 'Loved by thousands of players worldwide!',
      buttonText: 'See Why',
      bgColor: 'bg-gradient-to-r from-red-900 to-pink-700',
    },
    {
      subtitle: 'Exclusive',
      description: 'Available exclusively on our platform!',
      buttonText: 'Play Exclusive',
      bgColor: 'bg-gradient-to-r from-gray-900 to-gray-700',
    },
  ];

  const content = promotionalTexts[index % promotionalTexts.length];
  
  return {
    ...content,
    title: game.title,
    image: getGameThumbnail(game),
  };
};

export default function PromotionalBanners({ games, onPlayGame }: PromotionalBannersProps) {
  // Use the last 10 games for variety, but only show 3 at a time
  const promotionalGames = games.slice(-10).reverse(); // Get last 10 and reverse to show newest first
  
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
        {promotionalGames.map((game, index) => {
          const promoContent = getPromotionalContent(game, index);
          
          return (
            <SwiperSlide key={game.id}>
              <div 
                className={`relative h-48 rounded-lg overflow-hidden ${promoContent.bgColor} p-6 cursor-pointer group`}
                style={{
                  backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.7), rgba(0,0,0,0.4)), url(${promoContent.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className="relative z-10">
                  <div className="text-xs text-gray-300 uppercase tracking-wider mb-1">
                    {promoContent.subtitle}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{promoContent.title}</h3>
                  <p className="text-sm text-gray-200 mb-4">{promoContent.description}</p>
                  <button 
                    className="px-4 py-2 bg-white/20 backdrop-blur text-white rounded hover:bg-white/30 transition-colors"
                    onClick={() => {
                      if (onPlayGame) {
                        onPlayGame(game.id);
                      }
                    }}
                  >
                    {promoContent.buttonText}
                  </button>
                </div>
                <div className="absolute right-0 bottom-0 w-32 h-32 opacity-20 transform translate-x-8 translate-y-8">
                  <div className="w-full h-full bg-white/10 rounded-full"></div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
} 