import React from 'react';
import { X, Heart, MessageCircle, MapPin, Calendar, ShieldCheck, Quote, Copy, Check } from 'lucide-react';
import { Profile } from '../types.ts';

interface ProfileDetailModalProps {
  profile: Profile | null;
  isOpen: boolean;
  onClose: () => void;
  isLiked: boolean;
  onToggleLike: (id: number) => void;
}

export const ProfileDetailModal: React.FC<ProfileDetailModalProps> = ({
  profile,
  isOpen,
  onClose,
  isLiked,
  onToggleLike
}) => {
  if (!isOpen || !profile) return null;

  const [copied, setCopied] = React.useState(false);

  const waGreeting = encodeURIComponent(
    `আসসালামু আলাইকুম/নমস্কার ${profile.name}, 'ছ্যাঁকা খাওয়া প্রেমিক' প্ল্যাটফর্মে আপনার প্রোফাইল ও গল্প দেখে মেসেজ দিলাম। আশা করি আপনি ভালো আছেন। একটু মন খুলে কথা বলা যাবে?`
  );
  const waUrl = `https://wa.me/${profile.number}?text=${waGreeting}`;

  const copyNumber = () => {
    navigator.clipboard.writeText(profile.number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#211124] border border-[#482050] rounded-2xl shadow-2xl overflow-hidden my-auto">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#3b1942] bg-[#27132c]">
          <div className="flex items-center gap-2 text-xs font-mono text-rose-300">
            <span>প্রোফাইল আইডি: #{String(profile.id).padStart(3, '0')}</span>
            {profile.isVerified && (
              <span className="flex items-center gap-1 text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5" />
                যাচাইকৃত প্রোফাইল
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Top Profile Summary */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="w-32 h-32 rounded-2xl overflow-hidden border-2 border-rose-500/40 bg-zinc-900 shrink-0 shadow-lg shadow-rose-950/30">
              <img
                src={profile.photo}
                alt={profile.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 text-center sm:text-left space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                {profile.name}
              </h2>

              {/* Zero-Pill Unboxed Metadata */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-zinc-400">
                <span>{profile.age} বছর</span>
                <span aria-hidden="true">·</span>
                <span>{profile.gender}</span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-zinc-400" />
                  {profile.district}
                </span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-zinc-400" />
                  {profile.createdAt}
                </span>
              </div>

              {/* Emotional Mood */}
              <div className="pt-1 text-xs font-medium text-rose-300 flex items-center justify-center sm:justify-start gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>বর্তমান মানসিক অবস্থা: {profile.mood}</span>
              </div>

              {/* Empathy count button */}
              <div className="pt-2 flex items-center justify-center sm:justify-start gap-3">
                <button
                  type="button"
                  onClick={() => onToggleLike(profile.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isLiked
                      ? 'bg-rose-950/80 text-rose-300 border border-rose-600'
                      : 'bg-[#2f1634] text-zinc-300 hover:text-white border border-[#4d2256]'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                  <span>{isLiked ? 'সহানুভূতি জানিয়েছেন' : 'সহানুভূতি জানান'} ({profile.likes})</span>
                </button>

                <button
                  type="button"
                  onClick={copyNumber}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium text-zinc-400 hover:text-zinc-200 bg-[#26122a] border border-[#431d4b] transition-colors flex items-center gap-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'নম্বর কপি হয়েছে' : 'নম্বর কপি'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Heartbreak Story Box */}
          <div className="p-5 rounded-2xl bg-[#29142f] border border-[#471f50] space-y-2">
            <h3 className="text-sm font-semibold text-rose-300 flex items-center gap-2">
              <span>💔 বিচ্ছেদের গল্প ও মনের অনুভূতি</span>
            </h3>
            <p className="text-sm text-zinc-200 leading-relaxed font-normal whitespace-pre-line">
              {profile.story}
            </p>
          </div>

          {/* Quote if present */}
          {profile.quote && (
            <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/40 flex items-start gap-3 text-rose-200 text-xs sm:text-sm italic">
              <Quote className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <span>"{profile.quote}"</span>
            </div>
          )}

          {/* WhatsApp Direct Connect Action Strip */}
          <div className="p-4 rounded-2xl bg-[#1d2d24] border border-[#2b593f] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-center sm:text-left space-y-0.5">
              <div className="text-xs font-bold text-emerald-300">
                সরাসরি WhatsApp-এ যুক্ত হন
              </div>
              <div className="text-[11px] text-zinc-300">
                এক ক্লিকে ভদ্র ও সহমর্মিতাপূর্ণ মেসেজ দিয়ে কথা বলা শুরু করুন
              </div>
            </div>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 shrink-0 active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
              <span>WhatsApp চ্যাট চালু করুন</span>
            </a>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-[#3b1942] bg-[#27132c] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-800/60 hover:bg-zinc-800 rounded-xl transition-colors"
          >
            বন্ধ করুন
          </button>
        </div>

      </div>
    </div>
  );
};
