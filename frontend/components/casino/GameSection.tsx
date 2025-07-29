'use client';

import { ChevronLeft, ChevronRight, Flame, Grid3X3, Network } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { Game } from '@/types';
import GameCard from './GameCard';
import 'swiper/css';
import 'swiper/css/navigation';

interface GameSectionProps {
  title: string;
  icon: 'fire' | 'slots' | 'network';
  games: Game[];
  type: 'originals' | 'slots' | 'providers';
  onPlayGame: (gameId: number) => void;
}

const iconMap = {
  fire: <Flame className="w-5 h-5" />,
  slots: <Grid3X3 className="w-5 h-5" />,
  network: <Network className="w-5 h-5" />
};

export default function GameSection({ title, icon, games, type, onPlayGame }: GameSectionProps) {
  if (games.length === 0) return null;

  const swiperBreakpoints = {
    320: {
      slidesPerView: 2,
      spaceBetween: 12,
      slidesPerGroup: 1,
    },
    480: {
      slidesPerView: 2.5,
      spaceBetween: 12,
      slidesPerGroup: 1,
    },
    640: {
      slidesPerView: 3,
      spaceBetween: 16,
      slidesPerGroup: 2,
    },
    768: {
      slidesPerView: 4,
      spaceBetween: 16,
      slidesPerGroup: 2,
    },
    1024: {
      slidesPerView: 6,
      spaceBetween: 16,
      slidesPerGroup: 3,
    },
    1280: {
      slidesPerView: 8,
      spaceBetween: 20,
      slidesPerGroup: 4,
    },
    1536: {
      slidesPerView: 8,
      spaceBetween: 20,
      slidesPerGroup: 4,
    },
  };

  return (
    <div className="relative px-2">
      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-[#3b82f6]">{iconMap[icon]}</span>
          <h2 className="text-xl font-bold text-white">{title}</h2>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            className={`${title.replace(/\s+/g, '-').toLowerCase()}-prev p-2 rounded-lg bg-[#2f3241] hover:bg-[#3f4251] text-white transition-colors`}
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            className={`${title.replace(/\s+/g, '-').toLowerCase()}-next p-2 rounded-lg bg-[#2f3241] hover:bg-[#3f4251] text-white transition-colors`}
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Games container with Swiper */}
      <div className="relative">
        <Swiper
          modules={[Navigation]}
          spaceBetween={16}
          slidesPerView={8}
          slidesPerGroup={4}
          navigation={{
            nextEl: `.${title.replace(/\s+/g, '-').toLowerCase()}-next`,
            prevEl: `.${title.replace(/\s+/g, '-').toLowerCase()}-prev`,
          }}
          breakpoints={swiperBreakpoints}
          className="game-section-swiper"
        >
          {games.map((game) => (
            <SwiperSlide key={game.id}>
              <GameCard game={game} onPlay={onPlayGame} type={type} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
} 