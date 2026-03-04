import { ParsedLesson, StandardLessonContent, FocusedReaderContent, VocabWord } from '../types';

export const extractVocabularyFromLessons = async (lessons: any[]): Promise<VocabWord[]> => {
  const allWords: VocabWord[] = [];

  for (const lesson of lessons) {
    // We expect the lesson content to already be parsed if we are dealing with standard loaded lessons,
    // but we can add safety checks.
    const content = typeof lesson.content === 'string' ? JSON.parse(lesson.content) : lesson.content;

    if (lesson.lessonType === 'focused-reading') {
      const frContent = content as FocusedReaderContent;
      if (frContent.parts) {
        frContent.parts.forEach(part => {
          if (part.vocabulary_explanations) {
            Object.entries(part.vocabulary_explanations).forEach(([word, def]) => {
              allWords.push({
                word,
                definition: def,
                sourceLessonId: lesson.id
              });
            });
          }
        });
      }
    } else {
      // Standard Lesson fallback
      const stdContent = content as StandardLessonContent;
      if (stdContent.activities?.vocabulary?.items) {
        const { items, definitions } = stdContent.activities.vocabulary;
        items.forEach(item => {
          const def = definitions.find(d => d.id === item.answer);
          if (def) {
            allWords.push({
              word: item.label,
              definition: def.text,
              sourceLessonId: lesson.id
            });
          }
        });
      }
    }
  }

  // Deduplicate words (case-insensitive) keeping the first encountered definition
  const uniqueWords = new Map<string, VocabWord>();
  allWords.forEach(wordObj => {
    const key = wordObj.word.trim().toLowerCase();
    if (!uniqueWords.has(key)) {
      uniqueWords.set(key, wordObj);
    }
  });

  return Array.from(uniqueWords.values());
};
