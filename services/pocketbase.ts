import PocketBase from 'pocketbase';
import { LessonRecord, ParsedLesson, LessonContent } from '../types';

// Initialize PocketBase
// Note: We use the URL provided in the original application
const pb = new PocketBase('https://blog.teacherjake.com');
pb.autoCancellation(false);

export const getFileUrl = (record: LessonRecord, filename: string) => {
  return pb.files.getURL(record, filename);
};

const parseLessonContent = (content: string | LessonContent): LessonContent => {
  if (typeof content === 'string') {
    try {
      return JSON.parse(content);
    } catch (e) {
      console.error("Failed to parse lesson content", e);
      return {
        title: "Error Parsing Lesson",
        readingText: "",
        activities: {
          vocabulary: { items: [], definitions: [] },
          fillInTheBlanks: [],
          comprehension: { questions: [] },
          scrambled: [],
          writtenExpression: { questions: [], examples: "" }
        }
      };
    }
  }
  return content;
};

export const fetchLessons = async (language: string, level: string) => {
  try {
    const records = await pb.collection('worksheets').getFullList<LessonRecord>({
      filter: `language = "${language}" && level = "${level}"`,
      sort: '-created',
    });
    
    return records.map(record => ({
      id: record.id,
      // Prefer top-level title, fallback to content title
      title: record.title || (typeof record.content === 'string' ? JSON.parse(record.content).title : record.content.title) || 'Untitled',
      level: record.level,
      language: record.language,
      tags: record.tags || []
    }));
  } catch (error) {
    console.error("Error fetching lessons:", error);
    throw error;
  }
};

export const fetchLessonById = async (id: string): Promise<ParsedLesson> => {
  try {
    const record = await pb.collection('worksheets').getOne<LessonRecord>(id);
    const content = parseLessonContent(record.content);
    
    // If DB has a title, ensure it overrides the JSON content title
    if (record.title) {
        content.title = record.title;
    }
    
    return {
      ...record,
      content,
      imageUrl: record.image ? getFileUrl(record, record.image) : undefined
    };
  } catch (error) {
    console.error(`Error fetching lesson ${id}:`, error);
    throw error;
  }
};