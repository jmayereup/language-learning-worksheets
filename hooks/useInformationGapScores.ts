import { ReportData, ReportScorePill } from '../types';

export interface ActivityResult {
  score: number;
  total: number;
}

export const useInformationGapScores = () => {
  const calculateReportData = (
    lessonTitle: string,
    studentName: string,
    studentId: string,
    homeroom: string,
    activityResults: ActivityResult[]
  ): ReportData => {
    let totalScore = 0;
    let maxScore = 0;
    const pills: ReportScorePill[] = [];

    activityResults.forEach((res) => {
      if (res) {
        totalScore += res.score;
        maxScore += res.total;
      }
    });

    pills.push({ label: 'Speaking Activities', score: totalScore, total: maxScore });

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    return {
      title: lessonTitle,
      nickname: studentName,
      studentId,
      homeroom,
      finishTime: `${dateStr}, ${timeStr}`,
      totalScore,
      maxScore,
      pills
    };
  };

  return {
    calculateReportData
  };
};
