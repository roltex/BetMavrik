'use client';

import { ChevronLeft, ChevronRight, Flame, Grid3X3, Network } from 'lucide-react';
import { useRef } from 'react';
import { Game } from '@/types';
import GameCard from './GameCard';

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
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    
    const scrollAmount = 400;
    const currentScroll = scrollContainerRef.current.scrollLeft;
    
    scrollContainerRef.current.scrollTo({
      left: direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount,
      behavior: 'smooth'
    });
  };

  if (games.length === 0) return null;

  return (
    <div className="relative">
      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-[#3b82f6]">{iconMap[icon]}</span>
          <h2 className="text-xl font-bold text-white">{title}</h2>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            className="p-2 rounded-lg bg-[#2f3241] hover:bg-[#3f4251] text-white transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 rounded-lg bg-[#2f3241] hover:bg-[#3f4251] text-white transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Games container */}
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth"
        >
          {games.map((game) => (
            <div
              key={game.id}
              className={`flex-shrink-0 ${
                type === 'originals' ? 'w-48' : 'w-64'
              }`}
            >
              <GameCard game={game} onPlay={onPlayGame} type={type} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 