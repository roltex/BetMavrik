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
    bgColor: 'bg-gradient-to-r from-purple-900 to-purple-700',
    image: '/placeholder-game.png'
  },
  {
    id: 2,
    title: 'Just Slots 100x Hunt',
    subtitle: 'Exclusive Promotion',
    description: '$40,000 Prize Pool! Read More',
    buttonText: 'Learn More',
    bgColor: 'bg-gradient-to-r from-pink-900 to-red-700',
    image: '/placeholder-game.png'
  },
  {
    id: 3,
    title: 'Daily Races',
    subtitle: 'Promotion',
    description: 'Play in our $100,000 Daily Race Read More',
    buttonText: 'Race Now',
    bgColor: 'bg-gradient-to-r from-blue-900 to-cyan-700',
    image: '/placeholder-game.png'
  }
];

export default function PromotionalBanners() {
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
        {promotions.map((promo) => (
          <SwiperSlide key={promo.id}>
            <div className={`relative h-48 rounded-lg overflow-hidden ${promo.bgColor} p-6 cursor-pointer group`}>
              <div className="relative z-10">
                <div className="text-xs text-gray-300 uppercase tracking-wider mb-1">
                  {promo.subtitle}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{promo.title}</h3>
                <p className="text-sm text-gray-200 mb-4">{promo.description}</p>
                <button className="px-4 py-2 bg-white/20 backdrop-blur text-white rounded hover:bg-white/30 transition-colors">
                  {promo.buttonText}
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