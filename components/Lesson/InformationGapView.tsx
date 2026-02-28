import React, { useState, useEffect } from 'react';
import { ParsedLesson, InformationGapContent, UserAnswers, ReportData, ReportScorePill } from '../../types';
import { Mic, CheckCircle, Volume2 } from 'lucide-react';
import { InformationGapQuestions } from '../Activities/InformationGapQuestions';
import { speakText } from '../../utils/textUtils';
import { VoiceSelectorModal } from '../UI/VoiceSelectorModal';
import { ReadingPassage } from '../Activities/ReadingPassage';
import { LessonFooter } from './LessonFooter';
import { LessonMedia } from '../UI/LessonMedia';
import { AudioControls } from '../UI/AudioControls';
import { useInformationGapScores, ActivityResult } from '../../hooks/useInformationGapScores';

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
  const [isSinglePlayer, setIsSinglePlayer] = useState(false);
  const passageRef = React.useRef<HTMLDivElement>(null);

  const { content } = lesson;


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

  const { calculateReportData } = useInformationGapScores();

  const handleActivityFinish = (score?: number, total?: number) => {
    const results = [...activityResults];
    if (score !== undefined && total !== undefined && total > 0) {
      results[currentActivityIndex] = { score, total };
    }
    
    onFinish(calculateReportData(
      lesson.title || lesson.content.topic || 'Speaking Lesson',
      studentName,
      studentId,
      homeroom,
      results
    ));
  };

  const handleActivityProgress = (score: number, total: number) => {
    const newResults = [...activityResults];
    newResults[currentActivityIndex] = { score, total };
    setActivityResults(newResults);
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
      handleActivityFinish(); // Call the final finish handler when all activities are done
    }
  }, [isFinished]);

  if (currentPlayer === null) {
    const firstActivity = activities[0] || {};
    const mainTitle = lesson.title || (Array.isArray(content) ? firstActivity.topic : content.topic) || "Information-Gap Activity";
    const mainDesc = (Array.isArray(content) ? firstActivity.scenario_description : content.scenario_description) || "Select your role to begin.";
    
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 animate-fade-in">
        <div className="text-center mb-12">
          <LessonMedia 
            imageUrl={lesson.imageUrl} 
            title={mainTitle} 
          />
          
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

          <h1 className="text-3xl font-black text-green-900 mb-4 tracking-tight leading-tight max-w-2xl mx-auto">{mainTitle}</h1>
          <p className="text-lg text-gray-600 font-medium max-w-xl mx-auto">{mainDesc}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto mb-12">
          {[1, 2].map((playerNum) => (
            <button
              key={playerNum}
              onClick={() => setCurrentPlayer(playerNum)}
              className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-500 hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Mic className="w-10 h-10 text-blue-600" />
              </div>
              <h2 className="text-2xl font-black text-gray-800 mb-2">Player {playerNum}</h2>
              <p className="text-gray-500 font-medium tracking-wide">Click to select this role</p>
            </button>
          ))}
        </div>

        <div className="flex flex-col items-center p-6 bg-green-50 rounded-2xl border border-green-100 max-w-lg mx-auto">
          <label className="flex items-center gap-4 cursor-pointer group">
            <div className="relative inline-flex items-center">
              <input 
                type="checkbox" 
                checked={isSinglePlayer} 
                onChange={(e) => setIsSinglePlayer(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-900 font-black text-lg group-hover:text-blue-700 transition-colors">Single Player Mode</span>
              <span className="text-gray-500 text-sm font-medium">Listen to partner info via TTS</span>
            </div>
          </label>
        </div>
      </div>
    );
  }

  const currentActivity = activities[currentActivityIndex];
  
  const myTextBlocks = currentActivity.blocks.filter(b => b.text_holder_id === currentPlayer);
  const myQuestions = currentActivity.blocks.flatMap(b => b.questions).filter(q => q.asker_id === currentPlayer);
  const partnerText = currentActivity.blocks
    .filter(b => b.text_holder_id !== currentPlayer)
    .map(b => b.text)
    .join('\n\n');


  return (
    <div className="space-y-4">
      {currentPlayer !== null && (
        <button 
          onClick={() => {
            if (currentActivityIndex > 0) {
              setCurrentActivityIndex(prev => prev - 1);
            } else {
              setCurrentPlayer(null);
            }
          }}
          className="flex items-center text-blue-700 font-bold hover:text-blue-800 transition-colors mb-4"
        >
          &larr; Back
        </button>
      )}
      <div className="flex flex-col items-center mb-8">
        <div className="inline-block bg-green-100 text-green-800 px-4 py-1 rounded-full text-sm font-black uppercase tracking-wider border border-green-200">
          Player {currentPlayer}
        </div>
      </div>

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
                            ? 'bg-blue-600 text-white shadow-lg scale-110' 
                            : activityResults[idx] 
                                ? 'bg-blue-100 text-blue-600 border-2 border-blue-200 hover:bg-blue-200' 
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
      <ReadingPassage
        text={myTextBlocks.map(b => b.text).join('\n\n')}
        language={lesson.language}
        title="Your Secret Information"
        onSlowToggle={() => toggleTTS(0.6, myTextBlocks.map(b => b.text).join(' '))}
        onListenToggle={() => toggleTTS(1.0, myTextBlocks.map(b => b.text).join(' '))}
        ttsStatus={ttsState.status}
        currentRate={ttsState.rate}
        hasVoices={availableVoices.length > 0}
        onVoiceOpen={availableVoices.length > 0 ? () => setIsVoiceModalOpen(true) : undefined}
        passageRef={passageRef}
        className="mb-8"
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

      {/* Single Player: Partner's Information Section */}
      {isSinglePlayer && partnerText && (
        <div className="mb-8 p-6 bg-blue-50 border border-blue-100 rounded-2xl animate-fade-in">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-3">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg shadow-sm">
                <Volume2 className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-black text-blue-900 tracking-tight leading-none mb-1">Listen to Partner's Info</h3>
                <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">Partner ({currentPlayer === 1 ? 'Player 2' : 'Player 1'})</p>
              </div>
            </div>
            <AudioControls
              onSlowToggle={() => toggleTTS(0.6, partnerText)}
              onListenToggle={() => toggleTTS(1.0, partnerText)}
              ttsStatus={ttsState.status}
              currentRate={ttsState.rate}
              hasVoices={false}
              variant="white"
              className="sm:justify-end"
            />
          </div>
          <div className="bg-white/50 p-4 rounded-xl border border-blue-50">
            <p className="text-blue-800 font-medium italic text-sm text-center sm:text-left">
              "Your partner has secret information you need. Click the buttons above to hear what they know."
            </p>
          </div>
        </div>
      )}

      {/* Questions to ask the partner */}
      <section className="mb-6 p-2">
        <div className="flex items-center gap-3 mb-6 ml-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Your Task: Ask Your Partner</h2>
        </div>
        <InformationGapQuestions 
          key={currentActivityIndex}
          questions={myQuestions} 
          onFinish={handleNextActivity}
          onProgress={handleActivityProgress}
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
        onFinish={() => handleActivityFinish()}
        onReset={onReset}
      />
    </div>
  );
};
