import React, { useState, useRef, useEffect } from 'react';
import { ParsedLesson, ChapterBookContent, UserAnswers, ReportData, ChapterQuizQuestion } from '../../types';
import { VoiceSelectorModal } from '../UI/VoiceSelectorModal';
import { LessonFooter } from './LessonFooter';
import { ChevronRight, ChevronLeft, CheckCircle2, Languages } from 'lucide-react';
import { Button } from '../UI/Button';
import { ReadingPassage } from '../Activities/ReadingPassage';
import { Comprehension } from '../Activities/Comprehension';
import { CollapsibleActivity } from '../UI/CollapsibleActivity';
import { LessonMedia } from '../UI/LessonMedia';
import { useFocusedReaderScores } from '../../hooks/useFocusedReaderScores';
import { ReportCard } from '../UI/ReportCard';

import { useTTS } from '../../hooks/useTTS';

interface ChapterBookViewProps {
  lesson: ParsedLesson & { content: ChapterBookContent };
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
}

export const ChapterBookView: React.FC<ChapterBookViewProps> = ({
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
}) => {
  const content = lesson.content;
  const [currentChapterIndex, setCurrentChapterIndex] = useState(answers.focusedReaderPage || 0);
  const [showTranslation, setShowTranslation] = useState<Record<number, boolean>>({});
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  
  const currentChapter = content.chapters[currentChapterIndex] || content.chapters[0];
  const chapterText = currentChapter.content.join('\n\n');
  const displayText = showTranslation[currentChapterIndex] ? currentChapter.translation : chapterText;
  const currentLanguage = showTranslation[currentChapterIndex] ? 'English' : lesson.language;
  const [showReportCard, setShowReportCard] = useState(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);

  const {
      ttsState,
      availableVoices,
      selectedVoiceName,
      setSelectedVoiceName,
      audioPreference,
      setAudioPreference,
      toggleTTS
  } = useTTS({
      language: currentLanguage,
      defaultAudioPreference: 'tts',
      defaultReadingText: chapterText
  });
  
  const readingPassageRef = useRef<HTMLDivElement>(null);

  const handleChapterChange = (newIndex: number) => {
    setCurrentChapterIndex(newIndex);
    setAnswers(prev => ({ ...prev, focusedReaderPage: newIndex }));
    
    // Stop TTS when changing chapters
    if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }

    setTimeout(() => {
      readingPassageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 10);
  };

  const toggleTranslation = (idx: number) => {
    setShowTranslation(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  // Map ChapterQuizQuestion to the format expected by Comprehension component
  const mapQuizData = (questions: ChapterQuizQuestion[]) => {
    return {
      questions: questions.map(q => ({
        question: q.question,
        options: q.options.map(o => o.text),
        answer: q.options.find(o => o.value === 'correct')?.text || ''
      }))
    };
  };

  // We reuse useFocusedReaderScores by adapting ChapterBookContent to FocusedReaderContent structure if needed,
  // or we can just implement a simplified version. For now, let's use the hook but adapt the data.
  // Actually, useFocusedReaderScores expects FocusedReaderContent.
  // Let's implement a quick scoring logic here or adapt.
  
  const chapterAnswers = answers.focusedReader?.[currentChapterIndex] || {};
  const isChapterCompleted = !!answers.completionStates?.[`chapter_${currentChapterIndex}`];

  const calculateScore = () => {
    let totalScore = 0;
    let totalPossible = 0;
    
    content.chapters.forEach((chapter, cIdx) => {
      const cAnswers = answers.focusedReader?.[cIdx] || {};
      chapter.quiz.forEach((q, qIdx) => {
        totalPossible++;
        const correctAnswer = q.options.find(o => o.value === 'correct')?.text;
        if (cAnswers[qIdx] === correctAnswer) {
          totalScore++;
        }
      });
    });
    
    return { score: totalScore, total: totalPossible };
  };

  const handleFinishClick = () => {
    const { score, total } = calculateScore();
    const data: ReportData = {
      title: lesson.title || content.title,
      nickname: studentName,
      studentId: studentId,
      homeroom: homeroom,
      finishTime: new Date().toLocaleTimeString(),
      totalScore: score,
      maxScore: total,
      pills: [
        { label: 'Reading Comprehension', score, total }
      ]
    };
    setReportData(data);
    setShowReportCard(true);
    onFinish(data);
  };

  return (
    <div className="space-y-4">
      <div className="max-w-4xl mx-auto px-1 sm:px-4 py-4 space-y-6">
        <div className="text-center space-y-2">
            <h2 className="text-2xl font-black text-green-800">{content.title}</h2>
            {content.subtitle && <p className="text-gray-500 font-bold">{content.subtitle}</p>}
        </div>

        <LessonMedia 
          imageUrl={lesson.imageUrl} 
          title={currentChapter.title} 
        />

        {/* Chapter Navigation Dots */}
        <div className="flex justify-center flex-wrap gap-2 mb-4">
          {content.chapters.map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleChapterChange(idx)}
              className={`h-3 rounded-full transition-all duration-300 ${
                currentChapterIndex === idx ? 'w-8 bg-green-600' : 'w-3 bg-green-200 hover:bg-green-300'
              }`}
              title={`Go to Chapter ${idx + 1}`}
            />
          ))}
        </div>

        <div ref={readingPassageRef} className="scroll-mt-6" />
        
        <ReadingPassage
          text={displayText}
          language={showTranslation[currentChapterIndex] ? 'English' : lesson.language}
          title={currentChapter.title}
          onSlowToggle={() => toggleTTS(0.6, displayText)}
          onListenToggle={() => toggleTTS(1.0, displayText)}
          ttsStatus={ttsState.status}
          currentRate={ttsState.rate}
          hasVoices={availableVoices.length > 0}
          onTranslate={() => toggleTranslation(currentChapterIndex)}
          onSwipeLeft={currentChapterIndex < content.chapters.length - 1 ? () => handleChapterChange(currentChapterIndex + 1) : undefined}
          onSwipeRight={currentChapterIndex > 0 ? () => handleChapterChange(currentChapterIndex - 1) : undefined}
          onVoiceOpen={availableVoices.length > 0 ? () => setIsVoiceModalOpen(true) : undefined}
          className="animate-slide-up"
          showHighlightHelp={!showTranslation[currentChapterIndex]}
        />

        {/* Quiz Section */}
        {currentChapter.quiz.length > 0 && (
          <section className="animate-fade-in" key={currentChapterIndex}>
            <CollapsibleActivity
              isCompleted={isChapterCompleted}
              title={`${currentChapter.title} Quiz`}
              score={isChapterCompleted ? "" : undefined}
            >
              <Comprehension
                data={mapQuizData(currentChapter.quiz)}
                readingText={chapterText}
                language={lesson.language}
                onChange={(partAnswers) => {
                  setAnswers(prev => {
                    const focusedReader = { ...(prev.focusedReader || {}) };
                    focusedReader[currentChapterIndex] = partAnswers;
                    return { ...prev, focusedReader };
                  });
                }}
                savedAnswers={chapterAnswers}
                voiceName={selectedVoiceName}
                toggleTTS={toggleTTS}
                ttsState={ttsState}
                lessonId={`${lesson.id}-chapter-${currentChapterIndex}`}
                title="Chapter Quiz"
                showReferenceText={false}
                savedIsCompleted={isChapterCompleted}
                onComplete={(completed) => {
                    setAnswers(prev => ({
                        ...prev,
                        completionStates: {
                            ...(prev.completionStates || {}),
                            [`chapter_${currentChapterIndex}`]: completed
                        }
                    }));
                }}
              />
            </CollapsibleActivity>
          </section>
        )}

        <hr className="border-gray-200 my-6"/>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
          <Button
            variant="secondary"
            onClick={() => handleChapterChange(Math.max(0, currentChapterIndex - 1))}
            disabled={currentChapterIndex === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-5 h-5" /> Previous
          </Button>

          <span className="text-sm font-black text-gray-400 uppercase tracking-widest">
            Chapter {currentChapterIndex + 1} of {content.chapters.length}
          </span>

          {currentChapterIndex < content.chapters.length - 1 ? (
            <Button
              variant="primary"
              onClick={() => handleChapterChange(currentChapterIndex + 1)}
              className="flex items-center gap-2"
            >
              Next <ChevronRight className="w-5 h-5" />
            </Button>
          ) : (
            <div className="text-green-600 font-black flex items-center gap-2 animate-bounce">
              <CheckCircle2 className="w-6 h-6" /> The End!
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
          onFinish={handleFinishClick}
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

      {showReportCard && reportData && (
        <ReportCard
          data={reportData}
          onClose={() => setShowReportCard(false)}
        />
      )}
    </div>
  );
};
