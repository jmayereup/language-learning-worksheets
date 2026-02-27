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
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].pageX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;
    const touchEnd = e.changedTouches[0].pageX;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentPartIndex < content.parts.length - 1) {
      setCurrentPartIndex(currentPartIndex + 1);
    } else if (isRightSwipe && currentPartIndex > 0) {
      setCurrentPartIndex(currentPartIndex - 1);
    }
    setTouchStart(null);
  };

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

    // Normalize to NFC to ensure consistent character representation
    const normalizedText = text.normalize('NFC');
    const normalizedExplanations: Record<string, string> = {};
    Object.entries(explanations).forEach(([key, value]) => {
      normalizedExplanations[key.normalize('NFC').toLowerCase()] = value;
    });

    const sortedKeys = Object.keys(normalizedExplanations).sort((a, b) => b.length - a.length);
    
    // Function to render clickable segments for regular text
    const renderClickableSegments = (textSegment: string, segmentKeyPrefix: string) => {
      const wordsAndSpaces = textSegment.split(/(\s+)/);
      return wordsAndSpaces.map((subPart, j) => {
        if (/^\s+$/.test(subPart)) return subPart;
        
        // Split by punctuation for sub-segments
        const subSegments = subPart.split(/([.,!?;:"'()\[\]{}]+)/).filter(Boolean);
        return (
          <React.Fragment key={`${segmentKeyPrefix}-${j}`}>
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
    };

    if (sortedKeys.length === 0) return renderClickableSegments(normalizedText, "plain");

    // Create regex for vocabulary words
    const escapedKeys = sortedKeys.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    const regex = new RegExp(`(${escapedKeys})`, 'gui');

    const result: (string | React.ReactNode | (string | React.ReactNode | React.ReactNode[])[])[] = [];
    let lastIndex = 0;
    
    // Manual iteration with exec to handle boundaries and duplicates correctly
    let match;
    while ((match = regex.exec(normalizedText)) !== null) {
      const start = match.index;
      const word = match[0];
      const end = start + word.length;

      // Verify word boundaries
      const charBefore = start > 0 ? normalizedText[start - 1] : '';
      const charAfter = end < normalizedText.length ? normalizedText[end] : '';
      
      const isWordBoundaryBefore = !charBefore || !/[\p{L}\p{N}]/u.test(charBefore);
      const isWordBoundaryAfter = !charAfter || !/[\p{L}\p{N}]/u.test(charAfter);

      if (isWordBoundaryBefore && isWordBoundaryAfter) {
        // Add preceding text as clickable segments
        if (start > lastIndex) {
          result.push(renderClickableSegments(normalizedText.substring(lastIndex, start), `text-${start}`));
        }

        // Add highlighted vocabulary word
        const explanation = normalizedExplanations[word.toLowerCase()];
        result.push(
          <span key={`vocab-${start}`} className="relative group inline-block">
            <span 
              onClick={() => handleWordClick(word)}
              className="cursor-pointer font-bold text-green-700 border-b-2 border-dotted border-green-400 hover:bg-green-50 px-0.5 rounded transition-all"
            >
              {word}
            </span>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-64 p-3 bg-white border border-green-100 text-gray-800 text-sm rounded-lg shadow-xl z-50 animate-fade-in pointer-events-none">
              <p className="font-bold border-b border-green-100 pb-1 mb-1 text-green-700">{word}</p>
              {explanation}
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-white" />
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-green-100 mt-px -z-10" />
            </div>
          </span>
        );
        lastIndex = end;
      }
    }

    // Add remaining text as clickable segments
    if (lastIndex < normalizedText.length) {
      result.push(renderClickableSegments(normalizedText.substring(lastIndex), `final`));
    }

    return result;
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
        {lesson.imageUrl && (
          <div className="w-full flex justify-center mb-6">
            <img
              src={lesson.imageUrl}
              alt="Lesson topic"
              className="w-full h-auto max-h-[400px] object-contain rounded-2xl shadow-lg bg-white p-4 border border-green-100 animate-fade-in"
            />
          </div>
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
        <section 
          className="bg-transparent sm:bg-white rounded-none sm:rounded-xl shadow-none sm:shadow-sm border-none sm:border sm:border-green-100 animate-slide-up"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="bg-white border-b border-green-100 p-4 flex justify-between items-center text-green-900 sm:rounded-t-xl">
            <h2 className="text-xl font-black uppercase tracking-widest">Part {currentPart.part_number}</h2>
            
            <div className="flex gap-2">
              <AudioControls 
                onVoiceOpen={availableVoices.length > 0 ? () => setIsVoiceModalOpen(true) : undefined}
                onSlowToggle={() => toggleTTS(0.6, currentPart.text)}
                onListenToggle={() => toggleTTS(1.0, currentPart.text)}
                ttsStatus={ttsState.status}
                currentRate={ttsState.rate}
                hasVoices={availableVoices.length > 0}
              />
            </div>
          </div>

          <div className="p-1 mx-1 sm:p-4">
            <div className="prose max-w-none text-lg leading-relaxed text-gray-800 select-none">
              {renderTextWithVocabulary(currentPart.text, currentPart.vocabulary_explanations)}
            </div>
            
            <div className="mt-2 pt-2 border-t border-gray-100 flex items-center gap-2 text-green-600 font-bold italic">
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
                <div key={qIdx} className="bg-transparent sm:bg-white p-4 sm:p-8 rounded-none sm:rounded-xl shadow-none sm:shadow-sm border-none sm:border sm:border-green-100 hover:border-green-300 transition-all">
                  <p className="text-lg sm:text-xl font-bold text-gray-800 mb-6">
                    {qIdx + 1}. {q.question}
                  </p>
                  
                  <div className="grid sm:grid-cols-2 gap-2">
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
