import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';

interface CollapsibleActivityProps {
  isCompleted: boolean;
  title: string;
  children: React.ReactNode;
  score?: string;
}

export const CollapsibleActivity: React.FC<CollapsibleActivityProps> = ({
  isCompleted,
  title,
  children,
  score
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hasAutoCollapsed, setHasAutoCollapsed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastHeightRef = useRef<number>(0);
  const isAdjustingRef = useRef<boolean>(false);

  useEffect(() => {
    if (!isCompleted) {
      setIsCollapsed(false);
      setHasAutoCollapsed(false);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Only auto-collapse if it moves out of view at the top 
        // AND we haven't auto-collapsed it yet (to allow manual expansion)
        if (!entry.isIntersecting && entry.boundingClientRect.top < 0 && !hasAutoCollapsed) {
          if (containerRef.current) {
            lastHeightRef.current = containerRef.current.offsetHeight;
            isAdjustingRef.current = true;
          }
          setIsCollapsed(true);
          setHasAutoCollapsed(true);
        }
      },
      { threshold: 0 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [isCompleted, hasAutoCollapsed]);

  // Handle scroll compensation to prevent "jerking" when height changes above viewport
  React.useLayoutEffect(() => {
    if (lastHeightRef.current && containerRef.current && isAdjustingRef.current) {
      const newHeight = containerRef.current.offsetHeight;
      const delta = lastHeightRef.current - newHeight;
      const rect = containerRef.current.getBoundingClientRect();
      
      // We only care if the element's top is above or near the top of the viewport
      if (delta !== 0 && rect.top < 100) {
        // Use requestAnimationFrame to ensure the scroll happens after layout but before paint
        requestAnimationFrame(() => {
          window.scrollBy({
            top: -delta,
            behavior: 'instant'
          } as ScrollToOptions);
        });
      }
      
      lastHeightRef.current = 0;
      isAdjustingRef.current = false;
    }
  }, [isCollapsed]);

  const handleToggle = (collapsed: boolean) => {
    if (containerRef.current) {
      lastHeightRef.current = containerRef.current.offsetHeight;
      isAdjustingRef.current = true;
    }
    setIsCollapsed(collapsed);
  };

  if (!isCollapsed) {
    return (
      <div 
        ref={containerRef} 
        className="mb-2 animate-fade-in group relative"
        style={{ overflowAnchor: isAdjustingRef.current ? 'none' : 'auto' }}
      >
        <button 
          className="w-full justify-end px-0 py-1 mb-1 rounded-md text-[10px] font-bold text-gray-400 uppercase tracking-tighter hover:text-green-600 transition-colors flex items-center gap-1"
          onClick={() => handleToggle(true)}
        >
          <span>Collapse</span>
          <ChevronUp className="w-3 h-3" />
        </button>
        {children}
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="bg-white p-3 mb-2 md:p-4 rounded-xl border border-green-50 shadow-sm flex items-center justify-between animate-fade-in group cursor-pointer hover:bg-green-50 transition-colors"
      onClick={() => handleToggle(false)}
      style={{ overflowAnchor: isAdjustingRef.current ? 'none' : 'auto' }}
    >
      <div className="flex items-center gap-3">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${isCompleted ? 'bg-green-100' : 'bg-gray-100'}`}>
          <CheckCircle2 className={`w-5 h-5 ${isCompleted ? 'text-green-600' : 'text-gray-300'}`} />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-sm md:text-base">{title}</h3>
          <p className="text-[10px] md:text-xs text-gray-500 font-medium">
            {isCompleted ? `Activity completed ${score ? `• Score: ${score}` : ''}` : 'Activity in progress'}
          </p>
        </div>
      </div>
      
      <button className="p-2 text-gray-400 group-hover:text-green-600 transition-colors">
        <div className="flex items-center gap-1 text-xs md:text-sm font-bold uppercase tracking-tighter">
          <span>Expand</span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </button>
    </div>
  );
};
