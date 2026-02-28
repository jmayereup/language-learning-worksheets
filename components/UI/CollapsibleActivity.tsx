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
  const isAutoRef = useRef<boolean>(false);

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
            isAutoRef.current = true;
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

  // Handle scroll compensation to prevent "jerking" when collapsing content above viewport
  React.useLayoutEffect(() => {
    if (isCollapsed && lastHeightRef.current && containerRef.current && isAutoRef.current) {
      const newHeight = containerRef.current.offsetHeight;
      const delta = lastHeightRef.current - newHeight;
      if (delta > 0) {
        // We only care if the element is above the viewport 
        // (which it should be based on our IntersectionObserver logic)
        window.scrollBy(0, -delta);
      }
      lastHeightRef.current = 0;
      isAutoRef.current = false;
    }
  }, [isCollapsed]);

  if (!isCollapsed) {
    return (
      <div ref={containerRef} className="mb-2 animate-fade-in group relative">
        <button 
          className="w-full justify-end px-0 py-1 mb-1 rounded-md text-[10px] font-bold text-gray-400 uppercase tracking-tighter hover:text-green-600 transition-colors flex items-center gap-1"
          onClick={() => setIsCollapsed(true)}
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
      onClick={() => setIsCollapsed(false)}
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
