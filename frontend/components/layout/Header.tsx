'use client';

import { useEffect, useState } from 'react';
import { User } from '@/types';

interface HeaderProps {
  user: User | null;
}

export default function Header({ user }: HeaderProps) {
  const [balance, setBalance] = useState(user?.balance || 0);

  useEffect(() => {
    if (user) {
      setBalance(user.balance);
    }
  }, [user]);

  useEffect(() => {
    const handleBalanceUpdate = (event: CustomEvent) => {
      if (event.detail.userId === user?.id) {
        setBalance(event.detail.balance);
      }
    };

    window.addEventListener('balance_update', handleBalanceUpdate as EventListener);
    return () => {
      window.removeEventListener('balance_update', handleBalanceUpdate as EventListener);
    };
  }, [user]);

  return (
    <header className="sticky top-0 z-50 bg-[#1a2c38] shadow-xl backdrop-blur-sm">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-white">Stake</h1>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm text-gray-400">Balance</div>
                  <div className="text-white font-semibold">
                    ${balance.toFixed(2)} {user.currency}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-[#0f212e] rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 text-white hover:text-gray-300 transition-colors">
                  Login
                </button>
                <button className="px-4 py-2 bg-[#3b82f6] text-white rounded hover:bg-[#2563eb] transition-colors">
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 