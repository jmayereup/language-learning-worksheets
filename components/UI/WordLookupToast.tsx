import React, { useState, useEffect } from 'react';
import { X, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { AudioControls } from './AudioControls';
import { speakText } from '../../utils/textUtils';

interface WordLookupToastProps {
  word: string;
  language: string;
  onClose: () => void;
  ttsStatus: 'playing' | 'paused' | 'stopped';
  currentRate: number;
}

export const WordLookupToast: React.FC<WordLookupToastProps> = ({
  word,
  language,
  onClose,
  ttsStatus,
  currentRate,
}) => {
  const [definitionData, setDefinitionData] = useState<{ type: 'dictionary' | 'translation' | 'google-search', content: any } | null>(null);
  const [isFetchingDefinition, setIsFetchingDefinition] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const getLanguageCode = (lang: string) => {
    const map: Record<string, string> = {
      'english': 'en',
      'spanish': 'es',
      'french': 'fr',
      'german': 'de',
      'thai': 'th'
    };
    return map[lang.toLowerCase()] || 'en';
  };

  const fetchWordData = async (wordToFetch: string, langCode: string) => {
    try {
      const dictUrl = `https://freedictionaryapi.com/api/v1/entries/${langCode}/${encodeURIComponent(wordToFetch)}`;
      const response = await fetch(dictUrl);
      
      if (response.ok) {
        const data = await response.json();
        // Check for both possible API structures
        const hasEntries = data && typeof data === 'object' && data.entries && data.entries.length > 0;
        const hasMeanings = Array.isArray(data) && data[0]?.meanings?.length > 0;
        
        if (hasEntries || hasMeanings) {
          return { type: 'dictionary', content: data };
        }
      }
      return { type: 'google-search', content: wordToFetch };
    } catch (error) {
      console.error("Lookup failed", error);
      return null;
    }
  };

  const fetchDefinition = async (wordToFetch: string) => {
    setIsFetchingDefinition(true);
    setDefinitionData(null);
    setIsExpanded(false);
    try {
      const langCode = getLanguageCode(language);
      const data = await fetchWordData(wordToFetch, langCode);
      if (data) {
        const isPhrase = wordToFetch.trim().split(/\s+/).length > 1;
        if (data.type === 'google-search' || isPhrase) {
          const baseUrl = isPhrase 
            ? `https://www.google.com/search?q=translate+${encodeURIComponent(wordToFetch)}`
            : `https://www.google.com/search?q=define+${encodeURIComponent(wordToFetch)}`;
          
          window.open(baseUrl, '_blank');
          onClose(); // Close toast when redirecting to Google
          return;
        }
        setDefinitionData(data as any);
      }
    } finally {
      setIsFetchingDefinition(false);
    }
  };

  useEffect(() => {
    // Reset state when word changes
    setDefinitionData(null);
    setIsExpanded(false);
    setIsFetchingDefinition(false);
  }, [word]);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 text-white z-50 text-sm w-full shadow-[0_-4px_20px_rgba(0,0,0,0.4)]">
      <div className="max-w-4xl mx-auto px-4 py-4 flex flex-col gap-3">
        <div className="flex justify-between items-center border-b border-gray-700 pb-2">
          <div className="flex items-center gap-3">
            <span className="font-bold text-lg text-blue-400 capitalize">{word}</span>
            <div className="border-l border-gray-600 pl-3">
              <AudioControls 
                onSlowToggle={() => speakText(word, language, 0.5)}
                onListenToggle={() => speakText(word, language, 1.0)}
                ttsStatus={ttsStatus}
                currentRate={currentRate}
                variant="dark"
                className="scale-90 origin-left"
              />
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 p-1.5 rounded-full transition-colors ml-2"
          >
            <X size={16} />
          </button>
        </div>
        
        {!definitionData && !isFetchingDefinition && (
          <button 
            onClick={() => fetchDefinition(word)}
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
          <div className="text-gray-200 text-base leading-relaxed">
            {definitionData.type === 'dictionary' && definitionData.content ? (
              <div className="flex flex-col gap-4">
                {(() => {
                  const entries = Array.isArray(definitionData.content) 
                    ? definitionData.content 
                    : (definitionData.content.entries || []);
                  
                  if (entries.length === 0) return <p>Definition missing.</p>;
  
                  const allMeanings = entries.flatMap((entry: any) => {
                    if (entry.meanings) {
                      return entry.meanings.map((m: any) => ({ ...m, word: entry.word || word }));
                    } 
                    if (entry.senses) {
                      return [{
                        partOfSpeech: entry.partOfSpeech,
                        definitions: entry.senses.map((s: any) => ({
                          definition: s.definition,
                          example: s.examples?.[0] || s.example
                        })),
                        word: entry.word || word
                      }];
                    }
                    return [];
                  });
  
                  if (allMeanings.length === 0) return <p>Definition missing.</p>;
                  const displayMeanings = isExpanded ? allMeanings : allMeanings.slice(0, 1);
  
                  return (
                    <>
                      <div className={`flex flex-col gap-3 ${!isExpanded ? 'max-h-[120px] overflow-hidden' : ''}`}>
                        {displayMeanings.map((meaning: any, mIdx: number) => (
                          <div key={mIdx} className="border-l-2 border-blue-500/30 pl-3">
                            <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-900/50 text-blue-300 mb-1 uppercase tracking-wider">
                              {meaning.partOfSpeech || 'unknown'}
                            </span>
                            {meaning.definitions?.slice(0, isExpanded ? 5 : 2).map((def: any, dIdx: number) => (
                              <div key={dIdx} className="mb-2 last:mb-0">
                                <p className="text-sm sm:text-base">{def.definition}</p>
                                {def.example && (
                                  <p className="text-xs sm:text-sm italic text-gray-400 mt-1">
                                    "{def.example}"
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
  
                      {allMeanings.length > 1 || (allMeanings[0]?.definitions?.length > 2) ? (
                        <button
                          onClick={() => setIsExpanded(!isExpanded)}
                          className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-xs font-semibold py-1 transition-colors self-start"
                        >
                          {isExpanded ? (
                            <><ChevronUp size={14} /> Show Less</>
                          ) : (
                            <><ChevronDown size={14} /> More details...</>
                          )}
                        </button>
                      ) : null}
  
                      <div className="mt-4 pt-3 border-t border-gray-700/50 flex flex-col gap-1 text-[10px] text-gray-400">
                        <p>
                          Content sourced from{' '}
                          {definitionData.content.source?.url ? (
                            <a href={definitionData.content.source.url} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">Wiktionary</a>
                          ) : 'Wiktionary'}
                          {' '}under{' '}
                          <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">CC BY-SA 4.0</a>.
                        </p>
                        <p>Data provided by <a href="https://freedictionaryapi.com" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">FreeDictionaryAPI.com</a>.</p>
                      </div>
                    </>
                  );
                })()}
              </div>
            ) : (
              <div>
                <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-gray-800 text-emerald-300 mb-2 uppercase tracking-wider">Translation</span>
                <p>{typeof definitionData.content === 'string' ? definitionData.content : 'Search result available.'}</p>
              </div>
            )}
          </div>
        )}
  
        {definitionData && (
          <div className="pt-2 border-t border-gray-700 mt-1 flex justify-end">
            <a 
              href={word.trim().split(/\s+/).length > 1 
                ? `https://www.google.com/search?q=translate+${encodeURIComponent(word)}` 
                : `https://www.google.com/search?q=define+${encodeURIComponent(word)}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
            >
              {word.trim().split(/\s+/).length > 1 ? 'Translate on Google ↗' : 'Search on Google ↗'}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
