import PocketBase from 'pocketbase';
import { LessonRecord, ParsedLesson, LessonContent } from '../types';

// Initialize PocketBase
// Note: We use the URL provided in the original application
const createPB = () => {
  try {
    // Check if localStorage is available
    localStorage.getItem('test');
    return new PocketBase('https://blog.teacherjake.com');
  } catch (e) {
    console.warn("localStorage not available, using memory store");
    // PocketBase automatically falls back to an internal memory store 
    // if it can't find a global localStorage or if it fails.
    // But we can be explicit or just handle the error.
    return new PocketBase('https://blog.teacherjake.com');
  }
};

const pb = createPB();
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

const getYouTubeId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url?.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export const fetchLessons = async (language: string, level: string) => {
  try {
    let filter = `language = "${language}"`;
    if (level !== 'All') {
      filter += ` && level = "${level}"`;
    }

    const records = await pb.collection('worksheets').getFullList<LessonRecord>({
      filter: filter,
      sort: '-created',
    });

    return records.map(record => {
      const content = typeof record.content === 'string' ? JSON.parse(record.content) : record.content;
      const title = record.title || content.title || 'Untitled';

      // Extract a snippet for the description, removing the title if it's at the start
      let description = content.readingText || '';
      if (description.startsWith(title)) {
        description = description.substring(title.length).trim();
      }
      description = description.substring(0, 120) + (description.length > 120 ? '...' : '');

      let imageUrl = record.image ? getFileUrl(record, record.image) : undefined;

      // Fallback to YouTube thumbnail if no image uploaded
      if (!imageUrl && record.videoUrl) {
        const ytId = getYouTubeId(record.videoUrl);
        if (ytId) {
          imageUrl = `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`;
        }
      }

      return {
        id: record.id,
        title,
        level: record.level,
        language: record.language,
        tags: record.tags || [],
        created: record.created,
        imageUrl,
        description
      };
    });
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