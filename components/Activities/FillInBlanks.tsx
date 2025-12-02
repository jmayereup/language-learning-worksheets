import React, { useState } from 'react';
import { FillInBlankItem, VocabularyItem } from '../../types';
import { normalizeString, shuffleArray } from '../../utils/textUtils';
import { Button } from '../UI/Button';
import { ChevronLeft, ChevronRight, Check, RefreshCw } from 'lucide-react';

interface Props {
  data: FillInBlankItem[];
  vocabItems: VocabularyItem[];
  level: string;
  onChange: (answers: Record<number, string>) => void;
  savedAnswers: Record<number, string>;
}

export const FillInBlanks: React.FC<Props> = ({ data, vocabItems, level, onChange, savedAnswers }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isChecked, setIsChecked] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  
  if (!data || data.length === 0) return null;

  const isBeginner = level === 'A1' || level === 'A2';

  const currentItem = data[currentIndex];
  const currentAnswer = savedAnswers[currentIndex] || '';

  // Generate options for dropdown if beginner
  const getOptions = (correctAnswer: string): string[] => {
    const distractors = vocabItems
      .filter(v => normalizeString(v.label) !== normalizeString(correctAnswer))
      .map(v => v.label);
    
    // Pick 3 random distractors + correct answer
    // Explicitly type the array and the generic to ensure proper inference
    const pool: string[] = [...shuffleArray<string>(distractors).slice(0, 3), correctAnswer];
    const options = shuffleArray<string>(pool);
    return options;
  };

  const handleNext = () => {
    if (!isChecked) {
      // Check Mode
      setIsChecked(true);
      const isCorrect = normalizeString(currentAnswer) === normalizeString(currentItem.answer);
      
      // Auto advance if correct
      if (isCorrect && currentIndex < data.length - 1) {
        setTimeout(() => {
          setIsChecked(false);
          setCurrentIndex(prev => prev + 1);
        }, 1000);
      } else if (isCorrect && currentIndex === data.length - 1) {
        setTimeout(() => setIsCompleted(true), 1000);
      }
    } else {
      // Next Mode (after checking incorrect answer)
      if (currentIndex < data.length - 1) {
        setIsChecked(false);
        setCurrentIndex(prev => prev + 1);
      } else {
        setIsCompleted(true);
      }
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setIsChecked(false);
      setIsCompleted(false);
    }
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setIsChecked(false);
    setIsCompleted(false);
    onChange({});
  };

  // UI for correct/incorrect state
  const isCorrect = normalizeString(currentAnswer) === normalizeString(currentItem?.answer || '');
  let inputClass = "border-b-2 border-blue-300 bg-blue-50 text-blue-900 font-semibold px-2 py-1 mx-2 focus:outline-none focus:border-blue-600 transition-colors text-center min-w-[140px] text-lg md:text-xl";
  
  if (isChecked) {
    inputClass = isCorrect
      ? "border-b-2 border-green-500 bg-green-50 text-green-900 font-bold px-2 py-1 mx-2 text-lg md:text-xl"
      : "border-b-2 border-red-500 bg-red-50 text-red-900 font-bold px-2 py-1 mx-2 text-lg md:text-xl";
  }

  if (isCompleted) {
    // Calculate total score for final display
    const totalCorrect = data.reduce((acc, item, idx) => {
      return normalizeString(savedAnswers[idx] || '') === normalizeString(item.answer) ? acc + 1 : acc;
    }, 0);

    return (
      <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8 text-center">
         <h2 className="text-2xl font-bold text-blue-800 mb-4">Activity 2: Fill in the blanks</h2>
         <div className={`text-3xl font-bold mb-4 ${totalCorrect === data.length ? 'text-green-600' : 'text-blue-600'}`}>
            {totalCorrect === data.length ? '🎉 Perfect!' : 'Good Job!'}
         </div>
         <p className="text-gray-600 text-lg mb-6">You got {totalCorrect} out of {data.length} correct.</p>
         <Button onClick={handleRetry} variant="secondary">
           <RefreshCw className="w-4 h-4 mr-2" /> Retry Activity
         </Button>
      </section>
    );
  }

  return (
    <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-800">Activity 2: Fill in the blanks</h2>
      </div>

      <div className="min-h-[150px] flex flex-col justify-center items-center py-8">
        <div className="text-lg md:text-xl leading-loose text-center text-gray-800 max-w-3xl">
          <span>{currentItem.before}</span>
          
          {isBeginner && vocabItems.length > 0 ? (
             <select 
               value={currentAnswer}
               onChange={(e) => onChange({...savedAnswers, [currentIndex]: e.target.value})}
               disabled={isChecked}
               className={`${inputClass} rounded cursor-pointer appearance-none py-2 px-4`}
             >
               <option value="">Select...</option>
               {getOptions(currentItem.answer).map((opt, i) => (
                 <option key={i} value={opt.toLowerCase()}>{opt.toLowerCase()}</option>
               ))}
             </select>
          ) : (
            <input 
              type="text"
              value={currentAnswer}
              onChange={(e) => onChange({...savedAnswers, [currentIndex]: e.target.value})}
              disabled={isChecked}
              className={`${inputClass} rounded`}
              placeholder="?"
              autoComplete="off"
            />
          )}
          
          <span>{currentItem.after}</span>
        </div>

        {isChecked && !isCorrect && (
          <div className="mt-4 text-red-600 font-semibold animate-fade-in text-lg">
            Correct answer: <span className="underline">{currentItem.answer}</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
        <Button 
          variant="secondary" 
          onClick={handlePrev} 
          disabled={currentIndex === 0}
          className="w-12 h-12 !p-0 rounded-full"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>

        <span className="font-medium text-gray-500">
          Question {currentIndex + 1} of {data.length}
        </span>

        <Button 
          variant={isChecked && !isCorrect ? "secondary" : "primary"}
          onClick={handleNext}
          disabled={!currentAnswer && !isChecked}
          className="min-w-[120px]"
        >
          {isChecked ? (currentIndex === data.length - 1 ? 'Finish' : 'Next') : 'Check'}
          {!isChecked && <Check className="ml-2 w-4 h-4" />}
          {isChecked && <ChevronRight className="ml-2 w-4 h-4" />}
        </Button>
      </div>
    </section>
  );
};