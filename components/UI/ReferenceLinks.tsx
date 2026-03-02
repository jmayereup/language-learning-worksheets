import React from 'react';
import { ExternalLink, BookOpen } from 'lucide-react';

interface ReferenceLinksProps {
  references?: Record<string, string>;
  className?: string;
}

export const ReferenceLinks: React.FC<ReferenceLinksProps> = ({ references, className = '' }) => {
  if (!references || Object.keys(references).length === 0) return null;

  return (
    <div className={`mt-8 p-4 sm:p-6 bg-linear-to-br from-slate-50 to-white rounded-2xl border border-slate-200 shadow-sm ${className}`}>
      <div className="flex items-center gap-2 mb-4 text-slate-800">
        <BookOpen className="w-5 h-5 text-blue-600" />
        <h3 className="font-bold text-lg">Further Reading & References</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {Object.entries(references).map(([label, url]) => (
          <a
            key={url}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-100 hover:border-blue-300 hover:bg-blue-50/50 hover:shadow-md transition-all duration-300 group"
          >
            <span className="font-medium text-slate-700 group-hover:text-blue-700 truncate mr-2">
              {label}
            </span>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-500 shrink-0" />
          </a>
        ))}
      </div>
    </div>
  );
};
