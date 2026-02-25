import React, { useState } from 'react';
import { InformationGapQuestion } from '../../types';
import { CheckCircle2, XCircle, Volume2, Trophy, ArrowRight } from 'lucide-react';
import { Button } from '../UI/Button';
import { speakText } from '../../utils/textUtils';

interface InformationGapQuestionsProps {
  questions: InformationGapQuestion[];
  onFinish: (score: number, total: number) => void;
  language: string;
  selectedVoiceName: string | null;
}

export const InformationGapQuestions: React.FC<InformationGapQuestionsProps> = ({ 
  questions, 
  onFinish,
  language,
  selectedVoiceName
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  if (questions.length === 0) {
    return (
      <div className="bg-gray-50 p-12 rounded-3xl border-2 border-dashed border-gray-200 text-center animate-fade-in">
        <p className="text-gray-500 font-bold text-xl mb-4">No questions for this role.</p>
        <p className="text-gray-400">Wait for your partner to ask you questions, then show them this screen when you are both done.</p>
        <div className="mt-8">
            <Button onClick={() => onFinish(0, 0)} className="bg-green-600 hover:bg-green-700 shadow-lg">Finish Lesson</Button>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="bg-white p-12 rounded-3xl shadow-xl border-4 border-green-500 text-center animate-bounce-in">
        <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Trophy className="w-12 h-12 text-yellow-500" />
        </div>
        <h2 className="text-4xl font-black text-green-900 mb-2">Well Done!</h2>
        <p className="text-gray-600 text-xl mb-8">You completed your side of the activity.</p>
        
        <div className="flex justify-center gap-8 mb-10">
          <div className="text-center">
            <div className="text-5xl font-black text-green-600 mb-1">{score}/{questions.length}</div>
            <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">Score</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-black text-blue-600 mb-1">{percentage}%</div>
            <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">Accuracy</div>
          </div>
        </div>

        <Button 
          onClick={() => onFinish(score, questions.length)} 
          className="w-full max-w-sm h-16 text-xl font-black bg-green-600 hover:bg-green-700 hover:scale-105 transition-all shadow-xl rounded-2xl"
        >
          {percentage === 100 ? 'Continue' : 'View Results Report'}
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
    <div className="bg-white p-8 md:p-12 rounded-3xl shadow-lg border border-gray-100 animate-fade-in">
      <div className="flex justify-between items-center mb-10">
        <div className="bg-gray-100 text-gray-500 px-4 py-1.5 rounded-full text-sm font-black">
          QUESTION {currentQuestionIndex + 1} OF {questions.length}
        </div>
        <div className="text-green-600 font-black">
          SCORE: {score}
        </div>
      </div>

      <div className="mb-10 text-center">
        <div className="flex justify-center mb-4">
            <button 
                onClick={() => speakText(currentQuestion.question, language, 0.7, selectedVoiceName)}
                className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center hover:bg-green-100 transition-colors"
            >
                <Volume2 className="w-6 h-6" />
            </button>
        </div>
        <h3 className="text-3xl font-black text-gray-900 leading-tight">
          {currentQuestion.question}
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-10">
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
              className={`p-6 rounded-2xl text-left text-xl transition-all flex justify-between items-center ${optionStyles}`}
            >
              <span>{option}</span>
              {showFeedback && option === currentQuestion.correct_answer && <CheckCircle2 className="w-8 h-8 text-green-600" />}
              {showFeedback && option === selectedOption && option !== currentQuestion.correct_answer && <XCircle className="w-8 h-8 text-red-600" />}
            </button>
          );
        })}
      </div>

      {showFeedback && (
        <div className="animate-slide-up">
          <Button 
            onClick={handleNext} 
            className="w-full h-16 text-xl font-black bg-green-600 hover:bg-green-700 rounded-2xl shadow-lg flex items-center justify-center gap-2"
          >
            {currentQuestionIndex < questions.length - 1 ? (
              <>Next Question <ArrowRight className="w-6 h-6" /></>
            ) : (
              'Finish Quiz'
            )}
          </Button>
        </div>
      )}
    </div>
  );
};
