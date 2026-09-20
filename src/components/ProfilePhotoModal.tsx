import React, { useState, useRef } from 'react';
import { X, Camera, Check, Link as LinkIcon } from 'lucide-react';
import { optimizeImageFile } from '../utils/storage';

interface ProfilePhotoModalProps {
  isOpen: boolean;
  currentPhoto: string;
  onClose: () => void;
  onSave: (newPhotoUrl: string) => void;
  title: string;
  saveBtnText: string;
  cancelBtnText: string;
}

export const ProfilePhotoModal: React.FC<ProfilePhotoModalProps> = ({
  isOpen,
  currentPhoto,
  onClose,
  onSave,
  title,
  saveBtnText,
  cancelBtnText,
}) => {
  const [photoUrl, setPhotoUrl] = useState<string>(currentPhoto);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    try {
      setIsProcessing(true);
      const compressed = await optimizeImageFile(file, 600, 0.9);
      setPhotoUrl(compressed);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSave = () => {
    if (photoUrl.trim()) {
      onSave(photoUrl.trim());
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current / Preview Image */}
        <div className="text-center space-y-3">
          <div className="relative inline-block">
            <img
              src={photoUrl}
              alt="Profile Preview"
              className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-white shadow-xl ring-4 ring-red-400"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://i.imgur.com/Ml4A0jp.jpeg';
              }}
            />
          </div>

          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileChange(e.target.files[0]);
                }
              }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl border border-red-200 transition cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>{isProcessing ? 'ছবি লোড হচ্ছে...' : 'ডিভাইস থেকে নতুন ছবি বাছুন'}</span>
            </button>
          </div>
        </div>

        {/* Image URL Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <LinkIcon className="w-3.5 h-3.5 text-slate-400" />
            <span>অথবা ছবির সরাসরি লিংক পেস্ট করুন:</span>
          </label>
          <input
            type="url"
            value={photoUrl.startsWith('data:') ? '' : photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            placeholder="https://i.imgur.com/..."
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
          >
            {cancelBtnText}
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs transition"
          >
            <Check className="w-4 h-4" />
            <span>{saveBtnText}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
