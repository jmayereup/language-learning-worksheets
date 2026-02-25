import { createRoot } from 'react-dom/client';
import React from 'react';
import { LessonView } from './components/Lesson/LessonView';
import './index.css'; // Ensure tailwind is imported

class TJPocketBaseWorksheet extends HTMLElement {
  private root: any = null;
  private mountPoint: HTMLDivElement | null = null;

  connectedCallback() {
    this.render();
  }

  render() {
    // Try to find a script tag first
    let jsonContent = '';
    const scriptTag = this.querySelector('script[type="application/json"]');
    
    if (scriptTag) {
      jsonContent = scriptTag.textContent || '';
    } else {
      // Fallback to text content
      // If we already have a mountPoint, we shouldn't look at textContent again as it might have changed or been cleared
      if (!this.mountPoint) {
        jsonContent = this.textContent || '';
      }
    }

    if (!jsonContent.trim() && !this.mountPoint) {
      return; // Do nothing if empty and not already rendered
    }

    try {
      let lessonData: any;
      if (jsonContent.trim()) {
        const rawData = JSON.parse(jsonContent.trim());
        
        // Map PocketBase JSON structure to ParsedLesson
        lessonData = {
          id: rawData.id,
          title: rawData.title,
          level: rawData.level,
          language: rawData.language,
          tags: rawData.tags || [],
          created: rawData.created,
          updated: rawData.updated,
          imageUrl: rawData.image ? rawData.image : undefined,
          audioFileUrl: rawData.audioFile ? rawData.audioFile : undefined,
          isVideoLesson: rawData.isVideoLesson,
          videoUrl: rawData.videoUrl,
          content: rawData.content,
          image: rawData.image || '',
          collectionId: rawData.collectionId || '',
          collectionName: rawData.collectionName || '',
          lessonType: rawData.lessonType,
          creatorId: rawData.creatorId,
          seo: rawData.seo
        };
      }

      if (!this.mountPoint) {
        // Clear the element's content only once
        this.innerHTML = '';
        
        // Create a mount point for React
        this.mountPoint = document.createElement('div');
        this.mountPoint.className = 'tj-worksheet-wrapper';
        this.appendChild(this.mountPoint);
      }

      if (!this.root && this.mountPoint) {
        this.root = createRoot(this.mountPoint);
      }

      if (this.root && lessonData) {
        this.root.render(
          <React.StrictMode>
              <LessonView lesson={lessonData} />
          </React.StrictMode>
        );
      }
    } catch (e) {
      console.error('TJ Worksheet: Failed to parse JSON content or render component', e);
      if (!this.mountPoint) {
        this.innerHTML = `<div style="color: red; padding: 1rem; border: 1px solid red;">TJ Worksheet Error: Failed to load worksheet data. Check console for details.</div>`;
      }
    }
  }
}

if (!customElements.get('tj-pocketbase-worksheet')) {
  customElements.define('tj-pocketbase-worksheet', TJPocketBaseWorksheet);
}
