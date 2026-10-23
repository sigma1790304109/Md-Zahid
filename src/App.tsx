import React, { useState, useEffect, useMemo } from 'react';
import { 
  Heart, 
  Search, 
  Filter, 
  HeartCrack, 
  PlusCircle, 
  MessageSquareHeart, 
  Sparkles, 
  X,
  UserCheck
} from 'lucide-react';
import { Profile, Confession, UserAccount, MoodType, GenderType } from './types.ts';
import { BANGLADESH_DISTRICTS } from './data/initialData.ts';
import { storage } from './storage.ts';
import { soundscape } from './audio.ts';

import { Navbar } from './components/Navbar.tsx';
import { Hero } from './components/Hero.tsx';
import { ProfileCard } from './components/ProfileCard.tsx';
import { ProfileDetailModal } from './components/ProfileDetailModal.tsx';
import { UserProfileModal } from './components/UserProfileModal.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { ConfessionWall } from './components/ConfessionWall.tsx';
import { PoetrySection } from './components/PoetrySection.tsx';
import { AdminPanel } from './components/AdminPanel.tsx';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<'gallery' | 'confessions' | 'poetry' | 'admin'>('gallery');

  // Application State
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [confessions, setConfessions] = useState<Confession[]>([]);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [userLikes, setUserLikes] = useState<number[]>([]);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);

  // Modals
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUserProfileModalOpen, setIsUserProfileModalOpen] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState<'সকল' | 'ছেলে' | 'মেয়ে'>('সকল');
  const [districtFilter, setDistrictFilter] = useState<string>('সকল');
  const [moodFilter, setMoodFilter] = useState<string>('সকল');

  // Initialize data from storage
  useEffect(() => {
    const loadedProfiles = storage.getProfiles();
    const loadedConfessions = storage.getConfessions();
    const loggedUser = storage.getCurrentUser();
    const likes = storage.getUserLikes();

    setProfiles(loadedProfiles);
    setConfessions(loadedConfessions);
    setCurrentUser(loggedUser);
    setUserLikes(likes);
  }, []);

  // Ambient soundscape toggle
  const handleToggleAudio = () => {
    const playing = soundscape.toggle();
    setIsAudioPlaying(playing);
  };

  // Like / Empathy toggle
  const handleToggleLike = (profileId: number) => {
    const result = storage.toggleLikeProfile(profileId);
    setProfiles(prev =>
      prev.map(p => (p.id === profileId ? { ...p, likes: result.totalLikes } : p))
    );
    setUserLikes(storage.getUserLikes());
  };

  // User auth success
  const handleAuthSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    // Refresh profiles in case user has a published profile
    setProfiles(storage.getProfiles());
  };

  // User profile update
  const handleUpdateUser = (updatedUser: UserAccount) => {
    setCurrentUser(updatedUser);
    setProfiles(storage.getProfiles());
  };

  // Logout
  const handleLogout = () => {
    storage.logoutUser();
    setCurrentUser(null);
  };

  // Admin handlers
  const handleAddProfile = (newProfile: Profile) => {
    setProfiles(prev => [newProfile, ...prev]);
  };

  const handleDeleteProfile = (id: number) => {
    storage.deleteProfile(id);
    setProfiles(prev => prev.filter(p => p.id !== id));
  };

  const handleUpdateProfile = (id: number, updates: Partial<Profile>) => {
    const updated = storage.updateProfile(id, updates);
    if (updated) {
      setProfiles(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
    }
  };

  const handleResetData = () => {
    if (confirm('আপনি কি সমস্ত ডেটা রিসেট করে প্রাথমিক ডেমো অবস্থায় ফিরিয়ে নিতে চান?')) {
      storage.resetAllData();
      setProfiles(storage.getProfiles());
      setConfessions(storage.getConfessions());
      setUserLikes([]);
      setCurrentUser(null);
    }
  };

  // Filtered Profiles
  const filteredProfiles = useMemo(() => {
    return profiles.filter((p) => {
      // Search
      const matchSearch =
        !searchQuery.trim() ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.story.toLowerCase().includes(searchQuery.toLowerCase());

      // Gender
      const matchGender = genderFilter === 'সকল' || p.gender === genderFilter;

      // District
      const matchDistrict = districtFilter === 'সকল' || p.district === districtFilter;

      // Mood
      const matchMood = moodFilter === 'সকল' || p.mood === moodFilter;

      return matchSearch && matchGender && matchDistrict && matchMood;
    });
  }, [profiles, searchQuery, genderFilter, districtFilter, moodFilter]);

  const totalLikes = useMemo(() => {
    return profiles.reduce((acc, curr) => acc + curr.likes, 0);
  }, [profiles]);

  return (
    <div className="min-h-screen bg-[#160c18] text-[#fce7f3] flex flex-col font-sans selection:bg-rose-900 selection:text-white">
      
      {/* Top Bar Contract Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenProfile={() => setIsUserProfileModalOpen(true)}
        isAudioPlaying={isAudioPlaying}
        onToggleAudio={handleToggleAudio}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* TAB 1: GALLERY & PROFILES */}
        {activeTab === 'gallery' && (
          <div>
            {/* Hero Banner */}
            <Hero
              totalProfiles={profiles.length}
              totalConfessions={confessions.length}
              totalLikes={totalLikes}
              onExplore={() => {
                const el = document.getElementById('profiles-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenConfess={() => setActiveTab('confessions')}
              onOpenProfileOrAuth={() => {
                if (currentUser) {
                  setIsUserProfileModalOpen(true);
                } else {
                  setIsAuthModalOpen(true);
                }
              }}
              isLoggedIn={Boolean(currentUser)}
            />

            {/* Profiles & Filter Section */}
            <section id="profiles-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
              
              {/* Header and User Profile Quick Trigger Banner */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
                    <span>হৃদয়ভাঙা প্রেমিক গ্যালারি</span>
                    <HeartCrack className="w-6 h-6 text-rose-500" />
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                    কারো সাথে মন খুলে কথা বলতে সরাসরি WhatsApp-এ বার্তা পাঠান
                  </p>
                </div>

                {/* Logged in User Bar Quick Indicator */}
                {currentUser ? (
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#26132a] border border-[#481e50]">
                    {currentUser.avatar ? (
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-full object-cover border border-rose-500/40 shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-rose-900/60 text-rose-200 border border-rose-700/50 flex items-center justify-center font-bold text-sm shrink-0">
                        {currentUser.name.slice(0, 1)}
                      </div>
                    )}
                    <div className="min-w-0 pr-2">
                      <div className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                        <span>{currentUser.name}</span>
                        <UserCheck className="w-3.5 h-3.5 text-rose-400" />
                      </div>
                      <div className="text-[11px] text-zinc-400 truncate max-w-[200px]">
                        {currentUser.bio || 'বায়ো যোগ করুন'}
                      </div>
                    </div>
                    <button
                      onClick={() => setIsUserProfileModalOpen(true)}
                      className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold shrink-0 transition-colors"
                    >
                      এডিট
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="self-start md:self-auto px-4 py-2 bg-[#2a1430] hover:bg-[#381a3e] border border-[#4c2155] rounded-xl text-xs font-semibold text-rose-300 transition-colors flex items-center gap-2"
                  >
                    <PlusCircle className="w-4 h-4 text-rose-400" />
                    <span>আপনার প্রোফাইল যোগ করুন</span>
                  </button>
                )}
              </div>

              {/* Functional Interactive Filter & Search Controls */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#211124] border border-[#411d49] space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  
                  {/* Search Input */}
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="নাম, শহর বা গল্প দিয়ে খুঁজুন..."
                      className="w-full pl-9 pr-3.5 py-2.5 bg-[#170a19] border border-[#482050] focus:border-rose-500 rounded-xl text-white text-xs sm:text-sm outline-none transition-colors"
                    />
                    <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3 pointer-events-none" />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-3 text-zinc-400 hover:text-white"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Gender Filter Tabs */}
                  <div className="flex items-center p-1 bg-[#170a19] border border-[#482050] rounded-xl text-xs font-medium">
                    {(['সকল', 'ছেলে', 'মেয়ে'] as const).map((g) => (
                      <button
                        key={g}
                        onClick={() => setGenderFilter(g)}
                        className={`flex-1 py-1.5 rounded-lg transition-colors ${
                          genderFilter === g
                            ? 'bg-rose-900/70 text-white font-semibold shadow-sm'
                            : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>

                  {/* District Dropdown */}
                  <div className="relative">
                    <select
                      value={districtFilter}
                      onChange={(e) => setDistrictFilter(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#170a19] border border-[#482050] focus:border-rose-500 rounded-xl text-white text-xs sm:text-sm outline-none transition-colors appearance-none cursor-pointer"
                    >
                      <option value="সকল">সকল জেলা / এলাকা</option>
                      {BANGLADESH_DISTRICTS.map((dist) => (
                        <option key={dist} value={dist} className="bg-[#201024] text-white">
                          {dist}
                        </option>
                      ))}
                    </select>
                    <Filter className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-3.5 pointer-events-none" />
                  </div>

                  {/* Mood Dropdown */}
                  <div className="relative">
                    <select
                      value={moodFilter}
                      onChange={(e) => setMoodFilter(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#170a19] border border-[#482050] focus:border-rose-500 rounded-xl text-white text-xs sm:text-sm outline-none transition-colors appearance-none cursor-pointer"
                    >
                      <option value="সকল">সকল মানসিক অবস্থা (Mood)</option>
                      <option value="কান্নায় রাত কাটে">কান্নায় রাত কাটে 🌧️</option>
                      <option value="স্মৃতিতে বিভোর">স্মৃতিতে বিভোর 🥀</option>
                      <option value="নতুন সূচনা">নতুন সূচনা 🌱</option>
                      <option value="একাকী পথচলা">একাকী পথচলা 🚶</option>
                      <option value="মায়ায় বাঁধা">মায়ায় বাঁধা 💔</option>
                      <option value="বিশ্বাসঘাতকতার ক্ষত">বিশ্বাসঘাতকতার ক্ষত ⚡</option>
                    </select>
                    <Filter className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-3.5 pointer-events-none" />
                  </div>

                </div>

                {/* Active filter count & clear */}
                <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
                  <div>
                    মোট দেখানো হচ্ছে: <span className="text-white font-bold tabular-nums">{filteredProfiles.length}</span> টি প্রোফাইল
                  </div>

                  {(searchQuery || genderFilter !== 'সকল' || districtFilter !== 'সকল' || moodFilter !== 'সকল') && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setGenderFilter('সকল');
                        setDistrictFilter('সকল');
                        setMoodFilter('সকল');
                      }}
                      className="text-rose-400 hover:text-rose-300 font-medium underline transition-colors"
                    >
                      ফিল্টার রিসেট করুন
                    </button>
                  )}
                </div>

              </div>

              {/* Profiles Grid */}
              {filteredProfiles.length === 0 ? (
                <div className="py-16 text-center space-y-3 bg-[#1e0e21] border border-[#3b1942] rounded-2xl p-8">
                  <HeartCrack className="w-12 h-12 text-rose-500/60 mx-auto" />
                  <h3 className="text-lg font-bold text-white">কোনো প্রোফাইল পাওয়া যায়নি</h3>
                  <p className="text-xs sm:text-sm text-zinc-400 max-w-sm mx-auto">
                    আপনার নির্বাচিত ফিল্টারের সাথে মিলছে এমন কোনো প্রোফাইল নেই। ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন।
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProfiles.map((p) => (
                    <ProfileCard
                      key={p.id}
                      profile={p}
                      isLiked={userLikes.includes(p.id)}
                      onToggleLike={handleToggleLike}
                      onOpenDetail={(prof) => setSelectedProfile(prof)}
                    />
                  ))}
                </div>
              )}

            </section>
          </div>
        )}

        {/* TAB 2: CONFESSIONS WALL */}
        {activeTab === 'confessions' && (
          <ConfessionWall
            confessions={confessions}
            onAddConfession={(newConf) => setConfessions(prev => [newConf, ...prev])}
            currentUser={currentUser}
          />
        )}

        {/* TAB 3: POETRY & QUOTES */}
        {activeTab === 'poetry' && (
          <PoetrySection />
        )}

        {/* TAB 4: ADMIN PANEL */}
        {activeTab === 'admin' && (
          <AdminPanel
            profiles={profiles}
            onAddProfile={handleAddProfile}
            onDeleteProfile={handleDeleteProfile}
            onUpdateProfile={handleUpdateProfile}
            onResetData={handleResetData}
          />
        )}

      </main>

      {/* Global Modals */}
      {/* 1. Profile Details Modal */}
      <ProfileDetailModal
        profile={selectedProfile}
        isOpen={Boolean(selectedProfile)}
        onClose={() => setSelectedProfile(null)}
        isLiked={selectedProfile ? userLikes.includes(selectedProfile.id) : false}
        onToggleLike={handleToggleLike}
      />

      {/* 2. User Profile Modal (Set Profile Picture, Edit Bio, Display Name) */}
      {currentUser && (
        <UserProfileModal
          isOpen={isUserProfileModalOpen}
          onClose={() => setIsUserProfileModalOpen(false)}
          currentUser={currentUser}
          onUpdateUser={handleUpdateUser}
          onLogout={handleLogout}
        />
      )}

      {/* 3. Auth Modal (Login / Register) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* Footer */}
      <footer className="mt-16 border-t border-[#3b1942] bg-[#140a16] py-8 px-4 sm:px-6 lg:px-8 text-center space-y-3">
        <div className="flex items-center justify-center gap-2 text-rose-400 font-bold text-sm">
          <span>ছ্যাঁকা খাওয়া প্রেমিক 💔</span>
          <span className="text-zinc-600">·</span>
          <span className="text-zinc-400 font-normal text-xs">ভাঙা হৃদয়ের শহরে স্বাগতম</span>
        </div>
        <p className="text-xs text-zinc-400 max-w-xl mx-auto leading-relaxed">
          সতর্কবার্তা: শুধু অনুমতি পাওয়া ব্যক্তির ছবি ও নম্বর ব্যবহার করবেন। এটি একটি সামাজিক সহমর্মিতা প্ল্যাটফর্ম। কারো প্রতি অশালীন আচরণ কঠোরভাবে নিষিদ্ধ।
        </p>
        <div className="text-[11px] text-zinc-500">
          © ২০২৬ ছ্যাঁকা খাওয়া প্রেমিক · সকল অধিকার সংরক্ষিত
        </div>
      </footer>

    </div>
  );
}
