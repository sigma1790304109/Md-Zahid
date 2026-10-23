import React, { useState, useRef } from 'react';
import { Shield, KeyRound, UserPlus, Trash2, CheckCircle2, Lock, LogOut, RefreshCw, Upload, Eye, ExternalLink } from 'lucide-react';
import { Profile, MoodType, GenderType } from '../types.ts';
import { BANGLADESH_DISTRICTS } from '../data/initialData.ts';
import { storage, DEFAULT_ADMIN_PASSWORD } from '../storage.ts';

interface AdminPanelProps {
  profiles: Profile[];
  onAddProfile: (profile: Profile) => void;
  onDeleteProfile: (id: number) => void;
  onUpdateProfile: (id: number, updates: Partial<Profile>) => void;
  onResetData: () => void;
}

const MOODS: MoodType[] = [
  'কান্নায় রাত কাটে',
  'স্মৃতিতে বিভোর',
  'নতুন সূচনা',
  'একাকী পথচলা',
  'মায়ায় বাঁধা',
  'বিশ্বাসঘাতকতার ক্ষত'
];

export const AdminPanel: React.FC<AdminPanelProps> = ({
  profiles,
  onAddProfile,
  onDeleteProfile,
  onUpdateProfile,
  onResetData
}) => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminPassInput, setAdminPassInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Add profile form state
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [age, setAge] = useState<number>(24);
  const [gender, setGender] = useState<GenderType>('ছেলে');
  const [district, setDistrict] = useState('ঢাকা');
  const [mood, setMood] = useState<MoodType>('স্মৃতিতে বিভোর');
  const [story, setStory] = useState('');
  const [quote, setQuote] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string>('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPass = storage.getAdminPassword();
    if (adminPassInput === storedPass || adminPassInput === DEFAULT_ADMIN_PASSWORD) {
      setIsAdminLoggedIn(true);
      setErrorMsg('');
      setSuccessMsg('অ্যাডমিন হিসেবে সফলভাবে প্রবেশ করেছেন!');
    } else {
      setErrorMsg('অ্যাডমিন পাসওয়ার্ড সঠিক নয়। ডিফল্ট পাসওয়ার্ড: admin123');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      alert('অনুগ্রহ করে JPG, PNG বা WebP ছবি ব্যবহার করুন।');
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      alert('ছবির সাইজ সর্বোচ্চ ৩ MB হতে পারবে।');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPhotoPreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !number.trim() || !photoPreview) {
      alert('দয়া করে নাম, WhatsApp নম্বর এবং ছবি নির্বাচন করুন।');
      return;
    }

    const cleanNum = number.replace(/\D/g, '');
    const newProfile = storage.addProfile({
      name: name.trim(),
      age: Number(age) || 24,
      gender,
      district,
      number: cleanNum,
      photo: photoPreview,
      story: story.trim() || 'ভাঙা হৃদয়ের অনুভূতিগুলো নীরবে বয়ে নিয়ে বেড়াচ্ছি...',
      mood,
      quote: quote.trim() || undefined
    });

    onAddProfile(newProfile);
    setSuccessMsg(`"${name}"-এর প্রোফাইল সফলভাবে তৈরি হয়েছে!`);

    // Reset Form
    setName('');
    setNumber('');
    setStory('');
    setQuote('');
    setPhotoPreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';

    setTimeout(() => setSuccessMsg(''), 4000);
  };

  if (!isAdminLoggedIn) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="p-6 sm:p-8 rounded-2xl bg-[#211124] border border-[#482050] shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-rose-950 border border-rose-800/60 flex items-center justify-center text-rose-300">
              <Lock className="w-6 h-6 text-rose-400" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">🔐 Admin Login</h2>
            <p className="text-xs text-zinc-400">
              প্ল্যাটফর্মের প্রোফাইল ও ডেটা নিয়ন্ত্রণের জন্য প্রবেশ করুন
            </p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-200 text-xs">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Admin পাসওয়ার্ড
              </label>
              <input
                type="password"
                required
                value={adminPassInput}
                onChange={(e) => setAdminPassInput(e.target.value)}
                placeholder="ডিফল্ট: admin123"
                className="w-full px-3.5 py-2.5 bg-[#170a19] border border-[#482050] focus:border-rose-500 rounded-xl text-white text-sm outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>Admin প্রবেশ</span>
            </button>
          </form>

          {/* Quick Helper for Demo testing */}
          <div className="p-3 rounded-xl bg-[#28132d] border border-[#481e50] text-center space-y-1">
            <p className="text-xs text-zinc-400">
              ডেমো অ্যাডমিন পাসওয়ার্ড: <code className="text-rose-300 font-mono font-bold">admin123</code>
            </p>
            <button
              type="button"
              onClick={() => setAdminPassInput('admin123')}
              className="text-[11px] text-rose-400 hover:underline"
            >
              এক ক্লিকে পাসওয়ার্ড বসান
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner with Logout & Reset */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-[#251229] border border-[#481f51]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-950 border border-rose-800/60 flex items-center justify-center text-rose-300">
            <Shield className="w-5 h-5 text-rose-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">⚙️ Admin Control Panel</h2>
            <p className="text-xs text-zinc-400">প্রোফাইল পরিচালনা ও নতুন কার্ড সংযোজন</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onResetData}
            className="px-3 py-1.5 bg-[#1b0d1e] hover:bg-rose-950/40 text-zinc-400 hover:text-rose-300 border border-[#3f1c46] rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5"
            title="ডেমো ডেটা রিসেট করুন"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>ডেটা রিসেট</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAdminLoggedIn(false)}
            className="px-3.5 py-1.5 bg-rose-900/40 hover:bg-rose-900/70 text-rose-200 border border-rose-700/50 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Admin Logout</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-800 text-emerald-200 text-xs sm:text-sm font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Grid: Left Create Profile Form, Right Existing Profiles List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ADD PROFILE FORM (5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#211024] border border-[#431e4c] space-y-5">
          <div className="flex items-center gap-2 border-b border-[#3b1942] pb-3">
            <UserPlus className="w-5 h-5 text-rose-400" />
            <h3 className="text-base font-bold text-white">নতুন প্রোফাইল যোগ করুন</h3>
          </div>

          <form onSubmit={handleCreateProfile} className="space-y-4">
            
            {/* Image Upload Area */}
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                প্রোফাইল ছবি <span className="text-rose-400">*</span>
              </label>
              
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl overflow-hidden border border-[#52245b] bg-[#170a19] flex items-center justify-center shrink-0">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Upload className="w-6 h-6 text-zinc-500" />
                  )}
                </div>

                <div className="flex-1 space-y-1.5">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-2 bg-[#2d1532] hover:bg-[#3b1c42] border border-[#4d2155] rounded-xl text-xs font-semibold text-rose-200 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>ছবি নির্বাচন করুন</span>
                  </button>
                  <p className="text-[11px] text-zinc-400">
                    JPG, PNG বা WebP (সর্বোচ্চ ৩ MB)
                  </p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                ছেলে/মেয়ের নাম <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="যেমন: তানভীর আহমেদ"
                className="w-full px-3.5 py-2 bg-[#170a19] border border-[#482050] focus:border-rose-500 rounded-xl text-white text-xs sm:text-sm outline-none"
              />
            </div>

            {/* WhatsApp Number */}
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                WhatsApp নম্বর <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="যেমন: 8801712345678 বা 01712345678"
                className="w-full px-3.5 py-2 bg-[#170a19] border border-[#482050] focus:border-rose-500 rounded-xl text-white text-xs sm:text-sm outline-none"
              />
            </div>

            {/* Age & Gender */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">বয়স</label>
                <input
                  type="number"
                  min={18}
                  max={60}
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full px-3.5 py-2 bg-[#170a19] border border-[#482050] focus:border-rose-500 rounded-xl text-white text-xs sm:text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">লিঙ্গ</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as GenderType)}
                  className="w-full px-3 py-2 bg-[#170a19] border border-[#482050] focus:border-rose-500 rounded-xl text-white text-xs sm:text-sm outline-none"
                >
                  <option value="ছেলে">ছেলে</option>
                  <option value="মেয়ে">মেয়ে</option>
                  <option value="অন্যান্য">অন্যান্য</option>
                </select>
              </div>
            </div>

            {/* District & Mood */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">জেলা</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-2 bg-[#170a19] border border-[#482050] focus:border-rose-500 rounded-xl text-white text-xs sm:text-sm outline-none"
                >
                  {BANGLADESH_DISTRICTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">অবস্থা (Mood)</label>
                <select
                  value={mood}
                  onChange={(e) => setMood(e.target.value as MoodType)}
                  className="w-full px-3 py-2 bg-[#170a19] border border-[#482050] focus:border-rose-500 rounded-xl text-white text-xs sm:text-sm outline-none"
                >
                  {MOODS.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Heartbreak Story */}
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                বিচ্ছেদের গল্প / মনের কথা
              </label>
              <textarea
                rows={3}
                value={story}
                onChange={(e) => setStory(e.target.value)}
                placeholder="তার সাথে কী ঘটেছিল সংক্ষেপে লিখুন..."
                className="w-full px-3.5 py-2 bg-[#170a19] border border-[#482050] focus:border-rose-500 rounded-xl text-white text-xs sm:text-sm outline-none resize-none"
              />
            </div>

            {/* Quote */}
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                মনের উক্তি (ঐচ্ছিক)
              </label>
              <input
                type="text"
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                placeholder="যেমন: বৃষ্টিভেজা বিকেলে আজও তাকে মনে পড়ে..."
                className="w-full px-3.5 py-2 bg-[#170a19] border border-[#482050] focus:border-rose-500 rounded-xl text-white text-xs sm:text-sm outline-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-95"
            >
              ছবি ও প্রোফাইল যোগ করুন
            </button>
          </form>
        </div>

        {/* EXISTING PROFILES LIST (7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#211024] border border-[#431e4c] space-y-4">
          <div className="flex items-center justify-between border-b border-[#3b1942] pb-3">
            <h3 className="text-base font-bold text-white">
              বিদ্যমান প্রোফাইলসমূহ ({profiles.length})
            </h3>
            <span className="text-xs text-zinc-400">সরাসরি মুছুন বা যাচাই করুন</span>
          </div>

          <div className="space-y-3 max-h-[620px] overflow-y-auto pr-1">
            {profiles.length === 0 ? (
              <p className="text-xs text-zinc-400 text-center py-8">
                এখনো কোনো প্রোফাইল নেই।
              </p>
            ) : (
              profiles.map((p) => (
                <div
                  key={p.id}
                  className="p-3.5 rounded-xl bg-[#28132c] border border-[#451f4e] flex items-center justify-between gap-3 hover:border-zinc-500 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={p.photo}
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-xl object-cover border border-[#52255b] shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm truncate">{p.name}</span>
                        <span className="text-[11px] font-mono text-rose-300">#{p.id}</span>
                        {p.isVerified && (
                          <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/60 px-1.5 py-0.5 rounded">
                            Verified
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-zinc-400 flex items-center gap-1.5 mt-0.5">
                        <span>WA: {p.number}</span>
                        <span>·</span>
                        <span>{p.district}</span>
                        <span>·</span>
                        <span className="text-rose-400/90">{p.mood}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Toggle verify */}
                    <button
                      type="button"
                      onClick={() => onUpdateProfile(p.id, { isVerified: !p.isVerified })}
                      className={`p-1.5 rounded-lg border text-xs transition-colors ${
                        p.isVerified 
                          ? 'border-emerald-600 bg-emerald-950/40 text-emerald-300' 
                          : 'border-zinc-700 bg-zinc-800 text-zinc-400'
                      }`}
                      title="যাচাইকরণ টগল করুন"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>

                    {/* Test WhatsApp Link */}
                    <a
                      href={`https://wa.me/${p.number}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-300 hover:bg-emerald-900/60 transition-colors"
                      title="WhatsApp টেস্ট"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`আপনি কি সত্যিই "${p.name}"-এর প্রোফাইল মুছে ফেলতে চান?`)) {
                          onDeleteProfile(p.id);
                        }
                      }}
                      className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/70 border border-rose-800 text-rose-300 transition-colors"
                      title="প্রোফাইল মুছুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
