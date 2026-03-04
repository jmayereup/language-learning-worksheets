import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../UI/Button';
import { RefreshCw, Play, Trophy, Clock, Zap } from 'lucide-react';

export interface VocabWord {
  word: string;
  definition: string;
  sourceLessonId: string;
}

interface Props {
  words: VocabWord[];
  onFinish: (score: number) => void;
}

const GAME_DURATION = 60; // 60 seconds

// Audio context helper for synthesized sounds
const playSound = (type: 'correct' | 'incorrect' | 'highscore') => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    if (type === 'correct') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.2);
    } else if (type === 'incorrect') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.2);
    } else if (type === 'highscore') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
      osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.3); // C6
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.5);
    }
  } catch (e) {
    console.warn('Audio play failed', e);
  }
};

export const WordBlasterGame: React.FC<Props> = ({ words, onFinish }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [highestCombo, setHighestCombo] = useState(0);

  const [currentWord, setCurrentWord] = useState<VocabWord | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'incorrect'>('none');
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isPlaying) {
      endGame();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, timeLeft]);

  // Keyboard shortcuts (1, 2, 3, 4)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying || feedback !== 'none' || options.length !== 4) return;
      
      const key = e.key;
      if (['1', '2', '3', '4'].includes(key)) {
        const index = parseInt(key, 10) - 1;
        handleOptionClick(options[index]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPlaying, feedback, options]);

  const generateQuestion = () => {
    if (words.length === 0) return;
    const target = words[Math.floor(Math.random() * words.length)];
    setCurrentWord(target);

    // Get 3 other random words for options
    let otherWords = words.filter(w => w.word !== target.word);
    
    // Shuffle and pick 3
    otherWords.sort(() => Math.random() - 0.5);
    const chosenOptions = otherWords.slice(0, 3).map(w => w.word);
    chosenOptions.push(target.word);
    chosenOptions.sort(() => Math.random() - 0.5);

    setOptions(chosenOptions);
    setFeedback('none');
    setSelectedWord(null);
  };

  const startGame = () => {
    setScore(0);
    setCombo(0);
    setHighestCombo(0);
    setTimeLeft(GAME_DURATION);
    setIsPlaying(true);
    generateQuestion();
  };

  const endGame = () => {
    setIsPlaying(false);
    if (timerRef.current) clearInterval(timerRef.current);
    // Check if score is higher than highest locally saved score is handled by parent,
    // but we can just pass the score up
    onFinish(score);
  };

  const handleOptionClick = (option: string) => {
    if (feedback !== 'none' || !currentWord) return; // Prevent double clicking
    
    setSelectedWord(option);

    if (option === currentWord.word) {
      // Correct!
      setFeedback('correct');
      playSound('correct');
      const points = 10 + (combo * 2);
      setScore(prev => prev + points);
      setCombo(prev => {
        const newCombo = prev + 1;
        setHighestCombo(hc => Math.max(hc, newCombo));
        return newCombo;
      });
      setTimeout(() => {
        if (isPlaying) generateQuestion();
      }, 500); // Quick turnaround for speed game
    } else {
      // Incorrect
      setFeedback('incorrect');
      playSound('incorrect');
      setCombo(0);
      setTimeout(() => {
        if (isPlaying) generateQuestion();
      }, 1500); // Give them time to see the right answer
    }
  };

  if (words.length < 4) {
    return (
      <div className="p-8 text-center bg-white rounded-xl shadow-sm border border-orange-200">
        <p className="text-orange-600 font-bold">Not enough vocabulary words to play (minimum 4 required).</p>
      </div>
    );
  }

  if (!isPlaying && timeLeft === GAME_DURATION) {
    return (
      <div className="bg-linear-to-br from-indigo-900 via-purple-900 to-indigo-800 p-8 rounded-3xl shadow-2xl text-center text-white border border-indigo-700/50 relative overflow-hidden">
        {/* Dynamic Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
           <div className="absolute -top-[50%] -left-[10%] w-[70%] h-[70%] bg-purple-500/20 blur-[120px] rounded-full mix-blend-screen"></div>
           <div className="absolute top-[80%] -right-[10%] w-[50%] h-[50%] bg-indigo-500/20 blur-[100px] rounded-full mix-blend-screen"></div>
        </div>

        <div className="relative z-10">
          <div className="mb-6 flex justify-center">
            <div className="bg-white/10 p-4 rounded-2xl shadow-inner backdrop-blur-sm border border-white/10">
              <Zap size={64} className="text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
            </div>
          </div>
          <h2 className="text-5xl font-black mb-3 text-transparent bg-clip-text bg-linear-to-r from-yellow-300 via-yellow-100 to-yellow-300 tracking-tight drop-shadow-sm">Word Blaster</h2>
          <p className="text-xl text-indigo-200 mb-10 max-w-md mx-auto font-medium">Race against the clock to match as many words to their definitions as possible!</p>
          <button 
            onClick={startGame}
            className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 font-bold text-xl text-indigo-950 bg-linear-to-b from-yellow-300 to-yellow-500 rounded-full hover:from-yellow-200 hover:to-yellow-400 hover:scale-105 active:scale-95 transition-all outline-none focus:ring-4 focus:ring-yellow-400/50 shadow-[0_10px_25px_-5px_rgba(234,179,8,0.5)] border border-yellow-200"
          >
            <Play size={28} className="fill-indigo-900" />
            START BLASTING
            <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
        </div>
      </div>
    );
  }

  if (!isPlaying && timeLeft === 0) {
    return (
      <div className="bg-linear-to-br from-indigo-900 via-purple-900 to-indigo-800 p-10 rounded-3xl shadow-2xl text-center text-white relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
           <div className="absolute top-[20%] left-[20%] w-[60%] h-[60%] bg-pink-500/20 blur-[100px] rounded-full mix-blend-screen"></div>
        </div>
        <div className="relative z-10">
          <h2 className="text-4xl font-extrabold mb-4 text-transparent bg-clip-text bg-linear-to-r from-pink-300 to-yellow-300 shadow-sm inline-block">Time's Up!</h2>
          <div className="text-8xl font-black mb-6 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">{score} <span className="text-3xl font-bold text-indigo-300 tracking-widest pl-2">PTS</span></div>
          <p className="text-xl text-indigo-200 mb-10 font-medium">Highest Combo: <span className="text-yellow-400 font-bold">{highestCombo}x</span></p>
          <button 
            onClick={startGame}
            className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 font-bold text-lg text-white bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 hover:scale-105 active:scale-95 transition-all outline-none focus:ring-2 focus:ring-white border border-white/20 shadow-lg"
          >
            <RefreshCw size={24} className="group-hover:rotate-180 transition-transform duration-500" />
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-linear-to-b from-indigo-50 to-white p-3 md:p-6 rounded-3xl shadow-xl border border-indigo-100/50 max-w-2xl mx-auto flex flex-col min-h-[60vh] md:min-h-0">
      {/* Header Stats */}
      <div className="flex justify-between items-center mb-4 md:mb-8 bg-white p-3 md:p-4 rounded-2xl shadow-sm border border-gray-100 shrink-0">
        <div className="flex items-center gap-2 md:gap-3 text-indigo-900 font-bold text-lg md:text-xl">
          <div className="p-1.5 md:p-2 bg-indigo-100 text-indigo-600 rounded-xl">
            <Trophy size={20} className="md:w-6 md:h-6" />
          </div>
          Score: <span className="text-indigo-600">{score}</span>
        </div>
        {combo > 1 && (
          <div className="text-yellow-500 font-black text-xl md:text-2xl animate-pulse drop-shadow-sm flex items-center gap-1">
            <Zap size={20} className="md:w-6 md:h-6 fill-yellow-500" /> {combo}x
          </div>
        )}
        <div className={`flex items-center gap-1.5 md:gap-2 font-bold text-lg md:text-xl px-3 md:px-4 py-1.5 md:py-2 rounded-xl border ${timeLeft <= 10 ? 'text-red-500 bg-red-50 border-red-200 animate-pulse' : 'text-gray-700 bg-gray-50 border-gray-200'}`}>
          <Clock size={20} className={`md:w-6 md:h-6 ${timeLeft <= 10 ? 'text-red-500' : 'text-gray-400'}`} /> {timeLeft}s
        </div>
      </div>

      {/* Main Game Area */}
      {currentWord && (
        <div className="flex-1 flex flex-col justify-center">
          <div className="bg-linear-to-br from-indigo-900 to-purple-800 p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-lg mb-4 md:mb-8 relative overflow-hidden group">
             {/* Subdued animation in background */}
             <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-50"></div>

            <p className="text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white font-medium leading-tight relative z-10 drop-shadow-md py-4 md:py-0">
              "{currentWord.definition}"
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 flex-1">
            {options.map((option, idx) => {
              let btnClass = "relative overflow-hidden p-4 md:p-6 text-lg sm:text-xl md:text-2xl font-bold rounded-xl md:rounded-2xl border-2 shadow-sm transition-all duration-200 outline-none hover:scale-[1.02] active:scale-95 flex items-center justify-center min-h-[70px] md:min-h-[100px] flex-1";
              const isSelected = selectedWord === option;
              
              if (feedback === 'none') {
                btnClass += " bg-white border-gray-200 text-indigo-900 hover:border-indigo-400 hover:shadow-md hover:bg-indigo-50/50";
              } else if (option === currentWord.word) {
                // The correct answer always highlights green when feedback is shown
                btnClass += " bg-green-500 border-green-600 text-white shadow-lg shadow-green-500/30 ring-4 ring-green-500/20";
              } else if (isSelected && feedback === 'incorrect') {
                // The wrong answer we clicked
                btnClass += " bg-red-500 border-red-600 text-white shadow-inner animate-[shake_0.5s_ease-in-out]";
              } else {
                // Other wrong answers
                btnClass += " bg-gray-50 border-gray-200 text-gray-400 opacity-50";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionClick(option)}
                  disabled={feedback !== 'none'}
                  className={btnClass}
                  title={`Press ${idx + 1}`}
                >
                  <span className="absolute top-2 left-3 text-xs opacity-40 font-bold border rounded px-1 hidden md:block">{idx + 1}</span>
                  <span className="relative z-10">{option}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
