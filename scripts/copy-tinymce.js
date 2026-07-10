import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.join(__dirname, '..');
const srcDir = path.join(projectRoot, 'node_modules', 'tinymce');
const destDir = path.join(projectRoot, 'public', 'tinymce');

try {
  // Clear dest if it exists
  if (fs.existsSync(destDir)) {
    fs.rmSync(destDir, { recursive: true, force: true });
  }
  fs.mkdirSync(destDir, { recursive: true });
  
  // Copy files
  fs.cpSync(srcDir, destDir, { recursive: true });
  console.log('Successfully copied TinyMCE assets to public/tinymce');
} catch (err) {
  console.error('Error copying TinyMCE assets:', err);
  process.exit(1);
}
