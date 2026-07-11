import { ParsedLesson, StandardLessonContent, FocusedReaderContent, VocabWord } from '../types';
import { normalizeContent } from './contentFormat';

export const extractVocabularyFromLessons = async (lessons: any[]): Promise<VocabWord[]> => {
  const allWords: VocabWord[] = [];

  for (const lesson of lessons) {
    const content = normalizeContent(lesson.content);

    // Custom-element / legacy-markdown content has no structured vocab to extract.
    if (typeof content !== 'object' || content === null) {
      continue;
    }

    if (lesson.lessonType === 'focused-reading') {
      const frContent = content as FocusedReaderContent;
      if (frContent.parts) {
        frContent.parts.forEach(part => {
          if (part.vocabulary_explanations) {
            Object.entries(part.vocabulary_explanations).forEach(([word, def]) => {
              allWords.push({
                word,
                definition: def as string,
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
  uniqueWords.forEach(wordObj => {
    const key = wordObj.word.trim().toLowerCase();
    if (!uniqueWords.has(key)) {
      uniqueWords.set(key, wordObj);
    }
  });

  return Array.from(uniqueWords.values());
};
