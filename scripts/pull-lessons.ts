import PocketBase from 'pocketbase';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connection details from services/pocketbase.ts
const PB_URL = 'https://blog.teacherjake.com';
const pb = new PocketBase(PB_URL);

async function pullLessons() {
    console.log(`Connecting to ${PB_URL}...`);
    
    try {
        // Fetch all lessons from the worksheets collection
        // Based on pocketbase-types.ts, the collection is 'worksheets'
        // and the tags are WorksheetsTagsOptions[]
        const records = await pb.collection('worksheets').getFullList({
            sort: '-created',
        });

        console.log(`Found ${records.length} total lessons.`);

        // Filter for M1-2 or science tags
        const filteredLessons = records.filter(record => {
            const tags = record.tags || [];
            return tags.includes('M1-2') || tags.includes('science');
        });

        console.log(`Filtered down to ${filteredLessons.length} lessons with 'M1-2' or 'science' tags.`);

        // Format into markdown links: [title](https://www.teacherjake.com/pb/[id])
        const markdownLines = filteredLessons.map(lesson => {
            const title = lesson.title || 'Untitled Lesson';
            const url = `https://www.teacherjake.com/pb/${lesson.id}`;
            return `[${title}](${url})`;
        });

        const outputContent = markdownLines.join('\n');
        const outputPath = path.resolve(__dirname, '../Reference/pocketbase_lessons.md');

        // Ensure directory exists
        const outputDir = path.dirname(outputPath);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        fs.writeFileSync(outputPath, outputContent);
        console.log(`Successfully wrote ${markdownLines.length} links to ${outputPath}`);

    } catch (error) {
        console.error('Error pulling lessons:', error);
        process.exit(1);
    }
}

pullLessons();
