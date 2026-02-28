import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface Props {
  data: {
    questions: { text: string }[];
    examples?: string;
  };
  savedAnswers: Record<number, string>;
  onChange: (answers: Record<number, string>) => void;
}

export const WrittenExpression: React.FC<Props> = ({
  data,
  savedAnswers,
  onChange
}) => {
  const [showExamples, setShowExamples] = useState(false);

  if (!data || !data.questions) return null;

  return (
    <section className="bg-white p-2 sm:p-4 rounded-xl shadow-sm border border-green-100 relative mb-2">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-black text-green-900 uppercase tracking-tight">Written Expression</h2>
      </div>
      <p className="text-gray-500 mb-4 text-sm font-medium">Write a short response for each of the following questions.</p>
      
      <div className="space-y-8">
        {data.questions.map((q, i) => (
          <div key={i} className="space-y-3">
            <p className="font-medium text-gray-800 text-lg">{i + 1}. {q.text}</p>
            <textarea
              className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none transition-all min-h-[100px] text-lg"
              placeholder="Write your answer here..."
              value={savedAnswers[i] || ''}
              onChange={(e) => {
                const newAnswers = { ...savedAnswers, [i]: e.target.value };
                onChange(newAnswers);
              }}
            />
          </div>
        ))}
      </div>

      {data.examples && (
        <div className="mt-8 pt-6 border-t border-gray-100">
          <button
            onClick={() => setShowExamples(!showExamples)}
            className="text-green-600 font-bold flex items-center gap-2 hover:text-green-700 transition-colors"
          >
            {showExamples ? (
              <><EyeOff className="w-5 h-5" /> Hide Example Answers</>
            ) : (
              <><Eye className="w-5 h-5" /> Show Example Answers</>
            )}
          </button>

          {showExamples && (
            <div
              className="mt-4 p-6 bg-green-50 rounded-xl border border-green-100 prose max-w-none animate-fade-in"
              dangerouslySetInnerHTML={{ __html: data.examples }}
            />
          )}
        </div>
      )}
    </section>
  );
};
