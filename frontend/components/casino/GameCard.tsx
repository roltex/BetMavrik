'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';
import { Game } from '@/types';
import { Skeleton } from '@/components/ui/SkeletonLoader';

interface GameCardProps {
  game: Game;
  onPlay: (gameId: number) => void;
  type?: 'slots' | 'originals';
  isLoading?: boolean;
}

export default function GameCard({ game, onPlay, type = 'slots', isLoading = false }: GameCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  if (isLoading) {
    return (
      <div className="group cursor-pointer">
        <div className={`relative overflow-hidden rounded-lg bg-[#2f3241] ${
          type === 'originals' ? 'aspect-[3/4]' : 'aspect-[4/5]'
        }`}>
          <Skeleton className="absolute inset-0 w-full h-full rounded-lg" />
          
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-200 flex items-center justify-center">
            <Skeleton className="w-12 h-12 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </div>
        </div>
        
        <div className="mt-2 px-1">
          <Skeleton className="h-4 w-3/4 mb-1" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    );
  }

  const getThumbnail = () => {
    if (game.thumbnail_vertical) {
      return game.thumbnail_vertical;
    }
    if (game.id) {
      return `https://thumb.all-ingame.com/vertical/${game.id}.png`;
    }
    return game.thumbnail || `https://thumb.all-ingame.com/iv2/${game.id}.png`;
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div className="group cursor-pointer" onClick={() => onPlay(game.id)}>
      <div className={`relative overflow-hidden rounded-lg bg-[#2f3241] ${
        type === 'originals' ? 'aspect-[3/4]' : 'aspect-[4/5]'
      }`}>
        {/* Loading skeleton */}
        {!imageLoaded && !imageError && (
          <Skeleton className="absolute inset-0 w-full h-full rounded-lg" />
        )}

        {/* Game thumbnail */}
        {!imageError && (
          <img
            src={getThumbnail()}
            alt={game.title}
            className={`w-full h-full object-cover transition-all duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onError={handleImageError}
            onLoad={handleImageLoad}
            loading="lazy"
          />
        )}

        {/* Fallback for broken images */}
        {imageError && (
          <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <div className="text-xs font-medium">{game.title}</div>
              <div className="text-xs opacity-75 mt-1">Image unavailable</div>
            </div>
          </div>
        )}
        
        {/* Play button overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-200 flex items-center justify-center">
          <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 transform scale-90 group-hover:scale-100">
            <Play className="w-5 h-5 text-black ml-0.5" fill="currentColor" />
          </div>
        </div>
      </div>
      
      {/* Game info */}
      <div className="mt-2 px-1">
        <h3 className="text-sm font-medium text-white truncate" title={game.title}>
          {game.title}
        </h3>
        <p className="text-xs text-gray-400 truncate">
          {game.producer || 'Unknown'}
        </p>
      </div>
    </div>
  );
} 