export interface VocabularyItem {
  label: string;
  answer: string; // references a definition ID
}

export interface Definition {
  id: string;
  text: string;
}

export interface VocabularyActivity {
  items: VocabularyItem[];
  definitions: Definition[];
}

export interface FillInBlankItem {
  before: string;
  after: string;
  answer: string;
}

export interface ComprehensionQuestion {
  text: string;
  answer: string; // "true" or "false" string
}

export interface ComprehensionActivity {
  questions: ComprehensionQuestion[];
}

export interface ScrambledItem {
  text: string; // The hint/display text (sometimes empty in this data model, derived from answer)
  answer: string; // The correct full sentence
}

export interface WritingQuestion {
  text: string;
}

export interface WritingActivity {
  questions: WritingQuestion[];
  examples: string; // HTML string
}

export interface InformationGapQuestion {
  asker_id: number;
  question: string;
  options: string[];
  correct_answer: string;
}

export interface InformationGapBlock {
  text_holder_id: number;
  text: string;
  questions: InformationGapQuestion[];
}

export interface InformationGapActivity {
  topic: string;
  scenario_description: string;
  blocks: InformationGapBlock[];
}

export interface InformationGapContent {
  topic?: string; // Optional for backward compatibility
  scenario_description?: string; // Optional for backward compatibility
  player_count: number;
  blocks?: InformationGapBlock[]; // Optional for backward compatibility
  activities?: InformationGapActivity[];
  seo_intro?: string; // Added for SEO automation
}

export interface FocusedReaderQuestion {
  question: string;
  type: 'True/False' | 'Multiple Choice' | string;
  options: string[];
  answer: string;
}

export interface FocusedReaderPart {
  part_number: number;
  text: string;
  vocabulary_explanations: Record<string, string>;
  questions: FocusedReaderQuestion[];
}

export interface FocusedReaderContent {
  title: string;
  seo_intro: string;
  parts: FocusedReaderPart[];
}

export interface StandardLessonContent {
  title: string;
  readingText: string;
  seo_intro?: string; // Added for SEO automation
  activities: {
    vocabulary: VocabularyActivity;
    fillInTheBlanks: FillInBlankItem[];
    comprehension: ComprehensionActivity;
    scrambled: ScrambledItem[];
    writtenExpression: WritingActivity;
  };
}

export type LessonContent = StandardLessonContent | InformationGapContent | InformationGapActivity[] | FocusedReaderContent;

export interface LessonRecord {
  id: string;
  collectionId: string;
  collectionName: string;
  created: string;
  updated: string;
  language: string;
  level: string;
  image: string;
  videoUrl: string;
  isVideoLesson: boolean;
  lessonType?: string; // e.g. "information-gap"
  title?: string; // Added field
  tags?: string[]; // Added field
  content: LessonContent | string; // PB returns JSON or string depending on parse
  audioFile?: string; // Added field
  creatorId?: string; // Added field
  seo?: string; // Added field
  description?: string; // Added field
}

export interface ParsedLesson extends Omit<LessonRecord, 'content'> {
  content: LessonContent;
  imageUrl?: string;
  audioFileUrl?: string;
}

// State for User Answers
export interface UserAnswers {
  vocabulary: Record<string, string>; // index -> definition letter (a, b, c)
  fillBlanks: Record<number, string>; // index -> word
  comprehension: Record<number, string>; // index -> "true"/"false"
  scrambled: Record<number, string>; // index -> user formed sentence
  writing: Record<number, string>; // index -> user text
  infoGap?: Record<number, { score: number, total: number }>; // activityIndex -> result
  focusedReader?: Record<number, Record<number, string>>; // partIndex -> questionIndex -> answer
  completionStates?: Record<string, boolean>; // sectionKey -> boolean
}

export interface CompletionStates {
  vocabularyChecked: boolean;
  fillBlanksChecked: boolean;
  comprehensionCompleted: boolean;
  scrambledCompleted: boolean;
}

export interface ReportScorePill {
  label: string;
  score: number;
  total: number;
}

export interface ReportWrittenResponse {
  question: string;
  answer: string;
}

export interface ReportData {
  title: string;
  nickname: string;
  studentId: string;
  homeroom: string;
  finishTime: string;
  totalScore: number;
  maxScore: number;
  pills: ReportScorePill[];
  writtenResponses?: ReportWrittenResponse[];
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'tj-pocketbase-worksheet': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}