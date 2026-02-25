import React, { useState } from 'react';
import { InformationGapContent, ParsedLesson } from '../../types';
import { Button } from '../UI/Button';
import { Users, CheckCircle } from 'lucide-react';
import { InformationGapQuestions } from '../Activities/InformationGapQuestions';
import { speakText } from '../../utils/textUtils';
import { GenericLessonLayout } from './GenericLessonLayout';

interface InformationGapViewProps {
  lesson: ParsedLesson & { content: InformationGapContent };
  onReset: () => void;
  onFinish: () => void;
  studentName: string;
  setStudentName: (name: string) => void;
  studentId: string;
  setStudentId: (id: string) => void;
  homeroom: string;
  setHomeroom: (homeroom: string) => void;
  isNameLocked: boolean;
}

interface ActivityResult {
  score: number;
  total: number;
}

export const InformationGapView: React.FC<InformationGapViewProps> = ({ 
  lesson, 
  onReset, 
  onFinish,
  studentName,
  setStudentName,
  studentId,
  setStudentId,
  homeroom,
  setHomeroom,
  isNameLocked
}) => {
  const [currentPlayer, setCurrentPlayer] = useState<number | null>(null);
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [activityResults, setActivityResults] = useState<ActivityResult[]>([]);
  const [isFinished, setIsFinished] = useState(false);

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

  if (currentPlayer === null) {
    const firstActivity = activities[0] || {};
    const mainTitle = lesson.title || (Array.isArray(content) ? firstActivity.topic : content.topic) || "Information-Gap Activity";
    const mainDesc = (Array.isArray(content) ? firstActivity.scenario_description : content.scenario_description) || "Select your role to begin.";
    
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 animate-fade-in">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-green-900 mb-4 tracking-tight leading-tight">{mainTitle}</h1>
          <p className="text-xl text-gray-600 font-medium">{mainDesc}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {[1, 2].map((playerNum) => (
            <button
              key={playerNum}
              onClick={() => setCurrentPlayer(playerNum)}
              className="group bg-white p-10 rounded-4xl shadow-lg border-2 border-transparent hover:border-green-500 hover:shadow-2xl transition-all duration-300 flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-10 h-10 text-green-600" />
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
  
  if (!currentActivity || isFinished) {
    const totalScore = activityResults.reduce((sum, res) => sum + res.score, 0);
    const totalQuestions = activityResults.reduce((sum, res) => sum + res.total, 0);

    return (
      <GenericLessonLayout
        lesson={lesson}
        displayTitle={lesson.title || "Lesson Complete"}
        studentName={studentName}
        setStudentName={setStudentName}
        studentId={studentId}
        setStudentId={setStudentId}
        homeroom={homeroom}
        setHomeroom={setHomeroom}
        isNameLocked={isNameLocked}
        onFinish={onFinish}
        onBack={() => {
            setIsFinished(false);
            setCurrentActivityIndex(0);
            setActivityResults([]);
        }}
        playerRole={currentPlayer}
        variant="white"
      >
        <div className="bg-white p-12 rounded-3xl shadow-xl border-4 border-green-500 text-center animate-bounce-in max-w-2xl mx-auto my-12">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h2 className="text-4xl font-black text-green-900 mb-2">Lesson Complete!</h2>
          <p className="text-gray-600 text-xl mb-8">You've finished all {activities.length} activities.</p>
          
          <div className="grid grid-cols-2 gap-8 mb-10">
            <div className="bg-green-50 p-6 rounded-2xl">
              <div className="text-4xl font-black text-green-600">{totalScore}/{totalQuestions}</div>
              <div className="text-xs font-bold text-green-800 uppercase tracking-widest mt-1">Total Score</div>
            </div>
            <div className="bg-blue-50 p-6 rounded-2xl">
              <div className="text-4xl font-black text-blue-600">{totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 100}%</div>
              <div className="text-xs font-bold text-blue-800 uppercase tracking-widest mt-1">Final Accuracy</div>
            </div>
          </div>

          <p className="text-gray-500 mb-8 italic">Enter your details below to submit your final report.</p>
        </div>
      </GenericLessonLayout>
    );
  }

  const myTextBlocks = currentActivity.blocks.filter(b => b.text_holder_id === currentPlayer);
  const myQuestions = currentActivity.blocks.flatMap(b => b.questions).filter(q => q.asker_id === currentPlayer);

  const handleActivityFinish = (score: number, total: number) => {
    const newResults = [...activityResults];
    newResults[currentActivityIndex] = { score, total };
    setActivityResults(newResults);

    if (currentActivityIndex < activities.length - 1) {
      setCurrentActivityIndex(prev => prev + 1);
      window.scrollTo(0, 0);
    } else {
      setIsFinished(true);
    }
  };

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
      onFinish={onFinish}
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
      <div className="mb-6 flex flex-col md:flex-row items-center justify-between gap-4 px-2 pl-2 h-fit">
        <div className="flex items-center gap-2 p-2 w-1/2">
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
        
        <div className="flex items-center justify-between md:justify-end gap-6">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
                Activity {currentActivityIndex + 1} of {activities.length}
            </div>
            {activityResults.length > 0 && (
                <div className="text-sm font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                    Running Score: {activityResults.reduce((sum, r) => sum + (r?.score || 0), 0)}
                </div>
            )}
        </div>
      </div>

      {/* Information for the current player */}
      <section className="bg-white p-8 rounded-3xl shadow-sm border border-green-100 mb-8 overflow-hidden relative">
        <div className="mb-4">
            <h1 className="text-3xl font-black text-gray-900 leading-tight mb-2">{currentActivity.topic}</h1>
            <p className="text-lg text-gray-500 font-medium">{currentActivity.scenario_description}</p>
        </div>
        <hr className="my-6 border-gray-100" />
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-green-900 uppercase tracking-tight">Your Secret Information</h2>
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-full font-bold"
            onClick={() => speakText(myTextBlocks.map(b => b.text).join(' '), lesson.language)}
          >
            Listen
          </Button>
        </div>
        
        <div className="space-y-6">
          {myTextBlocks.length > 0 ? myTextBlocks.map((block, i) => (
            <div 
              key={i} 
              className="prose max-w-none font-serif text-2xl leading-relaxed text-gray-800 bg-gray-50/50 p-6 rounded-2xl border border-gray-100 italic relative z-10"
            >
              {block.text}
            </div>
          )) : (
            <div className="text-center py-8 text-gray-400 italic font-medium">
              You have no specific text for this role. Use your partner's information.
            </div>
          )}
        </div>
      </section>

      {/* Questions to ask the partner */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6 ml-2">
          <div className="bg-green-600 p-2 rounded-lg">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Your Task: Ask Your Partner</h2>
        </div>
        
        <InformationGapQuestions 
          key={currentActivityIndex}
          questions={myQuestions} 
          onFinish={handleActivityFinish}
          language={lesson.language}
        />
      </section>

      <div className="flex justify-center mt-12 mb-8">
        <Button onClick={onReset} variant="outline" className="text-red-500 border-red-100 hover:bg-red-50 font-bold rounded-xl">
          Reset All Progress
        </Button>
      </div>
    </GenericLessonLayout>
  );
};
