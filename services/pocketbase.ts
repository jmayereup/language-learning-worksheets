import PocketBase from 'pocketbase';
import { LessonRecord, ParsedLesson, LessonContent } from '../types';

// Initialize PocketBase
// Note: We use the URL provided in the original application
const PB_URL = (typeof process !== 'undefined' && process.env?.POCKETBASE_URL) || 'https://blog.teacherjake.com';
const FILES_BASE_URL = (typeof process !== 'undefined' && process.env?.FILES_BASE_URL) || 'https://files.teacherjake.com';

const createPB = () => {
  try {
    // Check if localStorage is available
    localStorage.getItem('test');
    return new PocketBase(PB_URL);
  } catch (e) {
    console.warn("localStorage not available, using memory store");
    // PocketBase automatically falls back to an internal memory store 
    // if it can't find a global localStorage or if it fails.
    // But we can be explicit or just handle the error.
    return new PocketBase(PB_URL);
  }
};

const pb = createPB();
pb.autoCancellation(false);

export const getFileUrl = (record: LessonRecord | { collectionId: string, id: string }, filename: string, _queryParams?: Record<string, any>) => {
  if (!filename) return '';
  const collection = (record as any).collectionId || (record as any).collectionName;
  const id = (record as any).id;
  
  if (collection && id) {
    return `${FILES_BASE_URL}/${collection}/${id}/${filename}`;
  }
  
  // Fallback to SDK if record is incomplete (though should be avoided for S3 direct access)
  return pb.files.getURL(record as any, filename);
};

// Auth methods
export const loginWithEmail = async (email: string, password: string) => {
  try {
    // Try to authenticate as a regular user first
    return await pb.collection('users').authWithPassword(email, password);
  } catch (error) {
    // If that fails, try to authenticate as a superuser (admin) in PocketBase v0.23+
    try {
      return await pb.collection('_superusers').authWithPassword(email, password);
    } catch (superuserError) {
      // Throw the original user auth error if both fail
      throw error;
    }
  }
};

export const logout = () => {
  pb.authStore.clear();
};

export const getCurrentUser = () => {
  return pb.authStore.record;
};

export const isAuthenticated = () => {
  return pb.authStore.isValid;
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
        ...record,
        title,
        content,
        imageUrl,
        description,
        collectionId: record.collectionId || '',
        collectionName: record.collectionName || ''
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
    if (record.title && 'title' in content) {
      (content as any).title = record.title;
    }

    return {
      ...record,
      content,
      imageUrl: record.image ? getFileUrl(record, record.image) : undefined,
      audioFileUrl: record.audioFile ? getFileUrl(record, record.audioFile) : undefined
    };
  } catch (error) {
    console.error(`Error fetching lesson ${id}:`, error);
    throw error;
  }
};

export const fetchAllLessons = async (creatorId?: string) => {
  try {
    const options: any = {
      sort: '-created',
    };

    if (creatorId) {
      options.filter = `creatorId = "${creatorId}"`;
    }

    const records = await pb.collection('worksheets').getFullList<LessonRecord>(options);

    return records.map(record => {
      const content = typeof record.content === 'string' ? JSON.parse(record.content) : record.content;
      const title = record.title || content.title || 'Untitled';
      
      let imageUrl = record.image ? getFileUrl(record, record.image) : undefined;
      if (!imageUrl && record.videoUrl) {
        const ytId = getYouTubeId(record.videoUrl);
        if (ytId) imageUrl = `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`;
      }

      return {
        ...record,
        title,
        content,
        imageUrl,
        collectionId: record.collectionId || '',
        collectionName: record.collectionName || ''
      };
    });
  } catch (error) {
    console.error("Error fetching all lessons:", error);
    throw error;
  }
};

export interface PaginatedLessonsResponse {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  items: any[];
}

export const fetchPaginatedLessons = async (
  page: number = 1,
  perPage: number = 20,
  searchQuery?: string,
  creatorId?: string,
  language?: string,
  lessonType?: string
): Promise<PaginatedLessonsResponse> => {
  try {
    const options: any = {
      sort: '-created',
      fields: 'id,collectionId,collectionName,title,level,language,lessonType,created,image,videoUrl,creatorId'
    };

    const filters: string[] = [];
    if (creatorId) {
      filters.push(`creatorId = "${creatorId}"`);
    }
    if (searchQuery) {
      // Basic text search on title
      filters.push(`title ~ "${searchQuery}"`); 
    }
    if (language && language !== 'All') {
      filters.push(`language = "${language}"`);
    }
    if (lessonType && lessonType !== 'All') {
      filters.push(`lessonType = "${lessonType}"`);
    }

    if (filters.length > 0) {
      options.filter = filters.join(' && ');
    }

    const unparsedResult = await pb.collection('worksheets').getList(page, perPage, options);

    const mappedItems = unparsedResult.items.map(record => {
      const title = record.title || 'Untitled';
      
      let imageUrl = record.image ? getFileUrl({ collectionId: record.collectionId, id: record.id }, record.image) : undefined;
      
      // Let's ensure getFileUrl works using the record even if partially populated.
      // Since 'image' is returned, we need collectionId/collectionName or just use id.
      if (!imageUrl && record.videoUrl) {
        const ytId = getYouTubeId(record.videoUrl);
        if (ytId) imageUrl = `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`;
      }

      return {
        ...record,
        title,
        imageUrl,
      };
    });

    return {
      page: unparsedResult.page,
      perPage: unparsedResult.perPage,
      totalItems: unparsedResult.totalItems,
      totalPages: unparsedResult.totalPages,
      items: mappedItems
    };
  } catch (error) {
    console.error("Error fetching paginated lessons:", error);
    throw error;
  }
};

// CRUD methods
export const createLesson = async (data: any) => {
  const user = getCurrentUser();
  
  if (data instanceof FormData) {
    if (user?.id) {
      data.append('creatorId', user.id);
    }
    return await pb.collection('worksheets').create(data);
  }

  const payload = {
    ...data,
    creatorId: user?.id
  };
  return await pb.collection('worksheets').create(payload);
};

export const updateLesson = async (id: string, data: any) => {
  return await pb.collection('worksheets').update(id, data);
};

export const deleteLesson = async (id: string) => {
  return await pb.collection('worksheets').delete(id);
};