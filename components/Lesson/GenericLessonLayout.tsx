import React from 'react';
import { ParsedLesson } from '../../types';

interface GenericLessonLayoutProps {
  lesson: ParsedLesson;
  displayTitle: string;
  studentName: string;
  setStudentName: (name: string) => void;
  studentId: string;
  setStudentId: (id: string) => void;
  homeroom: string;
  setHomeroom: (homeroom: string) => void;
  isNameLocked: boolean;
  onBack?: () => void;
  showBack?: boolean;
  playerRole?: number | null;
  children: React.ReactNode;
  variant?: 'green' | 'white';
}

export const GenericLessonLayout: React.FC<GenericLessonLayoutProps> = ({
  displayTitle,
  playerRole,
  children}) => {
  return (
    <div className="bg-white max-w-4xl mx-auto pb-8 px-1 py-4 sm:px-6">
      {/* Page Title - Unified with the design of other views */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-black text-green-900 mb-2 tracking-tight">
          {displayTitle}
        </h1>
        {playerRole && (
          <div className="inline-block bg-green-100 text-green-800 px-4 py-1 rounded-full text-sm font-black uppercase tracking-wider border border-green-200">
            Player {playerRole}
          </div>
        )}
      </div>

      <main>
        {children}
      </main>
    </div>
  );
};
