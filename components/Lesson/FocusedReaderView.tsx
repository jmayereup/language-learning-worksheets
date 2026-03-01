import React, { useState, useMemo } from 'react';
import { ParsedLesson, FocusedReaderContent, UserAnswers, ReportData, ReportScorePill } from '../../types';
import { speakText } from '../../utils/textUtils';
import { AudioControls } from '../UI/AudioControls';
import { VoiceSelectorModal } from '../UI/VoiceSelectorModal';
import { LessonFooter } from './LessonFooter';
import { HelpCircle, ChevronRight, ChevronLeft, CheckCircle2, MessageSquare, XCircle } from 'lucide-react';
import { Button } from '../UI/Button';
import { Vocabulary } from '../Activities/Vocabulary';
import { ReadingPassage } from '../Activities/ReadingPassage';
import { Comprehension } from '../Activities/Comprehension';
import { CollapsibleActivity } from '../UI/CollapsibleActivity';
import { LessonMedia } from '../UI/LessonMedia';
import { useFocusedReaderScores } from '../../hooks/useFocusedReaderScores';

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


  const {
    vocabScore,
    isVocabCompleted,
    comprehensionScore,
    isComprehensionCompleted,
    calculateReportData
  } = useFocusedReaderScores(content, answers, currentPartIndex);


  return (
    <div 
      className="space-y-4"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="max-w-4xl mx-auto px-1 sm:px-4 py-4 sm:py-8 space-y-2">
        <LessonMedia 
          imageUrl={lesson.imageUrl} 
          title={lesson.title || content.title} 
        />


        {/* Navigation Dots */}
        <div className="flex justify-center gap-2 mb-4">
          {content.parts.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPartIndex(idx)}
              className={`h-3 rounded-full transition-all duration-300 ${
                currentPartIndex === idx ? 'w-8 bg-blue-600' : 'w-3 bg-blue-200 hover:bg-blue-300'
              }`}
              title={`Go to Part ${idx + 1}`}
            />
          ))}
        </div>

        <ReadingPassage
          text={currentPart.text}
          language={lesson.language}
          title={`Page ${currentPart.part_number}`}
          vocabularyExplanations={currentPart.vocabulary_explanations}
          onSlowToggle={() => toggleTTS(0.6, currentPart.text)}
          onListenToggle={() => toggleTTS(1.0, currentPart.text)}
          ttsStatus={ttsState.status}
          currentRate={ttsState.rate}
          hasVoices={availableVoices.length > 0}
          onVoiceOpen={availableVoices.length > 0 ? () => setIsVoiceModalOpen(true) : undefined}
          showHighlightHelp={true}
          className="animate-slide-up"
        />

        {/* Vocabulary Section */}
        {Object.keys(currentPart.vocabulary_explanations).length > 0 && (
          <section className="animate-fade-in">
            <CollapsibleActivity
              isCompleted={isVocabCompleted}
              title={`Page ${currentPart.part_number} Vocabulary`}
              score={`${vocabScore}/${Object.keys(currentPart.vocabulary_explanations).length}`}
            >
              <Vocabulary 
                data={{
                  items: Object.keys(currentPart.vocabulary_explanations).map((word, i) => ({
                    label: word,
                    answer: `def_${i}`
                  })),
                  definitions: Object.entries(currentPart.vocabulary_explanations).map(([word, def], i) => ({
                    id: `def_${i}`,
                    text: def
                  }))
                }}
                language={lesson.language}
                onChange={(vAnswers) => {
                  setAnswers(prev => {
                    const newVocab = { ...(prev.vocabulary || {}) };
                    // First clear all existing matches for this specific part
                    Object.keys(newVocab).forEach(key => {
                      if (key.startsWith(`vocab_${currentPartIndex}_`)) {
                        delete newVocab[key];
                      }
                    });
                    // Then apply the new set of matches
                    Object.entries(vAnswers).forEach(([key, val]) => {
                      const pIdxKey = key.replace('vocab_', `vocab_${currentPartIndex}_`);
                      newVocab[pIdxKey] = val;
                    });
                    return { ...prev, vocabulary: newVocab };
                  });
                }}
                savedAnswers={(() => {
                  const partVocab: Record<string, string> = {};
                  Object.entries(answers.vocabulary || {}).forEach(([key, val]) => {
                    if (key.startsWith(`vocab_${currentPartIndex}_`)) {
                      const originalKey = key.replace(`vocab_${currentPartIndex}_`, 'vocab_');
                      partVocab[originalKey] = val;
                    }
                  });
                  return partVocab;
                })()}
                toggleTTS={toggleTTS}
                ttsState={ttsState}
                lessonId={`${lesson.id}-part-${currentPartIndex}`}
                title={`Page ${currentPart.part_number} Vocabulary`}
                savedIsChecked={isVocabCompleted}
                hasActivityToggle={true}
              />
            </CollapsibleActivity>
          </section>
        )}

        {/* Questions Section */}
        {currentPart.questions.length > 0 && (
          <section className="animate-fade-in" key={currentPartIndex}>
            <CollapsibleActivity
              isCompleted={isComprehensionCompleted}
              title={`Page ${currentPart.part_number} Questions`}
              score={`${comprehensionScore}/${currentPart.questions.length}`}
            >
              <Comprehension
                data={{ questions: currentPart.questions }}
                readingText={currentPart.text}
                language={lesson.language}
                onChange={(partAnswers) => {
                  setAnswers(prev => {
                    const focusedReader = { ...(prev.focusedReader || {}) };
                    focusedReader[currentPartIndex] = partAnswers;
                    return { ...prev, focusedReader };
                  });
                }}
                savedAnswers={answers.focusedReader?.[currentPartIndex] || {}}
                voiceName={selectedVoiceName}
                toggleTTS={toggleTTS}
                ttsState={ttsState}
                lessonId={`${lesson.id}-part-${currentPartIndex}`}
                title={`Page ${currentPart.part_number} Questions`}
                showReferenceText={false}
                savedIsCompleted={isComprehensionCompleted}
              />
            </CollapsibleActivity>
          </section>
        )}
        <hr className="border-gray-300 my-6"/>
        {/* Controls */}
        <div className="flex justify-between items-center">
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
          onFinish={() => onFinish(calculateReportData(lesson.title, studentName, studentId, homeroom))}
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
    </div>
  );
};
