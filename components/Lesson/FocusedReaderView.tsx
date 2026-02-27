import React, { useState, useMemo } from 'react';
import { ParsedLesson, FocusedReaderContent, UserAnswers, ReportData, ReportScorePill } from '../../types';
import { speakText } from '../../utils/textUtils';
import { GenericLessonLayout } from './GenericLessonLayout';
import { AudioControls } from '../UI/AudioControls';
import { VoiceSelectorModal } from '../UI/VoiceSelectorModal';
import { LessonFooter } from './LessonFooter';
import { HelpCircle, ChevronRight, ChevronLeft, CheckCircle2, MessageSquare, XCircle } from 'lucide-react';
import { Button } from '../UI/Button';

interface FocusedReaderViewProps {
  lesson: ParsedLesson & { content: FocusedReaderContent };
  studentName: string;
  setStudentName: (name: string) => void;
  studentId: string;
  setStudentId: (id: string) => void;
  homeroom: string;
  setHomeroom: (homeroom: string) => void;
  isNameLocked: boolean;
  onFinish: (data: ReportData) => void;
  onReset: () => void;
  answers: UserAnswers;
  setAnswers: React.Dispatch<React.SetStateAction<UserAnswers>>;
  toggleTTS: (rate: number, overrideText?: string) => void;
  ttsState: { status: 'playing' | 'paused' | 'stopped', rate: number };
  availableVoices: SpeechSynthesisVoice[];
  selectedVoiceName: string | null;
  setSelectedVoiceName: (name: string) => void;
  isVoiceModalOpen: boolean;
  setIsVoiceModalOpen: (isOpen: boolean) => void;
  audioPreference: 'recorded' | 'tts';
  setAudioPreference: (pref: 'recorded' | 'tts') => void;
}

