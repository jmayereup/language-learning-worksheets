import React from 'react';
import { X, FileJson } from 'lucide-react';
import { Button } from '../../UI/Button';

interface FormHeaderProps {
  isPublicCreator: boolean;
  lessonId: string | null;
  onCancel: () => void;
}

export const FormHeader: React.FC<FormHeaderProps> = ({ 
  isPublicCreator, 
  lessonId, 
  onCancel 
}) => {
  const getTitle = () => {
    if (isPublicCreator) return 'Create Standalone Worksheet';
    return lessonId ? 'Edit Worksheet' : 'Create New Worksheet';
  };

  const getSubtitle = () => {
    if (isPublicCreator) {
      return 'Generate standalone HTML worksheets for personal use. Use the Admin dashboard for live worksheets.';
    }
    return lessonId ? `Editing ID: ${lessonId}` : 'Define your worksheet properties and content';
  };

  return (
    <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50">
      <div className="flex items-center gap-3">
        <div className="bg-green-600 p-2 rounded-lg shrink-0">
          <FileJson className="w-4 h-4 md:w-5 md:h-5 text-white" />
        </div>
        <div>
          <h2 className="text-base md:text-lg font-black text-gray-900 leading-tight">
            {getTitle()}
          </h2>
          <p className="text-[10px] md:text-xs text-gray-500 font-medium">
            {getSubtitle()}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="secondary" size="sm" onClick={onCancel} className="flex-1 sm:flex-none gap-2 text-xs">
          <X className="w-4 h-4" /> Cancel
        </Button>
      </div>
    </div>
  );
};