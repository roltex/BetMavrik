'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Game, CreateFreespinsRequest } from '@/types';
import { apiService } from '@/services/api';
import { Skeleton } from '@/components/ui/SkeletonLoader';

interface GameCardProps {
  game: Game;
  onPlay: (gameId: number) => void;
  type?: 'slot' | 'originals';
  isLoading?: boolean;
}

export default function GameCard({ game, onPlay, type = 'slot', isLoading = false }: GameCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

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

  const handleFreespins = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      const freespinsData: CreateFreespinsRequest = {
        game: game.title,
        currency: 'USD',
        betlevel: 1,
        freespincount: 10,
        expiretime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' ') // 24 hours from now
      };
      
      console.log('🎁 Creating freespins for game:', game.title);
      const response = await apiService.startFreespins(freespinsData);
      console.log('✅ Freespins created:', response.identifier);
      
      // You could show a modal or notification here
      alert(`Freespins created! Identifier: ${response.identifier}`);
    } catch (error) {
      console.error('❌ Failed to create freespins:', error);
      alert('Failed to create freespins. Check console for details.');
    }
  };

  if (isLoading) {
    return (
      <div className="group cursor-pointer">
        <div className={`relative overflow-hidden rounded-lg bg-[#0f212e] ${
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

  return (
    <div className="group cursor-pointer" onClick={() => onPlay(game.id)}>
      <div className={`relative overflow-hidden rounded-lg bg-[#0f212e] ${
        type === 'originals' ? 'aspect-[3/4]' : 'aspect-[4/5]'
      }`}>
        {/* Loading skeleton */}
        {!imageLoaded && !imageError && (
          <Skeleton className="absolute inset-0 w-full h-full rounded-lg" />
        )}

        {/* Game thumbnail */}
        {!imageError && (
          <Image
            src={getThumbnail()}
            alt={game.title}
            fill
            className={`object-cover transition-all duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onError={handleImageError}
            onLoad={handleImageLoad}
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 12.5vw"
            unoptimized
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
            <div className="w-0 h-0 border-l-[8px] border-l-black border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1"></div>
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
        
        {/* Action Buttons */}
        <div className="flex gap-2 mt-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlay(game.id);
            }}
            className="flex-1 py-1.5 px-2 bg-[#3b82f6] text-white text-xs rounded hover:bg-[#2563eb] transition-colors"
          >
            Play
          </button>
          
          {/* Freespins button - only show for games that support freespins */}
          {game.has_freespins && (
            <button
              onClick={handleFreespins}
              className="py-1.5 px-2 bg-[#10b981] text-white text-xs rounded hover:bg-[#059669] transition-colors"
              title="Create Freespins"
            >
              🎁
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 