import React, { useState, useEffect } from 'react';
import { VocabularyActivity } from '../../types';
import { Button } from '../UI/Button';
import { Volume2, Settings2 } from 'lucide-react';
import { speakText, shouldShowAudioControls, selectElementText, seededShuffle } from '../../utils/textUtils';
import { AudioControls } from '../UI/AudioControls';

interface Props {
  data: VocabularyActivity;
  language: string;
  onChange: (answers: Record<string, string>) => void;
  savedAnswers: Record<string, string>;
  voiceName?: string | null;
  savedIsChecked?: boolean;
  onComplete?: (isChecked: boolean) => void;
  toggleTTS: (rate: number, overrideText?: string) => void;
  ttsState: { status: 'playing' | 'paused' | 'stopped', rate: number };
  lessonId: string;
}

export const Vocabulary: React.FC<Props> = ({ 
  data, 
  language, 
  onChange, 
  savedAnswers, 
  voiceName, 
  savedIsChecked = false, 
  onComplete,
  toggleTTS,
  ttsState,
  lessonId
}) => {
  const [shuffledIndices, setShuffledIndices] = useState<number[]>([]);
  const [isChecked, setIsChecked] = useState(savedIsChecked);
  const [score, setScore] = useState(0);
  const [activeSpeechId, setActiveSpeechId] = useState<string | null>(null);

  useEffect(() => {
    // Shuffle only once on mount or data change
    const indices = data.items.map((_, i) => i);
    setShuffledIndices(seededShuffle(indices, `${lessonId}-vocab`));
  }, [data, lessonId]);

  const handleInputChange = (itemIndex: number, value: string) => {
    // Only allow 1 char
    const char = value.slice(-1).toLowerCase();

    const newAnswers = { ...savedAnswers, [`vocab_${itemIndex}`]: char };
    onChange(newAnswers);

    // Optional: If you want to clear validation visual when they type, uncomment below
    // setIsChecked(false); 
  };

  const checkAnswers = () => {
    let correctCount = 0;

    shuffledIndices.forEach(idx => {
      const item = data.items[idx];
      const userAnswer = savedAnswers[`vocab_${idx}`] || '';
      // Find which definition letter corresponds to the correct answer ID
      const correctDefIndex = data.definitions.findIndex(d => d.id === item.answer);
      const correctChar = String.fromCharCode(97 + correctDefIndex); // a, b, c...

      if (userAnswer.toLowerCase() === correctChar) {
        correctCount++;
      }
    });

    setScore(correctCount);
    setIsChecked(true);
    onComplete?.(true);
  };

  return (
    <section className="bg-white p-2 rounded-xl sm:shadow-sm sm:border sm:border-gray-100 mb-2">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-green-800">Activity 1: Vocabulary</h2>
      </div>

      <p className="text-gray-600 mb-6 text-lg">Select the correct letter for each word. You can check your answers as many times as you like.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Words Column */}
        <div className="space-y-4">
          <h3 className="font-semibold text-xl text-gray-800 mb-4">Match the words:</h3>
          {shuffledIndices.map((originalIndex, displayIndex) => {
            const item = data.items[originalIndex];
            const inputId = `vocab_${originalIndex}`;
            const val = savedAnswers[inputId] || '';

            // Determine styling based on check state
            let borderClass = "border-gray-300 focus:ring-green-500 focus:border-green-500";
            if (isChecked && val) {
              const correctDefIndex = data.definitions.findIndex(d => d.id === item.answer);
              const correctChar = String.fromCharCode(97 + correctDefIndex);
              borderClass = val.toLowerCase() === correctChar
                ? "border-green-500 bg-green-50 text-green-700"
                : "border-red-500 bg-red-50 text-red-700";
            }

            return (
              <div key={`word-${originalIndex}`} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <input
                  type="text"
                  maxLength={1}
                  value={val}
                  onChange={(e) => handleInputChange(originalIndex, e.target.value)}
                  className={`w-12 h-12 text-center text-xl font-bold rounded-md border-2 outline-none transition-colors uppercase ${borderClass}`}
                  placeholder="?"
                />
                {shouldShowAudioControls() && (
                  <AudioControls
                    onSlowToggle={() => {
                      const id = `word-${originalIndex}`;
                      setActiveSpeechId(id);
                      toggleTTS(0.6, item.label);
                      if (ttsState.status === 'stopped') {
                        setTimeout(() => setActiveSpeechId(null), 2000);
                      }
                    }}
                    onListenToggle={() => {
                      const id = `word-${originalIndex}`;
                      setActiveSpeechId(id);
                      toggleTTS(1.0, item.label);
                      if (ttsState.status === 'stopped') {
                        setTimeout(() => setActiveSpeechId(null), 2000);
                      }
                    }}
                    ttsStatus={activeSpeechId === `word-${originalIndex}` ? ttsState.status : 'stopped'}
                    currentRate={activeSpeechId === `word-${originalIndex}` ? ttsState.rate : 1.0}
                    hasVoices={false}
                  />
                )}
                <span className="font-medium text-gray-700 text-lg selectable-text" translate="no">{displayIndex + 1}. {item.label}</span>
              </div>
            );
          })}
        </div>

        {/* Definitions Column */}
        <div className="space-y-4">
          <h3 className="font-semibold text-xl text-gray-800 mb-4">Definitions:</h3>
          {data.definitions.map((def, idx) => (
            <div key={def.id} className="flex gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 items-start">
              <span className="font-bold text-gray-500 text-lg min-w-6">{String.fromCharCode(97 + idx)}.</span>
              <div className="flex-1 flex justify-between items-start gap-2">
                <span className="text-gray-700 leading-snug text-lg selectable-text" translate="no">{def.text}</span>
                {shouldShowAudioControls() && (
                  <AudioControls
                    onSlowToggle={() => {
                      const id = `def-${idx}`;
                      setActiveSpeechId(id);
                      toggleTTS(0.6, def.text);
                      if (ttsState.status === 'stopped') {
                        setTimeout(() => setActiveSpeechId(null), 3000);
                      }
                    }}
                    onListenToggle={() => {
                      const id = `def-${idx}`;
                      setActiveSpeechId(id);
                      toggleTTS(1.0, def.text);
                      if (ttsState.status === 'stopped') {
                        setTimeout(() => setActiveSpeechId(null), 3000);
                      }
                    }}
                    ttsStatus={activeSpeechId === `def-${idx}` ? ttsState.status : 'stopped'}
                    currentRate={activeSpeechId === `def-${idx}` ? ttsState.rate : 1.0}
                    hasVoices={false}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center gap-4">
        <div className="flex items-center gap-4">
          <Button onClick={checkAnswers} size="lg">Check Answers</Button>
          {isChecked && (
            <div className={`text-xl font-bold ${score === data.items.length ? 'text-green-600' : 'text-green-600'}`}>
              Score: {score} / {data.items.length}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};