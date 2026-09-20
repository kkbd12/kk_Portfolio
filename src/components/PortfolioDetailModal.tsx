import React, { useEffect } from 'react';
import { X, Calendar, Tag, Trash2 } from 'lucide-react';
import { ModalData } from '../types';

interface PortfolioDetailModalProps {
  data: ModalData;
  onClose: () => void;
  closeButtonText: string;
  onDeleteCustom?: (id: string) => void;
}

export const PortfolioDetailModal: React.FC<PortfolioDetailModalProps> = ({
  data,
  onClose,
  closeButtonText,
  onDeleteCustom,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (data.isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [data.isOpen, onClose]);

  if (!data.isOpen) return null;

  return (
    <div
      id="dynamic-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/80 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Optional Image Banner if imageSrc is present */}
        {data.imageSrc && (
          <div className="relative w-full max-h-80 sm:max-h-96 bg-slate-950 overflow-hidden flex items-center justify-center">
            <img
              src={data.imageSrc}
              alt={data.title}
              className="w-full h-full max-h-80 sm:max-h-96 object-contain"
            />
            <div className="absolute top-3 right-3">
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3
              id="modal-title"
              className="text-xl sm:text-2xl font-bold text-red-600"
            >
              {data.title}
            </h3>
            <div className="flex flex-wrap items-center gap-2 mt-1.5">
              {data.category && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
                  <Tag className="w-3 h-3" />
                  <span>{data.category}</span>
                </span>
              )}
              {data.date && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                  <Calendar className="w-3 h-3 text-slate-500" />
                  <span>{data.date}</span>
                </span>
              )}
            </div>
          </div>

          {!data.imageSrc && (
            <button
              id="close-modal-btn"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 transition"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 text-slate-700 text-base leading-relaxed max-h-[50vh] overflow-y-auto space-y-4">
          <div
            id="modal-content"
            className="text-justify whitespace-pre-line leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: data.content
                ? data.content.replace(/\\n/g, '<br />').replace(/\n/g, '<br />')
                : '',
            }}
          />
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div>
            {data.itemId?.startsWith('custom_') && onDeleteCustom && (
              <button
                onClick={() => {
                  if (data.itemId && confirm('আপনি কি এই ছবিটি মুছে ফেলতে চান?')) {
                    onDeleteCustom(data.itemId);
                    onClose();
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>মুছে ফেলুন</span>
              </button>
            )}
          </div>

          <button
            id="close-modal-footer-btn"
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition shadow-sm cursor-pointer"
          >
            {closeButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};
