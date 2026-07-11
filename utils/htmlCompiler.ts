import { getComponentConfig } from './componentMapper';

const escapeHtml = (str: string): string => {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
};

export const compileLessonHtml = (lesson: any, rawHtml: string): string => {
  const componentConfig = getComponentConfig(lesson.lessonType);
  const title = lesson.title || 'Interactive Worksheet';
  const description = lesson.seo || '';
  const teacherCode = lesson.teacherCode || '';
  const level = lesson.level || '';
  const language = lesson.language || '';

  // 1. Build the interactive component HTML
  let elementHtml = '';
  if (componentConfig) {
    const attrs: string[] = [];
    if (teacherCode) {
      attrs.push(`code="${escapeHtml(teacherCode)}"`);
    }

    if (lesson.lessonType === 'lbl-reader') {
      attrs.push(`lang-original="${escapeHtml(language)}"`);
      attrs.push('lang-translation="Thai"'); // default translation fallback
      attrs.push(`story-title="${escapeHtml(title)}"`);
    } else if (lesson.lessonType === 'listening' && lesson.audioFileUrl) {
      attrs.push(`audio-listening="${escapeHtml(lesson.audioFileUrl)}"`);
    }

    if (lesson.customConfig?.testMode) {
      attrs.push('test-mode');
    }

    const contentHtml = typeof lesson.content === 'string'
      ? `<script type="text/markdown">\n${lesson.content}\n</script>`
      : `<script type="application/json">\n${JSON.stringify(lesson.content, null, 2)}\n</script>`;

    elementHtml = `<!-- TJ ${componentConfig.tag} Component -->
<${componentConfig.tag} ${attrs.join(' ')}>
  ${contentHtml}
</${componentConfig.tag}>

<script src="${componentConfig.script}" type="module" defer></script>`;
  } else {
    // Fallback standard worksheet
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
      html: rawHtml, // Include raw instructions in the JSON payload
      customConfig: lesson.customConfig
    }, null, 2);

    const codeAttr = teacherCode ? ` code="${escapeHtml(teacherCode)}"` : '';

    elementHtml = `<!-- TJ PocketBase Worksheet Web Component -->
<tj-pocketbase-worksheet${codeAttr}>
  <script type="application/json">
${embedData}
  </script>
</tj-pocketbase-worksheet>

<script src="https://worksheets.teacherjake.com/wc/tj-pocketbase-worksheet.es.js" type="module" defer></script>`;
  }

  // 2. Locate or append the element inside the raw user HTML
  const placeholderRegex = /<(?:lesson-component|web-component)\b[^>]*>(?:<\/(?:lesson-component|web-component)>)?|<(?:lesson-component|web-component)\b[^>]*\/>/i;
  let bodyHtml = '';
  if (placeholderRegex.test(rawHtml)) {
    bodyHtml = rawHtml.replace(placeholderRegex, elementHtml);
  } else {
    // If no placeholder is found, append it at the end
    bodyHtml = `${rawHtml}\n${elementHtml}`;
  }

  // 3. Wrap it in a clean article wrapper that matches standard styling and links the stylesheet
  return `<!-- TJ Language Learning Worksheet (Pre-compiled) -->
<link rel="stylesheet" href="https://worksheets.teacherjake.com/wc/language-learning-worksheets.css">

<article class="tj-worksheet-compiled prose mx-auto p-4 sm:p-6">
  <header class="tj-worksheet-header mb-6 text-center">
    <h1 class="text-3xl font-black text-green-900 tracking-tight mb-2">${escapeHtml(title)}</h1>
    ${description ? `<p class="text-sm text-gray-500 font-medium italic mt-1">${escapeHtml(description)}</p>` : ''}
  </header>
  
  <div class="tj-worksheet-body">
    ${bodyHtml}
  </div>
</article>`.trim();
};
