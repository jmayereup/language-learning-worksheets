import React from 'react';
import { VocabularyItem, Definition } from '../../types';

interface VocabularyListProps {
  items: VocabularyItem[];
  definitions: Definition[];
  toggleTTS: (rate: number, overrideText?: string) => void;
}

export const VocabularyList: React.FC<VocabularyListProps> = ({ items, definitions, toggleTTS }) => {
  return (
    <div className="tj-vocab-list space-y-2">
      <p className="text-gray-500 mb-1 text-sm font-medium italic">Review the vocabulary words. Tap a word to hear it.</p>
      <div className="grid grid-cols-1 border-gray-600 pt-2 text-gray-800">
        {items.map((item, idx) => {
          const def = definitions.find(d => d.id === item.answer);
          return (
            <div 
              key={idx} 
              onClick={() => toggleTTS(.6, item.label)}
              className="flex items-start gap-1 px-3 hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-200 cursor-pointer rounded-r-xl group odd:bg-indigo-50"
            >
              <div className="flex-1 min-w-0">
                <div className="flex flex-row gap-2 mb-0.5 justify-start">
                  <div className="font-semibold transition-colors py-1" translate="no">
                    {item.label}:  <span className="font-normal"> {def?.text}</span> 
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
