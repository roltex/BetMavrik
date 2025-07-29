'use client';

import Image from 'next/image';
import { Game } from '@/types';
import { Users } from 'lucide-react';

interface GameCardProps {
  game: Game;
  onPlay: (gameId: number) => void;
  type?: 'originals' | 'slots' | 'providers';
}

export default function GameCard({ game, onPlay, type = 'slots' }: GameCardProps) {
  const getThumbnail = () => {
    // Always prefer vertical images for a more vertical-oriented layout
    if (game.thumbnail_vertical) {
      return game.thumbnail_vertical;
    }
    
    // Use the vertical URL format from the endpoint as first fallback
    if (game.id) {
      return `https://thumb.all-ingame.com/vertical/${game.id}.png`;
    }
    
    // Final fallback to regular thumbnail or default URL
    return game.thumbnail || `https://thumb.all-ingame.com/iv2/${game.id}.png`;
  };

  return (
    <div 
      className="game-card relative group cursor-pointer"
      onClick={() => onPlay(game.id)}
    >
      <div className={`relative overflow-hidden rounded-lg bg-[#2f3241] ${
        type === 'originals' ? 'aspect-[3/4]' : 'aspect-[4/5]'
      }`}>
        <Image
          src={getThumbnail()}
          alt={game.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder-game.png';
          }}
        />
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button className="px-6 py-2 bg-[#3b82f6] text-white rounded-lg font-semibold hover:bg-[#2563eb] transition-colors">
            Play
          </button>
        </div>

        {/* Playing count */}
        {game.playing && game.playing > 0 && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/70 px-2 py-1 rounded text-xs text-white">
            <Users className="w-3 h-3" />
            <span>{game.playing.toLocaleString()} playing</span>
          </div>
        )}

        {/* Game title overlay for originals */}
        {type === 'originals' && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <h3 className="text-white font-bold text-lg uppercase">{game.title}</h3>
            <p className="text-gray-300 text-sm">{game.producer}</p>
          </div>
        )}
      </div>

      {/* Game info for slots */}
      {type !== 'originals' && (
        <div className="mt-2">
          <h3 className="text-white font-medium text-sm truncate">{game.title}</h3>
          <p className="text-gray-500 text-xs">{game.producer}</p>
        </div>
      )}
    </div>
  );
} 