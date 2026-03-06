import { createRoot } from 'react-dom/client';
import React from 'react';
import { LessonEditor } from '../../components/Admin/LessonEditor';
import { ErrorBoundary } from '../../components/UI/ErrorBoundary';
import styles from '../../index.css?inline';

// We inline the CSS here so the component includes all Tailwind styles
const styleElement = document.createElement('style');
styleElement.textContent = styles;
document.head.appendChild(styleElement);

const container = document.getElementById('tj-creator-root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
          <LessonEditor 
              lessonId={null} 
              isStandalone={true}
              onSave={() => {}} 
              onCancel={() => {}} 
              onPreview={() => {}} 
          />
        </div>
      </ErrorBoundary>
    </React.StrictMode>
  );
} else {
    console.error("Could not find tj-creator-root element to mount standalone editor.");
}
