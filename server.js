import express from 'express';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;
const PB_URL = 'https://blog.teacherjake.com';
// Base path where the app is served (e.g. '/worksheets' on blog.teacherjake.com)
const BASE_PATH = process.env.BASE_PATH || '/worksheets';

const app = express();

// Read the built index.html template once at startup
const indexPath = join(__dirname, 'dist', 'index.html');
let indexHtml = readFileSync(indexPath, 'utf-8');

// --- Helpers ---

function getYouTubeId(url) {
  if (!url) return null;
  const match = url.match(/^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
  return match && match[2].length === 11 ? match[2] : null;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function buildOgTags({ title, description, imageUrl, pageUrl }) {
  return [
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
    `<meta property="og:image" content="${escapeHtml(imageUrl)}" />`,
    `<meta property="og:url" content="${escapeHtml(pageUrl)}" />`,
    `<meta property="og:type" content="article" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(description)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(imageUrl)}" />`,
  ].join('\n    ');
}

async function fetchLessonMeta(lessonId) {
  const res = await fetch(`${PB_URL}/api/collections/worksheets/records/${encodeURIComponent(lessonId)}`);
  if (!res.ok) return null;
  const record = await res.json();

  const content = typeof record.content === 'string' ? JSON.parse(record.content) : record.content;
  const title = record.title || content?.title || 'Untitled Worksheet';

  let description = content?.readingText || '';
  if (description.startsWith(title)) {
    description = description.substring(title.length).trim();
  }
  description = description.substring(0, 160) + (description.length > 160 ? '...' : '');
  if (!description) description = 'Interactive language learning worksheet';

  // Build image URL
  let imageUrl = '';
  if (record.image) {
    imageUrl = `${PB_URL}/api/files/${record.collectionId}/${record.id}/${record.image}`;
  } else if (record.videoUrl) {
    const ytId = getYouTubeId(record.videoUrl);
    if (ytId) imageUrl = `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`;
  }

  return { title, description, imageUrl };
}

// --- Routes (mounted under BASE_PATH) ---

const router = express.Router();

// Serve static assets directly (JS, CSS, images, etc.)
router.use(express.static(join(__dirname, 'dist'), { index: false }));

// All HTML requests go through OG injection
router.get('/{*path}', async (req, res) => {
  const lessonId = req.query.lesson;
  let html = indexHtml;

  if (lessonId) {
    try {
      const meta = await fetchLessonMeta(lessonId);
      if (meta) {
        const pageUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
        const ogTags = buildOgTags({ ...meta, pageUrl });

        // Replace the placeholder comment AND the default fallback OG tags with dynamic ones
        html = html.replace(
          /<!-- OG_META -->[\s\S]*?<meta name="twitter:card"[^>]*\/>/,
          ogTags
        );

        // Also update the <title> tag
        html = html.replace(
          '<title>Language Learning Worksheets</title>',
          `<title>${escapeHtml(meta.title)} — Teacher Jake Worksheets</title>`
        );
      }
    } catch (err) {
      console.error('OG injection error:', err.message);
      // Fall through to serve default HTML
    }
  }

  res.setHeader('Content-Type', 'text/html');
  res.send(html);
});

// Mount under the base path (e.g. /worksheets)
app.use(BASE_PATH, router);

app.listen(PORT, () => {
  console.log(`📄 Worksheet server running on http://localhost:${PORT}${BASE_PATH}`);
});
