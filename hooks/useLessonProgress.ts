import { useState, useEffect, useCallback } from 'react';
import { UserAnswers, CompletionStates } from '../types';

export interface StudentInfo {
  studentName: string;
  studentId: string;
  homeroom: string;
}

const defaultAnswers: UserAnswers = {
  vocabulary: {},
  fillBlanks: {},
  comprehension: {},
  scrambled: {},
  writing: {},
  infoGap: {}
};

const defaultCompletionStates: CompletionStates = {
  vocabularyChecked: false,
  fillBlanksChecked: false,
  comprehensionCompleted: false,
  scrambledCompleted: false,
};

export const useLessonProgress = (lessonId: string) => {
  const STORAGE_KEY = `lesson-progress-${lessonId}`;

  const getInitialValue = useCallback(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          answers: parsed.answers ?? defaultAnswers,
          studentName: parsed.studentName ?? '',
          studentId: parsed.studentId ?? '',
          homeroom: parsed.homeroom ?? '',
          completionStates: parsed.completionStates ?? defaultCompletionStates
        };
      }
    } catch (e) {
      console.warn('Failed to read saved progress:', e);
    }
    return {
      answers: defaultAnswers,
      studentName: '',
      studentId: '',
      homeroom: '',
      completionStates: defaultCompletionStates
    };
  }, [STORAGE_KEY]);

  const initial = getInitialValue();

  const [answers, setAnswers] = useState<UserAnswers>(initial.answers);
  const [completionStates, setCompletionStates] = useState<CompletionStates>(initial.completionStates);
  const [studentName, setStudentName] = useState(initial.studentName);
  const [studentId, setStudentId] = useState(initial.studentId);
  const [homeroom, setHomeroom] = useState(initial.homeroom);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ 
        answers, 
        studentName, 
        studentId, 
        homeroom, 
        completionStates 
      }));
    } catch (e) {
      console.warn('Failed to save progress:', e);
    }
  }, [STORAGE_KEY, answers, studentName, studentId, homeroom, completionStates]);

  const resetProgress = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setAnswers(defaultAnswers);
      setStudentName('');
      setStudentId('');
      setHomeroom('');
      setCompletionStates(defaultCompletionStates);
    } catch (e) {
      console.warn('Failed to clear progress:', e);
    }
  }, [STORAGE_KEY]);

  return {
    answers,
    setAnswers,
    studentName,
    setStudentName,
    studentId,
    setStudentId,
    homeroom,
    setHomeroom,
    completionStates,
    setCompletionStates,
    resetProgress
  };
};
