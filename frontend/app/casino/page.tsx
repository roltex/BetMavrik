'use client';

import { useState, useEffect } from 'react';
import PromotionalBanners from '@/components/casino/PromotionalBanners';
import NavigationTabs from '@/components/casino/NavigationTabs';
import GameSection from '@/components/casino/GameSection';
import AllGamesSection from '@/components/casino/AllGamesSection';
import SearchBar from '@/components/ui/SearchBar';
import Header from '@/components/layout/Header';
import { CasinoPageSkeleton } from '@/components/ui/SkeletonLoader';
import GameLaunchModal from '@/components/ui/GameLaunchModal';
import { Game, User } from '@/types';
import { apiService } from '@/services/api';

export default function CasinoPage() {
  const [user, setUser] = useState<User | null>(null);
  const [allGames, setAllGames] = useState<Game[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('lobby');
  const [isLoading, setIsLoading] = useState(true);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    gameId: number | null;
    gameTitle: string;
  }>({
    isOpen: false,
    gameId: null,
    gameTitle: ''
  });

  useEffect(() => {
    const initializePage = async () => {
      try {
        setIsLoading(true);
        
        // Load user and games data
        const [userData, gamesData] = await Promise.all([
          apiService.getUser(),
          apiService.getGames()
        ]);
        
        setUser(userData);
        setAllGames(gamesData);
      } catch (error) {
        console.error('Failed to load casino data:', error);
      } finally {
        // Add a minimum loading time for better UX
        setTimeout(() => {
          setIsLoading(false);
        }, 800);
      }
    };

    initializePage();
  }, []);

  const openGameModal = (gameId: number) => {
    const game = allGames.find(g => g.id === gameId);
    setModalState({
      isOpen: true,
      gameId,
      gameTitle: game?.title || 'Unknown Game'
    });
  };

  const closeGameModal = () => {
    setModalState({
      isOpen: false,
      gameId: null,
      gameTitle: ''
    });
  };

  const handleModalGameLaunch = async (
    gameId: number, 
    addLog: (log: { type: 'info' | 'success' | 'error' | 'warning'; step: string; message: string; details?: string }) => void
  ) => {
    try {
      addLog({
        type: 'info',
        step: 'Session',
        message: 'Sending request to game provider...',
        details: `Endpoint: ${process.env.NEXT_PUBLIC_API_URL || 'https://betmavrik-backend.up.railway.app'}/games`
      });

      // Add delay to show the logging process
      await new Promise(resolve => setTimeout(resolve, 1000));

      addLog({
        type: 'info',
        step: 'Session',
        message: 'Authenticating with game provider',
        details: 'Using HMAC-SHA256 signature verification'
      });

      await new Promise(resolve => setTimeout(resolve, 800));
      
      const gameUrl = await apiService.startGame(gameId);
      
      addLog({
        type: 'success',
        step: 'Session',
        message: 'Game session created successfully',
        details: `Session URL: ${gameUrl}`
      });

      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (gameUrl) {
        addLog({
          type: 'success',
          step: 'Launch',
          message: 'Game session ready',
          details: `Game URL: ${gameUrl}`
        });

        await new Promise(resolve => setTimeout(resolve, 800));
      } else {
        throw new Error('No game URL received from server');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response: { data?: { message?: string }; status?: number } };
        
        addLog({
          type: 'error',
          step: 'Session',
          message: 'Server error occurred',
          details: `Status: ${axiosError.response?.status} | ${axiosError.response?.data?.message || 'Server error'}`
        });
      } else if (error && typeof error === 'object' && 'request' in error) {
        addLog({
          type: 'error',
          step: 'Session',
          message: 'Network connection failed',
          details: 'Please check your internet connection and try again'
        });
      } else {
        addLog({
          type: 'error',
          step: 'Launch',
          message: 'Game launch failed',
          details: errorMessage
        });
      }
      
      throw error;
    }
  };

  // Show loading skeleton while data is being fetched
  if (isLoading) {
    return <CasinoPageSkeleton />;
  }

  // Filter games based on search term
  const searchFilteredGames = allGames.filter(game =>
    game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (game.producer && game.producer.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Filter games based on active tab
  const getFilteredGamesByCategory = () => {
    switch (activeTab) {
      case 'lobby':
        return searchFilteredGames; // Show all games in lobby
      case 'stake-originals':
        return searchFilteredGames.filter((game: Game) => 
          game.producer?.toLowerCase().includes('stake') || 
          game.category?.toLowerCase().includes('stake')
        );
      case 'slot':
        return searchFilteredGames.filter((game: Game) => 
          game.category?.toLowerCase().includes('slot') ||
          !game.category
        );
      case 'live-casino':
        return searchFilteredGames.filter((game: Game) => 
          game.category?.toLowerCase().includes('live') ||
          game.category?.toLowerCase().includes('casino')
        );
      case 'game-shows':
        return searchFilteredGames.filter((game: Game) => 
          game.category?.toLowerCase().includes('show') ||
          game.category?.toLowerCase().includes('game show')
        );
      case 'stake-exclusives':
        return searchFilteredGames.filter((game: Game) => 
          game.producer?.toLowerCase().includes('stake') && 
          (game.category?.toLowerCase().includes('exclusive') || game.title.toLowerCase().includes('exclusive'))
        );
      case 'new-releases':
        // For new releases, we could sort by date if available, for now just show recent games
        return searchFilteredGames.slice().reverse().slice(0, 50);
      default:
        return searchFilteredGames;
    }
  };

  const filteredGames = getFilteredGamesByCategory();

  // Categorize games for different sections (used when activeTab is 'lobby')
  const stakeOriginals = searchFilteredGames.filter((game: Game) => 
    game.producer?.toLowerCase().includes('stake') || 
    game.category?.toLowerCase().includes('stake')
  );
  
  const slot = searchFilteredGames.filter((game: Game) => 
    game.category?.toLowerCase().includes('slot') ||
    !game.category
  );

  return (
    <div className="min-h-screen bg-[#1a2c38]">
      <Header user={user} />
      
      <main className="max-w-[1200px] mx-auto px-4 py-6 pt-8">
        {/* Promotional Banners - Always show all games */}
          <div className="mb-12">
          <PromotionalBanners games={allGames} onPlayGame={openGameModal} />
          </div>

        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder={
              activeTab === 'lobby' ? 'Search your game' :
              activeTab === 'slot' ? 'Search slot games...' :
              activeTab === 'stake-originals' ? 'Search Stake Originals...' :
              activeTab === 'live-casino' ? 'Search live casino games...' :
              activeTab === 'game-shows' ? 'Search game shows...' :
              activeTab === 'stake-exclusives' ? 'Search Stake Exclusives...' :
              activeTab === 'new-releases' ? 'Search new releases...' :
              'Search your game'
            }
          />
        </div>

        {/* Navigation Tabs */}
        <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Game Sections */}
        <div className="space-y-12">
          {activeTab === 'lobby' ? (
            // Lobby view - show category sections
            <>
          {stakeOriginals.length > 0 && (
            <GameSection 
              title="Stake Originals" 
              icon="fire"
              games={stakeOriginals.slice(0, 12)}
              type="originals"
                  onPlayGame={openGameModal}
            />
          )}
          
              {slot.length > 0 && (
            <GameSection 
                  title="Slot" 
                  icon="slot"
                  games={slot.slice(0, 15)}
                  type="slot"
                  onPlayGame={openGameModal}
            />
          )}
          
          {/* All Games Section with Pagination */}
              <AllGamesSection 
                games={searchFilteredGames}
                onPlayGame={openGameModal}
              />
            </>
          ) : (
            // Category-specific view - show filtered games
            <>
              {/* Category Header */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {activeTab === 'stake-originals' && 'Stake Originals'}
                  {activeTab === 'slot' && 'Slot'}
                  {activeTab === 'live-casino' && 'Live Casino'}
                  {activeTab === 'game-shows' && 'Game Shows'}
                  {activeTab === 'stake-exclusives' && 'Stake Exclusives'}
                  {activeTab === 'new-releases' && 'New Releases'}
                </h2>
              </div>
              
              {filteredGames.length > 0 ? (
          <AllGamesSection 
            games={filteredGames}
              onPlayGame={openGameModal}
            />
              ) : (
                /* Empty State */
                <div className="flex flex-col items-center justify-center py-16 px-8">
                  <div className="w-20 h-20 bg-[#0f212e] rounded-full flex items-center justify-center mb-6">
                    <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.5-1.01-6-2.709M15 13.292V9.99c0-1.576-.644-3.002-1.686-4.043M7.5 4.5L16.5 13.5m0 0L7.5 22.5" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">No games found</h3>
                  <p className="text-gray-400 text-center max-w-md">
                    {searchTerm ? (
                      <>No games match your search &ldquo;<span className="text-white">{searchTerm}</span>&rdquo; in this category. Try searching with different keywords.</>
                    ) : (
                      <>We couldn&apos;t find any games in this category at the moment. Check back later or explore other categories.</>
                    )}
                  </p>
                  {searchTerm && (
                    <button 
                      onClick={() => setSearchTerm('')}
                      className="mt-4 px-4 py-2 bg-[#3b82f6] text-white rounded-lg hover:bg-[#2563eb] transition-colors"
                    >
                      Clear search
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Game Launch Modal */}
      <GameLaunchModal
        isOpen={modalState.isOpen}
        onClose={closeGameModal}
        gameTitle={modalState.gameTitle}
        gameId={modalState.gameId || 0}
        onLaunchGame={handleModalGameLaunch}
      />
    </div>
  );
} 