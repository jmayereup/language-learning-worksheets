import React from 'react';
import { FileJson, ShieldCheck, ClipboardPaste, Layout, Info, AlertCircle, Eye, Code, Globe, Save } from 'lucide-react';
import { Button } from '../../UI/Button';
import { Modal } from '../../UI/Modal';
import { JSONKeyValueEditor } from '../JSONKeyValueEditor';
import { DetectedContent } from '../../../utils/contentFormat';
import { getFormatLabel, getFormatBadgeStyle, getFormatTooltip, getFormatDetail, createValidationMessage } from '../../../utils/contentValidation';
import { TEXTAREA_HEIGHT, getGeminiUrl } from '../../../config/lessonEditor';

interface JSONContentSectionProps {
  jsonContent: string;
  lessonType: string;
  liveDetection: DetectedContent;
  isContentValid: boolean;
  isJsonContent: boolean;
  showVisualEditor: boolean;
  validationMessage: { ok: boolean; text: string } | null;
  error: string | null;
  onContentChange: (content: string) => void;
  onVisualEditorToggle: () => void;
  onVisualEditorApply: (data: any) => void;
  onPasteFromClipboard: () => void;
  onCheckFormat: () => void;
}

export const JSONContentSection: React.FC<JSONContentSectionProps> = ({
  jsonContent,
  lessonType,
  liveDetection,
  isContentValid,
  isJsonContent,
  showVisualEditor,
  validationMessage,
  error,
  onContentChange,
  onVisualEditorToggle,
  onVisualEditorApply,
  onPasteFromClipboard,
  onCheckFormat
}) => {
  const format = liveDetection.format;
  const badgeStyle = getFormatBadgeStyle(format);
  const tooltip = getFormatTooltip(liveDetection);
  const detail = getFormatDetail(liveDetection);

  return (
    <div className="mb-10">
      <div className="flex flex-wrap items-center justify-between mb-3 ml-1 gap-2">
        <div className="flex items-center gap-3">
          <label className="text-sm font-black text-gray-700 uppercase tracking-wider flex items-center gap-2">
            <FileJson className="w-4 h-4" /> Worksheet JSON Content
          </label>
          <span
            className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${badgeStyle}`}
            title={tooltip}
          >
            {getFormatLabel(format)}{detail}
          </span>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCheckFormat}
            disabled={!jsonContent.trim()}
            className="text-[10px] font-bold flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4" /> Check Format
          </Button>
          
          {isJsonContent && lessonType !== 'quiz-element' && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onVisualEditorToggle}
              className="text-[10px] font-bold flex items-center gap-1.5"
            >
              <Layout className="w-4 h-4" /> Visual Editor
            </Button>
          )}
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onPasteFromClipboard}
            className="text-[10px] font-bold flex items-center gap-1.5 border-blue-200 text-blue-700 hover:bg-blue-50"
          >
            <ClipboardPaste className="w-4 h-4" /> Paste
          </Button>
          
          {lessonType ? (
            <a
              href={getGeminiUrl(lessonType)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-md border border-blue-100 transition-colors"
            >
              <Info className="w-4 h-4" /> Get JSON from Gemini
            </a>
          ) : (
            <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md border border-gray-200 cursor-not-allowed opacity-70" title="Select a Lesson Type first">
              <Info className="w-4 h-4" /> Get JSON from Gemini
            </span>
          )}
        </div>
      </div>

      <textarea
        value={jsonContent}
        onChange={(e) => {
          onContentChange(e.target.value);
        }}
        required
        aria-invalid={!isContentValid}
        className={`w-full ${TEXTAREA_HEIGHT} p-6 bg-gray-900 text-green-400 font-mono text-sm leading-relaxed rounded-2xl focus:ring-2 outline-none border-2 shadow-inner ${
          isContentValid
            ? 'border-transparent focus:ring-green-500'
            : 'border-red-500/70 focus:ring-red-500'
        }`}
        spellCheck={false}
      />

      {validationMessage && (
        <div
          className={`my-2 p-4 border rounded-xl flex items-start gap-3 ${
            validationMessage.ok
              ? 'bg-green-50 border-green-200 text-green-700'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          {validationMessage.ok
            ? <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
            : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
          <p className="text-sm font-bold">{validationMessage.text}</p>
        </div>
      )}

      {!isContentValid && !validationMessage && (
        <div className="my-2 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <p className="text-sm font-bold">{liveDetection.format === 'invalid' ? liveDetection.error : 'Invalid content.'}</p>
        </div>
      )}

      {error && (
        <div className="my-2 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <p className="text-sm font-bold">{error}</p>
        </div>
      )}

      <Modal
        isOpen={showVisualEditor}
        onClose={onVisualEditorToggle}
        title="Worksheet Content Editor"
      >
        {liveDetection.format !== 'json' ? (
          <div className="p-12 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">Visual Editor is JSON-only</h3>
            <p className="text-gray-500 max-w-sm mx-auto">
              The visual editor works on JSON content. Switch your content to a JSON object
              (starts with <code className="bg-gray-100 px-1 rounded">&#123;</code> or <code className="bg-gray-100 px-1 rounded">[</code>)
              to use it.
            </p>
            <Button variant="outline" onClick={onVisualEditorToggle} className="mt-8">
              Go Back
            </Button>
          </div>
        ) : (
          <JSONKeyValueEditor
            initialData={liveDetection.value}
            onApply={onVisualEditorApply}
            onCancel={onVisualEditorToggle}
          />
        )}
      </Modal>
    </div>
  );
};