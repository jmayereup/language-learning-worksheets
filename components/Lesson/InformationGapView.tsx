import React, { useState, useEffect } from 'react';
import { ParsedLesson, InformationGapContent, UserAnswers, ReportData, ReportScorePill } from '../../types';
import { Mic, CheckCircle } from 'lucide-react';
import { InformationGapQuestions } from '../Activities/InformationGapQuestions';
import { speakText } from '../../utils/textUtils';
import { GenericLessonLayout } from './GenericLessonLayout';
import { VoiceSelectorModal } from '../UI/VoiceSelectorModal';
import { AudioControls } from '../UI/AudioControls';
import { LessonFooter } from './LessonFooter';

interface InformationGapViewProps {
  lesson: ParsedLesson & { content: InformationGapContent };
  studentName: string;
  setStudentName: (name: string) => void;
  studentId: string;
  setStudentId: (id: string) => void;
  homeroom: string;
  setHomeroom: (homeroom: string) => void;
  isNameLocked: boolean;
  onFinish: (data: ReportData) => void;
  onReset: () => void;
  toggleTTS: (rate: number, overrideText?: string) => void;
  ttsState: { status: 'playing' | 'paused' | 'stopped', rate: number };
  availableVoices: SpeechSynthesisVoice[];
  selectedVoiceName: string | null;
  setSelectedVoiceName: (name: string) => void;
  isVoiceModalOpen: boolean;
  setIsVoiceModalOpen: (isOpen: boolean) => void;
  audioPreference: 'recorded' | 'tts';
  setAudioPreference: (pref: 'recorded' | 'tts') => void;
  answers: UserAnswers;
  setAnswers: React.Dispatch<React.SetStateAction<UserAnswers>>;
}

interface ActivityResult {
  score: number;
  total: number;
}

