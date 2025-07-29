'use client';

import { Home, Sparkles, Grid3X3, Trophy, Gamepad2, Star, RotateCcw } from 'lucide-react';

interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const tabs: Tab[] = [
  { id: 'lobby', label: 'Lobby', icon: <Home className="w-4 h-4" /> },
  { id: 'stake-originals', label: 'Stake Originals', icon: <Sparkles className="w-4 h-4" /> },
  { id: 'slots', label: 'Slots', icon: <Grid3X3 className="w-4 h-4" /> },
  { id: 'live-casino', label: 'Live Casino', icon: <Trophy className="w-4 h-4" /> },
  { id: 'game-shows', label: 'Game Shows', icon: <Gamepad2 className="w-4 h-4" /> },
  { id: 'stake-exclusives', label: 'Stake Exclusives', icon: <Star className="w-4 h-4" /> },
  { id: 'new-releases', label: 'New Releases', icon: <RotateCcw className="w-4 h-4" /> },
];

interface NavigationTabsProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export default function NavigationTabs({ activeTab, onTabChange }: NavigationTabsProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
            activeTab === tab.id
              ? 'bg-[#3b82f6] text-white'
              : 'bg-[#2f3241] text-gray-400 hover:bg-[#3f4251] hover:text-white'
          }`}
        >
          {tab.icon}
          <span className="text-sm font-medium">{tab.label}</span>
        </button>
      ))}
    </div>
  );
} 