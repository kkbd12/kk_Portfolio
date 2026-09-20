import React from 'react';
import { Language } from '../types';
import { Globe, PlusCircle, Lock, Share2 } from 'lucide-react';

interface LanguageSelectorProps {
  currentLang: Language;
  onChange: (lang: Language) => void;
  onOpenUpload: () => void;
  uploadButtonText: string;
  isAdmin?: boolean;
  onOpenAdminLogin?: () => void;
  onOpenShare?: () => void;
}

const languages: { code: Language; label: string; flag: string }[] = [
  { code: 'bn', label: 'বাংলা', flag: '🇧🇩' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
];

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLang,
  onChange,
  onOpenUpload,
  uploadButtonText,
  isAdmin = false,
  onOpenAdminLogin,
  onOpenShare,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2 border-b border-slate-200">
      <div className="flex items-center gap-2 flex-wrap">
        <Globe className="w-4 h-4 text-slate-500" />
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Language / ভাষা:
        </span>
        <div className="inline-flex p-1 bg-white rounded-xl shadow-xs border border-slate-200">
          {languages.map((lang) => {
            const isActive = currentLang === lang.code;
            return (
              <button
                key={lang.code}
                id={`lang-btn-${lang.code}`}
                onClick={() => onChange(lang.code)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>{lang.flag}</span>
                <span>{lang.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        {onOpenShare && (
          <button
            id="share-publish-header-btn"
            onClick={onOpenShare}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 rounded-xl shadow-2xs transition cursor-pointer active:scale-95"
            title="পোর্টফোলিও লিংক কপি ও সবার মাঝে শেয়ার করুন"
          >
            <Share2 className="w-3.5 h-3.5 text-red-600" />
            <span>শেয়ার ও প্রকাশ</span>
          </button>
        )}

        {!isAdmin && onOpenAdminLogin && (
          <button
            id="admin-login-header-btn"
            onClick={onOpenAdminLogin}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl transition cursor-pointer"
            title="অ্যাডমিন প্যানেলে লগইন"
          >
            <Lock className="w-3.5 h-3.5 text-slate-500" />
            <span>অ্যাডমিন লগইন</span>
          </button>
        )}

        <button
          id="quick-upload-header-btn"
          onClick={onOpenUpload}
          className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl shadow-xs transition-all cursor-pointer ${
            isAdmin
              ? 'bg-red-600 hover:bg-red-700 text-white active:scale-95'
              : 'bg-slate-800 hover:bg-slate-900 text-white active:scale-95'
          }`}
          title={isAdmin ? 'ছবি আপলোড করুন' : 'অ্যাডমিন পাসওয়ার্ড দিয়ে আপলোড করুন'}
        >
          {isAdmin ? (
            <PlusCircle className="w-4 h-4" />
          ) : (
            <Lock className="w-4 h-4 text-amber-300" />
          )}
          <span>{uploadButtonText}</span>
        </button>
      </div>
    </div>
  );
};