export const InformationGapView: React.FC<InformationGapViewProps> = ({ 
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
  toggleTTS,
  ttsState,
  availableVoices,
  selectedVoiceName,
  setSelectedVoiceName,
  isVoiceModalOpen,
  setIsVoiceModalOpen,
  audioPreference,
  setAudioPreference,
  answers,
  setAnswers,
}) => {
  const [currentPlayer, setCurrentPlayer] = useState<number | null>(null);
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [activityResults, setActivityResults] = useState<ActivityResult[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const passageRef = React.useRef<HTMLDivElement>(null);

  const { content } = lesson;

  const handleWordClick = (word: string) => {
    const cleanWord = word.replace(/^[.,!?;:"'()\[\]{}]+|[.,!?;:"'()\[\]{}]+$/g, '');
    if (cleanWord) {
      speakText(cleanWord, lesson.language, 0.7, selectedVoiceName);
    }
  };

  const renderClickableText = (text: string) => {
    if (!text) return null;
    const segments = text.split(/(\s+)/);
    return segments.map((segment, i) => {
      if (/^\s+$/.test(segment)) return segment;
      const subSegments = segment.split(/([.,!?;:"'()\[\]{}]+)/).filter(Boolean);
      return (
        <React.Fragment key={i}>
          {subSegments.map((sub, j) => {
            if (/^[.,!?;:"'()\[\]{}]+$/.test(sub)) return <span key={j}>{sub}</span>;
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

  // Normalize activities - support:
  // 1. Array of activities directly: [...]
  // 2. Object with activities array: { activities: [...] }
  // 3. Legacy single activity object: { topic: "...", blocks: [...] }
  const activities: any[] = Array.isArray(content) 
    ? content 
    : (content.activities || (content.topic ? [{
        topic: content.topic,
        scenario_description: content.scenario_description || '',
        blocks: content.blocks || []
      }] : []));

  // Normalize activities ...

  const handleActivityFinish = (score: number, total: number) => {
    // 1. Compute total score across all activities
    let totalScore = 0;
    let maxScore = 0;
    const pills: ReportScorePill[] = [];

    // Combine all infoGap results
    const results = [...activityResults];
    results[currentActivityIndex] = { score, total }; // Ensure current is included
    
    results.forEach((res) => {
      if (res) {
        totalScore += res.score;
        maxScore += res.total;
      }
    });

    pills.push({ label: 'Speaking Activities', score: totalScore, total: maxScore });

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    onFinish({
      title: lesson.title || lesson.content.topic || 'Speaking Lesson',
      nickname: studentName,
      studentId: studentId,
      homeroom: homeroom,
      finishTime: `${dateStr}, ${timeStr}`,
      totalScore,
      maxScore,
      pills
    });
  };

  const handleNextActivity = (score: number, total: number) => {
    const newResults = [...activityResults];
    newResults[currentActivityIndex] = { score, total };
    setActivityResults(newResults);

    if (currentActivityIndex < activities.length - 1) {
      setCurrentActivityIndex(prev => prev + 1);
      window.scrollTo(0, 0);
    } else {
      setIsFinished(true); // Mark lesson as finished
    }
  };

  useEffect(() => {
    if (isFinished) {
      handleActivityFinish(0, 0); // Call the final finish handler when all activities are done
    }
  }, [isFinished]);

  if (currentPlayer === null) {
    const firstActivity = activities[0] || {};
    const mainTitle = lesson.title || (Array.isArray(content) ? firstActivity.topic : content.topic) || "Information-Gap Activity";
    const mainDesc = (Array.isArray(content) ? firstActivity.scenario_description : content.scenario_description) || "Select your role to begin.";
    
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 animate-fade-in">
        <div className="text-center mb-12">
          {lesson.imageUrl && (
            <div className="mb-8">
              <img 
                src={lesson.imageUrl} 
                alt={mainTitle} 
                className="max-h-64 mx-auto rounded-3xl shadow-lg object-contain bg-white p-4 border border-gray-100"
              />
            </div>
          )}
          
          <div className="flex justify-center gap-2 mb-6">
            <span className="bg-green-100 text-green-800 px-4 py-1.5 rounded-full text-sm font-black uppercase tracking-wider border border-green-200">
                {lesson.language}
            </span>
            {lesson.level && (
              <span className="bg-blue-100 text-blue-800 px-4 py-1.5 rounded-full text-sm font-black uppercase tracking-wider border border-blue-200">
                {lesson.level}
              </span>
            )}
            <span className="bg-purple-100 text-purple-800 px-4 py-1.5 rounded-full text-sm font-black uppercase tracking-wider border border-purple-200">
                Speaking
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-green-900 mb-4 tracking-tight leading-tight max-w-2xl mx-auto">{mainTitle}</h1>
          <p className="text-xl text-gray-600 font-medium max-w-xl mx-auto">{mainDesc}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {[1, 2].map((playerNum) => (
            <button
              key={playerNum}
              onClick={() => setCurrentPlayer(playerNum)}
              className="group bg-white p-10 rounded-4xl shadow-lg border-2 border-transparent hover:border-green-500 hover:shadow-2xl transition-all duration-300 flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Mic className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-black text-gray-800 mb-2">Player {playerNum}</h2>
              <p className="text-gray-500 font-medium tracking-wide">Click to select this role</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const currentActivity = activities[currentActivityIndex];
  
  const myTextBlocks = currentActivity.blocks.filter(b => b.text_holder_id === currentPlayer);
  const myQuestions = currentActivity.blocks.flatMap(b => b.questions).filter(q => q.asker_id === currentPlayer);


  return (
    <GenericLessonLayout
      lesson={lesson}
      displayTitle={currentActivity.topic}
      studentName={studentName}
      setStudentName={setStudentName}
      studentId={studentId}
      setStudentId={setStudentId}
      homeroom={homeroom}
      setHomeroom={setHomeroom}
      isNameLocked={isNameLocked}
      onBack={() => {
        if (currentActivityIndex > 0) {
            setCurrentActivityIndex(prev => prev - 1);
        } else {
            setCurrentPlayer(null);
        }
      }}
      showBack={true}
      playerRole={currentPlayer}
      variant="white"
    >
      <div className="mb-6 flex flex-col md:flex-row items-center justify-between gap-4 px-2 h-fit">
        <div className="flex items-center justify-center gap-2 p-2 w-full md:w-auto">
            {activities.map((_, idx) => (
                <button
                    key={idx}
                    onClick={() => {
                        setCurrentActivityIndex(idx);
                        window.scrollTo(0, 0);
                    }}
                    className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-black transition-all ${
                        idx === currentActivityIndex 
                            ? 'bg-green-600 text-white shadow-lg scale-110' 
                            : activityResults[idx] 
                                ? 'bg-green-100 text-green-600 border-2 border-green-200 hover:bg-green-200' 
                                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                    }`}
                    title={`Activity ${idx + 1}`}
                >
                    {idx + 1}
                </button>
            ))}
        </div>
        
        <div className="flex items-center justify-center md:justify-end gap-6 w-full md:w-auto">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
                Activity {currentActivityIndex + 1} of {activities.length}
            </div>
        </div>
      </div>

      {/* Information for the current player */}
      <section className="bg-transparent sm:bg-white p-2 sm:p-8 rounded-3xl sm:shadow-sm sm:border sm:border-green-100 mb-8 overflow-hidden relative">
        <div className="mb-6">
            <h1 className="text-xl font-black text-gray-900 leading-tight mb-2 tracking-tight">{currentActivity.topic}</h1>
            <p className="text-base text-gray-500 font-medium leading-relaxed">Read your information below and ask your partner questions to find the missing details.</p>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between mb-4">
          <h2 className="text-lg mb-4 font-black text-green-900 uppercase tracking-widest opacity-70">Your Secret Information</h2>
          <AudioControls 
            onVoiceOpen={availableVoices.length > 0 ? () => setIsVoiceModalOpen(true) : undefined}
            onSlowToggle={() => toggleTTS(0.6, myTextBlocks.map(b => b.text).join(' '))}
            onListenToggle={() => toggleTTS(1.0, myTextBlocks.map(b => b.text).join(' '))}
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
        
        <div className="space-y-6">
          {myTextBlocks.length > 0 ? myTextBlocks.map((block, i) => (
            <div 
              key={i} 
              className="max-w-none font-sans text-xl leading-relaxed text-gray-800 bg-transparent p-0 sm:bg-gray-50/50 sm:p-6 rounded-2xl sm:border sm:border-gray-100 relative z-10"
            >
              {renderClickableText(block.text)}
            </div>
          )) : (
            <div className="text-center py-8 text-gray-400 italic font-medium">
              You have no specific text for this role. Use your partner's information.
            </div>
          )}
        </div>
      </section>

      {/* Questions to ask the partner */}
      <section className="mb-6 p-2">
        <div className="flex items-center gap-3 mb-6 ml-2">
          <div className="bg-green-600 p-2 rounded-lg">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Your Task: Ask Your Partner</h2>
        </div>
        <InformationGapQuestions 
          key={currentActivityIndex}
          questions={myQuestions} 
          onFinish={handleNextActivity}
          language={lesson.language}
          selectedVoiceName={selectedVoiceName}
          toggleTTS={toggleTTS}
          ttsState={ttsState}
          isLastActivity={currentActivityIndex === activities.length - 1}
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
        onFinish={() => {
          let totalScore = 0;
          let maxScore = 0;
          const pills: ReportScorePill[] = [];
          
          activityResults.forEach((res) => {
            if (res) {
              totalScore += res.score;
              maxScore += res.total;
            }
          });

          pills.push({ label: 'Speaking Activities', score: totalScore, total: maxScore });
          
          const now = new Date();
          const dateStr = now.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
          const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

          onFinish({
            title: lesson.title || lesson.content.topic || 'Speaking Lesson',
            nickname: studentName,
            studentId: studentId,
            homeroom: homeroom,
            finishTime: `${dateStr}, ${timeStr}`,
            totalScore,
            maxScore,
            pills
          });
        }}
        onReset={onReset}
      />
    </GenericLessonLayout>
  );
};
