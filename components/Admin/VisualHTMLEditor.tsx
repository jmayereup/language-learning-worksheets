import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

interface VisualHTMLEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export const VisualHTMLEditor: React.FC<VisualHTMLEditorProps> = ({ value, onChange }) => {
  return (
    <div className="w-full border border-green-200 bg-white rounded-2xl overflow-hidden shadow-sm">
      <Editor
        tinymceScriptSrc="/tinymce/tinymce.min.js"
        licenseKey="gpl"
        value={value}
        onEditorChange={onChange}
        init={{
          height: 380,
          menubar: false,
          branding: false,
          promotion: false,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'media', 'table', 'code', 'help', 'wordcount'
          ],
          toolbar: 'undo redo | blocks | ' +
            'bold italic underline forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'link code removeformat | insertGame insertWebComp',
          content_style: `
            body { 
              font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; 
              font-size: 14px; 
              color: #1f2937;
              padding: 12px;
              line-height: 1.6;
            }
            h1 { font-size: 1.75rem; font-weight: 800; margin-top: 1.5rem; margin-bottom: 0.75rem; color: #064e3b; }
            h2 { font-size: 1.4rem; font-weight: 700; margin-top: 1.25rem; margin-bottom: 0.5rem; color: #064e3b; }
            h3 { font-size: 1.2rem; font-weight: 600; margin-top: 1rem; margin-bottom: 0.5rem; color: #065f46; }
            p { margin-bottom: 0.75rem; }
            ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 0.75rem; }
            ol { list-style-type: decimal; padding-left: 1.5rem; margin-bottom: 0.75rem; }
            a { color: #2563eb; text-decoration: underline; }
            strong { font-weight: 750; }
            em { font-style: italic; }
            
            /* Visual styling for custom elements inside the editor iframe */
            lesson-component, web-component {
              display: block;
              margin: 1.5rem 0;
              padding: 1.25rem;
              border: 2px dashed #34d399;
              background-color: #ecfdf5;
              border-radius: 0.75rem;
              color: #064e3b;
              font-weight: 800;
              font-size: 13px;
              text-align: center;
              cursor: default;
              user-select: none;
            }
            lesson-component::before {
              content: '🎮 Worksheet Interactive Game Component Placeholder';
            }
            web-component {
              border-color: #38bdf8;
              background-color: #f0f9ff;
              color: #0c4a6e;
            }
            web-component::before {
              content: '🌐 General Web Component Placeholder';
            }
          `,
          extended_valid_elements: 'lesson-component,web-component',
          custom_elements: 'lesson-component,web-component',
          setup: (editor) => {
            // Register custom button for Lesson Game Component
            editor.ui.registry.addButton('insertGame', {
              text: '🎮 Add Game',
              tooltip: 'Insert Interactive Game Component',
              onAction: () => {
                editor.insertContent('<lesson-component></lesson-component>');
              }
            });
            // Register custom button for General Web Component
            editor.ui.registry.addButton('insertWebComp', {
              text: '🌐 Add WebComp',
              tooltip: 'Insert General Web Component',
              onAction: () => {
                editor.insertContent('<web-component></web-component>');
              }
            });
          }
        }}
      />
    </div>
  );
};
