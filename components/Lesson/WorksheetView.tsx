import React, { useMemo, useState } from 'react';
import { Video, Eye, EyeOff } from 'lucide-react';
import { ParsedLesson, StandardLessonContent, UserAnswers, ReportData, ReportScorePill, ReportWrittenResponse, CompletionStates } from '../../types';
import { normalizeString, seededShuffle } from '../../utils/textUtils';
import { GenericLessonLayout } from './GenericLessonLayout';
import { Vocabulary } from '../Activities/Vocabulary';
import { FillInBlanks } from '../Activities/FillInBlanks';
import { Comprehension } from '../Activities/Comprehension';
import { Scrambled } from '../Activities/Scrambled';
import { ReadingPassage } from '../Activities/ReadingPassage';
import { WrittenExpression } from '../Activities/WrittenExpression';
import { VoiceSelectorModal } from '../UI/VoiceSelectorModal';
import { LessonFooter } from './LessonFooter';
import { CollapsibleActivity } from '../UI/CollapsibleActivity';

interface WorksheetViewProps {
  lesson: ParsedLesson & { content: StandardLessonContent };
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
  completionStates: CompletionStates;
  setCompletionStates: React.Dispatch<React.SetStateAction<CompletionStates>>;
  toggleTTS: (rate: number, overrideText?: string) => void;
  ttsState: { status: 'playing' | 'paused' | 'stopped', rate: number };
  availableVoices: SpeechSynthesisVoice[];
  selectedVoiceName: string | null;
  setSelectedVoiceName: (name: string) => void;
  isVoiceModalOpen: boolean;
  setIsVoiceModalOpen: (isOpen: boolean) => void;
  audioPreference: 'recorded' | 'tts';
  setAudioPreference: (pref: 'recorded' | 'tts') => void;
  passageRef: React.RefObject<HTMLDivElement>;
}

