/**
 * Data structures for 'ছ্যাঁকা খাওয়া প্রেমিক' (Heartbroken Lover Platform)
 */

export type MoodType = 
  | 'কান্নায় রাত কাটে' 
  | 'স্মৃতিতে বিভোর' 
  | 'নতুন সূচনা' 
  | 'একাকী পথচলা' 
  | 'মায়ায় বাঁধা'
  | 'বিশ্বাসঘাতকতার ক্ষত';

export type GenderType = 'ছেলে' | 'মেয়ে' | 'অন্যান্য';

export interface Profile {
  id: number;
  name: string;
  age: number;
  gender: GenderType;
  district: string;
  number: string; // WhatsApp formatted number
  photo: string;
  story: string;
  mood: MoodType;
  quote?: string;
  createdAt: string;
  likes: number;
  isVerified?: boolean;
  userPhone?: string; // linked to user account if created by user
}

export interface Confession {
  id: string;
  author: string;
  text: string;
  time: string;
  hugs: number;
  brokenHearts: number;
  strengths: number;
  authorPhone?: string;
}

export interface PoetryQuote {
  id: number;
  title: string;
  lines: string[];
  poet: string;
  category: 'কষ্ট' | 'স্মৃতি' | 'নিরাময়' | 'অভিমান';
}

export interface UserAccount {
  phone: string;
  name: string;
  bio?: string;
  avatar?: string;
  gender?: GenderType;
  district?: string;
  whatsapp?: string;
  mood?: MoodType;
  registeredAt: string;
  linkedProfileId?: number;
}
