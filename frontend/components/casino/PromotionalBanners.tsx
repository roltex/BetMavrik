'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const promotions = [
  {
    id: 1,
    title: 'Gold Portals',
    subtitle: 'New releases',
    description: 'New Enhanced RTP game! Read More',
    buttonText: 'Play Now',
    bgColor: 'bg-gradient-to-b from-purple-900 to-purple-700',
    image: '/placeholder-game.png'
  },
  {
    id: 2,
    title: 'Just Slots 100x Hunt',
    subtitle: 'Exclusive Promotion',
    description: '$40,000 Prize Pool! Read More',
    buttonText: 'Learn More',
    bgColor: 'bg-gradient-to-b from-pink-900 to-red-700',
    image: '/placeholder-game.png'
  },
  {
    id: 3,
    title: 'Daily Races',
    subtitle: 'Promotion',
    description: 'Play in our $100,000 Daily Race Read More',
    buttonText: 'Race Now',
    bgColor: 'bg-gradient-to-b from-blue-900 to-cyan-700',
    image: '/placeholder-game.png'
  }
];

export default function PromotionalBanners() {
  return (
    <div className="w-full h-96">
      <Swiper
        modules={[Autoplay, Pagination]}
        direction="vertical"
        spaceBetween={10}
        slidesPerView={1}
        pagination={{ 
          clickable: true,
          dynamicBullets: true,
        }}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        className="promotional-swiper h-full"
        style={{
          '--swiper-pagination-color': '#3b82f6',
          '--swiper-pagination-bullet-inactive-color': '#6b7280',
        } as any}
      >
        {promotions.map((promo) => (
          <SwiperSlide key={promo.id}>
            <div className={`relative h-full rounded-lg overflow-hidden ${promo.bgColor} p-6 cursor-pointer group`}>
              <div className="relative z-10 h-full flex flex-col justify-center">
                <div className="text-xs text-gray-300 uppercase tracking-wider mb-2">
                  {promo.subtitle}
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{promo.title}</h3>
                <p className="text-sm text-gray-200 mb-6 max-w-md">{promo.description}</p>
                <button className="px-6 py-3 bg-white/20 backdrop-blur text-white rounded-lg hover:bg-white/30 transition-colors self-start">
                  {promo.buttonText}
                </button>
              </div>
              <div className="absolute right-0 top-0 w-40 h-40 opacity-10 transform translate-x-10 -translate-y-10">
                <div className="w-full h-full bg-white/10 rounded-full"></div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
} 