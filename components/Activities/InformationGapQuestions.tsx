import React, { useState } from 'react';
import { InformationGapQuestion } from '../../types';
import { CheckCircle2, XCircle, Volume2, Trophy, ArrowRight } from 'lucide-react';
import { Button } from '../UI/Button';
import { speakText } from '../../utils/textUtils';
import { AudioControls } from '../UI/AudioControls';

interface InformationGapQuestionsProps {
  questions: InformationGapQuestion[];
  onFinish: (score: number, total: number) => void;
  language: string;
  selectedVoiceName: string | null;
  toggleTTS: (rate: number, overrideText?: string) => void;
  ttsState: { status: 'playing' | 'paused' | 'stopped', rate: number };
  isLastActivity: boolean;
}

export const InformationGapQuestions: React.FC<InformationGapQuestionsProps> = ({ 
  questions, 
  onFinish,
  language,
  selectedVoiceName,
  toggleTTS,
  ttsState,
  isLastActivity
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  if (questions.length === 0) {
    return (
      <div className="bg-gray-50 p-12 rounded-xl border-2 border-dashed border-gray-200 text-center animate-fade-in">
        <p className="text-gray-500 font-bold text-xl mb-4">No questions for this role.</p>
        <p className="text-gray-400">Wait for your partner to ask you questions, then show them this screen when you are both done.</p>
        <div className="mt-8">
            <Button onClick={() => onFinish(0, 0)} className="bg-green-600 hover:bg-green-700 shadow-sm">Finish Lesson</Button>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="bg-white p-12 rounded-xl shadow-sm border border-green-100 text-center animate-bounce-in">
        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Trophy className="w-10 h-10 text-yellow-500" />
        </div>
        <h2 className="text-3xl font-black text-green-900 mb-2">Well Done!</h2>
        <p className="text-gray-600 text-lg mb-8">You completed your side of the activity.</p>
        
        <div className="flex justify-center gap-8 mb-10">
          <div className="text-center">
            <div className="text-4xl font-black text-green-600 mb-1">{score}/{questions.length}</div>
            <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">Score</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-black text-blue-600 mb-1">{percentage}%</div>
            <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">Accuracy</div>
          </div>
        </div>

        <Button 
          onClick={() => onFinish(score, questions.length)} 
          className="w-full max-w-sm h-14 text-lg font-black bg-green-600 hover:bg-green-700 transition-all shadow-sm rounded-xl"
        >
          {isLastActivity ? 'Finish Lesson' : 'Proceed to Next Activity'}
        </Button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  const handleOptionSelect = (option: string) => {
    if (showFeedback) return;
    setSelectedOption(option);
    setShowFeedback(true);
    
    if (option === currentQuestion.correct_answer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      setIsCompleted(true);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-green-100 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div className="bg-gray-100 text-gray-500 px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
        <div className="text-green-600 font-black text-sm uppercase tracking-widest">
          Score: {score}
        </div>
      </div>

      <div className="mb-10 flex flex-col items-center">
        <AudioControls
          onSlowToggle={() => {
            toggleTTS(0.6, currentQuestion.question);
          }}
          onListenToggle={() => {
            toggleTTS(1.0, currentQuestion.question);
          }}
          ttsStatus={ttsState.status}
          currentRate={ttsState.rate}
          hasVoices={false}
          className="mb-4"
        />
        <h3 className="text-lg font-bold text-gray-900 leading-relaxed text-center">
          {currentQuestion.question}
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-2">
        {currentQuestion.options.map((option, i) => {
          let optionStyles = "bg-gray-50 border-2 border-gray-100 text-gray-700 hover:border-green-300 hover:bg-green-50";
          if (showFeedback) {
            if (option === currentQuestion.correct_answer) {
              optionStyles = "bg-green-100 border-2 border-green-500 text-green-900 font-bold";
            } else if (option === selectedOption) {
              optionStyles = "bg-red-100 border-2 border-red-500 text-red-900 font-bold";
            } else {
              optionStyles = "bg-gray-50 border-2 border-gray-100 text-gray-400 opacity-50";
            }
          }

          return (
            <button
              key={i}
              onClick={() => handleOptionSelect(option)}
              disabled={showFeedback}
              className={`p-4 rounded-xl text-left text-base font-bold transition-all flex justify-between items-center ${optionStyles}`}
            >
              <span>{option}</span>
              {showFeedback && option === currentQuestion.correct_answer && <CheckCircle2 className="w-6 h-6 text-green-600" />}
              {showFeedback && option === selectedOption && option !== currentQuestion.correct_answer && <XCircle className="w-6 h-6 text-red-600" />}
            </button>
          );
        })}
      </div>

      {showFeedback && (
        <div className="animate-slide-up mt-6">
          <Button 
            onClick={handleNext} 
            className="w-full h-14 text-lg font-black bg-green-600 hover:bg-green-700 rounded-xl shadow-sm flex items-center justify-center gap-2"
          >
            {currentQuestionIndex < questions.length - 1 ? (
              <>Next Question <ArrowRight className="w-5 h-5" /></>
            ) : (
              'Finish Quiz'
            )}
          </Button>
        </div>
      )}
    </div>
  );
};
