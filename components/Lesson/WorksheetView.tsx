import React, { useMemo, useState } from 'react';
import { ParsedLesson, StandardLessonContent, UserAnswers } from '../../types';
import { Languages, Video, Eye, EyeOff } from 'lucide-react';
import { shuffleArray, getLangCode, shouldShowAudioControls, normalizeString, selectElementText } from '../../utils/textUtils';
import { speakText } from '../../utils/textUtils';
import { GenericLessonLayout } from './GenericLessonLayout';
import { Vocabulary } from '../Activities/Vocabulary';
import { FillInBlanks } from '../Activities/FillInBlanks';
import { Comprehension } from '../Activities/Comprehension';
import { Scrambled } from '../Activities/Scrambled';
import { VoiceSelectorModal } from '../UI/VoiceSelectorModal';
import { AudioControls } from '../UI/AudioControls';
import { Button } from '../UI/Button';
import { LessonFooter } from './LessonFooter';
import { RotateCcw } from 'lucide-react';

interface WorksheetViewProps {
  lesson: ParsedLesson & { content: StandardLessonContent };
  studentName: string;
  setStudentName: (name: string) => void;
  studentId: string;
  setStudentId: (id: string) => void;
  homeroom: string;
  setHomeroom: (homeroom: string) => void;
  isNameLocked: boolean;
  onFinish: () => void;
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

