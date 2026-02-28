import React, { useState, useEffect } from 'react';
import { ParsedLesson, StandardLessonContent, InformationGapContent, FocusedReaderContent, LessonContent, ReportData } from '../../types';
import { selectElementText } from '../../utils/textUtils';
import { Loader } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTTS } from '../../hooks/useTTS';
import { useLessonProgress } from '../../hooks/useLessonProgress';
import { ReportCard } from '../UI/ReportCard';

const InformationGapView = React.lazy(() => import('./InformationGapView').then(m => ({ default: m.InformationGapView })));
const WorksheetView = React.lazy(() => import('./WorksheetView').then(m => ({ default: m.WorksheetView })));
const FocusedReaderView = React.lazy(() => import('./FocusedReaderView').then(m => ({ default: m.FocusedReaderView })));

interface Props {
  lesson: ParsedLesson;
}

const isStandardLesson = (content: LessonContent): content is StandardLessonContent => {
  return content !== null && typeof content === 'object' && 'activities' in content && !Array.isArray(content.activities);
};

const isFocusedReader = (content: LessonContent): content is FocusedReaderContent => {
  return content !== null && typeof content === 'object' && 'parts' in content && Array.isArray((content as any).parts);
};

export const LessonView: React.FC<Props> = ({ lesson }) => {
  const isStandard = isStandardLesson(lesson.content);
  const isFocused = isFocusedReader(lesson.content);

  const {
    answers,
    setAnswers,
    completionStates,
    setCompletionStates,
    studentName,
    setStudentName,
    studentId,
    setStudentId,
    homeroom,
    setHomeroom,
    resetProgress,
  } = useLessonProgress(lesson.id);

  const [showReportCard, setShowReportCard] = useState(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  
  const [isNameLocked, setIsNameLocked] = useState(false);
  const passageRef = React.useRef<HTMLDivElement>(null);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  // TTS Hook
  const {
    ttsState,
    availableVoices,
    selectedVoiceName,
    setSelectedVoiceName,
    audioPreference,
    setAudioPreference,
    toggleTTS
  } = useTTS({
    language: lesson.language,
    audioFileUrl: lesson.audioFileUrl,
    defaultReadingText: isStandard ? (lesson.content as StandardLessonContent).readingText : (isFocused ? (lesson.content as FocusedReaderContent).parts[0].text : ''),
    onStartCallback: () => {
      if (passageRef.current) {
        selectElementText(passageRef.current);
      }
    }
  });




  const handleReset = () => {
    if (window.confirm('Are you sure you want to clear all your progress? This cannot be undone.')) {
      resetProgress();
      setResetKey(prev => prev + 1);
      setShowReportCard(false);
      setReportData(null);
      setIsNameLocked(false);
      window.scrollTo(0, 0);
    }
  };

  const handleFinish = (data: ReportData) => {
    if (!studentName.trim() || !studentId.trim() || !homeroom.trim()) {
      alert('Please fill in your Nickname, Student ID, and Homeroom.');
      return;
    }

    if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    setIsNameLocked(true);
    setReportData(data);
    setShowReportCard(true);

    setTimeout(() => {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        console.warn('Confetti failed:', e);
      }
    }, 200);
  };

  const displayTitle = lesson.title || (isStandard ? (lesson.content as StandardLessonContent).title : (isFocused ? (lesson.content as FocusedReaderContent).title : (lesson.content as InformationGapContent).topic)) || 'Lesson';

  return (
    <div className="bg-white max-w-4xl mx-auto pb-4 px-1 py-4 sm:px-6">
      {/* Page Title - Unified Layout */}
      <div className="mb-4 text-center print:hidden">
        <h1 className="text-3xl md:text-4xl font-black text-green-900 mb-2 tracking-tight">
          {displayTitle}
        </h1>
      </div>

      <main>
        <React.Suspense fallback={<div className="flex items-center justify-center p-20"><Loader className="w-8 h-8 animate-spin text-green-600" /></div>}>
          {lesson.lessonType === 'information-gap' ? (
            <InformationGapView 
              key={`info-gap-${resetKey}`}
              lesson={{...lesson, content: lesson.content as InformationGapContent}} 
              onReset={handleReset}
              onFinish={handleFinish}
              studentName={studentName}
              setStudentName={setStudentName}
              studentId={studentId}
              setStudentId={setStudentId}
              homeroom={homeroom}
              setHomeroom={setHomeroom}
              isNameLocked={isNameLocked}
              toggleTTS={toggleTTS}
              ttsState={ttsState}
              availableVoices={availableVoices}
              selectedVoiceName={selectedVoiceName}
              setSelectedVoiceName={setSelectedVoiceName}
              isVoiceModalOpen={isVoiceModalOpen}
              setIsVoiceModalOpen={setIsVoiceModalOpen}
              audioPreference={audioPreference}
              setAudioPreference={setAudioPreference}
              answers={answers}
              setAnswers={setAnswers}
            />
          ) : lesson.lessonType === 'focused-reading' ? (
            <FocusedReaderView
              key={`focused-reader-${resetKey}`}
              lesson={{...lesson, content: lesson.content as FocusedReaderContent}}
              studentName={studentName}
              setStudentName={setStudentName}
              studentId={studentId}
              setStudentId={setStudentId}
              homeroom={homeroom}
              setHomeroom={setHomeroom}
              isNameLocked={isNameLocked}
              onFinish={handleFinish}
              onReset={handleReset}
              answers={answers}
              setAnswers={setAnswers}
              toggleTTS={toggleTTS}
              ttsState={ttsState}
              availableVoices={availableVoices}
              selectedVoiceName={selectedVoiceName}
              setSelectedVoiceName={setSelectedVoiceName}
              isVoiceModalOpen={isVoiceModalOpen}
              setIsVoiceModalOpen={setIsVoiceModalOpen}
              audioPreference={audioPreference}
              setAudioPreference={setAudioPreference}
            />
          ) : (
            <WorksheetView
              key={`worksheet-${resetKey}`}
              lesson={{...lesson, content: lesson.content as StandardLessonContent}}
              studentName={studentName}
              setStudentName={setStudentName}
              studentId={studentId}
              setStudentId={setStudentId}
              homeroom={homeroom}
              setHomeroom={setHomeroom}
              isNameLocked={isNameLocked}
              onFinish={handleFinish}
              onReset={handleReset}
              answers={answers}
              setAnswers={setAnswers}
              completionStates={completionStates}
              setCompletionStates={setCompletionStates}
              toggleTTS={toggleTTS}
              ttsState={ttsState}
              availableVoices={availableVoices}
              selectedVoiceName={selectedVoiceName}
              setSelectedVoiceName={setSelectedVoiceName}
              isVoiceModalOpen={isVoiceModalOpen}
              setIsVoiceModalOpen={setIsVoiceModalOpen}
              audioPreference={audioPreference}
              setAudioPreference={setAudioPreference}
              passageRef={passageRef}
            />
          )}
        </React.Suspense>
      </main>

      {showReportCard && reportData && (
        <ReportCard 
          data={reportData} 
          onClose={() => setShowReportCard(false)} 
        />
      )}
    </div>
  );
};