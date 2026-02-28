import { useMemo } from 'react';
import { 
  StandardLessonContent, 
  UserAnswers, 
  ReportData, 
  ReportScorePill, 
  ReportWrittenResponse 
} from '../types';
import { normalizeString } from '../utils/textUtils';

export const useWorksheetScores = (
  standardContent: StandardLessonContent, 
  answers: UserAnswers
) => {
  const vocabScore = useMemo(() => {
    let score = 0;
    const vocabData = standardContent.activities.vocabulary;
    vocabData.items.forEach((item, idx) => {
      const userAnswer = answers.vocabulary[`vocab_${idx}`] || '';
      const correctDefIndex = vocabData.definitions.findIndex(d => d.id === item.answer);
      const correctChar = String.fromCharCode(97 + correctDefIndex);
      if (userAnswer.toLowerCase() === correctChar) score++;
    });
    return score;
  }, [standardContent, answers.vocabulary]);

  const fillScore = useMemo(() => {
    let score = 0;
    const fillData = standardContent.activities.fillInTheBlanks;
    fillData.forEach((item, idx) => {
      if (normalizeString(answers.fillBlanks[idx] || '') === normalizeString(item.answer)) score++;
    });
    return score;
  }, [standardContent, answers.fillBlanks]);

  const compScore = useMemo(() => {
    let score = 0;
    const compData = standardContent.activities.comprehension;
    compData.questions.forEach((q, idx) => {
      if ((answers.comprehension[idx] || '').toLowerCase() === q.answer.toLowerCase()) score++;
    });
    return score;
  }, [standardContent, answers.comprehension]);

  const scrambledScore = useMemo(() => {
    let score = 0;
    const scrambledData = standardContent.activities.scrambled;
    scrambledData.forEach((item, idx) => {
      if (normalizeString(answers.scrambled[idx] || '') === normalizeString(item.answer)) score++;
    });
    return score;
  }, [standardContent, answers.scrambled]);

  const calculateReportData = (
    displayTitle: string, 
    studentName: string, 
    studentId: string, 
    homeroom: string
  ): ReportData => {
    const pills: ReportScorePill[] = [
      { 
        label: 'Vocabulary', 
        score: vocabScore, 
        total: standardContent.activities.vocabulary.items.length 
      },
      { 
        label: 'Fill Blanks', 
        score: fillScore, 
        total: standardContent.activities.fillInTheBlanks.length 
      },
      { 
        label: 'Comprehension', 
        score: compScore, 
        total: standardContent.activities.comprehension.questions.length 
      },
      { 
        label: 'Scrambled', 
        score: scrambledScore, 
        total: standardContent.activities.scrambled.length 
      }
    ];

    const totalScore = vocabScore + fillScore + compScore + scrambledScore;
    const maxScore = 
      standardContent.activities.vocabulary.items.length + 
      standardContent.activities.fillInTheBlanks.length + 
      standardContent.activities.comprehension.questions.length + 
      standardContent.activities.scrambled.length;

    const writtenResponses: ReportWrittenResponse[] = 
      standardContent.activities.writtenExpression.questions.map((q, i) => ({
        question: q.text,
        answer: answers.writing[i] || ''
      }));

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    return {
      title: displayTitle,
      nickname: studentName,
      studentId: studentId,
      homeroom: homeroom,
      finishTime: `${dateStr}, ${timeStr}`,
      totalScore,
      maxScore,
      pills,
      writtenResponses
    };
  };

  return {
    vocabScore,
    fillScore,
    compScore,
    scrambledScore,
    calculateReportData
  };
};
