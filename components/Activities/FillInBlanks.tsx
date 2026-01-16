import React, { useState, useMemo } from 'react';
import { FillInBlankItem, VocabularyItem } from '../../types';
import { normalizeString, shuffleArray, speakText, shouldShowAudioControls, selectElementText } from '../../utils/textUtils';
import { Button } from '../UI/Button';
import { Check, Volume2 } from 'lucide-react';

interface Props {
  data: FillInBlankItem[];
  vocabItems: VocabularyItem[];
  level: string;
  language: string;
  onChange: (answers: Record<number, string>) => void;
  savedAnswers: Record<number, string>;
}

export const FillInBlanks: React.FC<Props> = ({ data, vocabItems, level, language, onChange, savedAnswers }) => {
  const [isChecked, setIsChecked] = useState(false);

  // Randomize question order once on mount/data change
  const shuffledIndices = useMemo(() => {
    const indices = data.map((_, i) => i);
    return shuffleArray(indices);
  }, [data]);

  // Create word bank from answers
  const wordBank = useMemo(() => {
    const answers = data.map(item => item.answer);
    return shuffleArray(answers);
  }, [data]);

  if (!data || data.length === 0) return null;

  const handleCheck = () => {
    setIsChecked(true);
  };

  const handleChange = (originalIndex: number, value: string) => {
    if (isChecked) setIsChecked(false);
    onChange({
      ...savedAnswers,
      [originalIndex]: value
    });
  };

  // Calculate score
  const correctCount = data.reduce((acc, item, index) => {
    const userAnswer = savedAnswers[index] || '';
    return normalizeString(userAnswer) === normalizeString(item.answer) ? acc + 1 : acc;
  }, 0);

  return (
    <section className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-800">Activity 2: Fill in the blanks</h2>
        {isChecked && (
          <div className={`text-xl font-bold ${correctCount === data.length ? 'text-green-600' : 'text-blue-600'}`}>
            Score: {correctCount}/{data.length}
          </div>
        )}
      </div>

      {/* Word Bank */}
      <div className="bg-blue-50 p-4 rounded-lg mb-8 border border-blue-100">
        <h3 className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-3">Word Bank</h3>
        <div className="flex flex-wrap justify-around gap-2" translate="no">
          {wordBank.map((word, idx) => (
            <span
              key={idx}
              className="px-3 py-1.5 bg-white text-blue-800 rounded-md shadow-sm border border-blue-100 font-medium"
            >
              {word}
            </span>
          ))}
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {shuffledIndices.map((originalIndex) => {
          const item = data[originalIndex];
          const userAnswer = savedAnswers[originalIndex] || '';
          const isCorrect = normalizeString(userAnswer) === normalizeString(item.answer);

          let inputClass = "border-b-2 border-gray-300 bg-gray-50 px-2 py-1 mx-2 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors min-w-[120px] text-center font-medium";

          if (isChecked) {
            inputClass = isCorrect
              ? "border-b-2 border-green-500 bg-green-50 text-green-900 font-bold px-2 py-1 mx-2 min-w-[120px] text-center"
              : "border-b-2 border-red-500 bg-red-50 text-red-900 font-bold px-2 py-1 mx-2 min-w-[120px] text-center";
          }

          return (
            <div key={originalIndex} className="leading-loose text-lg text-gray-700 flex flex-wrap items-center">
              {shouldShowAudioControls() && (
                <button
                  onClick={(e) => {
                    speakText(`${item.before} ${item.answer} ${item.after}`, language, 0.7);
                    selectElementText(e.currentTarget.parentElement?.querySelector('.selectable-text') as HTMLElement);
                  }}
                  className="mr-3 text-gray-400 hover:text-blue-600 transition-colors"
                  title="Hear sentence"
                >
                  <Volume2 size={20} />
                </button>
              )}
              <div className="selectable-text flex flex-wrap items-center" translate="no">
                <span>{item.before}</span>
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => handleChange(originalIndex, e.target.value)}
                  className={inputClass}
                  placeholder="_____"
                />
                <span>{item.after}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="mt-8 flex justify-center gap-4">
        <Button onClick={handleCheck} icon={<Check size={20} />}>
          Check Answers
        </Button>
      </div>
    </section>
  );
};