export const FocusedReaderView: React.FC<FocusedReaderViewProps> = ({
  lesson,
  studentName,
  setStudentName,
  studentId,
  setStudentId,
  homeroom,
  setHomeroom,
  isNameLocked,
  onFinish,
  onReset,
  answers,
  setAnswers,
  toggleTTS,
  ttsState,
  availableVoices,
  selectedVoiceName,
  setSelectedVoiceName,
  isVoiceModalOpen,
  setIsVoiceModalOpen,
  audioPreference,
  setAudioPreference,
}) => {
  const content = lesson.content;
  const [currentPartIndex, setCurrentPartIndex] = useState(0);
  const currentPart = content.parts[currentPartIndex];

  const updateAnswers = (partIdx: number, questionIdx: number, answer: string) => {
    // Prevent changing answer if already set
    if (answers.focusedReader?.[partIdx]?.[questionIdx]) return;

    setAnswers(prev => {
      const focusedReader = { ...(prev.focusedReader || {}) };
      const partAnswers = { ...(focusedReader[partIdx] || {}) };
      partAnswers[questionIdx] = answer;
      focusedReader[partIdx] = partAnswers;
      return { ...prev, focusedReader };
    });
  };

  const handleWordClick = (word: string) => {
    const cleanWord = word.replace(/^[.,!?;:"'()\[\]{}]+|[.,!?;:"'()\[\]{}]+$/g, '');
    if (cleanWord) {
      speakText(cleanWord, lesson.language, 0.7, selectedVoiceName);
    }
  };

  const calculateReportData = (): ReportData => {
    const pills: ReportScorePill[] = [];
    let totalScore = 0;
    let maxOverallScore = 0;

    content.parts.forEach((part, pIdx) => {
      let partScore = 0;
      const partAnswers = answers.focusedReader?.[pIdx] || {};
      part.questions.forEach((q, qIdx) => {
        if (partAnswers[qIdx] === q.answer) {
          partScore++;
        }
      });
      pills.push({
        label: `Part ${part.part_number}`,
        score: partScore,
        total: part.questions.length
      });
      totalScore += partScore;
      maxOverallScore += part.questions.length;
    });

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    return {
      title: lesson.title || content.title,
      nickname: studentName,
      studentId,
      homeroom,
      finishTime: `${dateStr}, ${timeStr}`,
      totalScore,
      maxScore: maxOverallScore,
      pills,
    };
  };

  const renderTextWithVocabulary = (text: string, explanations: Record<string, string>) => {
    if (!text) return null;

    // Sort keys by length (descending) to match longer phrases first
    const sortedKeys = Object.keys(explanations).sort((a, b) => b.length - a.length);
    if (sortedKeys.length === 0) return text;

    // Create a regex to match any of the vocabulary keys as whole words/phrases
    // Using word boundaries \b for phrases is tricky with symbols, 
    // but for simple text language it usually works.
    const escapedKeys = sortedKeys.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    const regex = new RegExp(`(\\b(?:${escapedKeys})\\b)`, 'gi');

    // Split text by the regex, keeping the matches
    const parts = text.split(regex);

    return parts.map((part, i) => {
      const lowerPart = part.toLowerCase();
      const explanation = explanations[lowerPart];

      if (explanation) {
        return (
          <span key={i} className="relative group inline-block">
            <span 
              onClick={() => handleWordClick(part)}
              className="cursor-pointer font-bold text-green-700 border-b-2 border-dotted border-green-400 hover:bg-green-50 px-0.5 rounded transition-all"
            >
              {part}
            </span>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-64 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-xl z-50 animate-fade-in pointer-events-none">
              <p className="font-bold border-b border-gray-700 pb-1 mb-1">{part}</p>
              {explanation}
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-gray-900" />
            </div>
          </span>
        );
      }

      // If it's not a matched vocab word, handle individual word clicks for pronunciation
      // similar to how we did before, but simpler since we are already in segments.
      const wordsAndSpaces = part.split(/(\s+)/);
      return wordsAndSpaces.map((subPart, j) => {
        if (/^\s+$/.test(subPart)) return subPart;
        
        // Split by punctuation for sub-segments
        const subSegments = subPart.split(/([.,!?;:"'()\[\]{}]+)/).filter(Boolean);
        return (
          <React.Fragment key={`${i}-${j}`}>
            {subSegments.map((sub, k) => {
              if (/^[.,!?;:"'()\[\]{}]+$/.test(sub)) {
                return <span key={k}>{sub}</span>;
              }
              return (
                <span
                  key={k}
                  onClick={() => handleWordClick(sub)}
                  className="cursor-pointer hover:text-green-600 hover:bg-green-50 rounded px-0.5 transition-colors"
                >
                  {sub}
                </span>
              );
            })}
          </React.Fragment>
        );
      });
    });
  };

  return (
    <GenericLessonLayout
      lesson={lesson}
      displayTitle={lesson.title || content.title}
      studentName={studentName}
      setStudentName={setStudentName}
      studentId={studentId}
      setStudentId={setStudentId}
      homeroom={homeroom}
      setHomeroom={setHomeroom}
      isNameLocked={isNameLocked}
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Intro Section */}
        {content.seo_intro && (
          <section className="bg-green-50 p-6 rounded-2xl border border-green-100 shadow-sm animate-fade-in text-center">
             <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4 text-green-600">
               <MessageSquare className="w-6 h-6" />
             </div>
             <p className="text-gray-700 text-lg leading-relaxed italic">
               "{content.seo_intro}"
             </p>
          </section>
        )}

        {/* Navigation Dots */}
        <div className="flex justify-center gap-2 mb-4">
          {content.parts.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPartIndex(idx)}
              className={`h-3 rounded-full transition-all duration-300 ${
                currentPartIndex === idx ? 'w-8 bg-green-600' : 'w-3 bg-green-200 hover:bg-green-300'
              }`}
              title={`Go to Part ${idx + 1}`}
            />
          ))}
        </div>

        {/* Reading Section */}
        <section className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden animate-slide-up">
          <div className="bg-green-600 p-4 flex justify-between items-center text-white">
            <h2 className="text-xl font-black uppercase tracking-widest">Part {currentPart.part_number}</h2>
            
            <div className="flex gap-2">
              <AudioControls 
                onVoiceOpen={availableVoices.length > 0 ? () => setIsVoiceModalOpen(true) : undefined}
                onSlowToggle={() => toggleTTS(0.6, currentPart.text)}
                onListenToggle={() => toggleTTS(1.0, currentPart.text)}
                ttsStatus={ttsState.status}
                currentRate={ttsState.rate}
                hasVoices={availableVoices.length > 0}
                variant="white"
              />
            </div>
          </div>

          <div className="p-8 sm:p-12">
            <div className="prose max-w-none text-xl sm:text-2xl leading-relaxed text-gray-800 select-none">
              {renderTextWithVocabulary(currentPart.text, currentPart.vocabulary_explanations)}
            </div>
            
            <div className="mt-8 pt-8 border-t border-gray-100 flex items-center gap-2 text-green-600 font-bold italic">
              <HelpCircle className="w-5 h-5" />
              <span>Hover over bold green words for explanations!</span>
            </div>
          </div>
        </section>

        {/* Questions Section */}
        <section className="space-y-6 animate-fade-in" key={currentPartIndex}>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-2 bg-green-500 rounded-full" />
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Comprehension Check</h2>
          </div>

          <div className="grid gap-6">
            {currentPart.questions.map((q, qIdx) => {
              const userAnswer = answers.focusedReader?.[currentPartIndex]?.[qIdx];
              return (
                <div key={qIdx} className="bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-gray-100 hover:border-green-200 transition-all">
                  <p className="text-lg sm:text-xl font-bold text-gray-800 mb-6">
                    {qIdx + 1}. {q.question}
                  </p>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    {q.options.map((option, oIdx) => {
                      const isCorrect = option === q.answer;
                      const isSelected = userAnswer === option;
                      const hasAnswered = !!userAnswer;
                      
                      let buttonClass = 'border-gray-100 bg-gray-50 text-gray-700 hover:border-green-200';
                      if (hasAnswered) {
                        if (isCorrect) {
                          buttonClass = 'border-green-500 bg-green-50 text-green-900';
                        } else if (isSelected) {
                          buttonClass = 'border-red-500 bg-red-50 text-red-900';
                        } else {
                          buttonClass = 'border-gray-100 bg-gray-50 text-gray-400 opacity-50 cursor-not-allowed';
                        }
                      }

                      return (
                        <button
                          key={oIdx}
                          onClick={() => updateAnswers(currentPartIndex, qIdx, option)}
                          disabled={hasAnswered}
                          className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left font-bold ${buttonClass}`}
                        >
                          <span>{option}</span>
                          {hasAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />}
                          {isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-600 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Controls */}
        <div className="flex justify-between items-center py-8">
          <Button
            variant="secondary"
            onClick={() => setCurrentPartIndex(Math.max(0, currentPartIndex - 1))}
            disabled={currentPartIndex === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-5 h-5" /> Previous Part
          </Button>

          {currentPartIndex < content.parts.length - 1 ? (
            <Button
              variant="primary"
              onClick={() => setCurrentPartIndex(currentPartIndex + 1)}
              className="flex items-center gap-2"
            >
              Next Part <ChevronRight className="w-5 h-5" />
            </Button>
          ) : (
            <div className="text-green-600 font-black animate-bounce flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6" /> All Parts Read!
            </div>
          )}
        </div>

        <LessonFooter
          studentName={studentName}
          setStudentName={setStudentName}
          studentId={studentId}
          setStudentId={setStudentId}
          homeroom={homeroom}
          setHomeroom={setHomeroom}
          isNameLocked={isNameLocked}
          onFinish={() => onFinish(calculateReportData())}
          onReset={onReset}
        />
      </div>

      <VoiceSelectorModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        voices={availableVoices}
        selectedVoiceName={selectedVoiceName}
        onSelectVoice={setSelectedVoiceName}
        language={lesson.language}
        hasRecordedAudio={!!lesson.audioFileUrl}
        audioPreference={audioPreference}
        onSelectPreference={setAudioPreference}
      />
    </GenericLessonLayout>
  );
};
