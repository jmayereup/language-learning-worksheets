import React, { useState } from 'react';
import { Code, ChevronDown, ChevronRight } from 'lucide-react';
import { VisualHTMLEditor } from '../VisualHTMLEditor';

interface HTMLContentSectionProps {
  html: string;
  onChange: (value: string) => void;
}

export const HTMLContentSection: React.FC<HTMLContentSectionProps> = ({ html, onChange }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div className="mb-8 p-6 bg-green-50/30 border border-green-100 rounded-2xl">
      <button
        type="button"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full flex items-center justify-between text-left"
      >
        <label className="text-sm font-black text-green-900 uppercase tracking-wider flex items-center gap-2 cursor-pointer">
          <Code className="w-4 h-4 text-green-600" /> HTML Content / Lesson Instructions
        </label>
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4 text-green-600" />
        ) : (
          <ChevronDown className="w-4 h-4 text-green-600" />
        )}
      </button>
      
      {!isCollapsed && (
        <>
          <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 mb-3 text-xs text-blue-700 leading-relaxed">
            <strong>Tip:</strong> You can enter standard HTML here. To place the interactive web component / game in the middle of your text on occasion, simply insert the <code>&lt;lesson-component&gt;&lt;/lesson-component&gt;</code> or <code>&lt;web-component&gt;&lt;/web-component&gt;</code> tag where you want it to appear. If omitted, the web component renders automatically at the bottom.
          </div>
          <VisualHTMLEditor
            value={html}
            onChange={onChange}
          />
        </>
      )}
    </div>
  );
};