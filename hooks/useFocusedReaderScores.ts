import { useMemo } from 'react';
import { 
  FocusedReaderContent, 
  UserAnswers, 
  ReportData, 
  ReportScorePill 
} from '../types';

export const useFocusedReaderScores = (
  content: FocusedReaderContent, 
  answers: UserAnswers,
  currentPartIndex: number
) => {
  const currentPart = content.parts[currentPartIndex];

  const vocabScore = useMemo(() => {
    let score = 0;
    const vocabExplanations = currentPart.vocabulary_explanations || {};
    const vocabAnswers = answers.vocabulary || {};
    Object.keys(vocabExplanations).forEach((word, index) => {
      const answerKey = `vocab_${currentPartIndex}_${index}`;
      const userAnswer = vocabAnswers[answerKey] || '';
      const correctChar = String.fromCharCode(97 + index);
      if (userAnswer.toLowerCase() === correctChar) score++;
    });
    return score;
  }, [currentPart, currentPartIndex, answers.vocabulary]);

  const isVocabCompleted = useMemo(() => {
    const vocabExplanations = currentPart.vocabulary_explanations || {};
    const vocabCount = Object.keys(vocabExplanations).length;
    if (vocabCount === 0) return false;
    
    const vocabAnswers = answers.vocabulary || {};
    let matchedCount = 0;
    Object.keys(vocabExplanations).forEach((_, index) => {
      if (vocabAnswers[`vocab_${currentPartIndex}_${index}`]) matchedCount++;
    });
    return matchedCount === vocabCount;
  }, [currentPart, currentPartIndex, answers.vocabulary]);

  const comprehensionScore = useMemo(() => {
    let score = 0;
    const questions = currentPart.questions || [];
    const partAnswers = answers.focusedReader?.[currentPartIndex] || {};
    questions.forEach((q, i) => {
      if (partAnswers[i] === q.answer) score++;
    });
    return score;
  }, [currentPart, currentPartIndex, answers.focusedReader]);

  const isComprehensionCompleted = useMemo(() => {
    const questions = currentPart.questions || [];
    if (questions.length === 0) return false;
    const partAnswers = answers.focusedReader?.[currentPartIndex] || {};
    return questions.every((_, i) => !!partAnswers[i]);
  }, [currentPart, currentPartIndex, answers.focusedReader]);

  const calculateReportData = (
    lessonTitle: string,
    studentName: string,
    studentId: string,
    homeroom: string
  ): ReportData => {
    const pills: ReportScorePill[] = [];
    let totalScore = 0;
    let maxOverallScore = 0;

    content.parts.forEach((part, pIdx) => {
      // Questions score
      let partScore = 0;
      const partAnswers = answers.focusedReader?.[pIdx] || {};
      part.questions.forEach((q, qIdx) => {
        if (partAnswers[qIdx] === q.answer) {
          partScore++;
        }
      });
      pills.push({
        label: `Part ${part.part_number} Questions`,
        score: partScore,
        total: part.questions.length
      });
      totalScore += partScore;
      maxOverallScore += part.questions.length;

      // Vocabulary score
      const vocabExplanations = part.vocabulary_explanations || {};
      const vocabCount = Object.keys(vocabExplanations).length;
      if (vocabCount > 0) {
        let partVocabScore = 0;
        const vocabAnswers = answers.vocabulary || {};
        
        Object.keys(vocabExplanations).forEach((word, index) => {
          const answerKey = `vocab_${pIdx}_${index}`;
          const userAnswer = vocabAnswers[answerKey] || '';
          const correctChar = String.fromCharCode(97 + index);
          if (userAnswer.toLowerCase() === correctChar) {
            partVocabScore++;
          }
        });

        pills.push({
          label: `Part ${part.part_number} Vocab`,
          score: partVocabScore,
          total: vocabCount
        });
        totalScore += partVocabScore;
        maxOverallScore += vocabCount;
      }
    });

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    return {
      title: lessonTitle || content.title,
      nickname: studentName,
      studentId: studentId,
      homeroom: homeroom,
      finishTime: `${dateStr}, ${timeStr}`,
      totalScore,
      maxScore: maxOverallScore,
      pills,
    };
  };

  return {
    vocabScore,
    isVocabCompleted,
    comprehensionScore,
    isComprehensionCompleted,
    calculateReportData
  };
};
