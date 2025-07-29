'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Grid3X3 } from 'lucide-react';
import { Game } from '@/types';
import GameCard from './GameCard';

interface AllGamesSectionProps {
  games: Game[];
  onPlayGame: (gameId: number) => void;
}

export default function AllGamesSection({ games, onPlayGame }: AllGamesSectionProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const gamesPerPage = 20;

  if (games.length === 0) return null;

  // Calculate pagination
  const totalPages = Math.ceil(games.length / gamesPerPage);
  const startIndex = (currentPage - 1) * gamesPerPage;
  const endIndex = startIndex + gamesPerPage;
  const currentGames = games.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of section when page changes
    document.getElementById('all-games-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust start if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div id="all-games-section" className="relative px-2">
      {/* Section header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="text-[#3b82f6]">
            <Grid3X3 className="w-5 h-5" />
          </span>
          <h2 className="text-xl font-bold text-white">All Games</h2>
          <span className="text-gray-400 text-sm">
            ({games.length} games)
          </span>
        </div>
        
        {totalPages > 1 && (
          <div className="text-sm text-gray-400">
            Page {currentPage} of {totalPages}
          </div>
        )}
      </div>

      {/* Games grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4 mb-8">
        {currentGames.map((game) => (
          <div key={game.id}>
            <GameCard game={game} onPlay={onPlayGame} type="slots" />
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {/* Previous button */}
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            className="p-2 rounded-lg bg-[#2f3241] hover:bg-[#3f4251] text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* First page */}
          {getPageNumbers()[0] > 1 && (
            <>
              <button
                onClick={() => goToPage(1)}
                className="px-3 py-2 rounded-lg bg-[#2f3241] hover:bg-[#3f4251] text-white transition-colors"
              >
                1
              </button>
              {getPageNumbers()[0] > 2 && (
                <span className="text-gray-500">...</span>
              )}
            </>
          )}

          {/* Page numbers */}
          {getPageNumbers().map((page) => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`px-3 py-2 rounded-lg transition-colors ${
                page === currentPage
                  ? 'bg-[#3b82f6] text-white'
                  : 'bg-[#2f3241] hover:bg-[#3f4251] text-white'
              }`}
            >
              {page}
            </button>
          ))}

          {/* Last page */}
          {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
            <>
              {getPageNumbers()[getPageNumbers().length - 1] < totalPages - 1 && (
                <span className="text-gray-500">...</span>
              )}
              <button
                onClick={() => goToPage(totalPages)}
                className="px-3 py-2 rounded-lg bg-[#2f3241] hover:bg-[#3f4251] text-white transition-colors"
              >
                {totalPages}
              </button>
            </>
          )}

          {/* Next button */}
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg bg-[#2f3241] hover:bg-[#3f4251] text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
} 