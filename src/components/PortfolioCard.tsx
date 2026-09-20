import React from 'react';
import { Trash2, Calendar, Tag, ArrowRight } from 'lucide-react';
import { PortfolioItem } from '../types';

interface PortfolioCardProps {
  item: PortfolioItem;
  title: string;
  onClick: () => void;
  onDelete?: (id: string, e: React.MouseEvent) => void;
}

export const PortfolioCard: React.FC<PortfolioCardProps> = ({
  item,
  title,
  onClick,
  onDelete,
}) => {
  return (
    <div
      id={`portfolio-card-${item.id}`}
      className="group relative rounded-2xl overflow-hidden bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between cursor-pointer"
      onClick={onClick}
    >
      {/* Card Image Container */}
      <div className="relative w-full aspect-[7/10] overflow-hidden bg-slate-100">
        <img
          src={item.imageSrc}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            // fallback placeholder if broken
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?auto=format&fit=crop&w=600&q=80';
          }}
        />

        {/* Subtle overlay gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Top Badges (Category & Date / Custom) */}
        <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between gap-1 pointer-events-none">
          {item.category && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/75 backdrop-blur-xs text-white text-[11px] font-medium shadow-xs">
              <Tag className="w-2.5 h-2.5 text-red-400" />
              <span>{item.category}</span>
            </span>
          )}

          {item.date && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xs text-slate-800 text-[11px] font-medium shadow-xs ml-auto">
              <Calendar className="w-2.5 h-2.5 text-slate-500" />
              <span>{item.date}</span>
            </span>
          )}
        </div>

        {/* Delete button if custom upload */}
        {item.isCustom && onDelete && (
          <button
            id={`delete-btn-${item.id}`}
            onClick={(e) => onDelete(item.id, e)}
            title="মুছে ফেলুন / Delete photo"
            className="absolute bottom-2 right-2 p-2 rounded-lg bg-rose-600/90 text-white shadow-md hover:bg-rose-700 active:scale-95 transition-all opacity-90 group-hover:opacity-100 cursor-pointer"
            aria-label="Delete photo"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Card Footer with Title & Red Arrow */}
      <div className="p-3.5 bg-slate-50/80 group-hover:bg-red-50/70 transition-colors duration-200 border-t border-slate-200/80 text-center">
        <p className="text-sm sm:text-base font-bold text-slate-800 group-hover:text-red-600 transition-colors flex items-center justify-center gap-2">
          <span className="line-clamp-1">{title}</span>
          <ArrowRight className="w-4 h-4 text-red-600 transform group-hover:translate-x-1 transition-transform" />
        </p>
      </div>
    </div>
  );
};
