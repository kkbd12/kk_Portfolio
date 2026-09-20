import React, { useState } from 'react';
import { KeyRound, X, Check, Eye, EyeOff, ShieldAlert } from 'lucide-react';
import { getAdminPassword, saveAdminPassword, DEFAULT_ADMIN_PASSWORD } from '../utils/storage';

interface AdminSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (msg: string) => void;
}

export const AdminSettingsModal: React.FC<AdminSettingsModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const currentPassword = getAdminPassword();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (oldPassword.trim() !== currentPassword.trim()) {
      setError('বর্তমান পাসওয়ার্ড সঠিক নয়!');
      return;
    }
    if (!newPassword.trim() || newPassword.length < 3) {
      setError('নতুন পাসওয়ার্ড কমপক্ষে ৩ অক্ষরের হতে হবে।');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('নতুন পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড মেলেনি!');
      return;
    }

    saveAdminPassword(newPassword.trim());
    onSuccess('অ্যাডমিন পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে!');
    onClose();
  };

  const handleResetToDefault = () => {
    if (window.confirm('পাসওয়ার্ডটি ডিফল্ট পাসওয়ার্ডে রিস্টোর করতে চান?')) {
      saveAdminPassword(DEFAULT_ADMIN_PASSWORD);
      onSuccess('অ্যাডমিন পাসওয়ার্ড ডিফল্টে রিস্টোর করা হয়েছে!');
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-800">
            <div className="p-2 bg-slate-100 rounded-xl">
              <KeyRound className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">অ্যাডমিন পাসওয়ার্ড পরিবর্তন</h3>
              <p className="text-xs text-slate-500">আপনার অ্যাডমিন পাসওয়ার্ড পরিবর্তন করুন</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              বর্তমান পাসওয়ার্ড
            </label>
            <input
              type={showPwd ? 'text' : 'password'}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="বর্তমান পাসওয়ার্ড লিখুন"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-200"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              নতুন পাসওয়ার্ড
            </label>
            <input
              type={showPwd ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="নতুন পাসওয়ার্ড লিখুন"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-200"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              নতুন পাসওয়ার্ড নিশ্চিত করুন
            </label>
            <input
              type={showPwd ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="নতুন পাসওয়ার্ডটি পুনরায় লিখুন"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-200"
              required
            />
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <button
              type="button"
              onClick={() => setShowPwd(!showPwd)}
              className="text-slate-500 hover:text-slate-800 flex items-center gap-1"
            >
              {showPwd ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showPwd ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখুন'}</span>
            </button>

            <button
              type="button"
              onClick={handleResetToDefault}
              className="text-red-600 hover:underline font-medium"
            >
              ডিফল্ট পাসওয়ার্ডে রিসেট
            </button>
          </div>

          {error && (
            <p className="text-xs font-semibold text-red-600 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
              <span>{error}</span>
            </p>
          )}

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs transition"
            >
              <Check className="w-4 h-4" />
              <span>সংরক্ষণ করুন</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
