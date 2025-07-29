'use client';

import { useState, useEffect } from 'react';
import PromotionalBanners from '@/components/casino/PromotionalBanners';
import NavigationTabs from '@/components/casino/NavigationTabs';
import GameSection from '@/components/casino/GameSection';
import AllGamesSection from '@/components/casino/AllGamesSection';
import SearchBar from '@/components/ui/SearchBar';
import Header from '@/components/layout/Header';
import { CasinoPageSkeleton } from '@/components/ui/SkeletonLoader';
import { Game, User } from '@/types';
import { apiService } from '@/services/api';

export default function CasinoPage() {
  const [user, setUser] = useState<User | null>(null);
  const [allGames, setAllGames] = useState<Game[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

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

  const handlePlayGame = async (gameId: number) => {
    try {
      console.log('🎮 Attempting to start game:', gameId);
      
      const gameUrl = await apiService.startGame(gameId);
      console.log('✅ Received game URL:', gameUrl);
      
      if (gameUrl) {
        console.log('🚀 Opening game in new window...');
        
        // Try to open the game
        const gameWindow = window.open(gameUrl, '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
        
        if (gameWindow) {
          console.log('✅ Game window opened successfully');
          
          // Check if window was blocked after a short delay
          setTimeout(() => {
            if (gameWindow.closed) {
              console.warn('⚠️ Game window was closed or blocked');
              alert('Game window was blocked by popup blocker. Please allow popups for this site.');
            }
          }, 1000);
        } else {
          console.error('❌ Failed to open game window - popup blocked?');
          alert('Unable to open game. Please disable popup blocker and try again.');
        }
      } else {
        console.error('❌ No game URL received');
        alert('Failed to get game URL from server');
      }
    } catch (error) {
      console.error('❌ Failed to start game:', error);
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response: { data?: { message?: string } } };
        console.error('Server response:', axiosError.response.data);
        alert(`Game failed to start: ${axiosError.response.data?.message || 'Server error'}`);
      } else if (error && typeof error === 'object' && 'request' in error) {
        console.error('Network error:', (error as { request: unknown }).request);
        alert('Network error - please check your connection');
      } else {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Error details:', errorMessage);
        alert(`Game failed to start: ${errorMessage}`);
      }
    }
  };

  // Show loading skeleton while data is being fetched
  if (isLoading) {
    return <CasinoPageSkeleton />;
  }

  // Filter games based on search term
  const filteredGames = allGames.filter(game =>
    game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (game.producer && game.producer.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Categorize games
  const stakeOriginals = filteredGames.filter((game: Game) => 
    game.producer?.toLowerCase().includes('stake') || 
    game.category?.toLowerCase().includes('stake')
  );
  
  const slots = filteredGames.filter((game: Game) => 
    game.category?.toLowerCase().includes('slot') ||
    !game.category
  );

  return (
    <div className="min-h-screen bg-[#0f1419]">
      <Header user={user} />
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Promotional Banners */}
        {searchTerm === '' && (
          <div className="mb-12">
            <PromotionalBanners games={allGames} onPlayGame={handlePlayGame} />
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search your game"
          />
        </div>

        {/* Navigation Tabs */}
        <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Game Sections */}
        <div className="space-y-12">
          {stakeOriginals.length > 0 && (
            <GameSection 
              title="Stake Originals" 
              icon="fire"
              games={stakeOriginals.slice(0, 12)}
              type="originals"
              onPlayGame={handlePlayGame}
            />
          )}
          
          {slots.length > 0 && (
            <GameSection 
              title="Slots" 
              icon="slots"
              games={slots.slice(0, 15)}
              type="slots"
              onPlayGame={handlePlayGame}
            />
          )}
          
          {/* All Games Section with Pagination */}
          <AllGamesSection 
            games={filteredGames}
            onPlayGame={handlePlayGame}
          />
        </div>
      </main>
    </div>
  );
} 