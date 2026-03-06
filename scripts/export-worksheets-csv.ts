import PocketBase from 'pocketbase';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connection details from services/pocketbase.ts
const PB_URL = 'https://blog.teacherjake.com';
const pb = new PocketBase(PB_URL);

/**
 * Escapes a string for use in a CSV file.
 * Wraps in quotes and escapes existing quotes by doubling them.
 */
function escapeCSV(val: any): string {
    if (val === null || val === undefined) return '""';
    let str = String(val);
    if (Array.isArray(val)) {
        str = val.join(', ');
    }
    // Double up quotes
    const escaped = str.replace(/"/g, '""');
    return `"${escaped}"`;
}

async function exportToCSV() {
    console.log(`Connecting to ${PB_URL} for CSV export...`);
    
    try {
        // Fetch all lessons from the worksheets collection
        const records = await pb.collection('worksheets').getFullList({
            sort: '-created',
        });

        console.log(`Found ${records.length} total lessons.`);

        // CSV Header
        const headers = ['title', 'language', 'level', 'tags', 'lessonType', 'lessonID', 'link'];
        
        // Map records to CSV rows
        const rows = records.map(record => {
            const title = record.title || 'Untitled';
            const language = record.language || '';
            const level = record.level || '';
            const tags = record.tags || [];
            const lessonType = record.lessonType || '';
            const lessonID = record.id;
            const link = `[${title}](https://www.teacherjake.com/pb/${record.id})`;

            return [
                escapeCSV(title),
                escapeCSV(language),
                escapeCSV(level),
                escapeCSV(tags),
                escapeCSV(lessonType),
                escapeCSV(lessonID),
                escapeCSV(link)
            ].join(',');
        });

        const csvContent = [headers.join(','), ...rows].join('\n');
        const outputPath = path.resolve(__dirname, '../Reference/worksheets_export.csv');

        // Ensure directory exists
        const outputDir = path.dirname(outputPath);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        fs.writeFileSync(outputPath, csvContent);
        console.log(`Successfully wrote ${records.length} rows to ${outputPath}`);

    } catch (error) {
        console.error('Error exporting to CSV:', error);
        process.exit(1);
    }
}

exportToCSV();
