import React, { ReactNode } from 'react';
import { HelpCircle } from 'lucide-react';
import { AudioControls } from '../UI/AudioControls';
import { TranslateButton } from '../UI/TranslateButton';
import { speakText } from '../../utils/textUtils';

interface ReadingPassageProps {
  text: string;
  language: string;
  title?: string;
  vocabularyExplanations?: Record<string, string>;
  
  // Audio Controls Props
  onVoiceOpen?: () => void;
  onSlowToggle: () => void;
  onListenToggle: () => void;
  ttsStatus: 'playing' | 'paused' | 'stopped';
  currentRate: number;
  hasVoices: boolean;
  
  // Optional Translate
  onTranslate?: () => void;
  
  // UI Options
  showHighlightHelp?: boolean;
  className?: string;
  passageRef?: React.RefObject<HTMLDivElement>;
}

export const ReadingPassage: React.FC<ReadingPassageProps> = ({
  text,
  language,
  title = "Reading Passage",
  vocabularyExplanations = {},
  onVoiceOpen,
  onSlowToggle,
  onListenToggle,
  ttsStatus,
  currentRate,
  hasVoices,
  onTranslate,
  showHighlightHelp = false,
  className = "",
  passageRef,
}) => {
  const handleWordClick = (word: string) => {
    const cleanWord = word.replace(/^[.,!?;:"'()\[\]{}]+|[.,!?;:"'()\[\]{}]+$/g, '');
    if (cleanWord) {
      speakText(cleanWord, language, 0.7);
    }
  };

  const renderTextWithVocabulary = () => {
    if (!text) return null;

    // Normalize to NFC to ensure consistent character representation
    const normalizedText = text.normalize('NFC');
    const normalizedExplanations: Record<string, string> = {};
    Object.entries(vocabularyExplanations).forEach(([key, value]) => {
      normalizedExplanations[key.normalize('NFC').toLowerCase()] = value;
    });

    // For Thai, we pre-calculate word boundaries using Intl.Segmenter
    const breakPositions = new Set<number>([0, normalizedText.length]);
    if (language === 'Thai' && typeof (Intl as any).Segmenter === 'function') {
      const segmenter = new (Intl as any).Segmenter('th', { granularity: 'word' });
      const segments = Array.from(segmenter.segment(normalizedText));
      segments.forEach((s: any) => {
        breakPositions.add(s.index);
        breakPositions.add(s.index + s.segment.length);
      });
    }

    const sortedKeys = Object.keys(normalizedExplanations).sort((a, b) => b.length - a.length);
    
    // Function to render clickable segments for regular text
    const renderClickableSegments = (textSegment: string, segmentKeyPrefix: string) => {
      // Use Intl.Segmenter for Thai to handle word boundaries without spaces
      if (language === 'Thai' && typeof (Intl as any).Segmenter === 'function') {
        const segmenter = new (Intl as any).Segmenter('th', { granularity: 'word' });
        const segments = Array.from(segmenter.segment(textSegment));
        
        return segments.map((s: any, j: number) => {
          if (!s.isWordLike) return <span key={`${segmentKeyPrefix}-th-${j}`}>{s.segment}</span>;
          
          return (
            <span
              key={`${segmentKeyPrefix}-th-${j}`}
              onClick={() => handleWordClick(s.segment)}
              className="cursor-pointer hover:text-green-600 hover:bg-green-50 rounded px-0.5 transition-colors"
            >
              {s.segment}
            </span>
          );
        });
      }

      const wordsAndSpaces = textSegment.split(/(\s+)/);
      return wordsAndSpaces.map((subPart, j) => {
        if (/^\s+$/.test(subPart)) return subPart;
        
        // Split by punctuation for sub-segments
        const subSegments = subPart.split(/([.,!?;:"'()\[\]{}]+)/).filter(Boolean);
        return (
          <React.Fragment key={`${segmentKeyPrefix}-${j}`}>
            {subSegments.map((sub, k) => {
              if (/^[.,!?;:"'()\[\]{}]+$/.test(sub)) {
                return <span key={k}>{sub}</span>;
              }
              return (
                <span
                  key={k}
                  onClick={() => handleWordClick(sub)}
                  className="cursor-pointer hover:text-green-600 hover:bg-green-50 rounded px-0.5 transition-colors"
                >
                  {sub}
                </span>
              );
            })}
          </React.Fragment>
        );
      });
    };

    if (sortedKeys.length === 0) return renderClickableSegments(normalizedText, "plain");

    // Create regex for vocabulary words
    const escapedKeys = sortedKeys.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    const regex = new RegExp(`(${escapedKeys})`, 'gui');

    const result: ReactNode[] = [];
    let lastIndex = 0;
    
    let match;
    while ((match = regex.exec(normalizedText)) !== null) {
      const start = match.index;
      const word = match[0];
      const end = start + word.length;

      // Verify word boundaries
      let isWordBoundaryBefore = false;
      let isWordBoundaryAfter = false;

      if (language === 'Thai' && breakPositions.size > 2) {
        isWordBoundaryBefore = breakPositions.has(start);
        isWordBoundaryAfter = breakPositions.has(end);
      } else {
        const charBefore = start > 0 ? normalizedText[start - 1] : '';
        const charAfter = end < normalizedText.length ? normalizedText[end] : '';
        isWordBoundaryBefore = !charBefore || !/[\p{L}\p{N}]/u.test(charBefore);
        isWordBoundaryAfter = !charAfter || !/[\p{L}\p{N}]/u.test(charAfter);
      }

      if (isWordBoundaryBefore && isWordBoundaryAfter) {
        // Add preceding text as clickable segments
        if (start > lastIndex) {
          result.push(...(renderClickableSegments(normalizedText.substring(lastIndex, start), `text-${start}`) as ReactNode[]));
        }

        // Add highlighted vocabulary word
        result.push(
          <span key={`vocab-${start}`} className="inline-block">
            <span 
              onClick={() => handleWordClick(word)}
              className="cursor-pointer font-bold text-green-700 border-b-2 border-dotted border-green-400 hover:bg-green-50 px-0.5 rounded transition-all"
            >
              {word}
            </span>
          </span>
        );
        lastIndex = end;
      }
    }

    // Add remaining text as clickable segments
    if (lastIndex < normalizedText.length) {
      result.push(...(renderClickableSegments(normalizedText.substring(lastIndex), `final`) as ReactNode[]));
    }

    return result;
  };

  return (
    <section className={`bg-white p-2 rounded-xl sm:shadow-sm sm:border sm:border-green-100 mb-4 ${className}`}>
      <div className="bg-white border-b border-green-100 p-4 flex justify-between items-center text-green-900 sm:rounded-t-xl">
        <div translate="no">
          <h2 className="text-xl font-bold uppercase tracking-tight">{title}</h2>
        </div>
        
        <div className="flex gap-2">
          {onTranslate && <TranslateButton onClick={onTranslate} />}
          <AudioControls 
            onVoiceOpen={onVoiceOpen}
            onSlowToggle={onSlowToggle}
            onListenToggle={onListenToggle}
            ttsStatus={ttsStatus}
            currentRate={currentRate}
            hasVoices={hasVoices}
          />
        </div>
      </div>

      <div className="p-1 mx-1 sm:p-4">
        <div
          ref={passageRef}
          className="prose max-w-none text-lg leading-relaxed text-gray-800 bg-transparent p-0 sm:bg-gray-50 sm:p-6 rounded-lg sm:border sm:border-gray-100"
          translate="no"
        >
          {renderTextWithVocabulary()}
        </div>
        
        {showHighlightHelp && Object.keys(vocabularyExplanations).length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 text-green-600 font-bold italic">
            <HelpCircle className="w-5 h-5" />
            <span>Highlighted words are in the vocabulary activity below!</span>
          </div>
        )}
      </div>
    </section>
  );
};
