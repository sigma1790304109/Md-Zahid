import React, { useState } from 'react';
import { Send, HeartHandshake, HeartCrack, Flame, Sparkles, MessageSquareHeart } from 'lucide-react';
import { Confession, UserAccount } from '../types.ts';
import { storage } from '../storage.ts';

interface ConfessionWallProps {
  confessions: Confession[];
  onAddConfession: (newConfession: Confession) => void;
  currentUser: UserAccount | null;
}

export const ConfessionWall: React.FC<ConfessionWallProps> = ({
  confessions,
  onAddConfession,
  currentUser
}) => {
  const [text, setText] = useState('');
  const [author, setAuthor] = useState(currentUser ? currentUser.name : '');
  const [isAnonymous, setIsAnonymous] = useState(!currentUser);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localConfessions, setLocalConfessions] = useState<Confession[]>(confessions);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsSubmitting(true);
    const authorName = isAnonymous ? 'বেনামী হৃদয়' : (author.trim() || currentUser?.name || 'বেনামী হৃদয়');
    const created = storage.addConfession(text, authorName, currentUser?.phone);
    
    setLocalConfessions([created, ...localConfessions]);
    onAddConfession(created);
    setText('');
    setIsSubmitting(false);
  };

  const handleReact = (id: string, type: 'hugs' | 'brokenHearts' | 'strengths') => {
    const updated = storage.reactToConfession(id, type);
    if (updated) {
      setLocalConfessions(prev =>
        prev.map(c => (c.id === id ? { ...c, [type]: (c[type] || 0) + 1 } : c))
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Section Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center justify-center gap-2">
          <span>মনের কথা দেওয়াল</span>
          <span className="text-rose-400">🥀</span>
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
          বুকে চেপে রাখা অব্যক্ত কান্না, অপ্রকাশিত চিঠি কিংবা সান্ত্বনার কথা লিখে যান। কেউ আপনাকে বিচার করবে না।
        </p>
      </div>

      {/* Confession Post Box */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#231227] border border-[#441e4d] shadow-xl space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <textarea
              required
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="আজ আপনার মন কেমন আছে? তাকে নিয়ে না বলা কোনো কথা থাকলে লিখে যান..."
              className="w-full p-4 bg-[#170a19] border border-[#4b2053] focus:border-rose-500 rounded-xl text-white text-sm outline-none transition-colors resize-none leading-relaxed"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-zinc-300">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded border-[#4b2053] text-rose-600 focus:ring-0 bg-[#170a19]"
                />
                <span>বেনামী পোস্ট করুন (গোপন নাম)</span>
              </label>

              {!isAnonymous && (
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="আপনার ডাকনাম"
                  className="px-3 py-1.5 bg-[#170a19] border border-[#4b2053] rounded-lg text-xs text-white outline-none w-36"
                />
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !text.trim()}
              className="px-5 py-2.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-semibold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5 disabled:opacity-40"
            >
              <Send className="w-3.5 h-3.5" />
              <span>দেওয়ালে পোস্ট করুন</span>
            </button>
          </div>
        </form>
      </div>

      {/* Confessions Feed */}
      <div className="space-y-4">
        {localConfessions.map((conf) => (
          <article
            key={conf.id}
            className="p-5 rounded-2xl bg-[#201024] border border-[#3e1b46] hover:border-[#52245c] transition-colors space-y-3"
          >
            {/* Author and Time (Zero-Pill clean metadata) */}
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-rose-300">{conf.author}</span>
                <span aria-hidden="true">·</span>
                <span>{conf.time}</span>
              </div>
            </div>

            {/* Confession text */}
            <p className="text-sm sm:text-base text-zinc-200 leading-relaxed font-normal whitespace-pre-line">
              "{conf.text}"
            </p>

            {/* Reaction Buttons */}
            <div className="pt-2 border-t border-[#311537] flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
              {/* Hug */}
              <button
                type="button"
                onClick={() => handleReact(conf.id, 'hugs')}
                className="px-3 py-1.5 rounded-xl bg-[#28142c] hover:bg-rose-950/60 border border-[#421d49] text-zinc-300 hover:text-rose-300 transition-colors flex items-center gap-1.5"
                title="জড়িয়ে ধরে সান্ত্বনা"
              >
                <span>🤗</span>
                <span>জড়িয়ে ধরা</span>
                <span className="tabular-nums font-semibold text-rose-400">({conf.hugs})</span>
              </button>

              {/* Broken Heart */}
              <button
                type="button"
                onClick={() => handleReact(conf.id, 'brokenHearts')}
                className="px-3 py-1.5 rounded-xl bg-[#28142c] hover:bg-rose-950/60 border border-[#421d49] text-zinc-300 hover:text-rose-300 transition-colors flex items-center gap-1.5"
                title="আমিও একই কষ্টে আছি"
              >
                <span>💔</span>
                <span>একই ব্যথা</span>
                <span className="tabular-nums font-semibold text-rose-400">({conf.brokenHearts})</span>
              </button>

              {/* Stay Strong */}
              <button
                type="button"
                onClick={() => handleReact(conf.id, 'strengths')}
                className="px-3 py-1.5 rounded-xl bg-[#28142c] hover:bg-rose-950/60 border border-[#421d49] text-zinc-300 hover:text-rose-300 transition-colors flex items-center gap-1.5"
                title="ধৈর্য্য ধরুন ও শক্তিশালী থাকুন"
              >
                <span>💪</span>
                <span>শক্তি পাও</span>
                <span className="tabular-nums font-semibold text-rose-400">({conf.strengths})</span>
              </button>
            </div>
          </article>
        ))}
      </div>

    </div>
  );
};
