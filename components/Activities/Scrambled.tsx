import React, { useState, useEffect } from 'react';
import { ScrambledItem } from '../../types';
import { normalizeString, speakText, shouldShowAudioControls } from '../../utils/textUtils';
import { Button } from '../UI/Button';
import { ChevronLeft, RefreshCw, Volume2, Turtle, SkipForward } from 'lucide-react';

interface Props {
  data: ScrambledItem[];
  level: string;
  language: string;
  onChange: (answers: Record<number, string>) => void;
  savedAnswers: Record<number, string>;
}

export const Scrambled: React.FC<Props> = ({ data, level, language, onChange, savedAnswers }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wordBank, setWordBank] = useState<{id: number, text: string}[]>([]);
  const [formedSentence, setFormedSentence] = useState<{id: number, text: string}[]>([]);
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrectState, setIsCorrectState] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  
  if (!data || data.length === 0) return null;

  const isBeginner = level === 'A1' || level === 'A2';
  const currentItem = data[currentIndex];

  useEffect(() => {
    // Reset local state when question changes
    if (currentItem && isBeginner) {
      // Create fresh word tokens
      const words = currentItem.answer
        .replace(/[.!?]+$/, '')
        .split(/\s+/)
        .map((text, i) => ({ id: i, text }));
      
      // Shuffle
      for (let i = words.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [words[i], words[j]] = [words[j], words[i]];
      }
      
      setWordBank(words);
      setFormedSentence([]);
      setIsChecked(false);
      setIsCorrectState(false);
    } else {
      setIsChecked(false);
      setIsCorrectState(false);
    }
  }, [currentIndex, currentItem, isBeginner]);

  // Sync formed sentence to parent state
  useEffect(() => {
    if (isBeginner) {
      const currentSentence = formedSentence.map(w => w.text).join(' ');
      const savedSentence = savedAnswers[currentIndex] || '';
      
      // Only update if different to avoid loops
      if (currentSentence !== savedSentence) {
        onChange({ ...savedAnswers, [currentIndex]: currentSentence });
      }
    }
  }, [formedSentence, currentIndex, isBeginner, savedAnswers, onChange]);

  const moveWordToSentence = (wordId: number) => {
    if (isCorrectState) return;
    setIsChecked(false);
    const word = wordBank.find(w => w.id === wordId);
    if (word) {
      setWordBank(prev => prev.filter(w => w.id !== wordId));
      setFormedSentence(prev => [...prev, word]);
      speakText(word.text, language);
    }
  };

  const moveWordToBank = (wordId: number) => {
    if (isCorrectState) return;
    setIsChecked(false);
    const word = formedSentence.find(w => w.id === wordId);
    if (word) {
      setFormedSentence(prev => prev.filter(w => w.id !== wordId));
      setWordBank(prev => [...prev, word]);
    }
  };

  const handleManualInput = (val: string) => {
    setIsChecked(false);
    onChange({...savedAnswers, [currentIndex]: val});
  };

  const checkAnswer = () => {
    setIsChecked(true);
    
    // Use local state for validation to ensure what user sees is what is checked
    const currentAnswer = isBeginner 
        ? formedSentence.map(w => w.text).join(' ')
        : (savedAnswers[currentIndex] || '');
        
    const isCorrect = normalizeString(currentAnswer) === normalizeString(currentItem.answer);

    if (isCorrect) {
      setIsCorrectState(true);
      setTimeout(() => {
        if (currentIndex < data.length - 1) {
          setCurrentIndex(prev => prev + 1);
        } else {
          setIsCompleted(true);
        }
      }, 1500);
    }
  };

  const handleSkip = () => {
    if (currentIndex < data.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < data.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  if (isCompleted) {
      const totalCorrect = data.reduce((acc, item, idx) => {
      return normalizeString(savedAnswers[idx] || '') === normalizeString(item.answer) ? acc + 1 : acc;
    }, 0);
    return (
       <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8 text-center">
         <h2 className="text-2xl font-bold text-blue-800 mb-4">Activity 4: Sentences</h2>
         <div className={`text-3xl font-bold mb-4 ${totalCorrect === data.length ? 'text-green-600' : 'text-blue-600'}`}>
            Activity Completed!
         </div>
         <p className="text-gray-600 text-lg mb-6">Score: {totalCorrect} / {data.length}</p>
         <Button onClick={() => { setCurrentIndex(0); setIsCompleted(false); setIsChecked(false); onChange({}); }} variant="secondary">
           <RefreshCw className="w-4 h-4 mr-2" /> Retry
         </Button>
      </section>
    );
  }

  const userAnswer = savedAnswers[currentIndex] || '';
  const isCorrect = normalizeString(userAnswer) === normalizeString(currentItem?.answer || '');

  return (
    <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-800">Activity 4: Sentences</h2>
        {shouldShowAudioControls() && (
          <div className="flex gap-2">
             <Button variant="secondary" size="sm" onClick={() => speakText(currentItem.answer, language, 0.6)} title="Slow">
               <Turtle className="w-4 h-4 mr-1" /> Slow
             </Button>
             <Button variant="secondary" size="sm" onClick={() => speakText(currentItem.answer, language, 1.0)} title="Normal">
               <Volume2 className="w-4 h-4 mr-1" /> Normal
             </Button>
          </div>
        )}
      </div>

      <div className="min-h-[200px] py-4">
        {/* Answer Area */}
        <div className={`
          min-h-[80px] p-4 rounded-lg mb-6 border-2 flex flex-wrap gap-2 items-center transition-colors
          ${isChecked 
            ? (isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50') 
            : 'border-dashed border-gray-300 bg-gray-50'
          }
        `}>
           {isBeginner ? (
             formedSentence.length === 0 && !isChecked ? (
               <span className="text-gray-400 italic pointer-events-none text-lg">Click words below to form the sentence...</span>
             ) : (
               formedSentence.map(word => (
                 <button 
                   key={word.id}
                   onClick={() => moveWordToBank(word.id)}
                   disabled={isCorrectState}
                   className="bg-white text-blue-800 px-3 py-2 rounded shadow-sm border border-blue-100 font-medium hover:bg-red-50 hover:text-red-600 transition-colors animate-pop-in text-lg"
                 >
                   {word.text}
                 </button>
               ))
             )
           ) : (
             <input 
               type="text" 
               className="w-full bg-transparent outline-none text-lg p-2"
               placeholder="Type the sentence here..."
               value={userAnswer}
               onChange={(e) => handleManualInput(e.target.value)}
               disabled={isCorrectState}
             />
           )}
        </div>
        
        {/* Result Message */}
        {isChecked && !isCorrectState && (
           <div className="mb-6 text-center animate-fade-in text-lg">
             <p className="text-red-600 font-bold mb-1">Incorrect. Try again.</p>
           </div>
        )}
        {isCorrectState && (
           <div className="mb-6 text-center animate-fade-in text-lg">
             <p className="text-green-600 font-bold mb-1">Correct!</p>
           </div>
        )}

        {/* Word Bank (Beginner Only) */}
        {isBeginner && (
          <div className="flex flex-wrap gap-3 justify-center">
            {wordBank.map(word => (
              <button
                key={word.id}
                onClick={() => moveWordToSentence(word.id)}
                className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg shadow-sm font-medium hover:bg-blue-200 hover:scale-105 transition-all text-lg"
              >
                {word.text}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
        <Button 
          variant="secondary" 
          onClick={() => { setCurrentIndex(prev => prev - 1); setIsChecked(false); setIsCorrectState(false); }} 
          disabled={currentIndex === 0}
          className="w-12 h-12 !p-0 rounded-full"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>

        <span className="font-medium text-gray-500">
          {currentIndex + 1} / {data.length}
        </span>

        <div className="flex gap-2">
            {!isCorrectState && (
                <Button 
                  variant="secondary"
                  onClick={handleSkip}
                  className="min-w-[80px]"
                >
                  {SkipForward ? <SkipForward className="w-4 h-4 mr-2" /> : null} Skip
                </Button>
            )}
            
            <Button 
              variant={isChecked && !isCorrectState ? "secondary" : "primary"}
              onClick={checkAnswer}
              disabled={(!userAnswer && !isBeginner && !isCorrectState) || (isBeginner && formedSentence.length === 0 && !isCorrectState) || isCorrectState}
              className="min-w-[120px]"
            >
              {isCorrectState ? 'Correct!' : (isChecked ? 'Try Again' : 'Check')}
            </Button>
        </div>
      </div>
    </section>
  );
};