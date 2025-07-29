'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight, Flame, Zap, Grid3X3, Layers, Network, Gamepad2 } from 'lucide-react';
import { Game } from '@/types';
import GameCard from './GameCard';
import { GameSectionSkeleton } from '@/components/ui/SkeletonLoader';
import 'swiper/css';
import 'swiper/css/navigation';

interface GameSectionProps {
  title: string;
  icon: string;
  games: Game[];
  type: 'slots' | 'originals' | 'providers';
  onPlayGame: (gameId: number) => void;
  isLoading?: boolean;
}

const getIcon = (iconName: string) => {
  const iconMap = {
    fire: Flame,
    slots: Zap,
    grid: Grid3X3,
    layers: Layers,
    network: Network,
    gamepad: Gamepad2,
  };
  
  const IconComponent = iconMap[iconName as keyof typeof iconMap] || Grid3X3;
  return <IconComponent className="w-5 h-5" />;
};

export default function GameSection({ title, icon, games, type, onPlayGame, isLoading = false }: GameSectionProps) {
  if (isLoading) {
    return <GameSectionSkeleton title={title} count={8} />;
  }

  if (games.length === 0) return null;

  const sectionId = title.replace(/\s+/g, '-').toLowerCase();

  const swiperBreakpoints = {
    320: {
      slidesPerView: 2,
      slidesPerGroup: 2,
      spaceBetween: 12,
    },
    480: {
      slidesPerView: 3,
      slidesPerGroup: 3,
      spaceBetween: 14,
    },
    640: {
      slidesPerView: 4,
      slidesPerGroup: 4,
      spaceBetween: 16,
    },
    768: {
      slidesPerView: 5,
      slidesPerGroup: 4,
      spaceBetween: 16,
    },
    1024: {
      slidesPerView: 6,
      slidesPerGroup: 4,
      spaceBetween: 16,
    },
    1280: {
      slidesPerView: 7,
      slidesPerGroup: 4,
      spaceBetween: 16,
    },
    1536: {
      slidesPerView: 8,
      slidesPerGroup: 4,
      spaceBetween: 16,
    },
  };

  return (
    <div className="relative px-2">
      {/* Section header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-[#3b82f6]">
            {getIcon(icon)}
          </span>
          <h2 className="text-xl font-bold text-white">{title}</h2>
        </div>
        
        {/* Navigation buttons */}
        <div className="flex items-center gap-2">
          <button
            className={`${sectionId}-prev w-8 h-8 rounded-lg bg-[#2f3241] hover:bg-[#3f4251] text-white transition-colors flex items-center justify-center swiper-button-disabled:opacity-50 swiper-button-disabled:cursor-not-allowed`}
            aria-label={`Previous ${title}`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            className={`${sectionId}-next w-8 h-8 rounded-lg bg-[#2f3241] hover:bg-[#3f4251] text-white transition-colors flex items-center justify-center swiper-button-disabled:opacity-50 swiper-button-disabled:cursor-not-allowed`}
            aria-label={`Next ${title}`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Games slider */}
      <Swiper
        modules={[Navigation]}
        spaceBetween={16}
        slidesPerView={8}
        slidesPerGroup={4}
        navigation={{
          nextEl: `.${sectionId}-next`,
          prevEl: `.${sectionId}-prev`,
        }}
        breakpoints={swiperBreakpoints}
        className="game-section-swiper"
      >
        {games.map((game) => (
          <SwiperSlide key={game.id}>
            <GameCard game={game} onPlay={onPlayGame} type={type === 'providers' ? 'slots' : type} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
} 