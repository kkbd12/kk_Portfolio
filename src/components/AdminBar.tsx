import React from 'react';
import { ShieldCheck, Lock, LogOut, KeyRound, Camera, PlusCircle, Share2 } from 'lucide-react';

interface AdminBarProps {
  isAdmin: boolean;
  onOpenLogin: () => void;
  onLogout: () => void;
  onOpenUpload: () => void;
  onOpenSettings: () => void;
  onOpenShare?: () => void;
}

export const AdminBar: React.FC<AdminBarProps> = ({
  isAdmin,
  onOpenLogin,
  onLogout,
  onOpenUpload,
  onOpenSettings,
  onOpenShare,
}) => {
  if (!isAdmin) {
    return (
      <div className="flex items-center justify-end">
        <button
          id="admin-login-bar-btn"
          onClick={onOpenLogin}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 text-xs font-semibold shadow-2xs transition active:scale-95 cursor-pointer"
          title="অ্যাডমিন প্যানেলে লগইন করুন"
        >
          <Lock className="w-3.5 h-3.5 text-slate-500" />
          <span>অ্যাডমিন লগইন</span>
        </button>
      </div>
    );
  }

  return (
    <div
      id="admin-active-bar"
      className="p-3 sm:px-4 sm:py-2.5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-red-950 text-white shadow-md border border-red-900/40 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in duration-300"
    >
      <div className="flex items-center gap-2.5 self-start sm:self-center">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
        </span>
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-xs sm:text-sm font-bold text-white tracking-wide">
            অ্যাডমিন প্যানেল সক্রিয় (Admin Mode Active)
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
        {onOpenShare && (
          <button
            onClick={onOpenShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 shadow-xs transition active:scale-95 cursor-pointer"
            title="পোর্টফোলিও লিংক সবার মাঝে শেয়ার করুন"
          >
            <Share2 className="w-3.5 h-3.5 text-red-400" />
            <span>সবার মাঝে শেয়ার</span>
          </button>
        )}

        <button
          onClick={onOpenUpload}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-xs transition active:scale-95 cursor-pointer"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>নতুন ছবি আপলোড</span>
        </button>

        <button
          onClick={onOpenSettings}
          title="পাসওয়ার্ড পরিবর্তন করুন"
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium border border-slate-700 transition cursor-pointer"
        >
          <KeyRound className="w-3.5 h-3.5" />
          <span className="hidden md:inline">পাসওয়ার্ড</span>
        </button>

        <button
          onClick={onLogout}
          title="অ্যাডমিন প্যানেল থেকে লগআউট করুন"
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-950/70 hover:bg-rose-900 text-rose-300 hover:text-white text-xs font-medium border border-rose-800/60 transition cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>লগআউট</span>
        </button>
      </div>
    </div>
  );
};
