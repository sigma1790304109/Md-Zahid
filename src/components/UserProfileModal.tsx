import React, { useState, useRef } from 'react';
import { X, Camera, Save, LogOut, Check, Phone, MapPin, Smile, MessageCircle, Globe, Heart } from 'lucide-react';
import { UserAccount, MoodType, GenderType } from '../types.ts';
import { BANGLADESH_DISTRICTS } from '../data/initialData.ts';
import { storage } from '../storage.ts';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount;
  onUpdateUser: (updated: UserAccount) => void;
  onLogout: () => void;
}

const MOOD_OPTIONS: MoodType[] = [
  'কান্নায় রাত কাটে',
  'স্মৃতিতে বিভোর',
  'নতুন সূচনা',
  'একাকী পথচলা',
  'মায়ায় বাঁধা',
  'বিশ্বাসঘাতকতার ক্ষত'
];

const AVATAR_PRESETS = [
  { label: 'স্মৃতিময় পুরুষ', url: '/src/assets/images/heartbroken_man_rain_1792661841628.jpg' },
  { label: 'কুয়াশাময় নারী', url: '/src/assets/images/heartbroken_woman_dusk_1792661842122.jpg' },
  { label: 'চা ও নীরবতা', url: '/src/assets/images/reflective_man_cafe_1792661843928.jpg' },
  { label: 'ছাদে ডায়েরি', url: '/src/assets/images/emotional_woman_rooftop_1792661843147.jpg' }
];

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser,
  onLogout
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState(currentUser.name || '');
  const [bio, setBio] = useState(currentUser.bio || '');
  const [avatar, setAvatar] = useState(currentUser.avatar || '');
  const [gender, setGender] = useState<GenderType>(currentUser.gender || 'ছেলে');
  const [district, setDistrict] = useState(currentUser.district || 'ঢাকা');
  const [whatsapp, setWhatsapp] = useState(currentUser.whatsapp || currentUser.phone.replace(/\D/g, ''));
  const [mood, setMood] = useState<MoodType>(currentUser.mood || 'স্মৃতিতে বিভোর');
  
  const [isPublishingToGallery, setIsPublishingToGallery] = useState(Boolean(currentUser.linkedProfileId));
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setFeedbackMsg({ type: 'error', text: 'অনুগ্রহ করে JPG, PNG বা WebP ফরম্যাটের ছবি আপলোড করুন।' });
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      setFeedbackMsg({ type: 'error', text: 'ছবির সাইজ সর্বোচ্চ ৩ MB হতে পারবে।' });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatar(reader.result);
        setFeedbackMsg({ type: 'success', text: 'প্রোফাইল ছবি নির্বাচিত হয়েছে! সেভ করতে নিচের বাটনে চাপ দিন।' });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!name.trim()) {
      setFeedbackMsg({ type: 'error', text: 'আপনার নাম দিন।' });
      return;
    }

    setIsSaving(true);
    try {
      let linkedProfileId = currentUser.linkedProfileId;

      // Handle publishing to gallery if checked
      if (isPublishingToGallery) {
        if (!linkedProfileId) {
          // Create new gallery profile
          const newProfile = storage.addProfile({
            name: name.trim(),
            age: 24,
            gender,
            district,
            number: whatsapp.replace(/\D/g, '') || currentUser.phone.replace(/\D/g, ''),
            photo: avatar || '/src/assets/images/heartbroken_man_rain_1792661841628.jpg',
            story: bio.trim() || 'ভাঙা হৃদয়ের অনুভূতিগুলো নীরবে বয়ে নিয়ে বেড়াচ্ছি...',
            mood,
            quote: 'নীরব অশ্রুই হয়তো সব চেয়ে ভারী অনুভূতির ভাষা...',
            userPhone: currentUser.phone
          });
          linkedProfileId = newProfile.id;
        } else {
          // Update existing gallery profile
          storage.updateProfile(linkedProfileId, {
            name: name.trim(),
            district,
            number: whatsapp.replace(/\D/g, '') || currentUser.phone.replace(/\D/g, ''),
            photo: avatar || '/src/assets/images/heartbroken_man_rain_1792661841628.jpg',
            story: bio.trim() || 'ভাঙা হৃদয়ের অনুভূতিগুলো নীরবে বয়ে নিয়ে বেড়াচ্ছি...',
            mood
          });
        }
      }

      const updated = storage.updateUserProfile(currentUser.phone, {
        name: name.trim(),
        bio: bio.trim(),
        avatar,
        gender,
        district,
        whatsapp: whatsapp.trim(),
        mood,
        linkedProfileId: isPublishingToGallery ? linkedProfileId : undefined
      });

      if (updated) {
        onUpdateUser(updated);
        setFeedbackMsg({ type: 'success', text: 'আপনার প্রোফাইল তথ্য সফলভাবে সেভ করা হয়েছে!' });
        setTimeout(() => {
          setFeedbackMsg(null);
        }, 3000);
      }
    } catch {
      setFeedbackMsg({ type: 'error', text: 'সেভ করতে সমস্যা হয়েছে, আবার চেষ্টা করুন।' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#201024] border border-[#482050] rounded-2xl shadow-2xl overflow-hidden my-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#3b1942] bg-[#27132c]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-950 border border-rose-800/60 flex items-center justify-center text-rose-300">
              <Heart className="w-4 h-4 text-rose-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">আমার প্রোফাইল ও অনুভূতি</h2>
              <p className="text-xs text-zinc-400">আপনার ব্যক্তিগত তথ্য ও বায়ো সম্পাদনা করুন</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[78vh] overflow-y-auto">
          
          {feedbackMsg && (
            <div
              className={`p-3.5 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2 ${
                feedbackMsg.type === 'success'
                  ? 'bg-emerald-950/70 border border-emerald-800 text-emerald-200'
                  : 'bg-rose-950/70 border border-rose-800 text-rose-200'
              }`}
            >
              <Check className="w-4 h-4 shrink-0" />
              <span>{feedbackMsg.text}</span>
            </div>
          )}

          {/* Top Avatar & Name Section */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-4 rounded-xl bg-[#2a1430] border border-[#441f4d]">
            {/* Avatar with Upload Trigger */}
            <div className="relative group shrink-0">
              <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-rose-500/40 bg-zinc-900 flex items-center justify-center shadow-md">
                {avatar ? (
                  <img
                    src={avatar}
                    alt={name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-2xl font-bold text-rose-300">
                    {name ? name.slice(0, 1) : 'হৃ'}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[11px] font-medium transition-opacity cursor-pointer"
              >
                <Camera className="w-5 h-5 mb-1 text-rose-300" />
                <span>ছবি পরিবর্তন</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Account Quick Info */}
            <div className="flex-1 text-center sm:text-left space-y-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="text-lg font-bold text-white">{name || 'নামহীন প্রেমিক'}</span>
                <span className="text-xs text-rose-300 font-medium bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800/40">
                  {mood}
                </span>
              </div>
              <p className="text-xs text-zinc-400 flex items-center justify-center sm:justify-start gap-1">
                <Phone className="w-3 h-3 text-zinc-500" />
                <span>লগইন নম্বর: {currentUser.phone}</span>
                <span className="mx-1">·</span>
                <span>যুক্ত হয়েছেন: {currentUser.registeredAt}</span>
              </p>
              <div className="pt-1 flex flex-wrap gap-2 justify-center sm:justify-start">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1 bg-rose-900/50 hover:bg-rose-900/80 text-rose-200 border border-rose-700/50 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>ডিভাইস থেকে ছবি আপলোড</span>
                </button>
              </div>
            </div>
          </div>

          {/* Fast Preset Avatars */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-2">
              বা পছন্দের আর্ট অবতার সিলেক্ট করুন:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {AVATAR_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setAvatar(preset.url);
                    setFeedbackMsg({ type: 'success', text: `"${preset.label}" অবতার নির্বাচিত হয়েছে!` });
                  }}
                  className={`p-2 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                    avatar === preset.url
                      ? 'border-rose-500 bg-rose-950/40 ring-1 ring-rose-500'
                      : 'border-[#431e4c] bg-[#27132c] hover:border-zinc-500'
                  }`}
                >
                  <img
                    src={preset.url}
                    alt={preset.label}
                    referrerPolicy="no-referrer"
                    className="w-9 h-9 rounded-lg object-cover shrink-0"
                  />
                  <div className="text-[11px] font-medium text-zinc-200 truncate">
                    {preset.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Display Name */}
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                আপনার নাম (Display Name) <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="যেমন: তানভীর আহমেদ"
                className="w-full px-3.5 py-2.5 bg-[#170a19] border border-[#482050] focus:border-rose-500 rounded-xl text-white text-sm outline-none transition-colors"
              />
            </div>

            {/* WhatsApp Number */}
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                WhatsApp নম্বর (সংযোগের জন্য)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="যেমন: 01712345678 বা 8801712345678"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-[#170a19] border border-[#482050] focus:border-rose-500 rounded-xl text-white text-sm outline-none transition-colors"
                />
                <MessageCircle className="w-4 h-4 text-emerald-500 absolute left-3 top-3" />
              </div>
            </div>

            {/* District */}
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                জেলা / শহর
              </label>
              <div className="relative">
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-[#170a19] border border-[#482050] focus:border-rose-500 rounded-xl text-white text-sm outline-none transition-colors appearance-none"
                >
                  {BANGLADESH_DISTRICTS.map((dist) => (
                    <option key={dist} value={dist} className="bg-[#201024] text-white">
                      {dist}
                    </option>
                  ))}
                </select>
                <MapPin className="w-4 h-4 text-zinc-400 absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Emotional Mood */}
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                বর্তমান মানসিক অবস্থা (Mood)
              </label>
              <div className="relative">
                <select
                  value={mood}
                  onChange={(e) => setMood(e.target.value as MoodType)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-[#170a19] border border-[#482050] focus:border-rose-500 rounded-xl text-white text-sm outline-none transition-colors appearance-none"
                >
                  {MOOD_OPTIONS.map((m) => (
                    <option key={m} value={m} className="bg-[#201024] text-white">
                      {m}
                    </option>
                  ))}
                </select>
                <Smile className="w-4 h-4 text-rose-400 absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Short Bio (মনের কথা / বায়ো) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-zinc-300">
                সংক্ষিপ্ত বায়ো / মনের অনুভূতির কথা (Short Bio)
              </label>
              <span className="text-[11px] text-zinc-500">{bio.length}/300 অক্ষর</span>
            </div>
            <textarea
              rows={3}
              maxLength={300}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="আপনার ভালোবাসার গল্প, বিচ্ছেদের অনুভূতি অথবা নিজের সম্পর্কে কিছু লিখুন..."
              className="w-full px-3.5 py-2.5 bg-[#170a19] border border-[#482050] focus:border-rose-500 rounded-xl text-white text-sm outline-none transition-colors resize-none leading-relaxed"
            />
          </div>

          {/* Public Gallery Switch */}
          <div className="p-3.5 rounded-xl bg-[#28132d] border border-[#4b2152] flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-rose-400" />
                <span className="text-sm font-semibold text-white">পাবলিক গ্যালারিতে আমার প্রোফাইল প্রদর্শন করুন</span>
              </div>
              <p className="text-xs text-zinc-400">
                টিক দিলে অন্যান্য ছ্যাঁকা খাওয়া প্রেমিক-প্রেমিকারা গ্যালারিতে আপনার প্রোফাইল ও হোয়াটসঅ্যাপ দেখতে পাবে।
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={isPublishingToGallery}
                onChange={(e) => setIsPublishingToGallery(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
            </label>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-[#3b1942] bg-[#27132c] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>লগআউট</span>
          </button>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-800/60 hover:bg-zinc-800 rounded-xl transition-colors"
            >
              বাতিল
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="px-5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 rounded-xl shadow-md transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'সেভ হচ্ছে...' : 'প্রোফাইল সেভ করুন'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
