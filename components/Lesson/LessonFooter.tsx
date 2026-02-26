import React from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '../UI/Button';
import { SubmissionSection } from './SubmissionSection';

interface LessonFooterProps {
  studentName: string;
  setStudentName: (name: string) => void;
  studentId: string;
  setStudentId: (id: string) => void;
  homeroom: string;
  setHomeroom: (homeroom: string) => void;
  isNameLocked: boolean;
  onFinish: () => void;
  onReset: () => void;
  variant?: 'green' | 'white';
}

export const LessonFooter: React.FC<LessonFooterProps> = ({
  studentName,
  setStudentName,
  studentId,
  setStudentId,
  homeroom,
  setHomeroom,
  isNameLocked,
  onFinish,
  onReset,
  variant
}) => {
  return (
    <div className="flex flex-col items-center gap-4 py-8 animate-fade-in print:hidden">
      <p className="text-gray-500 italic">Check your answers carefully before finishing!</p>
      
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

      <Button
        onClick={onReset}
        variant="danger"
        size="sm"
        className="flex items-center gap-2 h-10"
      >
        <RotateCcw className="w-4 h-4" /> Reset
      </Button>
    </div>
  );
};
