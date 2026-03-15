import { createRoot } from 'react-dom/client';
import React from 'react';
import { ChapterBookView } from './components/Lesson/ChapterBookView';
import { ErrorBoundary } from './components/UI/ErrorBoundary';
import { useTTS } from './hooks/useTTS';
import { useLessonProgress } from './hooks/useLessonProgress';
import { ParsedLesson, ChapterBookContent, ReportData } from './types';
import styles from './index.css?inline';

class TJChapterBook extends HTMLElement {
  private root: any = null;
  private mountPoint: HTMLDivElement | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.classList.add('tj-printable-worksheet');
    this.injectGlobalPrintStyles();
    this.render();
  }

  private injectGlobalPrintStyles() {
    if (document.getElementById('tj-worksheet-print-isolation')) return;

    const style = document.createElement('style');
    style.id = 'tj-worksheet-print-isolation';
    style.textContent = `
      @media print {
        header, footer, nav, .sidebar, .comments-section, .nav-menu, .recommendations, .astro-header, .astro-footer {
          display: none !important;
        }
        
        tj-chapter-book {
          display: block !important;
          width: 100% !important;
        }

        @supports (selector(:has(*))) {
          :root:has(.tj-printable-worksheet) body *:not(:has(.tj-printable-worksheet)):not(.tj-printable-worksheet):not(.tj-printable-worksheet *) {
            display: none !important;
          }
          :root:has(.tj-printable-worksheet) body :has(.tj-printable-worksheet) {
            background: transparent !important;
            border: none !important;
            margin: 0 !important;
            padding: 0 !important;
          }
        }
      }
    `;
    document.head.appendChild(style);
  }

  render() {
    if (!this.shadowRoot) return;

    let jsonContent = '';
    const scriptTag = this.querySelector('script[type="application/json"]');
    
    if (scriptTag) {
      jsonContent = scriptTag.textContent || '';
    } else {
      // Only read textContent if mountPoint isn't created yet to avoid reading our own output
      if (!this.mountPoint) {
        jsonContent = this.textContent || '';
      }
    }

    if (!jsonContent.trim() && !this.mountPoint) return;

    try {
      let bookData: ChapterBookContent | null = null;
      const trimmedContent = jsonContent.trim();
      
      if (trimmedContent) {
        bookData = JSON.parse(trimmedContent);
      }

      if (!bookData) return;

      // Adapt ChapterBookContent to ParsedLesson format for the view
      const lessonData: ParsedLesson & { content: ChapterBookContent } = {
        id: `chapter-book-${bookData.title.replace(/\s+/g, '-').toLowerCase()}`,
        title: bookData.title,
        level: 'A2' as any, 
        language: (bookData.language || 'French') as any,
        tags: [],
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
        content: bookData,
        image: '',
        collectionId: '',
        collectionName: '',
        lessonType: 'chapter-book' as any,
        isVideoLesson: false,
        videoUrl: ''
      };

      if (!this.mountPoint) {
        this.shadowRoot.innerHTML = '';
        const styleElement = document.createElement('style');
        styleElement.textContent = styles;
        this.shadowRoot.appendChild(styleElement);
        
        this.mountPoint = document.createElement('div');
        this.mountPoint.className = 'tj-worksheet-wrapper';
        this.shadowRoot.appendChild(this.mountPoint);
      }

      if (!this.root && this.mountPoint) {
        this.root = createRoot(this.mountPoint);
      }

      if (this.root) {
        this.root.render(
          <React.StrictMode>
            <ErrorBoundary>
              <ChapterBookWrapper lesson={lessonData} />
            </ErrorBoundary>
          </React.StrictMode>
        );
      }
    } catch (e: any) {
      console.error('TJ Chapter Book: Failed to render', e);
    }
  }
}

const ChapterBookWrapper: React.FC<{ lesson: ParsedLesson & { content: ChapterBookContent } }> = ({ lesson }) => {
  const {
    answers,
    setAnswers,
    studentName,
    setStudentName,
    studentId,
    setStudentId,
    homeroom,
    setHomeroom,
    resetProgress,
  } = useLessonProgress(lesson.id);

  const [showReportCard, setShowReportCard] = React.useState(false);

  const handleFinish = (data: ReportData) => {
    setShowReportCard(true);
  };

  const handleReset = () => {
    if (window.confirm('Clear progress?')) {
      resetProgress();
      setShowReportCard(false);
    }
  };

  return (
    <>
      <ChapterBookView
        lesson={lesson}
        studentName={studentName}
        setStudentName={setStudentName}
        studentId={studentId}
        setStudentId={setStudentId}
        homeroom={homeroom}
        setHomeroom={setHomeroom}
        isNameLocked={showReportCard}
        onFinish={handleFinish}
        onReset={handleReset}
        answers={answers}
        setAnswers={setAnswers}
      />
    </>
  );
};

if (!customElements.get('tj-chapter-book')) {
  customElements.define('tj-chapter-book', TJChapterBook);
}
