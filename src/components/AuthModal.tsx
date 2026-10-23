import React, { useState } from 'react';
import { X, LogIn, UserPlus, Phone, Lock, User, FileText, Check, Sparkles } from 'lucide-react';
import { UserAccount } from '../types.ts';
import { storage } from '../storage.ts';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserAccount) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanPhone = phone.trim();
    if (!cleanPhone) {
      setErrorMsg('অনুগ্রহ করে মোবাইল নম্বর প্রদান করুন।');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।');
      return;
    }

    setLoading(true);

    if (mode === 'register') {
      const result = storage.registerUser(cleanPhone, password, {
        name: name.trim() || 'হৃদয়ভাঙা প্রেমিক',
        bio: bio.trim() || 'ভাঙা হৃদয়ের শহরে নতুন এক সহযাত্রী...'
      });

      setLoading(false);
      if (result.success && result.user) {
        setSuccessMsg(result.message);
        setTimeout(() => {
          onSuccess(result.user!);
          onClose();
        }, 600);
      } else {
        setErrorMsg(result.message);
      }
    } else {
      const result = storage.loginUser(cleanPhone, password);
      setLoading(false);
      if (result.success && result.user) {
        setSuccessMsg(result.message);
        setTimeout(() => {
          onSuccess(result.user!);
          onClose();
        }, 500);
      } else {
        setErrorMsg(result.message);
      }
    }
  };

  const handleUseDemoAccount = () => {
    setPhone('01711223344');
    setPassword('12345678');
    setMode('login');
    setErrorMsg('');
    setSuccessMsg('ডেমো ক্রেডেনশিয়াল বসানো হয়েছে! "লগইন করুন" বাটনে চাপ দিন।');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-md bg-[#211124] border border-[#482050] rounded-2xl shadow-2xl overflow-hidden my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#3b1942] bg-[#27132c]">
          <div className="flex items-center gap-2">
            <span className="text-xl">💔</span>
            <h2 className="text-base sm:text-lg font-bold text-white">
              {mode === 'login' ? 'অ্যাপে প্রবেশ (লগইন)' : 'নতুন অ্যাকাউন্ট তৈরি'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-2 p-1.5 bg-[#170a18] border-b border-[#3b1942] text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`py-2 rounded-xl transition-all ${
              mode === 'login'
                ? 'bg-rose-900/60 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            লগইন
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`py-2 rounded-xl transition-all ${
              mode === 'register'
                ? 'bg-rose-900/60 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            নতুন রেজিস্টার
          </button>
        </div>

        {/* Content & Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-200 text-xs">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-1.5">
              <Check className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Quick Demo Login Preset Helper */}
          {mode === 'login' && (
            <div className="p-3 rounded-xl bg-[#2a1330] border border-[#4d2055] flex items-center justify-between gap-2">
              <div className="text-xs text-zinc-300">
                <span className="font-semibold text-rose-300">দ্রুত পরীক্ষার জন্য:</span> সজীব আহমেদ (ডেমো অ্যাকাউন্ট)
              </div>
              <button
                type="button"
                onClick={handleUseDemoAccount}
                className="px-2.5 py-1 text-[11px] font-semibold text-white bg-rose-700 hover:bg-rose-600 rounded-lg shrink-0 transition-colors"
              >
                এক-ক্লিকে পূরণ
              </button>
            </div>
          )}

          {/* If register: ask for display name and short bio */}
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  আপনার নাম (Display Name) <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="যেমন: তানভীর আহমেদ"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-[#170a19] border border-[#482050] focus:border-rose-500 rounded-xl text-white text-sm outline-none transition-colors"
                  />
                  <User className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  সংক্ষিপ্ত বায়ো (মনের এক লাইন অনুভূতি)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="যেমন: নীরব অশ্রুই আমার রাতের সঙ্গী..."
                    className="w-full pl-9 pr-3.5 py-2.5 bg-[#170a19] border border-[#482050] focus:border-rose-500 rounded-xl text-white text-sm outline-none transition-colors"
                  />
                  <FileText className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                </div>
              </div>
            </>
          )}

          {/* Phone */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              মোবাইল নম্বর <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="যেমন: 01712345678"
                className="w-full pl-9 pr-3.5 py-2.5 bg-[#170a19] border border-[#482050] focus:border-rose-500 rounded-xl text-white text-sm outline-none transition-colors"
              />
              <Phone className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর) <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3.5 py-2.5 bg-[#170a19] border border-[#482050] focus:border-rose-500 rounded-xl text-white text-sm outline-none transition-colors"
              />
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-semibold text-sm rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            {mode === 'login' ? (
              <>
                <LogIn className="w-4 h-4" />
                <span>{loading ? 'প্রবেশ করা হচ্ছে...' : 'লগইন করুন'}</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>{loading ? 'অ্যাকাউন্ট তৈরি হচ্ছে...' : 'নতুন অ্যাকাউন্ট তৈরি করুন'}</span>
              </>
            )}
          </button>
        </form>

        {/* Footer Note */}
        <div className="px-6 py-3.5 border-t border-[#3b1942] bg-[#1a0c1c] text-center text-[11px] text-zinc-400">
          লগইন করার পর আপনি যেকোনো সময় নিজের প্রোফাইল ছবি, বায়ো ও নাম পরিবর্তন করতে পারবেন।
        </div>
      </div>
    </div>
  );
};
