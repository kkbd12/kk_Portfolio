import React from 'react';
import { MapPin, X, Home } from 'lucide-react';

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  addressText: string;
  closeText: string;
}

export const AddressModal: React.FC<AddressModalProps> = ({
  isOpen,
  onClose,
  title,
  addressText,
  closeText,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-red-600">
            <Home className="w-5 h-5" />
            <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-start gap-3">
          <MapPin className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <p className="text-sm sm:text-base text-slate-700 whitespace-pre-line leading-relaxed">
            {addressText}
          </p>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-semibold transition"
          >
            {closeText}
          </button>
        </div>
      </div>
    </div>
  );
};
