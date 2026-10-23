import { Profile, Confession, UserAccount } from './types.ts';
import { INITIAL_PROFILES, INITIAL_CONFESSIONS } from './data/initialData.ts';

const PROFILES_KEY = 'cp_profiles_v1';
const CONFESSIONS_KEY = 'cp_confessions_v1';
const USERS_DB_KEY = 'cp_users_database_v2';
const CURRENT_USER_KEY = 'cp_current_user_v2';
const LIKES_KEY = 'cp_user_likes_v1';
const ADMIN_PASS_KEY = 'cp_admin_password_v1';

export const DEFAULT_ADMIN_PASSWORD = 'admin123';

interface StoredUserRecord {
  pass: string;
  account: UserAccount;
}

export const storage = {
  getProfiles(): Profile[] {
    try {
      const data = localStorage.getItem(PROFILES_KEY);
      if (!data) {
        localStorage.setItem(PROFILES_KEY, JSON.stringify(INITIAL_PROFILES));
        return INITIAL_PROFILES;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_PROFILES;
    }
  },

  saveProfiles(profiles: Profile[]): void {
    try {
      localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
    } catch (e) {
      console.error('Failed to save profiles to storage', e);
    }
  },

  addProfile(profile: Omit<Profile, 'id' | 'createdAt' | 'likes'>): Profile {
    const list = this.getProfiles();
    const newId = list.length > 0 ? Math.max(...list.map(p => p.id)) + 1 : 1;
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    
    const newProfile: Profile = {
      ...profile,
      id: newId,
      createdAt: dateStr,
      likes: 0,
      isVerified: false
    };

    const updated = [newProfile, ...list];
    this.saveProfiles(updated);

    // If profile has a userPhone, also link to user account
    if (profile.userPhone) {
      this.updateUserProfile(profile.userPhone, { linkedProfileId: newId });
    }

    return newProfile;
  },

  updateProfile(id: number, updates: Partial<Profile>): Profile | null {
    const list = this.getProfiles();
    const idx = list.findIndex(p => p.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...updates };
    this.saveProfiles(list);
    return list[idx];
  },

  deleteProfile(id: number): void {
    const list = this.getProfiles();
    const updated = list.filter(p => p.id !== id);
    this.saveProfiles(updated);
  },

  toggleLikeProfile(profileId: number): { liked: boolean; totalLikes: number } {
    const profiles = this.getProfiles();
    const target = profiles.find(p => p.id === profileId);
    if (!target) return { liked: false, totalLikes: 0 };

    let likedIds: number[] = [];
    try {
      likedIds = JSON.parse(localStorage.getItem(LIKES_KEY) || '[]');
    } catch {
      likedIds = [];
    }

    const alreadyLiked = likedIds.includes(profileId);
    if (alreadyLiked) {
      likedIds = likedIds.filter(id => id !== profileId);
      target.likes = Math.max(0, target.likes - 1);
    } else {
      likedIds.push(profileId);
      target.likes += 1;
    }

    localStorage.setItem(LIKES_KEY, JSON.stringify(likedIds));
    this.saveProfiles(profiles);
    return { liked: !alreadyLiked, totalLikes: target.likes };
  },

  getUserLikes(): number[] {
    try {
      return JSON.parse(localStorage.getItem(LIKES_KEY) || '[]');
    } catch {
      return [];
    }
  },

  getConfessions(): Confession[] {
    try {
      const data = localStorage.getItem(CONFESSIONS_KEY);
      if (!data) {
        localStorage.setItem(CONFESSIONS_KEY, JSON.stringify(INITIAL_CONFESSIONS));
        return INITIAL_CONFESSIONS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_CONFESSIONS;
    }
  },

  saveConfessions(confessions: Confession[]): void {
    try {
      localStorage.setItem(CONFESSIONS_KEY, JSON.stringify(confessions));
    } catch (e) {
      console.error('Failed to save confessions', e);
    }
  },

  addConfession(text: string, author: string = 'বেনামী হৃদয়', authorPhone?: string): Confession {
    const list = this.getConfessions();
    const newConf: Confession = {
      id: `conf-${Date.now()}`,
      author: author.trim() || 'বেনামী হৃদয়',
      text: text.trim(),
      time: 'এইমাত্র',
      hugs: 0,
      brokenHearts: 1,
      strengths: 0,
      authorPhone
    };
    const updated = [newConf, ...list];
    this.saveConfessions(updated);
    return newConf;
  },

  reactToConfession(id: string, type: 'hugs' | 'brokenHearts' | 'strengths'): Confession | null {
    const list = this.getConfessions();
    const item = list.find(c => c.id === id);
    if (!item) return null;
    item[type] = (item[type] || 0) + 1;
    this.saveConfessions(list);
    return item;
  },

  // -------------------------------------------------------------
  // USER PROFILES & ACCOUNTS (associated with login)
  // -------------------------------------------------------------
  getUsersDatabase(): Record<string, StoredUserRecord> {
    try {
      const raw = localStorage.getItem(USERS_DB_KEY);
      if (!raw) {
        // Preload demo user
        const initialUsers: Record<string, StoredUserRecord> = {
          '01711223344': {
            pass: '12345678',
            account: {
              phone: '01711223344',
              name: 'সজীব আহমেদ',
              bio: 'প্রেমের নিঃশব্দ সমাধি দেখে এসেছি। নীরবতাই এখন আমার সবচেয়ে বড় শক্তি।',
              avatar: '/src/assets/images/heartbroken_man_rain_1792661841628.jpg',
              gender: 'ছেলে',
              district: 'ঢাকা',
              whatsapp: '8801711223344',
              mood: 'স্মৃতিতে বিভোর',
              registeredAt: '২০২৬-১০-০১'
            }
          }
        };
        localStorage.setItem(USERS_DB_KEY, JSON.stringify(initialUsers));
        return initialUsers;
      }
      return JSON.parse(raw);
    } catch {
      return {};
    }
  },

  saveUsersDatabase(db: Record<string, StoredUserRecord>): void {
    try {
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(db));
    } catch (e) {
      console.error('Failed to save users DB', e);
    }
  },

  registerUser(
    phone: string, 
    pass: string, 
    initialData?: { name?: string; bio?: string; avatar?: string }
  ): { success: boolean; message: string; user?: UserAccount } {
    const cleanPhone = phone.trim();
    if (!cleanPhone || cleanPhone.length < 6) {
      return { success: false, message: 'সঠিক মোবাইল নম্বর দিন।' };
    }
    if (pass.length < 6) {
      return { success: false, message: 'কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড দিন।' };
    }

    const db = this.getUsersDatabase();
    if (db[cleanPhone]) {
      return { success: false, message: 'এই নম্বরে অ্যাকাউন্ট রয়েছে। অনুগ্রহ করে লগইন করুন।' };
    }

    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    const newAccount: UserAccount = {
      phone: cleanPhone,
      name: initialData?.name?.trim() || 'হৃদয়ভাঙা পথিক',
      bio: initialData?.bio?.trim() || 'ভাঙা হৃদয়ের শহরে নতুন এক অভিযাত্রী...',
      avatar: initialData?.avatar || '',
      whatsapp: cleanPhone.replace(/\D/g, ''),
      mood: 'স্মৃতিতে বিভোর',
      district: 'ঢাকা',
      gender: 'ছেলে',
      registeredAt: dateStr
    };

    db[cleanPhone] = {
      pass,
      account: newAccount
    };

    this.saveUsersDatabase(db);
    this.setCurrentUser(newAccount);

    return { 
      success: true, 
      message: 'আপনার অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!', 
      user: newAccount 
    };
  },

  loginUser(phone: string, pass: string): { success: boolean; message: string; user?: UserAccount } {
    const cleanPhone = phone.trim();
    const db = this.getUsersDatabase();

    const record = db[cleanPhone];
    if (record && record.pass === pass) {
      this.setCurrentUser(record.account);
      return { success: true, message: 'লগইন সফল হয়েছে!', user: record.account };
    }

    return { success: false, message: 'মোবাইল নম্বর অথবা পাসওয়ার্ড মেলেনি। আবার চেষ্টা করুন।' };
  },

  getCurrentUser(): UserAccount | null {
    try {
      const data = localStorage.getItem(CURRENT_USER_KEY);
      if (!data) return null;
      const user: UserAccount = JSON.parse(data);
      // Refresh latest from DB to ensure sync
      const db = this.getUsersDatabase();
      if (db[user.phone]) {
        return db[user.phone].account;
      }
      return user;
    } catch {
      return null;
    }
  },

  setCurrentUser(user: UserAccount | null): void {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  },

  updateUserProfile(phone: string, updates: Partial<UserAccount>): UserAccount | null {
    const db = this.getUsersDatabase();
    if (!db[phone]) return null;

    db[phone].account = {
      ...db[phone].account,
      ...updates
    };

    this.saveUsersDatabase(db);

    // If current session is this user, sync session
    const current = this.getCurrentUser();
    if (current && current.phone === phone) {
      this.setCurrentUser(db[phone].account);
    }

    // Also sync public profile in gallery if linked
    if (db[phone].account.linkedProfileId) {
      this.updateProfile(db[phone].account.linkedProfileId, {
        name: db[phone].account.name,
        story: db[phone].account.bio || '',
        photo: db[phone].account.avatar || '',
        district: db[phone].account.district || 'ঢাকা',
        mood: db[phone].account.mood || 'স্মৃতিতে বিভোর',
        number: db[phone].account.whatsapp || phone.replace(/\D/g, '')
      });
    }

    return db[phone].account;
  },

  logoutUser(): void {
    this.setCurrentUser(null);
  },

  // Admin
  getAdminPassword(): string {
    return localStorage.getItem(ADMIN_PASS_KEY) || DEFAULT_ADMIN_PASSWORD;
  },

  setAdminPassword(newPass: string): void {
    localStorage.setItem(ADMIN_PASS_KEY, newPass);
  },

  resetAllData(): void {
    localStorage.removeItem(PROFILES_KEY);
    localStorage.removeItem(CONFESSIONS_KEY);
    localStorage.removeItem(LIKES_KEY);
    localStorage.removeItem(USERS_DB_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};
