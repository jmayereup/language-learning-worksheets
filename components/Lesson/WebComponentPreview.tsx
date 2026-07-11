import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Eye, Code, Globe, FileCode } from 'lucide-react';
import { Button } from '../UI/Button';
import { ParsedLesson } from '../../types';
import { getComponentConfig } from '../../utils/componentMapper';
import { compileLessonHtml } from '../../utils/htmlCompiler';

interface WebComponentPreviewProps {
  lesson: ParsedLesson;
  onClose: () => void;
}

export const WebComponentPreview: React.FC<WebComponentPreviewProps> = ({ lesson, onClose }) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'compiled-preview' | 'code'>('preview');
  const [copied, setCopied] = useState(false);

  const escapeHtml = (str: string) => {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  };

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
    seo: lesson.seo,
    html: lesson.html
  }, null, 2);

  const componentConfig = getComponentConfig(lesson.lessonType);

  const compiledHtml = compileLessonHtml(lesson, lesson.html || '');
  const embedCode = compiledHtml;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Register the custom element once when previewing if not already defined
  useEffect(() => {
    if (componentConfig) {
      const scriptId = `script-preview-${lesson.lessonType}`;
      if (!document.getElementById(scriptId)) {
        const script = document.createElement('script');
        script.id = scriptId;
        script.src = componentConfig.script;
        script.type = 'module';
        script.defer = true;
        document.body.appendChild(script);
      }
    } else {
      // This side-effect import handles registration
      import('../../pocketbase-worksheet');
    }
  }, [lesson.lessonType, componentConfig]);

  const renderCompiledPreview = () => {
    const srcDoc = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body {
              margin: 0;
              padding: 16px;
              font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
              background-color: #f9fafb;
            }
          </style>
        </head>
        <body>
          ${compiledHtml}
        </body>
      </html>
    `;

    return (
      <iframe
        title="Compiled HTML Preview"
        srcDoc={srcDoc}
        className="w-full min-h-[550px] border border-gray-150 rounded-2xl bg-gray-50 shadow-inner"
        sandbox="allow-scripts allow-same-origin"
      />
    );
  };



  const renderPreview = () => {
    if (!componentConfig) {
      return (
        <tj-pocketbase-worksheet>
          <script type="application/json">
            {embedData}
          </script>
        </tj-pocketbase-worksheet>
      );
    }

    const attrs: string[] = [];
    if (lesson.lessonType === 'lbl-reader') {
      attrs.push(`lang-original="${escapeHtml(lesson.language)}"`);
      attrs.push('lang-translation="Thai"');
      attrs.push(`story-title="${escapeHtml(lesson.title || '')}"`);
    } else if (lesson.lessonType === 'listening' && lesson.audioFileUrl) {
      attrs.push(`audio-listening="${escapeHtml(lesson.audioFileUrl)}"`);
    }

    if (lesson.customConfig?.testMode) {
      attrs.push('test-mode');
    }

    const contentHtml = typeof lesson.content === 'string'
      ? `<script type="text/markdown">\n${lesson.content}\n</script>`
      : JSON.stringify(lesson.content, null, 2);

    const elementHtml = `
      <${componentConfig.tag} ${attrs.join(' ')}>
        ${contentHtml}
      </${componentConfig.tag}>
    `;

    const htmlContent = lesson.html || '';
    const placeholderRegex = /<(?:lesson-component|web-component)\b[^>]*>(?:<\/(?:lesson-component|web-component)>)?|<(?:lesson-component|web-component)\b[^>]*\/>/i;
    const hasPlaceholder = placeholderRegex.test(htmlContent);

    if (hasPlaceholder) {
      const parts = htmlContent.split(placeholderRegex);
      const beforeHtml = parts[0];
      const afterHtml = parts.slice(1).join('');
      return (
        <div className="p-4 sm:p-6">
          {beforeHtml && <div className="tj-html-content prose max-w-none mb-6" dangerouslySetInnerHTML={{ __html: beforeHtml }} />}
          <div dangerouslySetInnerHTML={{ __html: elementHtml }} />
          {afterHtml && <div className="tj-html-content prose max-w-none mt-6" dangerouslySetInnerHTML={{ __html: afterHtml }} />}
        </div>
      );
    } else {
      return (
        <div className="p-4 sm:p-6">
          {htmlContent && <div className="tj-html-content prose max-w-none mb-6" dangerouslySetInnerHTML={{ __html: htmlContent }} />}
          <div dangerouslySetInnerHTML={{ __html: elementHtml }} />
        </div>
      );
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 shrink-0">
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
        <div className="flex border-b border-gray-100 px-6 overflow-x-auto scrollbar-none gap-2 shrink-0">
          <button 
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-2 px-4 py-4 text-xs sm:text-sm font-bold transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'preview' 
                ? 'border-green-600 text-green-700' 
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            <Eye className="w-4 h-4" /> Live Preview
          </button>
          
          <button 
            onClick={() => setActiveTab('compiled-preview')}
            className={`flex items-center gap-2 px-4 py-4 text-xs sm:text-sm font-bold transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'compiled-preview' 
                ? 'border-green-600 text-green-700' 
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            <Globe className="w-4 h-4" /> Astro Preview (Compiled)
          </button>



          <button 
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-2 px-4 py-4 text-xs sm:text-sm font-bold transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'code' 
                ? 'border-green-600 text-green-700' 
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            <Code className="w-4 h-4" /> Embed Code
          </button>
        </div>

        {/* Content */}
        <div className="grow overflow-y-auto p-6 bg-gray-50/30">
          {activeTab === 'preview' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden min-h-[400px]">
              {renderPreview()}
            </div>
          )}
          {activeTab === 'compiled-preview' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden min-h-[400px]">
              {renderCompiledPreview()}
            </div>
          )}
          {activeTab === 'code' && (
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
              <div className="bg-green-50 border border-green-150 p-4 rounded-xl">
                <p className="text-xs text-green-800 leading-relaxed font-medium">
                  <strong>Tip:</strong> This is a pre-compiled HTML block including both instructions and the interactive web component. You can paste this code into any HTML page, WordPress custom HTML block, Ghost post, or Notion embed to display this interactive lesson.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-end shrink-0">
          <Button onClick={onClose} variant="secondary">Close</Button>
        </div>
      </div>
    </div>
  );
};