export const WorksheetView: React.FC<WorksheetViewProps> = ({
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
  completionStates,
  setCompletionStates,
  toggleTTS,
  ttsState,
  availableVoices,
  selectedVoiceName,
  setSelectedVoiceName,
  isVoiceModalOpen,
  setIsVoiceModalOpen,
  audioPreference,
  setAudioPreference,
  passageRef,
}) => {
  const [showExamples, setShowExamples] = useState(false);
  const isStandard = true; // By definition in this component
  const standardContent = lesson.content;
  const displayTitle = lesson.title || standardContent.title;

  const updateAnswers = (section: keyof UserAnswers, data: any) => {
    setAnswers(prev => ({ ...prev, [section]: data }));
  };

  const handleTranslate = async () => {
    const text = standardContent.readingText;
    const langMap: Record<string, string> = {
      "English": "en",
      "French": "fr",
      "Spanish": "es",
      "German": "de"
    };
    const sourceLang = langMap[lesson.language] || 'auto';

    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.warn('Failed to copy to clipboard:', err);
    }

    const isAndroid = /android/i.test(navigator.userAgent);

    if (isAndroid) {
      const intentUrl = `intent://translate.google.com/?sl=${sourceLang}&text=${encodeURIComponent(text)}&op=translate#Intent;scheme=https;package=com.google.android.apps.translate;end`;
      const intentWindow = window.open(intentUrl, '_blank');
      setTimeout(() => {
        if (!intentWindow || intentWindow.closed) {
          window.open(`https://translate.google.com/?sl=${sourceLang}&text=${encodeURIComponent(text)}&op=translate`, '_blank');
        }
      }, 1000);
    } else {
      window.open(`https://translate.google.com/?sl=${sourceLang}&text=${encodeURIComponent(text)}&op=translate`, '_blank');
    }
  };
  const vocabScore = useMemo(() => {
    let score = 0;
    const vocabData = standardContent.activities.vocabulary;
    vocabData.items.forEach((item, idx) => {
      const userAnswer = answers.vocabulary[`vocab_${idx}`] || '';
      const correctDefIndex = vocabData.definitions.findIndex(d => d.id === item.answer);
      const correctChar = String.fromCharCode(97 + correctDefIndex);
      if (userAnswer.toLowerCase() === correctChar) score++;
    });
    return score;
  }, [standardContent, answers.vocabulary]);

  const fillScore = useMemo(() => {
    let score = 0;
    const fillData = standardContent.activities.fillInTheBlanks;
    fillData.forEach((item, idx) => {
      if (normalizeString(answers.fillBlanks[idx] || '') === normalizeString(item.answer)) score++;
    });
    return score;
  }, [standardContent, answers.fillBlanks]);
  const compScore = useMemo(() => {
    let score = 0;
    const compData = standardContent.activities.comprehension;
    compData.questions.forEach((q, idx) => {
      if ((answers.comprehension[idx] || '').toLowerCase() === q.answer.toLowerCase()) score++;
    });
    return score;
  }, [standardContent, answers.comprehension]);

  const scrambledScore = useMemo(() => {
    let score = 0;
    const scrambledData = standardContent.activities.scrambled;
    scrambledData.forEach((item, idx) => {
      if (normalizeString(answers.scrambled[idx] || '') === normalizeString(item.answer)) score++;
    });
    return score;
  }, [standardContent, answers.scrambled]);



  const calculateReportData = (): ReportData => {
    const pills: ReportScorePill[] = [];
    let totalScore = 0;
    let maxScore = 0;

    // 1. Vocabulary
    let vocabScore = 0;
    const vocabData = standardContent.activities.vocabulary;
    vocabData.items.forEach((item, idx) => {
      const userAnswer = answers.vocabulary[`vocab_${idx}`] || '';
      const correctDefIndex = vocabData.definitions.findIndex(d => d.id === item.answer);
      const correctChar = String.fromCharCode(97 + correctDefIndex);
      if (userAnswer.toLowerCase() === correctChar) vocabScore++;
    });
    pills.push({ label: 'Vocabulary', score: vocabScore, total: vocabData.items.length });
    totalScore += vocabScore;
    maxScore += vocabData.items.length;

    // 2. Fill in Blanks
    let fillScore = 0;
    const fillData = standardContent.activities.fillInTheBlanks;
    fillData.forEach((item, idx) => {
      if (normalizeString(answers.fillBlanks[idx] || '') === normalizeString(item.answer)) fillScore++;
    });
    pills.push({ label: 'Fill Blanks', score: fillScore, total: fillData.length });
    totalScore += fillScore;
    maxScore += fillData.length;

    // 3. Comprehension
    let compScore = 0;
    const compData = standardContent.activities.comprehension;
    compData.questions.forEach((q, idx) => {
      if ((answers.comprehension[idx] || '').toLowerCase() === q.answer.toLowerCase()) compScore++;
    });
    pills.push({ label: 'Comprehension', score: compScore, total: compData.questions.length });
    totalScore += compScore;
    maxScore += compData.questions.length;

    // 4. Scrambled
    let scrambledScore = 0;
    const scrambledData = standardContent.activities.scrambled;
    scrambledData.forEach((item, idx) => {
      if (normalizeString(answers.scrambled[idx] || '') === normalizeString(item.answer)) scrambledScore++;
    });
    pills.push({ label: 'Scrambled', score: scrambledScore, total: scrambledData.length });
    totalScore += scrambledScore;
    maxScore += scrambledData.length;

    // Written Expressions
    const writtenResponses: ReportWrittenResponse[] = standardContent.activities.writtenExpression.questions.map((q, i) => ({
      question: q.text,
      answer: answers.writing[i] || ''
    }));

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    return {
      title: displayTitle,
      nickname: studentName,
      studentId: studentId,
      homeroom: homeroom,
      finishTime: `${dateStr}, ${timeStr}`,
      totalScore,
      maxScore,
      pills,
      writtenResponses
    };
  };

  const handleFinishClick = () => {
    onFinish(calculateReportData());
  };

  const renderVideoExploration = () => {
    if (lesson.isVideoLesson || !lesson.videoUrl) return null;

    return (
      <section className="bg-white p-6 rounded-xl shadow-sm border border-green-100 mb-8 max-w-4xl mx-auto text-center animate-fade-in print:hidden">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
          <Video className="w-6 h-6 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-green-900 mb-2">Explore Further</h2>
        <p className="text-gray-600 mb-6 text-lg">
          Want to learn more about this topic? Watch this video to dive deeper!
        </p>
        <a
          href={lesson.videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-green-600 text-white px-8 py-3 rounded-full font-bold hover:bg-green-700 transform hover:scale-105 transition-all shadow-md"
        >
          Watch Video on YouTube
        </a>
      </section>
    );
  };



  const printVocabItems = useMemo(() =>
    seededShuffle([...standardContent.activities.vocabulary.items], `${lesson.id}-print-vocab`),
    [standardContent, lesson.id]
  );

  const printScrambledItems = useMemo(() => {
    return standardContent.activities.scrambled.map((item, idx) => {
      const words = item.answer.replace(/[.!?]+$/, '').split(/\s+/).filter(w => w);
      const shuffled = seededShuffle([...words], `${lesson.id}-print-scramble-${idx}`);
      return {
        ...item,
        scrambledText: shuffled.join(' / ')
      };
    });
  }, [standardContent, lesson.id]);

  return (
    <GenericLessonLayout
      lesson={lesson}
      displayTitle={displayTitle}
      studentName={studentName}
      setStudentName={setStudentName}
      studentId={studentId}
      setStudentId={setStudentId}
      homeroom={homeroom}
      setHomeroom={setHomeroom}
      isNameLocked={isNameLocked}
      onBack={onReset}
      showBack={false}
    >
      {/* Media Section */}
      <div className="max-w-4xl mx-auto space-y-6 mb-6">
        {lesson.isVideoLesson && lesson.videoUrl && (
          <div className="relative pt-[56.25%] rounded-2xl overflow-hidden bg-black shadow-lg border border-green-100 animate-fade-in group">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={lesson.videoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
              allowFullScreen
            />
          </div>
        )}

        {lesson.imageUrl && (
          <div className="w-full flex justify-center">
            <img
              src={lesson.imageUrl}
              alt="Lesson topic"
              className="w-full h-auto max-h-[500px] object-contain rounded-2xl shadow-lg bg-white p-4 border border-green-100 animate-fade-in"
            />
          </div>
        )}
      </div>

      <ReadingPassage
        text={standardContent.readingText}
        language={lesson.language}
        onSlowToggle={() => toggleTTS(0.6)}
        onListenToggle={() => toggleTTS(1.0)}
        ttsStatus={ttsState.status}
        currentRate={ttsState.rate}
        hasVoices={availableVoices.length > 0}
        onVoiceOpen={availableVoices.length > 0 ? () => setIsVoiceModalOpen(true) : undefined}
        onTranslate={handleTranslate}
        passageRef={passageRef}
      />

      {availableVoices.length > 0 && (
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
      )}

      {/* Activities Section */}
      <div className="space-y-2 pb-4">
        <section id="vocabulary">
          <CollapsibleActivity 
            isCompleted={completionStates.vocabularyChecked} 
            title="Vocabulary Matching"
            score={`${vocabScore}/${standardContent.activities.vocabulary.items.length}`}
          >
            <Vocabulary 
              data={standardContent.activities.vocabulary}
              language={lesson.language}
              onChange={(data) => updateAnswers('vocabulary', data)}
              savedAnswers={answers.vocabulary}
              voiceName={selectedVoiceName}
              savedIsChecked={completionStates.vocabularyChecked}
              onComplete={(isChecked) => setCompletionStates(prev => ({ ...prev, vocabularyChecked: isChecked }))}
              toggleTTS={toggleTTS}
              ttsState={ttsState}
              lessonId={lesson.id}
            />
          </CollapsibleActivity>
        </section>

        <section id="fill-blanks">
          <CollapsibleActivity 
            isCompleted={completionStates.fillBlanksChecked} 
            title="Fill in the Blanks"
            score={`${fillScore}/${standardContent.activities.fillInTheBlanks.length}`}
          >
            <FillInBlanks 
              data={standardContent.activities.fillInTheBlanks}
              vocabItems={standardContent.activities.vocabulary.items}
              level={lesson.level.replace('Level ', '')}
              language={lesson.language}
              onChange={(data) => updateAnswers('fillBlanks', data)}
              savedAnswers={answers.fillBlanks}
              voiceName={selectedVoiceName}
              savedIsChecked={completionStates.fillBlanksChecked}
              onComplete={(isChecked) => setCompletionStates(prev => ({ ...prev, fillBlanksChecked: isChecked }))}
              toggleTTS={toggleTTS}
              ttsState={ttsState}
              lessonId={lesson.id}
            />
          </CollapsibleActivity>
        </section>

        <section id="comprehension">
          <CollapsibleActivity
            isCompleted={completionStates.comprehensionCompleted}
            title="Comprehension Check"
            score={`${compScore}/${standardContent.activities.comprehension.questions.length}`}
          >
            <Comprehension
              data={standardContent.activities.comprehension}
              readingText={standardContent.readingText}
              language={lesson.language}
              onChange={(data) => updateAnswers('comprehension', data)}
              savedAnswers={answers.comprehension}
              voiceName={selectedVoiceName}
              savedIsCompleted={completionStates.comprehensionCompleted}
              onComplete={(isChecked) => setCompletionStates(prev => ({ ...prev, comprehensionCompleted: isChecked }))}
              toggleTTS={toggleTTS}
              ttsState={ttsState}
              lessonId={lesson.id}
              showReferenceText={false}
            />
          </CollapsibleActivity>
        </section>

        <section id="scrambled">
          <CollapsibleActivity
            isCompleted={completionStates.scrambledCompleted}
            title="Scrambled Sentences"
            score={`${scrambledScore}/${standardContent.activities.scrambled.length}`}
          >
            <Scrambled 
              data={standardContent.activities.scrambled}
              level={lesson.level.replace('Level ', '')}
              language={lesson.language}
              onChange={(data) => updateAnswers('scrambled', data)}
              savedAnswers={answers.scrambled}
              voiceName={selectedVoiceName}
              savedIsChecked={completionStates.scrambledCompleted}
              onComplete={(isChecked) => setCompletionStates(prev => ({ ...prev, scrambledCompleted: isChecked }))}
              toggleTTS={toggleTTS}
              ttsState={ttsState}
              lessonId={lesson.id}
            />
          </CollapsibleActivity>
        </section>

        <section id="writing">
          <WrittenExpression
            data={standardContent.activities.writtenExpression}
            savedAnswers={answers.writing}
            onChange={(newWriting) => updateAnswers('writing', newWriting)}
          />
        </section>

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

        <div className="mt-8">
          {renderVideoExploration()}
        </div>
      </div>

      {/* Print-only Layout */}
      <div className="hidden print:block print:p-8">
        <div className="flex justify-between items-start mb-8 border-b-2 border-gray-200 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{displayTitle}</h1>
            <p className="text-gray-600">Language: {lesson.language} | Level: {lesson.level}</p>
          </div>
          <div className="text-right space-y-2">
            <div className="border-b border-gray-300 w-48 text-left text-sm text-gray-400">Name:</div>
            <div className="border-b border-gray-300 w-48 text-left text-sm text-gray-400">Student ID:</div>
            <div className="border-b border-gray-300 w-48 text-left text-sm text-gray-400">Date:</div>
          </div>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-bold mb-4 bg-gray-100 p-2">Reading Passage</h2>
            <p className="text-lg leading-relaxed">{standardContent.readingText}</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 bg-gray-100 p-2">1. Vocabulary Matching</h2>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                {printVocabItems.map((item, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="w-8 h-8 border border-gray-400 shrink-0"></span>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                {standardContent.activities.vocabulary.definitions.map((def, i) => (
                  <div key={i}>
                    <span className="font-bold">{String.fromCharCode(97 + i)}.</span> {def.text}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="break-before-page">
            <h2 className="text-xl font-bold mb-4 bg-gray-100 p-2">2. Fill in the Blanks</h2>
            <div className="space-y-4">
              {standardContent.activities.fillInTheBlanks.map((item, i) => (
                <div key={i} className="text-lg">
                  {i + 1}. {item.before} ____________________ {item.after}
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 bg-gray-100 p-2">3. Reading Comprehension</h2>
            <div className="space-y-4">
              {standardContent.activities.comprehension.questions.map((q, i) => (
                <div key={i} className="flex justify-between items-start border-b border-gray-100 pb-2">
                  <span className="text-lg">{i + 1}. {q.text}</span>
                  <span className="font-bold flex gap-4">
                    <span>True</span>
                    <span>False</span>
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="break-before-page">
            <h2 className="text-xl font-bold mb-4 bg-gray-100 p-2">4. Scrambled Sentences</h2>
            <div className="space-y-6">
              {printScrambledItems.map((item, i) => (
                <div key={i} className="space-y-2">
                  <p className="text-gray-600 italic">({item.scrambledText})</p>
                  <div className="border-b-2 border-gray-200 h-8"></div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 bg-gray-100 p-2">5. Written Expression</h2>
            <div className="space-y-12">
              {standardContent.activities.writtenExpression.questions.map((q, i) => (
                <div key={i} className="space-y-4">
                  <p className="text-lg font-bold">{i + 1}. {q.text}</p>
                  <div className="space-y-4">
                    <div className="border-b border-gray-300 h-6"></div>
                    <div className="border-b border-gray-300 h-6"></div>
                    <div className="border-b border-gray-300 h-6"></div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

    </GenericLessonLayout>
  );
};
