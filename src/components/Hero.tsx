import React from 'react';
import { HeartCrack, MessageSquareHeart, Users, Sparkles, Send } from 'lucide-react';

interface HeroProps {
  totalProfiles: number;
  totalConfessions: number;
  totalLikes: number;
  onExplore: () => void;
  onOpenConfess: () => void;
  onOpenProfileOrAuth: () => void;
  isLoggedIn: boolean;
}

export const Hero: React.FC<HeroProps> = ({
  totalProfiles,
  totalConfessions,
  totalLikes,
  onExplore,
  onOpenConfess,
  onOpenProfileOrAuth,
  isLoggedIn
}) => {
  return (
    <section className="relative overflow-hidden border-b border-[#3b1942] bg-gradient-to-b from-[#221025] via-[#1a0c1c] to-[#160c18] pt-10 pb-12 sm:pt-14 sm:pb-16 px-4 sm:px-6 lg:px-8">
      {/* Subtle background glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-rose-950/20 blur-3xl pointer-events-none rounded-full" />
      
      <div className="relative max-w-4xl mx-auto text-center space-y-5">
        
        {/* Poetic Kicker without pill badge slop */}
        <div className="text-xs sm:text-sm font-semibold tracking-wider text-rose-400 uppercase">
          ভাঙা হৃদয়ের শহরে স্বাগতম · নিঃশব্দ ব্যথার সঙ্গী
        </div>

        {/* Main Title with balanced typography */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight sm:leading-snug text-balance">
          যেখানে প্রতিটি নীরব কান্নারও <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-400 to-rose-300">একটি গল্প আছে</span>
        </h1>

        {/* Empathetic subtitle */}
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-zinc-300 leading-relaxed font-normal">
          ছ্যাঁকা খাওয়া প্রেমিক-প্রেমিকাদের অনুভূতি প্রকাশের নিরাপদ স্থান। ছবি, মনের অনুভূতি ও হোয়াটসঅ্যাপের মাধ্যমে নিজের বেদনা ভাগ করে নিন অথবা সহানুভূতির হাত বাড়িয়ে দিন।
        </p>

        {/* CTAs */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={onExplore}
            className="px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-lg shadow-rose-950/50 transition-all active:scale-95 flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            <span>প্রোফাইল গ্যালারি দেখুন</span>
          </button>

          <button
            onClick={onOpenConfess}
            className="px-5 sm:px-6 py-2.5 sm:py-3 bg-[#2b1430] hover:bg-[#381a3e] border border-[#502457] text-zinc-200 font-semibold text-xs sm:text-sm rounded-xl transition-all active:scale-95 flex items-center gap-2"
          >
            <MessageSquareHeart className="w-4 h-4 text-rose-400" />
            <span>বেনামী মনের কথা লিখুন</span>
          </button>

          <button
            onClick={onOpenProfileOrAuth}
            className="px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-rose-300 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-rose-400" />
            <span>{isLoggedIn ? 'আমার বায়ো ও ছবি আপডেট' : 'নিজের প্রোফাইল খুলুন'}</span>
          </button>
        </div>

        {/* Metrics Row adhering to Tabular Figures and Zero Pill rules */}
        <div className="pt-6 sm:pt-8 grid grid-cols-3 gap-2 sm:gap-6 border-t border-[#3b1942]/70 max-w-2xl mx-auto text-center">
          <div className="p-3">
            <div className="text-xl sm:text-3xl font-bold text-white tabular-nums">
              {totalProfiles}
            </div>
            <div className="text-xs text-zinc-400 mt-1">
              হৃদয়ভাঙা প্রোফাইল
            </div>
          </div>

          <div className="p-3">
            <div className="text-xl sm:text-3xl font-bold text-rose-400 tabular-nums">
              {totalConfessions}
            </div>
            <div className="text-xs text-zinc-400 mt-1">
              বেনামী মনের কথা
            </div>
          </div>

          <div className="p-3">
            <div className="text-xl sm:text-3xl font-bold text-pink-400 tabular-nums">
              {totalLikes}+
            </div>
            <div className="text-xs text-zinc-400 mt-1">
              সহানুভূতির ছোঁয়া
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
