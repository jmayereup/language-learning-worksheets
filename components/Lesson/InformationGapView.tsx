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
  const { content } = lesson;

  if (currentPlayer === null) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 animate-fade-in">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-green-900 mb-4 tracking-tight leading-tight">{content.topic}</h1>
          <p className="text-xl text-gray-600 font-medium">{content.scenario_description}</p>
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

  const myTextBlocks = content.blocks.filter(b => b.text_holder_id === currentPlayer);
  const myQuestions = content.blocks.flatMap(b => b.questions).filter(q => q.asker_id === currentPlayer);

  return (
    <GenericLessonLayout
      lesson={lesson}
      displayTitle={content.topic}
      studentName={studentName}
      setStudentName={setStudentName}
      studentId={studentId}
      setStudentId={setStudentId}
      homeroom={homeroom}
      setHomeroom={setHomeroom}
      isNameLocked={isNameLocked}
      onFinish={onFinish}
      onBack={() => setCurrentPlayer(null)}
      playerRole={currentPlayer}
      variant="white"
    >
      {/* Information for the current player */}
      <section className="bg-white p-8 rounded-3xl shadow-sm border border-green-100 mb-8 overflow-hidden relative">
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
          questions={myQuestions} 
          onFinish={onFinish}
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
