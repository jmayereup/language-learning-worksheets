import React from 'react';
import { Info, Code } from 'lucide-react';

interface SEOSectionProps {
  seo: string;
  onChange: (value: string) => void;
}

export const SEOSection: React.FC<SEOSectionProps> = ({ seo, onChange }) => {
  return (
    <div className="mb-8 p-6 bg-blue-50/30 border border-blue-100 rounded-2xl">
      <label className="text-sm font-black text-blue-900 mb-2 ml-1 uppercase tracking-wider flex items-center gap-2">
        <Info className="w-4 h-4 text-blue-500" /> SEO Description / Snippet
      </label>
      <textarea
        value={seo}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-24 px-4 py-3 bg-white border border-blue-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm leading-relaxed"
        placeholder="Gemini will fill this in for you..."
      />
      <p className="mt-2 text-sm text-blue-400 font-medium ml-1 italic">
        This summary appears on the lesson list page and helps with search engine visibility. You only need it if you plan to use your worksheet on websites.
      </p>
    </div>
  );
};