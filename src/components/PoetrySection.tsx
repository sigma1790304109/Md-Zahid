import React, { useState } from 'react';
import { Copy, Check, MessageCircle, Feather } from 'lucide-react';
import { POETRY_COLLECTION } from '../data/initialData.ts';

export const PoetrySection: React.FC = () => {
  const [selectedCat, setSelectedCat] = useState<string>('সকল');
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const categories = ['সকল', 'কষ্ট', 'স্মৃতি', 'নিরাময়', 'অভিমান'];

  const filtered = selectedCat === 'সকল'
    ? POETRY_COLLECTION
    : POETRY_COLLECTION.filter(p => p.category === selectedCat);

  const handleCopy = (id: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center justify-center gap-2">
          <span>ছ্যাঁকার শায়েরি ও সান্ত্বনার বাণী</span>
          <Feather className="w-6 h-6 text-rose-400" />
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
          শব্দ যখন সান্ত্বনা দেয়—বিচ্ছেদের বেদনা ও ঘুরে দাঁড়ানোর অনুপ্রেরণামূলক কবিতা ও উক্তি
        </p>
      </div>

      {/* Category Filter Tabs (Interactive Functional Buttons) */}
      <div className="flex items-center justify-center gap-2 p-1.5 bg-[#211124] border border-[#3e1b46] rounded-xl max-w-md mx-auto">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              selectedCat === cat
                ? 'bg-rose-900/70 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Poetry Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((item) => {
          const fullText = `${item.title}\n${item.lines.join('\n')}\n— ${item.poet}`;
          const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(fullText)}`;

          return (
            <article
              key={item.id}
              className="p-6 rounded-2xl bg-[#211025] border border-[#441f4d] hover:border-rose-600/40 transition-all flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span className="font-bold text-white text-base">{item.title}</span>
                  <span className="text-rose-400/90 font-medium">#{item.category}</span>
                </div>

                <div className="space-y-1 text-sm text-zinc-200 leading-relaxed font-serif italic pt-1">
                  {item.lines.map((line, lIdx) => (
                    <p key={lIdx}>{line}</p>
                  ))}
                </div>

                <div className="text-xs text-zinc-400 pt-2 text-right">
                  — {item.poet}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#37193d] flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => handleCopy(item.id, fullText)}
                  className="px-3 py-1.5 rounded-xl bg-[#2b1330] hover:bg-[#381a3e] border border-[#482052] text-xs font-medium text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300">কপি হয়েছে</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-zinc-400" />
                      <span>কপি করুন</span>
                    </>
                  )}
                </button>

                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 bg-emerald-600/90 hover:bg-emerald-500 text-white rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-white" />
                  <span>WhatsApp শেয়ার</span>
                </a>
              </div>
            </article>
          );
        })}
      </div>

    </div>
  );
};
