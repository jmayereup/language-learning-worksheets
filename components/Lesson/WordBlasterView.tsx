import React, { useEffect, useState } from 'react';
import { WordBlasterGame, VocabWord } from '../Activities/WordBlasterGame';
import { Trophy, AlertCircle, Zap } from 'lucide-react';
import { ParsedLesson, WordBlasterContent } from '../../types';

interface Props {
  lesson: ParsedLesson;
  onFinish?: (data: any) => void;
  onReset?: () => void;
}

export const WordBlasterView: React.FC<Props> = ({ lesson, onFinish }) => {
  const content = lesson.content as WordBlasterContent;
  const [words, setWords] = useState<VocabWord[]>(content.words || []);
  const [highScore, setHighScore] = useState(0);
  const [newHighScore, setNewHighScore] = useState(false);

  const HIGHSCORE_KEY = 'word_blaster_highscore_v1';

  useEffect(() => {
    const savedScore = localStorage.getItem(HIGHSCORE_KEY);
    if (savedScore) {
      setHighScore(parseInt(savedScore, 10));
    }
  }, []);

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

      // Fire the onFinish callback if provided
      if (onFinish) {
        onFinish({
            title: lesson.title || 'Word Blaster Game',
            nickname: 'Player', // Assuming the component tracks this or is not full report
            studentId: 'N/A',
            homeroom: 'N/A',
            finishTime: new Date().toISOString(),
            totalScore: score,
            maxScore: score, // Need a way to track total max depending on mode
            pills: [{ label: 'High Score', score: Math.max(score, highScore), total: Math.max(score, highScore) }],
        });
      }
    }
  };

  if (!words || words.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 min-h-[60vh] bg-red-50/50 rounded-3xl m-4 border border-red-100">
        <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
        <h2 className="text-2xl font-bold text-red-900 mb-2">No Words Found</h2>
        <p className="text-red-700">There is no vocabulary data mapped to this lesson.</p>
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
        <p className="text-center text-slate-400 mt-8 font-medium text-sm">
          Playing with <span className="font-bold text-slate-500">{words.length}</span> unique power words extracted from selected worksheets.
        </p>
      </div>
    </div>
  );
};
