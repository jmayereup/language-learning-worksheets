import { DetectedContent } from './contentFormat';

export const getFormatLabel = (format: 'json' | 'html' | 'invalid'): string => {
  switch (format) {
    case 'json':
      return 'JSON';
    case 'html':
      return 'HTML Custom Element';
    default:
      return 'Invalid';
  }
};
import { ContentValidationResult, FormValidationResult, ValidationMessage } from '../types/lessonEditor';
import { POCKETBASE_SUPPORTED_LANGUAGES } from '../types';
import { VALIDATION_MESSAGES } from '../config/lessonEditor';

export const validateContent = (content: string): ContentValidationResult => {
  if (!content.trim()) {
    return {
      isValid: false,
      format: 'invalid',
      error: VALIDATION_MESSAGES.EMPTY_CONTENT
    };
  }

  const firstChar = content.trim()[0];
  
  if (firstChar === '{' || firstChar === '[') {
    try {
      JSON.parse(content.trim());
      return {
        isValid: true,
        format: 'json'
      };
    } catch (e) {
      return {
        isValid: false,
        format: 'invalid',
        error: VALIDATION_MESSAGES.INVALID_JSON
      };
    }
  }
  
  if (firstChar === '<') {
    const tagMatch = content.trim().match(/^<\s*([a-zA-Z][a-zA-Z0-9-]*)/);
    if (tagMatch) {
      const tagName = tagMatch[1];
      if (tagName.includes('-')) {
        return {
          isValid: true,
          format: 'html',
          tagName
        };
      } else {
        return {
          isValid: false,
          format: 'invalid',
          error: VALIDATION_MESSAGES.INVALID_CUSTOM_ELEMENT
        };
      }
    } else {
      return {
        isValid: false,
        format: 'invalid',
        error: VALIDATION_MESSAGES.INVALID_CUSTOM_ELEMENT
      };
    }
  }
  
  return {
    isValid: false,
    format: 'invalid',
    error: VALIDATION_MESSAGES.INVALID_CONTENT_FORMAT
  };
};

export const validateFormState = (
  formState: any,
  isPublicCreator: boolean
): FormValidationResult => {
  const errors: string[] = [];
  
  if (!isPublicCreator && formState.selectedTags.length === 0) {
    errors.push(VALIDATION_MESSAGES.MISSING_TAGS);
  }
  
  if (!formState.title.trim()) {
    errors.push('Title is required.');
  }
  
  if (!formState.language.trim()) {
    errors.push('Language is required.');
  }
  
  if (!formState.level.trim()) {
    errors.push('Level is required.');
  }
  
  if (!formState.lessonType.trim()) {
    errors.push('Lesson type is required.');
  }
  
  const contentValidation = validateContent(formState.jsonContent);
  if (!contentValidation.isValid) {
    errors.push(contentValidation.error || 'Invalid content format.');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const isPocketbaseSupportedLanguage = (language: string): boolean => {
  return (POCKETBASE_SUPPORTED_LANGUAGES as readonly string[]).includes(language);
};

export const getFormatBadgeStyle = (format: DetectedContent['format']): string => {
  switch (format) {
    case 'json':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'html':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    default:
      return 'bg-red-100 text-red-800 border-red-200';
  }
};

export const createValidationMessage = (
  detected: DetectedContent
): ValidationMessage => {
  if (detected.format === 'json') {
    return {
      ok: true,
      text: 'Valid JSON content.'
    };
  } else if (detected.format === 'html') {
    return {
      ok: true,
      text: `Valid custom element: <${detected.value.tagName}>.`
    };
  } else {
    return {
      ok: false,
      text: detected.error
    };
  }
};

export const getFormatTooltip = (detected: DetectedContent): string => {
  if (detected.format === 'html' && detected.value) {
    return `${getFormatLabel(detected.format)} <${detected.value.tagName}>`;
  } else if (detected.format === 'invalid') {
    return detected.error;
  }
  return getFormatLabel(detected.format);
};

export const getFormatDetail = (detected: DetectedContent): string => {
  if (detected.format === 'html' && detected.value) {
    return ` <${detected.value.tagName}>`;
  }
  return '';
};