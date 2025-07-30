'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Grid3X3, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Game } from '@/types';
import GameCard from './GameCard';
import { AllGamesSectionSkeleton } from '@/components/ui/SkeletonLoader';

interface AllGamesSectionProps {
  games: Game[];
  onPlayGame: (gameId: number) => void;
  isLoading?: boolean;
}

export default function AllGamesSection({ games, onPlayGame, isLoading = false }: AllGamesSectionProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isChangingPage, setIsChangingPage] = useState(false);
  const gamesPerPage = 32;

  if (isLoading) {
    return <AllGamesSectionSkeleton />;
  }

  if (games.length === 0) return null;

  // Calculate pagination
  const totalPages = Math.ceil(games.length / gamesPerPage);
  const startIndex = (currentPage - 1) * gamesPerPage;
  const endIndex = startIndex + gamesPerPage;
  const currentGames = games.slice(startIndex, endIndex);
  const showingStart = startIndex + 1;
  const showingEnd = Math.min(endIndex, games.length);

  const goToPage = async (page: number) => {
    if (page === currentPage || isChangingPage) return;
    
    setIsChangingPage(true);
    setCurrentPage(page);
    
    // Scroll to top of section with smooth animation
    document.getElementById('all-games-section')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
    
    // Small delay for better UX
    setTimeout(() => {
      setIsChangingPage(false);
    }, 300);
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

  const goToFirstPage = () => {
    if (currentPage > 1) {
      goToPage(1);
    }
  };

  const goToLastPage = () => {
    if (currentPage < totalPages) {
      goToPage(totalPages);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 7;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

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
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#3b82f6]/10 border border-[#3b82f6]/20">
            <Grid3X3 className="w-5 h-5 text-[#3b82f6]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">All Games</h2>
            <p className="text-sm text-gray-400 mt-1">
              Showing {showingStart}-{showingEnd} of {games.length} games
            </p>
          </div>
        </div>
        
        {totalPages > 1 && (
          <div className="hidden md:flex items-center gap-3 text-sm">
            <span className="text-gray-400">Page</span>
            <div className="flex items-center gap-1 px-3 py-1.5 bg-[#0f212e] rounded-lg border border-[#1a2c38]">
              <span className="text-white font-medium">{currentPage}</span>
              <span className="text-gray-500">of</span>
              <span className="text-gray-400">{totalPages}</span>
            </div>
          </div>
        )}
      </div>

      {/* Games grid with loading state */}
      <div className={`transition-opacity duration-300 ${isChangingPage ? 'opacity-50' : 'opacity-100'}`}>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4 mb-12">
          {currentGames.map((game) => (
            <div key={game.id} className="transform transition-transform duration-200 hover:scale-[1.02]">
              <GameCard game={game} onPlay={onPlayGame} type="slot" isLoading={isChangingPage} />
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col items-center gap-6 pb-8">
          {/* Mobile pagination info */}
          <div className="md:hidden text-center">
            <p className="text-sm text-gray-400">
              Page {currentPage} of {totalPages}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Showing {showingStart}-{showingEnd} of {games.length} games
            </p>
          </div>

          {/* Pagination controls */}
          <div className="flex items-center gap-2">
            {/* First page button */}
            <button
              onClick={goToFirstPage}
              disabled={currentPage === 1 || isChangingPage}
              className="hidden sm:flex items-center justify-center w-10 h-10 rounded-lg bg-[#0f212e] hover:bg-[#1a2c38] text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#0f212e] group"
              aria-label="First page"
              title="Go to first page"
            >
              <ChevronsLeft className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </button>

            {/* Previous button */}
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 1 || isChangingPage}
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#0f212e] hover:bg-[#1a2c38] text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#0f212e] group"
              aria-label="Previous page"
              title="Go to previous page"
            >
              <ChevronLeft className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </button>

            {/* Page numbers */}
            <div className="flex items-center gap-1">
              {/* First page if not in visible range */}
              {getPageNumbers()[0] > 1 && (
                <>
                  <button
                    onClick={() => goToPage(1)}
                    disabled={isChangingPage}
                    className="hidden sm:flex items-center justify-center min-w-[40px] h-10 px-3 rounded-lg bg-[#0f212e] hover:bg-[#1a2c38] text-white transition-all duration-200 hover:scale-105 disabled:opacity-50"
                  >
                    1
                  </button>
                  {getPageNumbers()[0] > 2 && (
                    <div className="hidden sm:flex items-center justify-center w-8 h-10">
                      <span className="text-gray-500 text-sm">⋯</span>
                    </div>
                  )}
                </>
              )}

              {/* Visible page numbers */}
              {getPageNumbers().map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  disabled={isChangingPage}
                  className={`flex items-center justify-center min-w-[40px] h-10 px-3 rounded-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 ${
                    page === currentPage
                      ? 'bg-[#3b82f6] text-white shadow-lg shadow-[#3b82f6]/25 scale-105'
                      : 'bg-[#0f212e] hover:bg-[#1a2c38] text-white'
                  }`}
                >
                  <span className="font-medium">{page}</span>
                </button>
              ))}

              {/* Last page if not in visible range */}
              {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
                <>
                  {getPageNumbers()[getPageNumbers().length - 1] < totalPages - 1 && (
                    <div className="hidden sm:flex items-center justify-center w-8 h-10">
                      <span className="text-gray-500 text-sm">⋯</span>
                    </div>
                  )}
                  <button
                    onClick={() => goToPage(totalPages)}
                    disabled={isChangingPage}
                    className="hidden sm:flex items-center justify-center min-w-[40px] h-10 px-3 rounded-lg bg-[#0f212e] hover:bg-[#1a2c38] text-white transition-all duration-200 hover:scale-105 disabled:opacity-50"
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>

            {/* Next button */}
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages || isChangingPage}
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#0f212e] hover:bg-[#1a2c38] text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#0f212e] group"
              aria-label="Next page"
              title="Go to next page"
            >
              <ChevronRight className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </button>

            {/* Last page button */}
            <button
              onClick={goToLastPage}
              disabled={currentPage === totalPages || isChangingPage}
              className="hidden sm:flex items-center justify-center w-10 h-10 rounded-lg bg-[#0f212e] hover:bg-[#1a2c38] text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#0f212e] group"
              aria-label="Last page"
              title="Go to last page"
            >
              <ChevronsRight className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </button>
          </div>

          {/* Quick page info for desktop */}
          <div className="hidden md:block text-center">
            <p className="text-xs text-gray-500">
              Jump to any page above • {games.length} total games available
            </p>
          </div>
        </div>
      )}
    </div>
  );
} 