import React from 'react';
import { Camera, Image as ImageIcon, Briefcase, Sparkles, Mail, Lock } from 'lucide-react';

interface HeaderProps {
  name: string;
  subtitle: string;
  motto: string;
  profileImage: string;
  onChangeProfilePhoto: () => void;
  onOpenUpload: () => void;
  totalPhotos: number;
  uploadButtonText: string;
  isAdmin?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  name,
  subtitle,
  motto,
  profileImage,
  onChangeProfilePhoto,
  onOpenUpload,
  totalPhotos,
  uploadButtonText,
  isAdmin = false,
}) => {
  return (
    <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 via-indigo-50/40 to-slate-50 border border-slate-200/80 shadow-md p-6 sm:p-10 text-center transition-all">
      {/* Decorative subtle background accents */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 rounded-full bg-red-100/40 blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 rounded-full bg-blue-100/50 blur-2xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto space-y-6">
        {/* Profile Avatar with Change Photo Trigger */}
        <div className="relative inline-block group">
          <div className="relative">
            <img
              id="profile-photo"
              src={profileImage}
              alt={name}
              className="w-36 h-36 sm:w-40 sm:h-40 rounded-full mx-auto object-cover border-4 border-white shadow-xl ring-4 ring-red-400/80 transition-transform duration-300 group-hover:scale-102"
              onError={(e) => {
                // Fallback to default if external URL fails
                (e.target as HTMLImageElement).src = 'https://i.imgur.com/Ml4A0jp.jpeg';
              }}
            />
            <button
              id="change-profile-photo-btn"
              onClick={onChangeProfilePhoto}
              title={isAdmin ? "প্রোফাইল ছবি পরিবর্তন করুন" : "প্রোফাইল ছবি পরিবর্তন করতে অ্যাডমিন পাসওয়ার্ড প্রয়োজন"}
              className="absolute bottom-1 right-1 p-2.5 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg border-2 border-white transition-all transform hover:scale-110 active:scale-95 cursor-pointer"
              aria-label="Change Profile Photo"
            >
              {isAdmin ? (
                <Camera className="w-4 h-4" />
              ) : (
                <Lock className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Name & Titles */}
        <div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-2">
            {name}
          </h1>
          <p className="text-base sm:text-lg text-red-600 font-semibold leading-relaxed max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Motto / Professional statement */}
        <p className="text-slate-700 max-w-3xl mx-auto text-sm sm:text-base leading-relaxed italic bg-white/60 backdrop-blur-xs py-3 px-6 rounded-2xl border border-slate-200/60 shadow-2xs">
          "{motto}"
        </p>

        {/* Badges & Quick Action Row */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-slate-700 border border-slate-200 text-xs font-semibold shadow-2xs">
            <ImageIcon className="w-3.5 h-3.5 text-red-600" />
            <span>গ্যালারিতে {totalPhotos}টি কাজের ছবি</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-slate-700 border border-slate-200 text-xs font-semibold shadow-2xs">
            <Briefcase className="w-3.5 h-3.5 text-blue-600" />
            <span>১০+ বছরের বাস্তব অভিজ্ঞতা</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-slate-700 border border-slate-200 text-xs font-semibold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>বহুমুখী উদ্যোক্তা ও সমাজকর্মী</span>
          </div>
        </div>

        {/* Primary CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
          <button
            id="header-add-photo-btn"
            onClick={onOpenUpload}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm shadow-md transition-all cursor-pointer active:scale-95 ${
              isAdmin
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-slate-900 hover:bg-black text-white'
            }`}
            title={isAdmin ? 'নতুন কাজের ছবি আপলোড করুন' : 'অ্যাডমিন পাসওয়ার্ড দিয়ে আপলোড করুন'}
          >
            {isAdmin ? (
              <Camera className="w-4 h-4" />
            ) : (
              <Lock className="w-4 h-4 text-amber-300" />
            )}
            <span>{uploadButtonText}</span>
          </button>

          <a
            href="#portfolio-section"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-medium text-sm border border-slate-300 shadow-xs transition-all"
          >
            <ImageIcon className="w-4 h-4 text-slate-500" />
            <span>পোর্টফোলিও দেখুন</span>
          </a>

          <a
            href="#contact-section"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-medium text-sm border border-slate-300 shadow-xs transition-all"
          >
            <Mail className="w-4 h-4 text-slate-500" />
            <span>যোগাযোগ করুন</span>
          </a>
        </div>
      </div>
    </header>
  );
};