  const handleWordClick = (word: string) => {
    const cleanWord = word.replace(/^[.,!?;:"'()\[\]{}]+|[.,!?;:"'()\[\]{}]+$/g, '');
    if (cleanWord) {
      speakText(cleanWord, lesson.language, 0.7, selectedVoiceName);
    }
  };

  const renderReadingPassage = (text: string) => {
    if (!text) return null;
    const segments = text.split(/(\s+)/);
    return segments.map((segment, i) => {
      if (/^\s+$/.test(segment)) return segment;
      const subSegments = segment.split(/([.,!?;:"'()\[\]{}]+)/).filter(Boolean);
      return (
        <React.Fragment key={i}>
          {subSegments.map((sub, j) => {
            if (/^[.,!?;:"'()\[\]{}]+$/.test(sub)) {
              return <span key={j}>{sub}</span>;
            }
            return (
              <span
                key={j}
                onClick={() => handleWordClick(sub)}
                className="cursor-pointer hover:text-green-600 hover:bg-green-100/50 rounded transition-colors"
                title="Click to hear pronunciation"
              >
                {sub}
              </span>
            );
          })}
        </React.Fragment>
      );
    });
  };

  const renderVideoExploration = () => {
    if (lesson.isVideoLesson || !lesson.videoUrl) return null;
    return (
      <section className="bg-white p-2 rounded-xl shadow-sm border border-green-100 mb-8 text-center animate-fade-in print:hidden">
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
    shuffleArray([...standardContent.activities.vocabulary.items]),
    [standardContent]
  );

  const printScrambledItems = useMemo(() => {
    return standardContent.activities.scrambled.map(item => {
      const words = item.answer.replace(/[.!?]+$/, '').split(/\s+/).filter(w => w);
      const shuffled = shuffleArray([...words]);
      return {
        ...item,
        scrambledText: shuffled.join(' / ')
      };
    });
  }, [standardContent]);

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
      onFinish={onFinish}
      onBack={onReset}
      showBack={false}
    >
      {/* Media Section */}
      <section className="bg-white p-2 rounded-xl sm:shadow-sm sm:border sm:border-green-100 mb-4">
        <div translate="no">
          <h2 className="text-xl font-bold text-green-900 mb-4">Reading Passage</h2>
        </div>

        {lesson.isVideoLesson && lesson.videoUrl && (
          <div className="relative pt-[56.25%] mb-6 rounded-lg overflow-hidden bg-black shadow-md">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={lesson.videoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
              allowFullScreen
            />
          </div>
        )}

        {lesson.imageUrl && (
          <div className="w-full flex justify-center mb-6">
            <img
              src={lesson.imageUrl}
              alt="Lesson topic"
              className="w-full h-auto max-h-[500px] object-contain rounded-lg shadow-sm"
            />
          </div>
        )}

        {/* Unified Audio Controls */}
        <div className="flex justify-center sm:justify-end mb-4">
          <AudioControls 
            onTranslate={handleTranslate}
            onVoiceOpen={availableVoices.length > 0 ? () => setIsVoiceModalOpen(true) : undefined}
            onSlowToggle={() => toggleTTS(0.6)}
            onListenToggle={() => toggleTTS(1.0)}
            ttsStatus={ttsState.status}
            currentRate={ttsState.rate}
            hasVoices={availableVoices.length > 0}
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
        </div>

        <div
          ref={passageRef}
          className="prose max-w-none text-lg leading-relaxed text-gray-800 bg-transparent p-0 sm:bg-gray-50 sm:p-6 rounded-lg sm:border sm:border-gray-100"
          translate="no"
        >
          {renderReadingPassage(standardContent.readingText)}
        </div>
      </section>

      {/* Activities Section */}
      <div className="space-y-8 pb-4">
        <section id="vocabulary">
          <Vocabulary
            data={standardContent.activities.vocabulary}
            language={lesson.language}
            onChange={(data) => updateAnswers('vocabulary', data)}
            savedAnswers={answers.vocabulary}
            voiceName={selectedVoiceName}
          />
        </section>

        <section id="fill-blanks">
          <FillInBlanks
            data={standardContent.activities.fillInTheBlanks}
            vocabItems={standardContent.activities.vocabulary.items}
            level={lesson.level.replace('Level ', '')}
            language={lesson.language}
            onChange={(data) => updateAnswers('fillBlanks', data)}
            savedAnswers={answers.fillBlanks}
            voiceName={selectedVoiceName}
          />
        </section>

        <section id="comprehension">
          <Comprehension
            data={standardContent.activities.comprehension}
            readingText={standardContent.readingText}
            language={lesson.language}
            onChange={(data) => updateAnswers('comprehension', data)}
            savedAnswers={answers.comprehension}
            voiceName={selectedVoiceName}
          />
        </section>

        <section id="scrambled">
          <Scrambled
            data={standardContent.activities.scrambled}
            level={lesson.level.replace('Level ', '')}
            language={lesson.language}
            onChange={(data) => updateAnswers('scrambled', data)}
            savedAnswers={answers.scrambled}
            voiceName={selectedVoiceName}
          />
        </section>

        <section id="writing">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-green-100">
            <h2 className="text-xl font-bold text-green-900 mb-6">Written Expression</h2>
            <div className="space-y-8">
              {standardContent.activities.writtenExpression.questions.map((q, i) => (
                <div key={i} className="space-y-3">
                  <p className="font-medium text-gray-800 text-lg">{i + 1}. {q.text}</p>
                  <textarea
                    className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none transition-all min-h-[100px] text-lg"
                    placeholder="Write your answer here..."
                    value={answers.writing[i] || ''}
                    onChange={(e) => {
                      const newWriting = { ...answers.writing, [i]: e.target.value };
                      updateAnswers('writing', newWriting);
                    }}
                  />
                </div>
              ))}
            </div>

            {standardContent.activities.writtenExpression.examples && (
              <div className="mt-8">
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
                    dangerouslySetInnerHTML={{ __html: standardContent.activities.writtenExpression.examples }}
                  />
                )}
              </div>
            )}
          </div>
        </section>

        <LessonFooter
          studentName={studentName}
          setStudentName={setStudentName}
          studentId={studentId}
          setStudentId={setStudentId}
          homeroom={homeroom}
          setHomeroom={setHomeroom}
          isNameLocked={isNameLocked}
          onFinish={onFinish}
          onReset={onReset}
        />
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
