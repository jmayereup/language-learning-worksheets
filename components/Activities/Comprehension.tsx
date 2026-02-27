import React, { useState, useMemo } from 'react';
import { ComprehensionActivity } from '../../types';
import { Button } from '../UI/Button';
import { Check, ChevronRight, RefreshCw, XCircle } from 'lucide-react';
import { speakText, shouldShowAudioControls, selectElementText, seededShuffle } from '../../utils/textUtils';
import { AudioControls } from '../UI/AudioControls';

interface Props {
  data: { questions: any[] };
  readingText: string;
  language: string;
  onChange: (answers: Record<number, string>) => void;
  savedAnswers: Record<number, string>;
  voiceName?: string | null;
  savedIsCompleted?: boolean;
  onComplete?: (isCompleted: boolean) => void;
  toggleTTS: (rate: number, overrideText?: string) => void;
  ttsState: { status: 'playing' | 'paused' | 'stopped', rate: number };
  lessonId: string;
  title?: string;
}

export const Comprehension: React.FC<Props> = ({
  data,
  readingText,
  language,
  onChange,
  savedAnswers,
  voiceName,
  savedIsCompleted = false,
  onComplete,
  toggleTTS,
  ttsState,
  lessonId,
  title = "Activity 3: Comprehension"
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isChecked, setIsChecked] = useState(false);
  const [isCompleted, setIsCompleted] = useState(savedIsCompleted);

  // Randomize question order once on mount/data change
  const shuffledIndices = useMemo(() => {
    const indices = data.questions.map((_, i) => i);
    return seededShuffle(indices, `${lessonId}-comprehension`);
  }, [data.questions, lessonId]);

  if (!data || !data.questions || data.questions.length === 0) return null;

  const actualIndex = shuffledIndices[currentIndex];
  const currentQuestion = data.questions[actualIndex];
  const userAnswer = savedAnswers[actualIndex];

  const handleOptionChange = (value: string) => {
    if (isChecked) return;
    
    // Immediately record the answer
    onChange({ ...savedAnswers, [shuffledIndices[currentIndex]]: value });
    
    // Immediately check the answer
    setIsChecked(true);
    const isCorrect = value === currentQuestion.answer;

    if (isCorrect) {
      // Auto-advance after delay if correct
      const delay = 1200;
      if (currentIndex < data.questions.length - 1) {
        setTimeout(() => {
          setIsChecked(false);
          setCurrentIndex(prev => prev + 1);
        }, delay);
      } else {
        setTimeout(() => {
          setIsCompleted(true);
          onComplete?.(true);
        }, delay);
      }
    }
    // If incorrect, we stay on the page so the user can see the correction and then click "Next"
  };

  const handleNext = () => {
    if (currentIndex < data.questions.length - 1) {
      setIsChecked(false);
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsCompleted(true);
      onComplete?.(true);
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
      <section className="bg-white p-6 rounded-xl sm:shadow-sm sm:border sm:border-gray-100 mb-2 text-center">
        <h2 className="text-xl font-bold text-green-800 mb-4">{title}</h2>
        <div className="text-2xl font-black mb-4 text-green-600">
          {score === data.questions.length ? '🎉 Perfect!' : 'Good Job!'}
        </div>
        <p className="text-gray-600 text-lg mb-6 font-medium">You got {score} out of {data.questions.length} correct.</p>
        <Button onClick={handleRetry} variant="secondary" className="px-8 py-3 rounded-full font-bold">
          <RefreshCw className="w-5 h-5 mr-2" /> Retry Activity
        </Button>
      </section>
    );
  }

  const isCorrect = userAnswer === currentQuestion.answer;

  return (
    <section className="bg-white p-2 rounded-xl sm:shadow-sm sm:border sm:border-gray-100 mb-2">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-green-800 tracking-tight">{title}</h2>
        <span className="font-bold text-gray-400 text-xs uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
          Question {currentIndex + 1} of {data.questions.length}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Reading Text Column */}
        <div className="order-2 lg:order-1">
          <h3 className="font-black text-gray-400 text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Reference Text
          </h3>
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 max-h-[400px] overflow-y-auto custom-scrollbar shadow-inner select-text">
            <p className="text-gray-700 leading-relaxed font-sans text-base whitespace-pre-line" translate="no">
              {readingText}
            </p>
          </div>
        </div>

        {/* Question Column */}
        <div className="order-1 lg:order-2 flex flex-col justify-center">
          <div className="mb-6 min-h-[120px]">
            <div className="flex items-start gap-4 mb-6">
              <p className="text-lg md:text-xl font-black text-gray-900 flex-1 leading-tight tracking-tight selectable-text" translate="no">
                {currentQuestion.text || currentQuestion.question}
              </p>
              {shouldShowAudioControls() && (
                <AudioControls
                  onSlowToggle={() => toggleTTS(0.6, currentQuestion.text || currentQuestion.question)}
                  onListenToggle={() => toggleTTS(1.0, currentQuestion.text || currentQuestion.question)}
                  ttsStatus={ttsState.status}
                  currentRate={ttsState.rate}
                  hasVoices={false}
                />
              )}
            </div>

            <div className={`flex ${currentQuestion.options ? 'flex-col' : 'flex-col sm:flex-row'} gap-4`}>
              {currentQuestion.options ? (
                // Multiple Choice rendering
                currentQuestion.options.map((option: string, idx: number) => {
                  const isOptionSelected = userAnswer === option;
                  const isCorrectOption = option === currentQuestion.answer;
                  const showSuccess = isChecked && isCorrectOption;
                  const showError = isChecked && isOptionSelected && !isCorrectOption;

                  return (
                    <label 
                      key={idx}
                      className={`
                        flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 select-none
                        ${isOptionSelected 
                          ? (isChecked 
                              ? (isCorrectOption ? 'border-green-500 bg-green-50 text-green-800' : 'border-red-500 bg-red-50 text-red-800')
                              : 'border-green-500 bg-green-50 text-green-800 shadow-md ring-2 ring-green-100')
                          : (isChecked && isCorrectOption 
                              ? 'border-green-500 bg-green-50 text-green-800' 
                              : 'border-gray-100 hover:border-green-200 hover:bg-gray-50 text-gray-700')
                        }
                      `}
                    >
                      <input
                        type="radio"
                        name={`q-${currentIndex}`}
                        value={option}
                        checked={isOptionSelected}
                        onChange={() => handleOptionChange(option)}
                        className="hidden"
                        disabled={isChecked}
                      />
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors
                        ${isOptionSelected 
                          ? (isChecked 
                              ? (isCorrectOption ? 'border-green-600 bg-green-600' : 'border-red-600 bg-red-600')
                              : 'border-green-600 bg-green-600')
                          : 'border-gray-300'}
                      `}>
                        {isOptionSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <span className="font-bold text-base leading-tight" translate="no">{option}</span>
                    </label>
                  );
                })
              ) : (
                // True/False rendering (Standard fallback)
                ['true', 'false'].map((val) => {
                  const isValSelected = userAnswer === val;
                  const isCorrectVal = val === currentQuestion.answer;
                  
                  return (
                    <label 
                      key={val}
                      className={`
                        flex-1 flex items-center justify-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 select-none
                        ${isValSelected
                          ? (isChecked
                            ? (isCorrectVal ? 'border-green-500 bg-green-50 text-green-800' : 'border-red-500 bg-red-50 text-red-800')
                            : 'border-green-500 bg-green-50 text-green-800 shadow-md ring-2 ring-green-100')
                          : 'border-gray-100 hover:border-green-200 hover:bg-gray-50 text-gray-700'
                        }
                      `}
                    >
                      <input
                        type="radio"
                        name={`q-${currentIndex}`}
                        value={val}
                        checked={isValSelected}
                        onChange={() => handleOptionChange(val)}
                        className="hidden"
                        disabled={isChecked}
                      />
                      <span className="font-black text-lg uppercase tracking-widest" translate="no">{val}</span>
                    </label>
                  );
                })
              )}
            </div>

            {isChecked && !isCorrect && (
              <div className="mt-6 p-4 bg-red-50 rounded-xl border border-red-100 text-center font-bold text-red-700 animate-fade-in text-base flex items-center justify-center gap-3">
                <XCircle className="w-5 h-5" />
                Correct answer: <span className="underline decoration-2">{currentQuestion.answer}</span>
              </div>
            )}
          </div>

          {/* Navigation - Only show if incorrect or explicitly checked */}
          {isChecked && !isCorrect && (
            <div className="flex items-center justify-end mt-4 pt-4 border-t border-gray-100">
              <Button
                variant="primary"
                onClick={handleNext}
                className="min-w-[120px] px-6 py-2 rounded-full font-black text-base shadow-md hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-center gap-2">
                  {currentIndex === data.questions.length - 1 ? 'Finish' : 'Next'}
                  <ChevronRight className="w-5 h-5" />
                </div>
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};