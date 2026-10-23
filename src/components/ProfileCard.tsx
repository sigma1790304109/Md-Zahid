import React from 'react';
import { Heart, MessageCircle, Eye, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Profile } from '../types.ts';

interface ProfileCardProps {
  profile: Profile;
  isLiked: boolean;
  onToggleLike: (id: number) => void;
  onOpenDetail: (profile: Profile) => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  isLiked,
  onToggleLike,
  onOpenDetail
}) => {
  // WhatsApp icebreaker message
  const waGreeting = encodeURIComponent(
    `আসসালামু আলাইকুম/নমস্কার ${profile.name}, 'ছ্যাঁকা খাওয়া প্রেমিক' প্ল্যাটফর্মে আপনার প্রোফাইল ও গল্প দেখে মেসেজ দিলাম। আশা করি আপনি ভালো আছেন। একটু মন খুলে কথা বলা যাবে?`
  );
  const waUrl = `https://wa.me/${profile.number}?text=${waGreeting}`;

  return (
    <article className="group bg-[#241328] border border-[#431e4c] hover:border-rose-600/50 rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-xl hover:shadow-rose-950/30 flex flex-col">
      
      {/* Profile Image with Measured Contrast Scrim */}
      <div 
        onClick={() => onOpenDetail(profile)}
        className="relative w-full aspect-square bg-[#1b0d1e] overflow-hidden cursor-pointer"
      >
        <img
          src={profile.photo}
          alt={profile.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            // Elegant fallback if image fails
            (e.target as HTMLElement).style.display = 'none';
          }}
        />

        {/* Gradient Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#241328] via-black/20 to-transparent pointer-events-none" />

        {/* Top Floating Badges (Subtle) */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="text-[11px] font-mono tracking-wider text-rose-200 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10">
            আইডি: #{String(profile.id).padStart(3, '0')}
          </div>

          {profile.isVerified && (
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-300 bg-emerald-950/70 backdrop-blur-md px-2 py-0.5 rounded-md border border-emerald-700/50">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>যাচাইকৃত</span>
            </div>
          )}
        </div>

        {/* Quick View Overlay Cue */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="text-xs font-semibold text-white bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20 flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-rose-400" />
            <span>সম্পূর্ণ গল্প পড়ুন</span>
          </span>
        </div>
      </div>

      {/* Card Content Area */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        
        <div>
          {/* Header Title & Unboxed Metadata as per Zero-Pill Constitution */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 
                onClick={() => onOpenDetail(profile)}
                className="text-base sm:text-lg font-bold text-white group-hover:text-rose-300 transition-colors cursor-pointer"
              >
                {profile.name}
              </h3>
              
              {/* Unboxed Metadata with · separator */}
              <div className="flex items-center gap-1.5 text-xs text-zinc-400 mt-0.5">
                <span>{profile.age} বছর</span>
                <span aria-hidden="true">·</span>
                <span>{profile.gender}</span>
                <span aria-hidden="true">·</span>
                <span>{profile.district}</span>
              </div>
            </div>

            {/* Empathy Heart Button */}
            <button
              type="button"
              onClick={() => onToggleLike(profile.id)}
              className={`p-2 rounded-xl transition-all flex items-center gap-1.5 text-xs font-semibold shrink-0 ${
                isLiked
                  ? 'bg-rose-950/70 text-rose-400 border border-rose-700/60'
                  : 'bg-[#2e1633] text-zinc-400 hover:text-rose-400 border border-[#4a2253]'
              }`}
              title="সহানুভূতি জানান"
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500 scale-110' : ''} transition-transform`} />
              <span className="tabular-nums">{profile.likes}</span>
            </button>
          </div>

          {/* Emotional Status (Clean text indicator) */}
          <div className="mt-2 text-xs text-rose-300/90 font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
            <span>অবস্থা: {profile.mood}</span>
          </div>

          {/* Heartbreak Story Excerpt */}
          <p 
            onClick={() => onOpenDetail(profile)}
            className="mt-2.5 text-xs sm:text-sm text-zinc-300 line-clamp-2 leading-relaxed cursor-pointer hover:text-zinc-100 transition-colors"
          >
            "{profile.story}"
          </p>
        </div>

        {/* Action Bar */}
        <div className="pt-2 border-t border-[#3b1a43] flex items-center gap-2">
          {/* Direct WhatsApp button */}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm active:scale-95"
          >
            <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
            <span>WhatsApp-এ কথা বলুন</span>
          </a>

          {/* Details Trigger */}
          <button
            type="button"
            onClick={() => onOpenDetail(profile)}
            className="p-2 bg-[#2d1532] hover:bg-[#3b1b42] text-zinc-300 hover:text-white rounded-xl border border-[#4c2155] transition-colors"
            title="বিস্তারিত দেখুন"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

      </div>

    </article>
  );
};
