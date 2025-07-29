import React from 'react';

// Base skeleton component
export function Skeleton({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse bg-gray-700 rounded ${className}`}
      {...props}
    />
  );
}

// Game card skeleton
export function GameCardSkeleton({ type = "slots" }: { type?: "slots" | "originals" }) {
  return (
    <div className="group cursor-pointer">
      <div className={`relative overflow-hidden rounded-lg bg-[#2f3241] ${
        type === 'originals' ? 'aspect-[3/4]' : 'aspect-[4/5]'
      }`}>
        {/* Image skeleton */}
        <Skeleton className="absolute inset-0 w-full h-full rounded-lg" />
        
        {/* Play button overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-200 flex items-center justify-center">
          <Skeleton className="w-12 h-12 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        </div>
      </div>
      
      {/* Game title */}
      <div className="mt-2 px-1">
        <Skeleton className="h-4 w-3/4 mb-1" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}

// Promotional banner skeleton
export function PromotionalBannerSkeleton() {
  return (
    <div className="relative h-48 rounded-lg overflow-hidden bg-[#2f3241]">
      {/* Background skeleton */}
      <Skeleton className="absolute inset-0 w-full h-full" />
      
      {/* Content overlay */}
      <div className="relative z-10 p-6 h-full flex flex-col justify-between">
        <div className="space-y-3">
          {/* Category */}
          <Skeleton className="h-3 w-20" />
          {/* Title */}
          <Skeleton className="h-6 w-40" />
          {/* Description */}
          <Skeleton className="h-4 w-32" />
        </div>
        
        {/* Play button */}
        <Skeleton className="h-8 w-20 rounded" />
      </div>
    </div>
  );
}

// Game section header skeleton
export function GameSectionHeaderSkeleton() {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <Skeleton className="w-6 h-6 rounded" />
        <Skeleton className="h-6 w-32" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="w-8 h-8 rounded-lg" />
        <Skeleton className="w-8 h-8 rounded-lg" />
      </div>
    </div>
  );
}

// Game section skeleton (horizontal slider)
export function GameSectionSkeleton({ title, count = 8 }: { title?: string; count?: number }) {
  return (
    <div className="relative px-2">
      <GameSectionHeaderSkeleton />
      
      {/* Games grid skeleton */}
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="flex-shrink-0 w-[140px] md:w-[160px]">
            <GameCardSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
}

// All games section skeleton (with pagination)
export function AllGamesSectionSkeleton() {
  return (
    <div className="relative px-2">
      {/* Header skeleton */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-lg" />
          <div>
            <Skeleton className="h-6 w-24 mb-2" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
        <Skeleton className="h-8 w-24 rounded-lg hidden md:block" />
      </div>

      {/* Games grid skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4 mb-12">
        {Array.from({ length: 32 }).map((_, index) => (
          <GameCardSkeleton key={index} />
        ))}
      </div>

      {/* Pagination skeleton */}
      <div className="flex flex-col items-center gap-6 pb-8">
        <div className="md:hidden text-center space-y-2">
          <Skeleton className="h-4 w-24 mx-auto" />
          <Skeleton className="h-3 w-32 mx-auto" />
        </div>

        <div className="flex items-center gap-2">
          <Skeleton className="w-10 h-10 rounded-lg hidden sm:block" />
          <Skeleton className="w-10 h-10 rounded-lg" />
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="w-10 h-10 rounded-lg" />
          ))}
          <Skeleton className="w-10 h-10 rounded-lg" />
          <Skeleton className="w-10 h-10 rounded-lg hidden sm:block" />
        </div>

        <Skeleton className="h-3 w-64 hidden md:block" />
      </div>
    </div>
  );
}

// Header skeleton
export function HeaderSkeleton() {
  return (
    <header className="bg-[#1a1c2e] border-b border-[#2f3241]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo skeleton */}
          <Skeleton className="h-8 w-32" />
          
          {/* User info skeleton */}
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
      </div>
    </header>
  );
}

// Casino page loading skeleton
export function CasinoPageSkeleton() {
  return (
    <div className="min-h-screen bg-[#0f1419]">
      <HeaderSkeleton />
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Search bar skeleton */}
        <div className="mb-8">
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>

        {/* Navigation tabs skeleton */}
        <div className="mb-8">
          <div className="flex gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-10 w-20 rounded-lg" />
            ))}
          </div>
        </div>

        {/* Promotional banners skeleton */}
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 3 }).map((_, index) => (
              <PromotionalBannerSkeleton key={index} />
            ))}
          </div>
        </div>

        {/* Game sections skeleton */}
        <div className="space-y-12">
          <GameSectionSkeleton title="Stake Originals" count={8} />
          <GameSectionSkeleton title="Slots" count={8} />
          <AllGamesSectionSkeleton />
        </div>
      </main>
    </div>
  );
} 