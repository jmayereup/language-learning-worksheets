import { WorksheetsLessonTypeOptions } from '../pocketbase-types';

export const DEFAULT_TEACHER_CODE = '6767';

export const TEXTAREA_HEIGHT = 'h-[500px]';

export const GEMINI_URLS: Record<string, string> = {
  'information-gap': 'https://gemini.google.com/gem/1bdsM9tYk1Qb4lcCsnPVOTK1FR_37HYnX?usp=sharing',
  'focused-reading': 'https://gemini.google.com/gem/1ZcCIp-jD0vhJk_nZziTbmGv0eVz-vfHV?usp=sharing',
  'default': 'https://gemini.google.com/gem/1a183ceHi_da5ac9scUQ3AXs0A5-TcOtn?usp=sharing'
};

export const FILE_UPLOAD_CONSTRAINTS = {
  image: {
    maxSize: 5 * 1024 * 1024, // 5MB
    acceptedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  },
  audio: {
    maxSize: 10 * 1024 * 1024, // 10MB
    acceptedTypes: ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/m4a']
  }
};

export const VALIDATION_MESSAGES = {
  EMPTY_CONTENT: 'Content is empty.',
  INVALID_JSON: 'Invalid JSON syntax.',
  INVALID_CUSTOM_ELEMENT: 'Invalid custom element. Must contain a hyphen (e.g. "my-element").',
  MULTIPLE_ROOT_ELEMENTS: 'HTML must contain exactly one root element.',
  MISSING_TAGS: 'Please select at least one tag.',
  UNSUPPORTED_LANGUAGE: 'Online saving is disabled: this language is not an officially supported platform language.',
  CLIPBOARD_PERMISSION_DENIED: 'Failed to read from clipboard. Please ensure you have granted permission.',
  CLIPBOARD_NO_IMAGE: 'No image found in clipboard.',
  INVALID_CONTENT_FORMAT: 'Invalid content. Must be JSON or a custom HTML element.',
  FAILED_TO_GENERATE_JSON: 'Failed to generate JSON for download.',
  FAILED_TO_GENERATE_EMBED: 'Failed to generate embed code.',
  FAILED_TO_SAVE_LESSON: 'Failed to save lesson.',
  CANNOT_PREVIEW_INVALID: 'Cannot preview: Invalid JSON content.'
};

export const getGeminiUrl = (lessonType: string): string => {
  return GEMINI_URLS[lessonType] || GEMINI_URLS['default'];
};

export const formatFilename = (title: string, extension: string): string => {
  const sanitized = title.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'worksheet';
  return `${sanitized}.${extension}`;
};