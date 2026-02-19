import React, { useState } from 'react';
import { ComprehensionActivity } from '../../types';
import { Button } from '../UI/Button';
import { Check, ChevronRight, RefreshCw, Volume2 } from 'lucide-react';
import { speakText, shouldShowAudioControls, selectElementText } from '../../utils/textUtils';

interface Props {
  data: ComprehensionActivity;
  readingText: string;
  language: string;
  onChange: (answers: Record<number, string>) => void;
  savedAnswers: Record<number, string>;
  voiceName?: string | null;
  savedIsCompleted?: boolean;
  onComplete?: (isCompleted: boolean) => void;
}

export const Comprehension: React.FC<Props> = ({ data, readingText, language, onChange, savedAnswers, voiceName, savedIsCompleted = false, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isChecked, setIsChecked] = useState(false);
  const [isCompleted, setIsCompleted] = useState(savedIsCompleted);

  if (!data || !data.questions || data.questions.length === 0) return null;

  const currentQuestion = data.questions[currentIndex];
  const userAnswer = savedAnswers[currentIndex];

  const handleOptionChange = (value: string) => {
    if (isChecked) return; // Prevent changing after check
    onChange({ ...savedAnswers, [currentIndex]: value });
  };

  const handleNext = () => {
    if (!isChecked) {
      // Check Mode
      setIsChecked(true);
      const isCorrect = userAnswer === currentQuestion.answer;

      // Auto advance if correct
      if (isCorrect && currentIndex < data.questions.length - 1) {
        setTimeout(() => {
          setIsChecked(false);
          setCurrentIndex(prev => prev + 1);
        }, 1000);
      } else if (isCorrect && currentIndex === data.questions.length - 1) {
        setTimeout(() => {
          setIsCompleted(true);
          onComplete?.(true);
        }, 1000);
      }
    } else {
      // Next Mode (after incorrect answer or manual advance)
      if (currentIndex < data.questions.length - 1) {
        setIsChecked(false);
        setCurrentIndex(prev => prev + 1);
      } else {
        setIsCompleted(true);
        onComplete?.(true);
      }
    }
  };


  const handleRetry = () => {
    setCurrentIndex(0);
    setIsChecked(false);
    setIsCompleted(false);
    onChange({});
  };

  if (isCompleted) {
    // Calculate score
    let score = 0;
    data.questions.forEach((q, i) => {
      if (savedAnswers[i] === q.answer) score++;
    });

    return (
      <section className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8 text-center">
        <h2 className="text-2xl font-bold text-blue-800 mb-4">Activity 3: Comprehension</h2>
        <div className={`text-3xl font-bold mb-4 ${score === data.questions.length ? 'text-green-600' : 'text-blue-600'}`}>
          {score === data.questions.length ? '🎉 Perfect!' : 'Good Job!'}
        </div>
        <p className="text-gray-600 text-lg mb-6">You got {score} out of {data.questions.length} correct.</p>
        <Button onClick={handleRetry} variant="secondary">
          <RefreshCw className="w-4 h-4 mr-2" /> Retry Activity
        </Button>
      </section>
    );
  }

  const isCorrect = userAnswer === currentQuestion.answer;

  return (
    <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-800">Activity 3: Comprehension</h2>
        <span className="font-medium text-gray-500 text-sm">
          Question {currentIndex + 1} of {data.questions.length}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Reading Text Column */}
        <div className="order-2 lg:order-1">
          <h3 className="font-bold text-gray-500 uppercase mb-2">Reference Text</h3>
          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 max-h-[300px] overflow-y-auto custom-scrollbar">
            <p className="text-gray-700 leading-relaxed font-serif text-lg whitespace-pre-line" translate="no">
              {readingText}
            </p>
          </div>
        </div>

        {/* Question Column */}
        <div className="order-1 lg:order-2 flex flex-col justify-center">
          <div className="mb-6 min-h-[120px]">
            <div className="flex items-start gap-3 mb-6">
              <p className="text-lg md:text-xl font-medium text-gray-800 flex-1 selectable-text" translate="no">{currentQuestion.text}</p>
              {shouldShowAudioControls() && (
                <button
                  onClick={() => {
                    try {
                      setTimeout(() => speakText(currentQuestion.text, language, 0.7, voiceName), 1);
                    } catch (e) {
                      console.warn('TTS failed:', e);
                    }
                  }}
                  className="text-gray-400 hover:text-blue-600 transition-colors p-1 shrink-0"
                  title="Hear question"
                >
                  <Volume2 size={24} />
                </button>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <label className={`
                          flex-1 flex items-center justify-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all select-none
                          ${userAnswer === 'true'
                  ? (isChecked
                    ? (currentQuestion.answer === 'true' ? 'border-green-500 bg-green-50 text-green-700' : 'border-red-500 bg-red-50 text-red-700')
                    : 'border-blue-500 bg-blue-50 text-blue-700')
                  : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50 text-gray-600'
                }
                      `}>
                <input
                  type="radio"
                  name={`q-${currentIndex}`}
                  value="true"
                  checked={userAnswer === 'true'}
                  onChange={() => handleOptionChange('true')}
                  className="hidden"
                  disabled={isChecked}
                />
                <span className="font-bold text-lg" translate="no">True</span>
              </label>

              <label className={`
                          flex-1 flex items-center justify-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all select-none
                          ${userAnswer === 'false'
                  ? (isChecked
                    ? (currentQuestion.answer === 'false' ? 'border-green-500 bg-green-50 text-green-700' : 'border-red-500 bg-red-50 text-red-700')
                    : 'border-blue-500 bg-blue-50 text-blue-700')
                  : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50 text-gray-600'
                }
                      `}>
                <input
                  type="radio"
                  name={`q-${currentIndex}`}
                  value="false"
                  checked={userAnswer === 'false'}
                  onChange={() => handleOptionChange('false')}
                  className="hidden"
                  disabled={isChecked}
                />
                <span className="font-bold text-lg" translate="no">False</span>
              </label>
            </div>

            {isChecked && !isCorrect && (
              <div className="mt-4 text-center font-bold text-red-600 animate-fade-in text-lg">
                Incorrect. The answer is {currentQuestion.answer === 'true' ? 'True' : 'False'}.
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-end mt-4 pt-4 border-t border-gray-100">
            <Button
              variant={isChecked && !isCorrect ? "secondary" : "primary"}
              onClick={handleNext}
              disabled={!userAnswer && !isChecked}
              className="min-w-[120px]"
            >
              {isChecked ? (currentIndex === data.questions.length - 1 ? 'Finish' : 'Next') : 'Check'}
              {!isChecked && <Check className="ml-2 w-4 h-4" />}
              {isChecked && <ChevronRight className="ml-2 w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};