import React from 'react';
import { Languages } from 'lucide-react';

interface TranslateButtonProps {
  onClick: () => void;
  className?: string;
}

export const TranslateButton: React.FC<TranslateButtonProps> = ({
  onClick,
  className = ""
}) => {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center px-3 py-1.5 text-sm font-bold border border-gray-200 rounded-xl shadow-sm hover:border-green-300 hover:bg-green-50 hover:text-green-600 transition-all bg-white text-gray-700 ${className}`}
      title="Translate"
    >
      <Languages className="w-4 h-4 mr-1.5 text-gray-500" /> 
    </button>
  );
};
