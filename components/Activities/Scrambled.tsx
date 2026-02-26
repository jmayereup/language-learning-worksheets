import React, { useState, useEffect } from 'react';
import { ScrambledItem } from '../../types';
import { normalizeString, speakText, shouldShowAudioControls, selectElementText } from '../../utils/textUtils';
import { Button } from '../UI/Button';
import { ChevronLeft, RefreshCw, Volume2, Turtle, SkipForward } from 'lucide-react';

interface Props {
  data: ScrambledItem[];
  level: string;
  language: string;
  onChange: (answers: Record<number, string>) => void;
  savedAnswers: Record<number, string>;
  voiceName?: string | null;
  savedIsCompleted?: boolean;
  onComplete?: (isCompleted: boolean) => void;
}

export const Scrambled: React.FC<Props> = ({ data, level, language, onChange, savedAnswers, voiceName, savedIsCompleted = false, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wordBank, setWordBank] = useState<{ id: number, text: string }[]>([]);
  const [formedSentence, setFormedSentence] = useState<{ id: number, text: string }[]>([]);
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrectState, setIsCorrectState] = useState(false);
  const [isCompleted, setIsCompleted] = useState(savedIsCompleted);
  const [activityMode, setActivityMode] = useState<'scramble' | 'dictation'>(() => {
    if (!shouldShowAudioControls()) return 'scramble';
    return (level === 'A1' || level === 'A2') ? 'scramble' : 'dictation';
  });

  if (!data || data.length === 0) return null;

  const currentItem = data[currentIndex];

  useEffect(() => {
    // Reset local state when question changes
    if (currentItem && activityMode === 'scramble') {
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
  }, [currentIndex, currentItem, activityMode]);

  // Sync formed sentence to parent state
  useEffect(() => {
    if (activityMode === 'scramble') {
      const currentSentence = formedSentence.map(w => w.text).join(' ');
      const savedSentence = savedAnswers[currentIndex] || '';

      // Only update if different to avoid loops
      if (currentSentence !== savedSentence) {
        onChange({ ...savedAnswers, [currentIndex]: currentSentence });
      }
    }
  }, [formedSentence, currentIndex, activityMode, savedAnswers, onChange]);

  const moveWordToSentence = (wordId: number) => {
    if (isCorrectState) return;
    setIsChecked(false);
    const word = wordBank.find(w => w.id === wordId);
    if (word) {
      setWordBank(prev => prev.filter(w => w.id !== wordId));
      setFormedSentence(prev => [...prev, word]);
      speakText(word.text, language, 1.0, voiceName);
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
    onChange({ ...savedAnswers, [currentIndex]: val });
  };

  const checkAnswer = () => {
    setIsChecked(true);

    // Use local state for validation to ensure what user sees is what is checked
    const currentAnswer = activityMode === 'scramble'
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
          onComplete?.(true);
        }
      }, 1500);
    }
  };

  const handleSkip = () => {
    if (currentIndex < data.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsCompleted(true);
      onComplete?.(true);
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
      <section className="bg-white p-2 rounded-xl sm:shadow-sm sm:border sm:border-gray-100 mb-2 text-center">
        <h2 className="text-2xl font-bold text-green-800 mb-4">Activity 4: Sentences</h2>
        <div className={`text-3xl font-bold mb-4 ${totalCorrect === data.length ? 'text-green-600' : 'text-green-600'}`}>
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
    <section className="bg-white p-2 rounded-xl sm:shadow-sm sm:border sm:border-gray-100 mb-2">
      <div className="space-y-4 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-green-800 leading-tight">Activity 4: Sentences</h2>
          </div>
          
          <div className="flex justify-between gap-3">
            {shouldShowAudioControls() && (
              <>
                <div className="flex bg-gray-100 p-1 rounded-lg">
                  <button
                    onClick={() => setActivityMode('scramble')}
                    className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${
                      activityMode === 'scramble'
                        ? 'bg-white text-green-700 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Scramble
                  </button>
                  <button
                    onClick={() => setActivityMode('dictation')}
                    className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${
                      activityMode === 'dictation'
                        ? 'bg-white text-green-700 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Dictation
                  </button>
                </div>

                <div className="flex gap-2  text-gray-700">
                  <button
                    className="flex items-center px-2 py-1.5 border border-gray-200 rounded-lg shadow-sm hover:border-green-300 hover:bg-green-50 hover:text-green-600 transition-all"
                    onClick={() => speakText(currentItem.answer, language, 0.7, voiceName)}
                    title="Slow"
                  >
                    <Turtle className="w-4 h-4" />
                  </button>
                  <button
                    className="flex items-center px-2 py-1.5 border border-gray-200 rounded-lg shadow-sm hover:border-green-300 hover:bg-green-50 hover:text-green-600 transition-all"
                    onClick={() => speakText(currentItem.answer, language, 1.0, voiceName)}
                    title="Normal"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <p className="text-gray-600 text-lg">
          {activityMode === 'dictation' 
            ? 'Listen to the audio and type the sentence.' 
            : 'Unscramble the words to form a correct sentence.'}
        </p>
      </div>

      <div className="min-h-[200px] py-4">
        {/* Answer Area */}
        <div className={`
          min-h-[80px] p-4 rounded-lg mb-6 border-2 flex flex-wrap gap-2 items-center transition-colors
          ${isChecked
            ? (isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50')
            : 'border-dashed border-green-300 bg-green-50/30'
          }
        `}>
          {activityMode === 'scramble' ? (
            formedSentence.length === 0 && !isChecked ? (
              <span className="text-gray-400 italic pointer-events-none text-lg">Click words below to form the sentence...</span>
            ) : (
              <div className="selectable-text flex flex-wrap gap-2 items-center" translate="no">
                {formedSentence.map(word => (
                  <button
                    key={word.id}
                    onClick={() => moveWordToBank(word.id)}
                    disabled={isCorrectState}
                    className="bg-white text-green-800 px-3 py-2 rounded shadow-sm border border-green-200 font-medium hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors animate-pop-in text-lg"
                  >
                    {word.text}
                  </button>
                ))}
              </div>
            )
          ) : (
            <input
              type="text"
              className="w-full bg-transparent outline-none text-lg p-2 selectable-text"
              placeholder="Type the sentence here..."
              value={userAnswer}
              onChange={(e) => handleManualInput(e.target.value)}
              disabled={isCorrectState}
              translate="no"
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

        {/* Word Bank (Scramble Mode Only) */}
        {activityMode === 'scramble' && (
          <div className="flex flex-wrap gap-3 justify-center" translate="no">
            {wordBank.map(word => (
              <button
                key={word.id}
                onClick={() => moveWordToSentence(word.id)}
                className="bg-white text-green-800 px-4 py-2 rounded-lg shadow-sm border border-green-200 font-medium hover:bg-green-50 hover:border-green-300 hover:scale-105 transition-all text-lg"
              >
                {word.text}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-end mt-6 pt-6 border-t border-gray-100">
        <span className="font-medium text-gray-500 mr-auto">
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
            disabled={(!userAnswer && activityMode === 'dictation' && !isCorrectState) || (activityMode === 'scramble' && formedSentence.length === 0 && !isCorrectState) || isCorrectState}
            className="min-w-[120px]"
          >
            {isCorrectState ? 'Correct!' : (isChecked ? 'Try Again' : 'Check')}
          </Button>
        </div>
      </div>
    </section>
  );
};