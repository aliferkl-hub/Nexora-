import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ContentItem } from '../../types';
import { ContentCard } from './ContentCard';

interface ContentSectionProps {
  title: string;
  subtitle?: string;
  items: ContentItem[];
  viewAllAction?: () => void;
}

export const ContentSection: React.FC<ContentSectionProps> = ({
  title,
  subtitle,
  items,
  viewAllAction,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    const offset = direction === 'left' ? -clientWidth * 0.75 : clientWidth * 0.75;
    scrollRef.current.scrollTo({
      left: scrollLeft + offset,
      behavior: 'smooth',
    });
  };

  if (!items || items.length === 0) return null;

  return (
    <section className="w-full py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-end justify-between mb-4 sm:mb-6">
          <div>
            <h2 className="font-display font-bold text-xl sm:text-2xl text-white tracking-wide">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                {subtitle}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {viewAllAction && (
              <button
                onClick={viewAllAction}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-medium mr-2 cursor-pointer transition-colors"
              >
                Ver todos
              </button>
            )}
            
            <button
              onClick={() => scroll('left')}
              className="p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Rolar para esquerda"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Rolar para direita"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Horizontal Carousel Track */}
        <div
          ref={scrollRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar pb-3 scroll-smooth snap-x snap-mandatory"
        >
          {items.map((item) => (
            <div
              key={item.id}
              className="w-[260px] sm:w-[300px] shrink-0 snap-start"
            >
              <ContentCard content={item} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
