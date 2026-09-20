import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  Image as ImageIcon,
  Calendar,
  Tag,
  FileText,
  Link as LinkIcon,
  Check,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { PortfolioItem } from '../types';
import { optimizeImageFile } from '../utils/storage';

interface PhotoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePhoto: (item: PortfolioItem) => void;
  onSetProfilePhoto?: (imgUrl: string) => void;
}

const CATEGORY_SUGGESTIONS = [
  'মৎস্য উদ্যোগ',
  'পশুপালন ও রাখাল',
  'গরু ব্যবসা ও খামার',
  'কৃষি ও ফসল',
  'সমাজসেবা ও ফান্ডরাইজিং',
  'কাঠমিস্ত্রি ও হস্তশিল্প',
  'নির্মাণ কাজ',
  'খাদ্য ও ব্যবসা',
  'সাহিত্য ও ব্লগিং',
  'অন্যান্য',
];

export const PhotoUploadModal: React.FC<PhotoUploadModalProps> = ({
  isOpen,
  onClose,
  onSavePhoto,
  onSetProfilePhoto,
}) => {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<string>('মৎস্য উদ্যোগ');
  const [date, setDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [description, setDescription] = useState<string>('');
  const [isProfilePhoto, setIsProfilePhoto] = useState<boolean>(false);

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('অনুগ্রহ করে একটি সঠিক ছবির ফাইল (JPG, PNG, WEBP) নির্বাচন করুন।');
      return;
    }

    try {
      setIsProcessing(true);
      setErrorMsg('');
      const compressedDataUrl = await optimizeImageFile(file);
      setImageSrc(compressedDataUrl);
    } catch (err) {
      console.error(err);
      setErrorMsg('ছবি প্রসেস করতে ব্যর্থ হয়েছে। অনুগ্রহ করে অন্য ছবি নির্বাচন করুন।');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageSrc.trim()) {
      setErrorMsg('অনুগ্রহ করে একটি ছবি আপলোড করুন অথবা ছবির লিংক প্রদান করুন।');
      return;
    }

    if (!title.trim() && !isProfilePhoto) {
      setErrorMsg('অনুগ্রহ করে ছবির একটি শিরোনাম বা কাজের নাম লিখুন।');
      return;
    }

    if (isProfilePhoto && onSetProfilePhoto) {
      onSetProfilePhoto(imageSrc);
      onClose();
      return;
    }

    const newItem: PortfolioItem = {
      id: `custom_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      imageSrc,
      customTitle: title.trim(),
      customDescription: description.trim() || `${title} সম্পর্কিত কাজের বাস্তব ছবি ও অভিজ্ঞতা।`,
      category: category.trim(),
      date: date.trim(),
      isCustom: true,
      createdAt: Date.now(),
    };

    onSavePhoto(newItem);

    // Reset form
    setImageSrc('');
    setTitle('');
    setDescription('');
    setErrorMsg('');
    onClose();
  };

  return (
    <div
      id="photo-upload-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="photo-upload-modal-container"
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 backdrop-blur-xs rounded-xl">
              <Upload className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-tight">
                নতুন কাজের ছবি যোগ করুন
              </h3>
              <p className="text-xs text-red-100">
                সহজে যেকোনো কাজের ছবি, তারিখ ও বিবরণ আপলোড করুন
              </p>
            </div>
          </div>
          <button
            id="close-upload-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Error Message if any */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2.5 text-rose-700 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Image Upload Zone */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">
              ছবি নির্বাচন করুন (Image Upload) *
            </label>

            {imageSrc ? (
              <div className="relative rounded-2xl border-2 border-dashed border-red-300 bg-red-50/40 p-4 text-center">
                <div className="relative max-w-xs mx-auto aspect-[4/5] rounded-xl overflow-hidden shadow-md bg-slate-900">
                  <img
                    src={imageSrc}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setImageSrc('')}
                    className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full shadow hover:bg-red-700 transition"
                    title="ছবি পরিবর্তন করুন"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="mt-2 text-xs font-semibold text-emerald-700 flex items-center justify-center gap-1">
                  <Check className="w-3.5 h-3.5" /> ছবি সফলভাবে লোড হয়েছে!
                </p>
              </div>
            ) : (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-red-500 bg-red-50/70 scale-99'
                    : 'border-slate-300 hover:border-red-400 bg-slate-50/60 hover:bg-red-50/30'
                }`}
              >
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
                <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                  {isProcessing ? (
                    <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <ImageIcon className="w-7 h-7" />
                  )}
                </div>
                <p className="text-sm font-bold text-slate-800 mb-1">
                  এখানে ক্লিক করে ছবি নির্বাচন করুন বা টেনে এনে ড্রপ করুন
                </p>
                <p className="text-xs text-slate-500">
                  সাপোর্টেড ফরম্যাট: JPG, PNG, WEBP (মোবাইল ও ক্যামেরা থেকেও আপলোড করা যাবে)
                </p>
              </div>
            )}

            {/* Direct URL input alternative */}
            <div className="mt-3">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="url"
                    value={imageSrc.startsWith('data:') ? '' : imageSrc}
                    onChange={(e) => setImageSrc(e.target.value)}
                    placeholder="অথবা সরাসরি ছবির অনলাইন লিংক (URL) লিখুন..."
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Profile Picture Option */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <div>
                <p className="text-xs sm:text-sm font-bold text-slate-800">
                  এই ছবিটি কি প্রধান প্রোফাইল ছবি হিসেবে ব্যবহার করবেন?
                </p>
                <p className="text-[11px] text-slate-500">
                  টিক দিলে এটি পেজের শীর্ষে প্রোফাইল পিকচার হিসেবে সেট হবে
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              id="set-as-profile-checkbox"
              checked={isProfilePhoto}
              onChange={(e) => setIsProfilePhoto(e.target.checked)}
              className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500 cursor-pointer"
            />
          </div>

          {!isProfilePhoto && (
            <>
              {/* Title Input */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1.5 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-red-600" />
                  <span>ছবির শিরোনাম / পেশা *</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="যেমন: নতুন মাছের নার্সারি পুকুর পরিদর্শন"
                  className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                />
              </div>

              {/* Date & Category Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Date Input */}
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span>তারিখ (Date)</span>
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                  />
                </div>

                {/* Category Input */}
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1.5 flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-amber-500" />
                    <span>বিভাগ / ক্যাটাগরি</span>
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="ক্যাটাগরি লিখুন"
                    className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                  />
                </div>
              </div>

              {/* Quick Category Suggestion Chips */}
              <div>
                <span className="text-xs font-semibold text-slate-500 block mb-1.5">
                  দ্রুত ক্যাটাগরি নির্বাচন করুন:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORY_SUGGESTIONS.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`px-2.5 py-1 text-xs rounded-lg transition-all ${
                        category === cat
                          ? 'bg-red-600 text-white font-semibold shadow-2xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Detailed Description / Story */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                  কাজের বিস্তারিত বিবরণ (কার্ডে ক্লিক করলে প্রদর্শিত হবে)
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="এই কাজ, উদ্যোগ বা অভিজ্ঞতা সম্পর্কে কিছু তথ্য লিখুন..."
                  className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition resize-none"
                />
              </div>
            </>
          )}

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            >
              বাতিল
            </button>
            <button
              type="submit"
              id="submit-upload-photo-btn"
              disabled={isProcessing}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 active:scale-95 rounded-xl shadow-md transition disabled:opacity-50 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{isProfilePhoto ? 'প্রোফাইল ছবি হিসেবে সংরক্ষণ করুন' : 'ছবিটি পোর্টফোলিওতে যোগ করুন'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
