import React from 'react';
import { Volume2, VolumeX, User, LogIn, HeartCrack, Sparkles } from 'lucide-react';
import { UserAccount } from '../types.ts';

interface NavbarProps {
  activeTab: 'gallery' | 'confessions' | 'poetry' | 'admin';
  setActiveTab: (tab: 'gallery' | 'confessions' | 'poetry' | 'admin') => void;
  currentUser: UserAccount | null;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
  isAudioPlaying: boolean;
  onToggleAudio: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenAuth,
  onOpenProfile,
  isAudioPlaying,
  onToggleAudio
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#160c18]/95 backdrop-blur-md border-b border-[#3b1d3f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 md:gap-8">
        
        {/* Zone 1: Single Brand Wordmark */}
        <button
          onClick={() => setActiveTab('gallery')}
          className="flex items-center gap-2.5 text-left group whitespace-nowrap shrink-0 transition-opacity hover:opacity-90"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-rose-950/40">
            <HeartCrack className="w-5 h-5 text-rose-100 group-hover:scale-110 transition-transform" />
          </div>
          <span className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
            ছ্যাঁকা খাওয়া প্রেমিক <span className="text-rose-400">💔</span>
          </span>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          <button
            onClick={() => setActiveTab('gallery')}
            className={`whitespace-nowrap transition-colors py-1 relative ${
              activeTab === 'gallery'
                ? 'text-rose-400 font-semibold'
                : 'text-zinc-300 hover:text-white'
            }`}
          >
            প্রোফাইল গ্যালারি
            {activeTab === 'gallery' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-500 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('confessions')}
            className={`whitespace-nowrap transition-colors py-1 relative ${
              activeTab === 'confessions'
                ? 'text-rose-400 font-semibold'
                : 'text-zinc-300 hover:text-white'
            }`}
          >
            মনের কথা দেওয়াল
            {activeTab === 'confessions' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-500 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('poetry')}
            className={`whitespace-nowrap transition-colors py-1 relative ${
              activeTab === 'poetry'
                ? 'text-rose-400 font-semibold'
                : 'text-zinc-300 hover:text-white'
            }`}
          >
            ছ্যাঁকার শায়েরি ও কষ্ট
            {activeTab === 'poetry' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-500 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            className={`whitespace-nowrap transition-colors py-1 relative ${
              activeTab === 'admin'
                ? 'text-rose-400 font-semibold'
                : 'text-zinc-300 hover:text-white'
            }`}
          >
            অ্যাডমিন প্যানেল
            {activeTab === 'admin' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-500 rounded-full" />
            )}
          </button>
        </nav>

        {/* Zone 3: Ambient Audio & User Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Ambient Rain Sound Toggle */}
          <button
            onClick={onToggleAudio}
            title={isAudioPlaying ? 'বৃষ্টির সুর বন্ধ করুন' : 'বৃষ্টির শান্ত সুর শুনুন'}
            className={`h-9 px-3 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors border ${
              isAudioPlaying 
                ? 'bg-rose-950/60 border-rose-600/60 text-rose-300 animate-pulse' 
                : 'bg-[#251528] border-[#44234a] text-zinc-300 hover:text-white hover:bg-[#321c36]'
            }`}
          >
            {isAudioPlaying ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden sm:inline">বৃষ্টির সুর চলছে</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-zinc-400" />
                <span className="hidden sm:inline">বৃষ্টির সাউন্ড</span>
              </>
            )}
          </button>

          {/* User Account / Profile Button */}
          {currentUser ? (
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2 pl-1.5 pr-3 py-1 bg-[#28152c] hover:bg-[#361c3b] border border-[#502656] rounded-lg transition-colors text-xs font-medium text-white max-w-[170px]"
            >
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 rounded-full object-cover border border-rose-400/50 shrink-0"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-rose-600/40 text-rose-200 border border-rose-500/30 flex items-center justify-center font-bold text-xs shrink-0">
                  {currentUser.name.slice(0, 1) || 'হৃ'}
                </div>
              )}
              <span className="truncate">{currentUser.name}</span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="h-9 px-3.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>লগইন / যুক্ত হোন</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Tab Strip (Ergonomic Thumb Navigation on narrow screens) */}
      <div className="md:hidden flex items-center justify-around border-t border-[#311835] bg-[#1a0e1c] px-2 py-1.5 text-xs font-medium">
        <button
          onClick={() => setActiveTab('gallery')}
          className={`px-2.5 py-1.5 rounded-md ${
            activeTab === 'gallery' ? 'bg-rose-900/40 text-rose-300 font-semibold' : 'text-zinc-400'
          }`}
        >
          গ্যালারি
        </button>
        <button
          onClick={() => setActiveTab('confessions')}
          className={`px-2.5 py-1.5 rounded-md ${
            activeTab === 'confessions' ? 'bg-rose-900/40 text-rose-300 font-semibold' : 'text-zinc-400'
          }`}
        >
          মনের কথা
        </button>
        <button
          onClick={() => setActiveTab('poetry')}
          className={`px-2.5 py-1.5 rounded-md ${
            activeTab === 'poetry' ? 'bg-rose-900/40 text-rose-300 font-semibold' : 'text-zinc-400'
          }`}
        >
          শায়েরি
        </button>
        <button
          onClick={() => setActiveTab('admin')}
          className={`px-2.5 py-1.5 rounded-md ${
            activeTab === 'admin' ? 'bg-rose-900/40 text-rose-300 font-semibold' : 'text-zinc-400'
          }`}
        >
          অ্যাডমিন
        </button>
      </div>
    </header>
  );
};
