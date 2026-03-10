import React from 'react';
import { Lightbulb } from 'lucide-react';
import { CriticalThinkingActivity } from '../../types';

interface Props {
  data: CriticalThinkingActivity;
  className?: string;
}

export const CriticalThinkingExtension: React.FC<Props> = ({ data, className = '' }) => {
  if (!data || !data.instructions || data.instructions.length === 0) return null;

  return (
    <section className={`bg-amber-50 p-4 sm:p-6 rounded-2xl border border-amber-200 mb-4 animate-fade-in ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-amber-100 p-2 rounded-xl">
          <Lightbulb className="w-6 h-6 text-amber-600" />
        </div>
        <h2 className="text-xl font-black text-amber-900 uppercase tracking-tight">
          {data.title || 'Critical Thinking & Discussion'}
        </h2>
      </div>

      <div className="space-y-4">
        {data.instructions.map((instruction, index) => (
          <div key={index} className="flex gap-4 items-start">
            <span className="shrink-0 w-8 h-8 bg-white border-2 border-amber-100 rounded-full flex items-center justify-center font-bold text-amber-700 shadow-sm">
              {index + 1}
            </span>
            <p className="text-amber-800 text-lg leading-relaxed pt-0.5">
              {instruction}
            </p>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-6 border-t border-amber-200/50 flex items-center gap-2 text-amber-600/70 text-sm font-medium italic">
        <Lightbulb className="w-4 h-4" />
        <span>Use these questions for personal reflection or group discussion. No answers required!</span>
      </div>
    </section>
  );
};
