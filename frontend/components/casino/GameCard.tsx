'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Play } from 'lucide-react';
import { Game, CreateFreespinsRequest } from '@/types';
import { apiService } from '@/services/api';
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

  return (
    <div 
      className={`relative bg-[#2f3241] rounded-lg overflow-hidden cursor-pointer group transition-all duration-300 hover:scale-105 hover:shadow-lg ${
        type === 'originals' ? 'aspect-[4/3]' : 'aspect-[3/4]'
      }`}
      onClick={() => onPlay(game.id)}
    >
      {/* Game Image */}
      <div className="relative w-full h-2/3">
        {!imageLoaded && !imageError && (
          <Skeleton className="absolute inset-0 w-full h-full rounded-lg" />
        )}
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
        {imageError && (
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
            <div className="text-white text-center p-2">
              <div className="text-lg font-bold mb-1">🎮</div>
              <div className="text-xs">{game.title}</div>
            </div>
          </div>
        )}
        
        {/* Play Button */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
            <div className="w-0 h-0 border-l-[8px] border-l-white border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1"></div>
          </div>
        </div>
      </div>

      {/* Game Info */}
      <div className="p-3 h-1/3 flex flex-col justify-between">
        <div>
          <h3 className="text-white text-sm font-medium truncate mb-1">{game.title}</h3>
          <p className="text-gray-400 text-xs truncate">{game.producer || 'Unknown'}</p>
        </div>
        
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