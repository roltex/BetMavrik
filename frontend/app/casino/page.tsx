'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import PromotionalBanners from '@/components/casino/PromotionalBanners';
import SearchBar from '@/components/ui/SearchBar';
import NavigationTabs from '@/components/casino/NavigationTabs';
import GameSection from '@/components/casino/GameSection';
import { Game, User } from '@/types';
import { apiService } from '@/services/api';

export default function CasinoPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('lobby');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gamesData, userData] = await Promise.all([
          apiService.getGames(),
          apiService.getUser()
        ]);
        setGames(gamesData);
        setUser(userData);
      } catch (error) {
        console.error('Error fetching data:', error);
        // If user fetch fails, continue without user data
        try {
          const gamesData = await apiService.getGames();
          setGames(gamesData);
        } catch (gameError) {
          console.error('Error fetching games:', gameError);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePlayGame = async (gameId: number) => {
    try {
      const gameUrl = await apiService.startGame(gameId);
      window.open(gameUrl, '_blank');
    } catch (error) {
      console.error('Error starting game:', error);
      alert('Failed to start game. Please try again.');
    }
  };

  const filteredGames = games.filter(game =>
    game.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Categorize games
  const stakeOriginals = filteredGames.filter(game => 
    game.category === 'stake_original' || game.producer === 'Stake'
  );
  const slots = filteredGames.filter(game => 
    game.category === 'slot' || game.category === 'slots'
  );
  const allGames = filteredGames;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1d29] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1d29]">
      <Header user={user} />
      
      <main className="container mx-auto px-4 py-6">
        {/* Promotional Banners */}
        <div className="mb-8">
          <PromotionalBanners games={games} onPlayGame={handlePlayGame} />
        </div>
        
        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar 
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search your game"
          />
        </div>
        
        {/* Navigation Tabs */}
        <div className="mb-8">
          <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
        
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
          
          <GameSection 
            title="Providers" 
            icon="network"
            games={allGames.slice(0, 30)}
            type="providers"
            onPlayGame={handlePlayGame}
          />
        </div>
      </main>
    </div>
  );
} 