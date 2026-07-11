import React from 'react';
import { Eye, Code, Globe, Save, X, Info } from 'lucide-react';
import { Button } from '../../UI/Button';
import { isPocketbaseSupportedLanguage } from '../../../utils/contentValidation';
import { POCKETBASE_SUPPORTED_LANGUAGES } from '../../../types';

interface ActionButtonsProps {
  isPublicCreator: boolean;
  lessonId: string | null;
  lessonType: string;
  language: string;
  isContentValid: boolean;
  isLoading: boolean;
  onCancel: () => void;
  onPreview: () => void;
  onCopyEmbed: () => void;
  onDownloadHTML: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  isPublicCreator,
  lessonId,
  lessonType,
  language,
  isContentValid,
  isLoading,
  onCancel,
  onPreview,
  onCopyEmbed,
  onDownloadHTML,
  onSubmit
}) => {
  const isPocketbaseSupported = React.useMemo(() => {
    if (!language) return false;
    return (POCKETBASE_SUPPORTED_LANGUAGES as readonly string[]).includes(language);
  }, [language]);

  const disabledTooltip = !isContentValid ? 'Fix the content format first' : undefined;

  return (
    <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-100 flex-wrap">
      <Button variant="secondary" onClick={onCancel} type="button" className="px-6 order-last sm:order-none">
        Cancel
      </Button>
      
      <Button 
        variant="outline" 
        type="button" 
        onClick={onPreview} 
        disabled={!lessonType || !isContentValid} 
        title={disabledTooltip} 
        className="px-6 border-green-200 text-green-700 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Eye className="w-4 h-4 mr-2" /> Preview
      </Button>
      
      <Button 
        variant="outline" 
        type="button" 
        onClick={onCopyEmbed} 
        disabled={!isContentValid} 
        title={disabledTooltip} 
        className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Code className="w-4 h-4 mr-2" /> Copy Embed
      </Button>
      
      <Button 
        variant="success" 
        type="button" 
        onClick={onDownloadHTML} 
        disabled={!isContentValid} 
        title={disabledTooltip} 
        className="shadow-lg shadow-green-100 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Globe className="w-4 h-4 mr-2" /> Save as HTML
      </Button>

      {!isPublicCreator && (
        <div className="ml-auto flex flex-col items-end w-full sm:w-auto mt-4 sm:mt-0">
          <Button 
            variant="success" 
            size="lg" 
            type="submit" 
            isLoading={isLoading} 
            disabled={!isPocketbaseSupported || !isContentValid} 
            title={disabledTooltip} 
            className="px-10 shadow-lg shadow-green-100 w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4 mr-2" /> {lessonId ? 'Update Online Worksheet' : 'Create Online Worksheet'}
          </Button>
          
          {!isPocketbaseSupported && language && (
            <p className="text-[10px] text-red-500 font-bold mt-1.5 text-right max-w-[250px] leading-tight mb-[-10px]">
              Online saving is disabled: '{language}' is not an officially supported platform language. You can still save as HTML.
            </p>
          )}
        </div>
      )}
    </div>
  );
};