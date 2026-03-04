import React, { useEffect, useState } from 'react';
import { fetchLessonById } from '../../services/pocketbase';
import { WordBlasterGame, VocabWord } from './WordBlasterGame';
import { Trophy, AlertCircle, Loader2, Zap } from 'lucide-react';
import { ParsedLesson } from '../../types';

interface Props {
  worksheetIds: string[];
}

export const WordBlasterView: React.FC<Props> = ({ worksheetIds }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [words, setWords] = useState<VocabWord[]>([]);
  const [highScore, setHighScore] = useState(0);
  const [newHighScore, setNewHighScore] = useState(false);

  const HIGHSCORE_KEY = 'word_blaster_highscore_v1';

  useEffect(() => {
    const savedScore = localStorage.getItem(HIGHSCORE_KEY);
    if (savedScore) {
      setHighScore(parseInt(savedScore, 10));
    }
  }, []);

  useEffect(() => {
    const loadVocabulary = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let allWords: VocabWord[] = [];
        
        for (const id of worksheetIds) {
          const lesson: ParsedLesson = await fetchLessonById(id);
          const content = lesson.content;
          
          if ('activities' in content && !Array.isArray(content.activities) && 'vocabulary' in content.activities) { // StandardLessonContent
            const standardActivities = content.activities as Record<string, any>;
            if (standardActivities.vocabulary?.items) {
              const { items, definitions } = standardActivities.vocabulary;
              items.forEach((item: any) => {
                const def = definitions.find((d: any) => d.id === item.answer);
                if (def) {
                  allWords.push({
                    word: item.label,
                    definition: def.text,
                    sourceLessonId: id
                  });
                }
              });
            }
          } else if ('parts' in content && content.parts) { // FocusedReaderContent
            content.parts.forEach(part => {
              const vocabMap = part.vocabulary_explanations || {};
              Object.entries(vocabMap).forEach(([word, definition]) => {
                allWords.push({ word, definition, sourceLessonId: id });
              });
            });
          }
        }
        
        // Remove duplicates based on word
        const uniqueWords = Array.from(new Map(allWords.map(w => [w.word.toLowerCase(), w])).values());
        
        setWords(uniqueWords);
      } catch (err) {
        console.error("Failed to load vocabulary for Word Blaster", err);
        setError("Could not load worksheets to extract vocabulary.");
      } finally {
        setLoading(false);
      }
    };
    
    if (worksheetIds.length > 0) {
      loadVocabulary();
    } else {
      setLoading(false);
    }
  }, [worksheetIds]);

  const handleFinishGame = (score: number) => {
    if (score > highScore) {
      setHighScore(score);
      setNewHighScore(true);
      localStorage.setItem(HIGHSCORE_KEY, score.toString());
      
      // Play high score sound using our helper if we expose it, or duplicate lightweight here
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContext) {
          const ctx = new AudioContext();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = 'square';
          osc.frequency.setValueAtTime(523.25, ctx.currentTime);
          osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
          osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2);
          osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.3);
          gain.gain.setValueAtTime(0.2, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + 0.5);
        }
      } catch (e) {}

      // Reset animation after a few seconds
      setTimeout(() => setNewHighScore(false), 5000);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
        <h2 className="text-xl font-bold text-indigo-900">Loading Power Words...</h2>
        <p className="text-indigo-400 mt-2 text-sm max-w-sm text-center">We're extracting the perfect vocabulary mix for your game.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-20 min-h-[60vh] bg-red-50/50 rounded-3xl m-4 border border-red-100">
        <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
        <h2 className="text-2xl font-bold text-red-900 mb-2">Oops!</h2>
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f8fafc] py-4 md:py-12 px-2 sm:px-6 flex flex-col justify-start md:justify-center">
      <div className="max-w-4xl mx-auto w-full">
        {/* Modern Header Section */}
        <div className="text-center mb-4 md:mb-10 hidden md:block">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-indigo-100 text-indigo-600 mb-4 shadow-sm border border-indigo-50 leading-none">
            <Zap className="w-8 h-8 mr-2 fill-yellow-400 text-yellow-500 drop-shadow-sm" />
            <Trophy className="w-8 h-8" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-3">
            Vocabulary Challenge
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
            Test your reflexes and recall. Match words with their definitions before time runs out.
          </p>
        </div>

        {/* High Score Banner */}
        {highScore > 0 && (
          <div className={`mb-4 md:mb-10 max-w-md mx-auto transition-transform duration-500 ${newHighScore ? 'scale-110 drop-shadow-2xl' : ''}`}>
             <div className={`bg-linear-to-r ${newHighScore ? 'from-green-100 to-emerald-100 border-emerald-400 animate-pulse' : 'from-amber-100 to-yellow-100 border-yellow-200'} rounded-2xl p-3 md:p-4 flex items-center justify-between shadow-sm border`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${newHighScore ? 'bg-emerald-400 text-emerald-900' : 'bg-yellow-400 text-yellow-900'}`}>
                    <Trophy className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <span className={`font-bold text-sm tracking-wide uppercase ${newHighScore ? 'text-emerald-900' : 'text-yellow-900'}`}>
                    {newHighScore ? 'NEW HIGH SCORE!!' : 'All-Time High'}
                  </span>
                </div>
                <span className={`text-2xl md:text-3xl font-black drop-shadow-sm ${newHighScore ? 'text-emerald-600' : 'text-yellow-600'}`}>{highScore}</span>
             </div>
          </div>
        )}

        {/* The Game */}
        <div className="relative z-10">
          <WordBlasterGame words={words} onFinish={handleFinishGame} />
        </div>
        
        {/* Extracted Stats */}
        {!loading && !error && words.length > 0 && (
          <p className="text-center text-slate-400 mt-8 font-medium text-sm">
            Playing with <span className="font-bold text-slate-500">{words.length}</span> unique power words extracted from selected worksheets.
          </p>
        )}
      </div>
    </div>
  );
};
