import { useState, useEffect, useMemo } from 'react';
import { parseContentWithValidation, syncSEOFromContent, syncTitleFromContent } from '../utils/lessonEditorHelpers';
import { ParsedContentResult } from '../types/lessonEditor';
import { parseContent, DetectedContent } from '../utils/contentFormat';

export const useContentParsing = (
  jsonContent: string,
  title: string,
  seo: string
) => {
  const [parsedResult, setParsedResult] = useState<ParsedContentResult>(() =>
    parseContentWithValidation(jsonContent, title)
  );

  const liveDetection = useMemo<DetectedContent>(() => {
    if (!jsonContent.trim()) return { format: 'invalid', error: 'Empty content' };
    return parseContent(jsonContent);
  }, [jsonContent]);

  const isContentValid = liveDetection.format !== 'invalid';
  const isJsonContent = liveDetection.format === 'json';

  useEffect(() => {
    setParsedResult(parseContentWithValidation(jsonContent, title));
  }, [jsonContent, title]);

  const autoSEO = useMemo(() => {
    return syncSEOFromContent(jsonContent, seo);
  }, [jsonContent, seo]);

  const autoTitle = useMemo(() => {
    return syncTitleFromContent(jsonContent);
  }, [jsonContent]);

  return {
    parsedResult,
    liveDetection,
    isContentValid,
    isJsonContent,
    autoSEO,
    autoTitle
  };
};