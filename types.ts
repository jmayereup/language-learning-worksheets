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

export interface LessonContent {
  title: string;
  readingText: string;
  activities: {
    vocabulary: VocabularyActivity;
    fillInTheBlanks: FillInBlankItem[];
    comprehension: ComprehensionActivity;
    scrambled: ScrambledItem[];
    writtenExpression: WritingActivity;
  };
}

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
  title?: string; // Added field
  tags?: string[]; // Added field
  content: LessonContent | string; // PB returns JSON or string depending on parse
  audioFile?: string; // Added field
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
}