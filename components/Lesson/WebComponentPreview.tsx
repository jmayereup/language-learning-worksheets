import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Eye, Code } from 'lucide-react';
import { Button } from '../UI/Button';
import { ParsedLesson } from '../../types';

interface WebComponentPreviewProps {
  lesson: ParsedLesson;
  onClose: () => void;
}

export const WebComponentPreview: React.FC<WebComponentPreviewProps> = ({ lesson, onClose }) => {
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');
  const [copied, setCopied] = useState(false);

  // Minimal lesson data for the embed script
  const embedData = JSON.stringify({
    id: lesson.id,
    title: lesson.title,
    level: lesson.level,
    language: lesson.language,
    tags: lesson.tags,
    created: lesson.created,
    updated: lesson.updated,
    imageUrl: lesson.imageUrl,
    audioFileUrl: lesson.audioFileUrl,
    isVideoLesson: lesson.isVideoLesson,
    videoUrl: lesson.videoUrl,
    content: lesson.content,
    lessonType: lesson.lessonType,
    creatorId: lesson.creatorId,
    seo: lesson.seo
  }, null, 2);

  const embedCode = `<!-- TJ Worksheet Embed -->
<link rel="stylesheet" href="https://blog.teacherjake.com/apps/worksheets/dist/wc/language-learning-worksheets.css">

<tj-pocketbase-worksheet>
  <script type="application/json">
${embedData}
  </script>
</tj-pocketbase-worksheet>

<script src="https://blog.teacherjake.com/apps/worksheets/dist/wc/tj-pocketbase-worksheet.umd.js"></script>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Register the custom element once when previewing if not already defined
  useEffect(() => {
    // This side-effect import handles registration
    import('../../pocketbase-worksheet');
  }, []);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <h2 className="text-xl font-black text-green-900 tracking-tight">Web Component Preview</h2>
            <p className="text-sm text-gray-500 font-medium">Embed this lesson on any website</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 px-6">
          <button 
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all border-b-2 ${
              activeTab === 'code' 
                ? 'border-green-600 text-green-700' 
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            <Code className="w-4 h-4" /> Embed Code
          </button>
          <button 
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all border-b-2 ${
              activeTab === 'preview' 
                ? 'border-green-600 text-green-700' 
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            <Eye className="w-4 h-4" /> Live Preview
          </button>
        </div>

        {/* Content */}
        <div className="grow overflow-y-auto p-6 bg-gray-50/30">
          {activeTab === 'code' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">HTML Code Snippet</span>
                <Button 
                  size="sm" 
                  variant={copied ? 'success' : 'secondary'} 
                  onClick={handleCopy}
                  className="flex items-center gap-2"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy Code'}
                </Button>
              </div>
              <div className="relative group">
                <pre className="bg-gray-900 text-green-400 p-6 rounded-2xl overflow-x-auto text-xs font-mono border border-gray-800 shadow-inner leading-relaxed">
                  {embedCode}
                </pre>
              </div>
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
                <p className="text-xs text-blue-700 leading-relaxed italic">
                  <strong>Tip:</strong> You can paste this code into any HTML page, WordPress custom HTML block, or Notion embed to display this interactive lesson.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden min-h-[400px]">
              {/* Note: In a real app we'd need to handle the custom element definition
                  But here we are importing it above which defines it globally */}
              <tj-pocketbase-worksheet>
                <script type="application/json">
                  {embedData}
                </script>
              </tj-pocketbase-worksheet>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-end">
          <Button onClick={onClose} variant="secondary">Close</Button>
        </div>
      </div>
    </div>
  );
};
