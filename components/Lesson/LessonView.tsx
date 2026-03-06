import React, { useState, useEffect } from 'react';
import { ParsedLesson, StandardLessonContent, InformationGapContent, FocusedReaderContent, LessonContent, ReportData, WordBlasterContent } from '../../types';
import { selectElementText } from '../../utils/textUtils';
import { Loader } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTTS } from '../../hooks/useTTS';
import { useLessonProgress } from '../../hooks/useLessonProgress';
import { ReportCard } from '../UI/ReportCard';


const InformationGapView = React.lazy(() => import('./InformationGapView').then(m => ({ default: m.InformationGapView })));
const WorksheetView = React.lazy(() => import('./WorksheetView').then(m => ({ default: m.WorksheetView })));
const FocusedReaderView = React.lazy(() => import('./FocusedReaderView').then(m => ({ default: m.FocusedReaderView })));
const WordBlasterView = React.lazy(() => import('./WordBlasterView').then(m => ({ default: m.WordBlasterView })));

interface Props {
  lesson: ParsedLesson;
}

const isStandardLesson = (content: LessonContent): content is StandardLessonContent => {
  return content !== null && typeof content === 'object' && 'activities' in content && !Array.isArray(content.activities);
};

const isFocusedReader = (content: LessonContent): content is FocusedReaderContent => {
  return content !== null && typeof content === 'object' && 'parts' in content && Array.isArray((content as any).parts);
};

const isWordBlaster = (content: LessonContent): content is WordBlasterContent => {
  return content !== null && typeof content === 'object' && 'words' in content && Array.isArray((content as any).words);
};

const isInformationGapLesson = (content: LessonContent): content is InformationGapContent => {
  if (Array.isArray(content)) return true;
  return content !== null && typeof content === 'object' && ('topic' in content || 'player_count' in content || ('activities' in content && Array.isArray((content as any).activities)));
};

export const LessonView: React.FC<Props> = ({ lesson }) => {
  const isStandard = isStandardLesson(lesson.content);
  const isFocused = isFocusedReader(lesson.content);
  const isBlaster = isWordBlaster(lesson.content);
  const isInfoGap = isInformationGapLesson(lesson.content);

  // Determine effective lesson type to handle previews where the dropdown hasn't been saved yet
  const effectiveLessonType = 
    isBlaster ? 'word-blaster' :
    isFocused ? 'focused-reading' :
    isInfoGap ? 'information-gap' :
    isStandard ? 'standard' :
    lesson.lessonType;

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
    defaultAudioPreference: lesson.audioFileUrl ? 'recorded' : 'tts',
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

  const isWebComponent = typeof window !== 'undefined' && 
    window.location.origin !== 'https://worksheets.teacherjake.com' && 
    !window.location.origin.includes('localhost') &&
    !window.location.origin.includes('127.0.0.1');
    
  const editUrl = isWebComponent 
    ? `https://worksheets.teacherjake.com/?view=admin&edit=${lesson.id}`
    : `/?view=admin&edit=${lesson.id}`;

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

  const displayTitle = lesson.title || (isStandard ? (lesson.content as StandardLessonContent).title : (isFocused ? (lesson.content as FocusedReaderContent).title : (isBlaster ? "Word Blaster" : (lesson.content as InformationGapContent).topic))) || 'Lesson';

  return (
    <div className="bg-white max-w-4xl mx-auto pb-4 px-1 py-4 sm:px-6 tj-printable-worksheet">
      {/* Page Title - Unified Layout */}
      <div className="mb-4 text-center print:hidden">
        <h1 className="text-3xl md:text-4xl font-black text-green-900 mb-2 tracking-tight">
          {displayTitle}
        </h1>
      </div>

      <main>
        <React.Suspense fallback={<div className="flex items-center justify-center p-20"><Loader className="w-8 h-8 animate-spin text-green-600" /></div>}>
          {effectiveLessonType === 'information-gap' ? (
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
          ) : effectiveLessonType === 'focused-reading' ? (
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
          ) : effectiveLessonType === 'word-blaster' ? (
            <WordBlasterView
              key={`word-blaster-${resetKey}`}
              lesson={{...lesson, content: lesson.content as WordBlasterContent}}
              onFinish={handleFinish}
              onReset={handleReset}
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
          isStandalone={lesson.isStandalone}
        />
      )}

      {/* Edit Button for Admins/Teachers */}
      <div className="mt-12 text-center print:hidden">
        <a 
          href={editUrl}
          target={isWebComponent ? "_blank" : "_self"}
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center text-xs font-medium text-gray-200 hover:text-gray-400 transition-colors"
          title="Edit this lesson"
        >
          <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          Edit Lesson
        </a>
      </div>
    </div>
  );
};