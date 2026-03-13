import React, { ReactNode, useState, useRef, useEffect } from 'react';
import { HelpCircle, X, BookOpen, Volume2, Turtle } from 'lucide-react';
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
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [definitionData, setDefinitionData] = useState<{ type: 'dictionary' | 'translation' | 'google-search', content: any } | null>(null);
  const [isFetchingDefinition, setIsFetchingDefinition] = useState(false);
  const selectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const getLanguageCode = (lang: string) => {
    const map: Record<string, string> = {
      'english': 'en',
      'spanish': 'es',
      'french': 'fr',
      'german': 'de',
      'thai': 'th'
    };
    // Include others but map to en by default for safety, or return short code.
    return map[lang.toLowerCase()] || 'en';
  };

  const fetchWordData = async (word: string, langCode: string) => {
    try {
      // 1. Try the Multilingual Dictionary first
      const dictUrl = `https://freedictionaryapi.com/api/v1/entries/${langCode}/${encodeURIComponent(word)}`;
      const response = await fetch(dictUrl);
      
      if (response.ok) {
        const data = await response.json();
        const hasEntries = data && typeof data === 'object' && data.entries && data.entries.length > 0;
        const hasMeanings = Array.isArray(data) && data[0]?.meanings?.length > 0;
        
        if (hasEntries || hasMeanings) {
          return { type: 'dictionary', content: data };
        }
      }

      // 2. Fallback to Google Search logic if dictionary entry is missing
      return { type: 'google-search', content: word };
      
    } catch (error) {
      console.error("Lookup failed", error);
      return null;
    }
  };

  const fetchDefinition = async (word: string) => {
    setIsFetchingDefinition(true);
    setDefinitionData(null);
    try {
      const langCode = getLanguageCode(language);
      const data = await fetchWordData(word, langCode);
      if (data) {
        // For phrases (usually detected if word contains spaces), we go to Google Translate
        const isPhrase = word.trim().split(/\s+/).length > 1;
        
        if (data.type === 'google-search' || isPhrase) {
          const baseUrl = isPhrase 
            ? `https://translate.google.com/?sl=${langCode}&tl=en&text=${encodeURIComponent(word)}&op=translate`
            : `https://www.google.com/search?q=define+${encodeURIComponent(word)}`;
          
          window.open(baseUrl, '_blank');
          setSelectedWord(null); 
          return;
        }
        setDefinitionData(data as any);
      }
    } finally {
      setIsFetchingDefinition(false);
    }
  };
  
  useEffect(() => {
    const handleSelectionChange = () => {
      if (selectionTimeoutRef.current) {
        clearTimeout(selectionTimeoutRef.current);
      }

      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) return;

      const selectedText = selection.toString().trim();
      if (selectedText && selectedText.split(/\s+/).length > 1) {
        // Only trigger for phrases (2+ words)
        selectionTimeoutRef.current = setTimeout(() => {
          const cleanPhrase = selectedText.replace(/^[.,!?;:"'()\[\]{}]+|[.,!?;:"'()\[\]{}]+$/g, '');
          if (cleanPhrase) {
            setSelectedWord(cleanPhrase);
            setDefinitionData(null);
          }
        }, 500);
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
      if (selectionTimeoutRef.current) {
        clearTimeout(selectionTimeoutRef.current);
      }
    };
  }, [language]);

  const handleWordClick = (word: string) => {
    const cleanWord = word.replace(/^[.,!?;:"'()\[\]{}]+|[.,!?;:"'()\[\]{}]+$/g, '');
    if (cleanWord) {
      speakText(cleanWord, language, 0.7);
      setSelectedWord(cleanWord);
      setDefinitionData(null);
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
              className="cursor-pointer hover:text-green-600 hover:bg-green-50 transition-colors"
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
                  className="cursor-pointer hover:text-green-600 hover:bg-green-50 transition-colors"
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
          <span key={`vocab-${start}`}>
            <span 
              onClick={() => handleWordClick(word)}
              className="cursor-pointer border-b-2 border-dotted font-semibold border-green-600 hover:bg-green-50 px-0 rounded transition-all"
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
    <section className={`bg-white p-1 sm:p-2 rounded-xl sm:shadow-sm sm:border sm:border-gray-100 mb-2 relative ${className}`}>
      <div className="flex justify-between items-center mb-2 px-1">
        <div translate="no">
          <h2 className="text-xl font-black text-green-900 uppercase tracking-tight">{title}</h2>
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

      <p className="text-gray-500 mb-4 text-xs sm:text-sm font-medium px-1">Read the text carefully. Tap any word to hear its pronunciation.</p>

      <div className="mx-0">
        <div
          ref={passageRef}
          className="max-w-none justify-baseline text-lg leading-relaxed text-gray-800 bg-transparent whitespace-pre-wrap select-text"
          translate="no"
        >
          {renderTextWithVocabulary()}
        </div>
        
        {showHighlightHelp && Object.keys(vocabularyExplanations).length > 0 && (
          <div className="prose mt-4 pt-4 border-t text-green-700 flex items-center gap-2 font-bold italic">
            <HelpCircle className="w-5 h-5" />
            <span>Underlined words are in the vocabulary activity below!</span>
          </div>
        )}
      </div>

      {selectedWord && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-gray-900 border border-gray-700 text-white px-4 py-4 rounded-xl flex flex-col gap-3 z-50 text-sm w-[90vw] sm:w-[400px] shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
          <div className="flex justify-between items-center border-b border-gray-700 pb-2">
            <div className="flex items-center gap-3">
              <span className="font-bold text-lg text-blue-400 capitalize">{selectedWord}</span>
              <div className="border-l border-gray-600 pl-3">
                <AudioControls 
                  onSlowToggle={() => speakText(selectedWord, language, 0.5)}
                  onListenToggle={() => speakText(selectedWord, language, 1.0)}
                  ttsStatus={ttsStatus}
                  currentRate={currentRate}
                  variant="dark"
                  className="scale-90 origin-left"
                />
              </div>
            </div>
            <button 
              onClick={() => setSelectedWord(null)} 
              className="text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 p-1.5 rounded-full transition-colors ml-2"
            >
              <X size={16} />
            </button>
          </div>
          
          {!definitionData && !isFetchingDefinition && (
            <button 
              onClick={() => fetchDefinition(selectedWord)}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-colors w-full sm:w-auto self-start shadow-sm"
            >
              <BookOpen size={16} />
              Translate / Dictionary
            </button>
          )}
          
          {isFetchingDefinition && (
            <div className="flex items-center gap-2 text-gray-400 py-2">
              <div className="w-4 h-4 rounded-full border-2 border-t-blue-500 border-gray-600 animate-spin"></div>
              <span>Searching...</span>
            </div>
          )}
          
          {definitionData && (
            <div className="text-gray-200 text-base leading-relaxed max-h-[150px] overflow-y-auto pr-2">
              {definitionData.type === 'dictionary' && definitionData.content && definitionData.content.entries && definitionData.content.entries.length > 0 ? (
                <div>
                  <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-gray-800 text-blue-300 mb-2 uppercase tracking-wider">
                    {definitionData.content.entries[0].partOfSpeech || 'Unknown Type'}
                  </span>
                  <p>{definitionData.content.entries[0].senses?.[0]?.definition || 'Definition missing.'}</p>
                </div>
              ) : definitionData.type === 'dictionary' && definitionData.content && definitionData.content[0]?.meanings ? (
                /* Fallback for the older Dictionary API format just in case */
                <div>
                  <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-gray-800 text-blue-300 mb-2 uppercase tracking-wider">
                    {definitionData.content[0].meanings[0]?.partOfSpeech || 'Unknown Type'}
                  </span>
                  <p>{definitionData.content[0].meanings[0]?.definitions?.[0]?.definition || 'Definition missing.'}</p>
                </div>
              ) : (
                <div>
                  <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-gray-800 text-emerald-300 mb-2 uppercase tracking-wider">
                    Translation
                  </span>
                  <p>{typeof definitionData.content === 'string' ? definitionData.content : 'Search result available.'}</p>
                </div>
              )}
            </div>
          )}

          {definitionData && (
            <div className="pt-2 border-t border-gray-700 mt-1 flex justify-end">
              <a 
                href={selectedWord.trim().split(/\s+/).length > 1 
                  ? `https://translate.google.com/?sl=${getLanguageCode(language)}&tl=en&text=${encodeURIComponent(selectedWord)}&op=translate` 
                  : `https://www.google.com/search?q=define+${encodeURIComponent(selectedWord)}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
              >
                {selectedWord.trim().split(/\s+/).length > 1 ? 'Translate on Google ↗' : 'Search on Google ↗'}
              </a>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
