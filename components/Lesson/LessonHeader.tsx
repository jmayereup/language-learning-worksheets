import React from 'react';
import { ArrowLeft, Mic } from 'lucide-react';

interface LessonHeaderProps {
  title: string;
  level?: string;
  language?: string;
  lessonType?: string;
  onBack?: () => void;
  showBack?: boolean;
  playerRole?: number | null;
}

export const LessonHeader: React.FC<LessonHeaderProps> = ({
  title,
  level,
  language,
  lessonType,
  onBack,
  showBack = false,
  playerRole
}) => {
  const isInfoGap = lessonType === 'information-gap';

  return (
    <div className="animate-fade-in">
      {playerRole && (
        <header className="mb-4 flex items-center justify-between animate-fade-in print:hidden">
          <button 
            onClick={onBack}
            className="flex items-center text-gray-500 hover:text-green-600 font-bold transition-colors bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Change Role
          </button>
          <div className="bg-green-100 text-green-800 px-4 py-1.5 rounded-full text-sm font-black uppercase tracking-wider">
            Player {playerRole}
          </div>
        </header>
      )}

      <section className="text-center mb-8 md:mb-12">
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-green-900 mb-4 tracking-tight leading-tight px-2">
          {title}
        </h1>
        {isInfoGap ? (
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-xl text-sm font-bold border border-blue-100">
            <Mic className="w-4 h-4" /> Speaking Activity
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-2">
            {language && (
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
                {language}
              </span>
            )}
            {level && (
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold">
                {level}
              </span>
            )}
          </div>
        )}
      </section>
    </div>
  );
};
