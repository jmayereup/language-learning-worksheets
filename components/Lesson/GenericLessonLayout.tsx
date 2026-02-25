import React from 'react';
import { ParsedLesson } from '../../types';
import { LessonHeader } from './LessonHeader';
import { SubmissionSection } from './SubmissionSection';

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
  onFinish: () => void;
  onBack?: () => void;
  showBack?: boolean;
  playerRole?: number | null;
  children: React.ReactNode;
  variant?: 'green' | 'white';
}

export const GenericLessonLayout: React.FC<GenericLessonLayoutProps> = ({
  lesson,
  displayTitle,
  studentName,
  setStudentName,
  studentId,
  setStudentId,
  homeroom,
  setHomeroom,
  isNameLocked,
  onFinish,
  onBack,
  showBack,
  playerRole,
  children,
  variant
}) => {
  return (
    <div className="max-w-4xl mx-auto pb-20 px-4 sm:px-6">
      <LessonHeader 
        title={displayTitle}
        level={lesson.level}
        language={lesson.language}
        lessonType={lesson.lessonType}
        onBack={onBack}
        showBack={showBack}
        playerRole={playerRole}
      />

      <main>
        {children}
      </main>

      <SubmissionSection 
        studentName={studentName}
        setStudentName={setStudentName}
        studentId={studentId}
        setStudentId={setStudentId}
        homeroom={homeroom}
        setHomeroom={setHomeroom}
        isNameLocked={isNameLocked}
        onFinish={onFinish}
        variant={variant}
      />
    </div>
  );
};
