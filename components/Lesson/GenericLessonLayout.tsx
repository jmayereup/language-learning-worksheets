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
  children: React.ReactNode;
  variant?: 'green' | 'white';
}

export const GenericLessonLayout: React.FC<GenericLessonLayoutProps> = ({
  displayTitle,
  children}) => {
  return (
    <div className="bg-white max-w-4xl mx-auto pb-4 px-1 py-4 sm:px-6">
      {/* Page Title - Unified with the design of other views */}
      <div className="mb-4 text-center print:hidden">
        <h1 className="text-3xl md:text-4xl font-black text-green-900 mb-2 tracking-tight">
          {displayTitle}
        </h1>
      </div>

      <main>
        {children}
      </main>
    </div>
  );
};
