import React from 'react';
import { AlertCircle, Info } from 'lucide-react';
import geminiCopyExample from '../../../assets/copy-from-gemini-example.png';

export const PublicCreatorWarning: React.FC = () => {
  return (
    <div className="bg-blue-50/50 border-b border-blue-100 p-4 md:p-6 text-sm text-blue-800">
      <div className="mb-5 p-4 bg-amber-50 border border-amber-250 rounded-xl text-amber-900 flex items-start gap-3 shadow-sm">
        <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block text-sm mb-0.5">Personal Use / Standalone HTML Generation Only</span>
          <span className="text-xs text-amber-800 leading-relaxed font-medium">
            Worksheets created here are <strong>not saved to the database</strong> and will not appear in the online library. This tool is designed to generate standalone interactive HTML files for offline use, email, or personal websites. To publish or manage live worksheets in the library, please use the <strong className="font-bold text-amber-950">Admin</strong> tab instead.
          </span>
        </div>
      </div>
      
      <h3 className="font-bold flex items-center gap-2 mb-2">
        <Info className="w-5 h-5 text-blue-600" />
        How to create a standalone worksheet
      </h3>
      
      <ol className="list-decimal pl-5 space-y-1.5 ml-2">
        <li>Select a <strong>Lesson Type</strong> to enable the Gemini generator link.</li>
        <li>
          Click <strong>Get JSON from Gemini</strong> to open a pre-prompted AI chat.<br /> 
          Tell Gemini to generate the worksheet content for the topic, language, and difficulty level desired.<br />
          <div className="my-2 p-3 bg-white/60 rounded-lg border border-blue-200/60 inline-block">
            <p className="text-xs font-bold mb-2">⚠️ Important: Use the copy icon at the TOP-RIGHT corner of Gemini's response:</p>
            <img src={geminiCopyExample} alt="Copy from Gemini Example" className="rounded border border-gray-200 shadow-sm max-w-full md:max-w-sm" />
          </div>
          <br />Then return to this tab and click the paste button above the WORKSHEET JSON CONTENT area below.
        </li>
        <li>Use <strong>Preview</strong> to verify your worksheet looks correct.</li>
        <li>Finally, click <strong>Save as HTML</strong> to download your standalone interactive worksheet!</li>
      </ol>
    </div>
  );
};