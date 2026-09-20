import React, { useState } from 'react';
import { Lock, Eye, EyeOff, X, ShieldAlert, KeyRound, Check } from 'lucide-react';
import { verifyAdminPassword } from '../utils/storage';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('অনুগ্রহ করে পাসওয়ার্ড প্রদান করুন');
      return;
    }

    if (verifyAdminPassword(password)) {
      setError('');
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setPassword('');
        onLoginSuccess();
      }, 600);
    } else {
      setError('ভুল পাসওয়ার্ড! অনুগ্রহ করে সঠিক অ্যাডমিন পাসওয়ার্ড দিন।');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5 text-red-600">
            <div className="p-2 bg-red-100 rounded-xl">
              <Lock className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 leading-tight">
                অ্যাডমিন লগইন (Admin Login)
              </h3>
              <p className="text-xs text-slate-500">
                শুধু মাত্র অ্যাডমিনের জন্য সুরক্ষিত
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informational badge without password hint */}
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-slate-700 text-xs sm:text-sm flex items-start gap-2.5">
          <KeyRound className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <p className="font-semibold text-slate-800">
            নতুন ছবি আপলোড বা গ্যালারি পরিবর্তন করতে অ্যাডমিন পাসওয়ার্ড দিন।
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              অ্যাডমিন পাসওয়ার্ড (Admin Password)
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                autoFocus
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                placeholder="পাসওয়ার্ড লিখুন"
                className={`w-full px-4 py-3 pr-12 rounded-xl text-base border transition focus:outline-none focus:ring-2 ${
                  error
                    ? 'border-red-500 ring-red-200 bg-red-50/30'
                    : 'border-slate-300 focus:border-red-500 focus:ring-red-200 bg-white'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 transition"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {error && (
              <p className="mt-2 text-xs font-semibold text-red-600 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </p>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs sm:text-sm font-semibold transition cursor-pointer"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={isSuccess}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white shadow-md transition cursor-pointer active:scale-95 ${
                isSuccess
                  ? 'bg-emerald-600'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {isSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>সফল হয়েছে!</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>লগইন করুন</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
