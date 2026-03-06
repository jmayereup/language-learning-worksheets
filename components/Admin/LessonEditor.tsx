import React, { useState, useEffect } from 'react';
import { fetchLessonById, createLesson, updateLesson } from '../../services/pocketbase';
import { LANGUAGE_OPTIONS, LEVEL_OPTIONS, TAG_OPTIONS, LESSON_TYPE_OPTIONS, POCKETBASE_SUPPORTED_LANGUAGES } from '../../types';
import { triggerRebuild } from '../../services/deploy';
import { Button } from '../UI/Button';
import { Save, X, AlertCircle, FileJson, Info, Globe, Layers, Tag as TagIcon, Video, Check, Image as ImageIcon, Music, Layout, ClipboardPaste, Eye, Code } from 'lucide-react';
import { Modal } from '../UI/Modal';
import { JSONKeyValueEditor } from './JSONKeyValueEditor';
import { SearchableSelect } from '../UI/SearchableSelect';



interface LessonEditorProps {
    lessonId: string | null;
    initialData?: any;
    isPublicCreator?: boolean;
    onSave: () => void;
    onCancel: () => void;
    onPreview: (lesson: any) => void;
}

export const LessonEditor: React.FC<LessonEditorProps> = ({ lessonId, initialData, isPublicCreator = false, onSave, onCancel, onPreview }) => {
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(!!lessonId);
    const [error, setError] = useState<string | null>(null);
    const [lessonData, setLessonData] = useState<any>(null); // Store original lesson data if available

    // Form fields
    const [title, setTitle] = useState('');
    const [language, setLanguage] = useState('');
    const [level, setLevel] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [videoUrl, setVideoUrl] = useState('');
    const [isVideoLesson, setIsVideoLesson] = useState(false);
    const [jsonContent, setJsonContent] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [lessonType, setLessonType] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [showVisualEditor, setShowVisualEditor] = useState(false);
    const [seo, setSeo] = useState('');
    const [isMinified, setIsMinified] = useState(false);

    const isPocketbaseSupportedLanguage = React.useMemo(() => {
        if (!language) return false;
        return (POCKETBASE_SUPPORTED_LANGUAGES as readonly string[]).includes(language);
    }, [language]);

    useEffect(() => {
        if (lessonId) {
            const loadLesson = async () => {
                try {
                    const lesson = await fetchLessonById(lessonId);
                    setLessonData(lesson);
                    setTitle(lesson.title || '');
                    setLanguage(lesson.language);
                    setLevel(lesson.level);
                    setSelectedTags(lesson.tags || []);
                    setVideoUrl(lesson.videoUrl || '');
                    setIsVideoLesson(lesson.isVideoLesson || false);
                    setLessonType(lesson.lessonType || 'worksheet');
                    setJsonContent(JSON.stringify(lesson.content, null, isMinified ? 0 : 2));
                    setSeo(lesson.seo || '');
                    if (lesson.imageUrl) setImagePreview(lesson.imageUrl);
                } catch (err) {
                    setError('Failed to load lesson for editing');
                } finally {
                    setFetching(false);
                }
            };
            loadLesson();
        } else {
            // New lesson starts with empty JSON content or initial data from props
            if (initialData) {
                try {
                    setTitle(initialData.title || '');
                    setLessonType(initialData.lessonType || '');

                    const newJsonContent = initialData.content ? JSON.stringify(initialData.content, null, isMinified ? 0 : 2) : '';

                    setJsonContent(newJsonContent);
                    setLanguage(initialData.language || '');
                    setLevel(initialData.level || '');
                    setSeo(initialData.seo || '');
                } catch (e) {
                    console.error("Failed to parse init data in LessonEditor", e);
                    setJsonContent('');
                }
            } else {
                setJsonContent('');
                setTitle('');
                setLessonType('');
                setLanguage('');
                setLevel('');
                setSelectedTags([]);
                setVideoUrl('');
                setIsVideoLesson(false);
                setSeo('');
                setImagePreview(null);
            }
        }
    }, [lessonId, initialData]);

    // Automatically sync SEO from jsonContent if empty
    useEffect(() => {
        if (!seo.trim() && jsonContent.trim()) {
            try {
                const parsed = JSON.parse(jsonContent);
                if (parsed.seo_intro) {
                    setSeo(parsed.seo_intro);
                }
            } catch (e) {
                // Ignore parse errors while typing
            }
        }
    }, [jsonContent, seo]);

    const handlePreview = () => {
        try {
            const parsedContent = JSON.parse(jsonContent);
            const tempLesson = {
                id: lessonId || 'preview',
                title,
                language,
                level,
                tags: selectedTags,
                videoUrl,
                isVideoLesson,
                lessonType,
                seo,
                content: parsedContent,
                imageUrl: imagePreview,
                audioFileUrl: lessonData?.audioFileUrl, // Keep existing if not changed, file upload preview for audio is harder
                created: lessonData?.created || new Date().toISOString(),
                updated: new Date().toISOString()
            };
            onPreview(tempLesson);
        } catch (e) {
            setError('Cannot preview: Invalid JSON content.');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Ensure at least one tag is selected
        if (selectedTags.length === 0) {
            setError('Please select at least one tag.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Validate JSON
            let parsedContent;
            try {
                parsedContent = JSON.parse(jsonContent);
                // Sync title from form to content if they differ
                if (title && parsedContent.title !== title) {
                    parsedContent.title = title;
                }
            } catch (err) {
                throw new Error('Invalid JSON content. Please check for syntax errors.');
            }

            const formData = new FormData();
            formData.append('title', title);
            formData.append('language', language);
            formData.append('level', level);
            selectedTags.forEach(tag => formData.append('tags', tag));
            formData.append('videoUrl', videoUrl);
            formData.append('isVideoLesson', String(isVideoLesson));
            formData.append('lessonType', lessonType);
            formData.append('seo', seo);
            formData.append('content', JSON.stringify(parsedContent));

            if (imageFile) {
                formData.append('image', imageFile);
            }
            if (audioFile) {
                formData.append('audioFile', audioFile);
            }

            if (lessonId) {
                await updateLesson(lessonId, formData);
            } else {
                await createLesson(formData);
            }

            // Trigger Cloudflare rebuild
            triggerRebuild();

            onSave();
        } catch (err: any) {
            setError(err.message || 'Failed to save lesson');
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadJSON = () => {
        try {
            // Validate JSON first
            let parsedContent;
            try {
                parsedContent = JSON.parse(jsonContent);
                if (title && parsedContent.title !== title) {
                    parsedContent.title = title;
                }
            } catch (err) {
                setError('Invalid JSON content. Please check for syntax errors before downloading.');
                return;
            }

            const lessonData = {
                title,
                language,
                level,
                tags: selectedTags,
                videoUrl,
                isVideoLesson,
                lessonType,
                seo,
                content: parsedContent,
            };

            const blob = new Blob([JSON.stringify(lessonData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'worksheet'}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (e: any) {
            setError('Failed to generate JSON for download.');
        }
    };

    const generateEmbedCode = () => {
        try {
            let parsedContent;
            try {
                parsedContent = JSON.parse(jsonContent);
                if (title && parsedContent.title !== title) {
                    parsedContent.title = title;
                }
            } catch (err) {
                setError('Invalid JSON content. Please check for syntax errors before generating embed code.');
                return null;
            }

            const embedData = JSON.stringify({
                title,
                level,
                language,
                tags: selectedTags,
                videoUrl,
                isVideoLesson,
                lessonType,
                seo,
                content: parsedContent,
                isStandalone: isPublicCreator
            }, null, 2);

            return `<!-- TJ Worksheet Embed -->
<link rel="stylesheet" href="https://worksheets.teacherjake.com/wc/language-learning-worksheets.css">

<tj-pocketbase-worksheet>
  <script type="application/json">
${embedData}
  </script>
</tj-pocketbase-worksheet>

<script src="https://worksheets.teacherjake.com/wc/tj-pocketbase-worksheet.umd.js"></script>`;
        } catch (e) {
            setError('Failed to generate embed code.');
            return null;
        }
    };

    const handleCopyEmbed = () => {
        const code = generateEmbedCode();
        if (code) {
            navigator.clipboard.writeText(code);
            alert("Embed code copied to clipboard!");
        }
    };

    const handleDownloadHTML = () => {
        const embedCode = generateEmbedCode();
        if (!embedCode) return;

        const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title || 'TeacherJake Worksheet'}</title>
    <style>
        body { margin: 0; padding: 0; background-color: #f9fafb; font-family: sans-serif; }
    </style>
</head>
<body>
    <div style="max-w: 1000px; margin: 0 auto; padding: 20px;">
        ${embedCode}
    </div>
</body>
</html>`;

        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'worksheet'}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleVisualEditorApply = (updatedData: any) => {
        setJsonContent(JSON.stringify(updatedData, null, isMinified ? 0 : 2));
        setShowVisualEditor(false);
    };

    const handlePasteFromClipboard = async () => {
        try {
            const text = await navigator.clipboard.readText();
            if (text) {
                setJsonContent(text);
                // Attempt to sync title if valid JSON
                try {
                    const parsed = JSON.parse(text);
                    if (parsed.title) {
                        setTitle(parsed.title);
                    }
                    if (parsed.seo_intro && !seo) {
                        setSeo(parsed.seo_intro);
                    }
                } catch (e) {
                    // Not valid JSON yet, that's fine
                }
            }
        } catch (err) {
            setError('Failed to read from clipboard. Please ensure you have granted permission.');
        }
    };

    const handlePasteImageFromClipboard = async () => {
        try {
            const items = await navigator.clipboard.read();
            let foundImage = false;
            for (const item of items) {
                const imageType = item.types.find(type => type.startsWith('image/'));
                if (imageType) {
                    const blob = await item.getType(imageType);
                    const file = new File([blob], `pasted-image-${Date.now()}.${imageType.split('/')[1]}`, { type: imageType });
                    setImageFile(file);
                    const reader = new FileReader();
                    reader.onloadend = () => setImagePreview(reader.result as string);
                    reader.readAsDataURL(file);
                    foundImage = true;
                    break;
                }
            }
            if (!foundImage) {
                setError('No image found in clipboard.');
            }
        } catch (err) {
            setError('Failed to paste image. Please ensure you have granted permission.');
        }
    };

    const toggleMinify = () => {
        try {
            const parsed = JSON.parse(jsonContent);
            const nextMinified = !isMinified;
            setJsonContent(JSON.stringify(parsed, null, nextMinified ? 0 : 2));
            setIsMinified(nextMinified);
        } catch (e) {
            setError('Cannot toggle format: Invalid JSON content.');
        }
    };

    if (fetching) {
        return (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm animate-pulse">
                <FileJson className="w-10 h-10 text-gray-300 mb-4" />
                <p className="text-gray-400 font-medium">Preparing worksheet data...</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50">
                <div className="flex items-center gap-3">
                    <div className="bg-green-600 p-2 rounded-lg shrink-0">
                        <FileJson className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-base md:text-lg font-black text-gray-900 leading-tight">{lessonId ? 'Edit Worksheet' : 'Create New Worksheet'}</h2>
                        <p className="text-[10px] md:text-xs text-gray-500 font-medium">{lessonId ? `Editing ID: ${lessonId}` : 'Define your worksheet properties and content'}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="secondary" size="sm" onClick={onCancel} className="flex-1 sm:flex-none gap-2 text-xs">
                        <X className="w-4 h-4" /> Cancel
                    </Button>
                </div>
            </div>

            {isPublicCreator && (
                <div className="bg-blue-50/50 border-b border-blue-100 p-4 md:p-6 text-sm text-blue-800">
                    <h3 className="font-bold flex items-center gap-2 mb-2">
                        <Info className="w-5 h-5 text-blue-600" />
                        How to create a standalone worksheet
                    </h3>
                    <ol className="list-decimal pl-5 space-y-1.5 ml-2">
                        <li>Fill out the form below with your worksheet's language, level, and tags.</li>
                        <li>Select a <strong>Lesson Type</strong> to enable the Gemini generator link.</li>
                        <li>Click <strong>Get JSON from Gemini</strong> to open a pre-prompted AI chat. Have Gemini generate the worksheet content, then paste the resulting JSON into the content area.</li>
                        <li>Use <strong>Preview</strong> to verify your worksheet looks correct.</li>
                        <li>Finally, click <strong>Save as HTML</strong> to download your standalone interactive worksheet!</li>
                    </ol>
                </div>
            )}

            <form onSubmit={handleSubmit} className="p-8">


                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-black text-gray-700 mb-2 ml-1 uppercase tracking-wider">Lesson Title</label>
                            <input
                                type="text"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                placeholder="Enter lesson title..."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-black text-gray-700 mb-2 ml-1 uppercase tracking-wider">Language</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10">
                                        <Globe className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <SearchableSelect
                                        value={language}
                                        onChange={setLanguage}
                                        options={LANGUAGE_OPTIONS}
                                        placeholder="Select language..."
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none hover:border-gray-300 transition-colors"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-black text-gray-700 mb-2 ml-1 uppercase tracking-wider">Level</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <Layers className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <select
                                        value={level}
                                        onChange={(e) => setLevel(e.target.value)}
                                        required
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none appearance-none"
                                    >
                                        <option value="" disabled>Select level...</option>
                                        {LEVEL_OPTIONS.map(opt => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-black text-gray-700 mb-2 ml-1 uppercase tracking-wider">Lesson Type</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <Layout className="h-4 w-4 text-gray-400" />
                                </div>
                                <select
                                    value={lessonType}
                                    onChange={(e) => setLessonType(e.target.value)}
                                    required
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none appearance-none"
                                >
                                    <option value="" disabled>Select lesson type...</option>
                                    {LESSON_TYPE_OPTIONS.map(opt => (
                                        <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1).replace('-', ' ')}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-black text-gray-700 mb-2 ml-1 uppercase tracking-wider">Tags</label>
                            <div className="flex flex-wrap gap-2 p-3 bg-gray-50 border border-gray-200 rounded-xl min-h-[50px]">
                                {TAG_OPTIONS.map(tag => (
                                    <button
                                        key={tag}
                                        type="button"
                                        onClick={() => {
                                            setSelectedTags(prev =>
                                                prev.includes(tag)
                                                    ? prev.filter(t => t !== tag)
                                                    : [...prev, tag]
                                            );
                                        }}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${selectedTags.includes(tag)
                                            ? 'bg-green-600 border-green-700 text-white shadow-sm'
                                            : 'bg-white border-gray-200 text-gray-600 hover:border-green-300 hover:bg-green-50'
                                            }`}
                                    >
                                        <TagIcon className="w-4 h-4" />
                                        {tag}
                                        {selectedTags.includes(tag) && <Check className="w-3 h-3" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-black text-gray-700 mb-2 ml-1 uppercase tracking-wider">YouTube URL</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <Video className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    value={videoUrl}
                                    onChange={(e) => setVideoUrl(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                                    placeholder="https://www.youtube.com/watch?v=..."
                                />
                            </div>
                        </div>

                        {!isPublicCreator && (
                            <>
                                <div>
                                    <label className="block text-sm font-black text-gray-700 mb-2 ml-1 uppercase tracking-wider">Worksheet Image</label>
                                    <div className="flex flex-col gap-3">
                                        {imagePreview && (
                                            <div className="w-full aspect-video rounded-xl bg-gray-100 overflow-hidden border border-gray-200">
                                                <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                                            </div>
                                        )}
                                        <div className="relative">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0] || null;
                                                    setImageFile(file);
                                                    if (file) {
                                                        const reader = new FileReader();
                                                        reader.onloadend = () => setImagePreview(reader.result as string);
                                                        reader.readAsDataURL(file);
                                                    } else {
                                                        setImagePreview(null);
                                                    }
                                                }}
                                                className="hidden"
                                                id="image-upload"
                                            />
                                            <div className="flex gap-2">
                                                <label
                                                    htmlFor="image-upload"
                                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-dashed border-gray-300 rounded-xl hover:border-green-500 hover:bg-green-50 cursor-pointer transition-all text-gray-600 font-bold text-sm"
                                                >
                                                    <ImageIcon className="w-4 h-4" />
                                                    <span className="truncate">{imageFile ? imageFile.name : 'Upload Image (JPG/PNG)'}</span>
                                                </label>
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    onClick={handlePasteImageFromClipboard}
                                                    className="px-4 py-3 h-auto"
                                                    title="Paste image from clipboard"
                                                >
                                                    <ClipboardPaste className="w-5 h-5 shrink-0" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-black text-gray-700 mb-2 ml-1 uppercase tracking-wider">Audio File (MP3)</label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept="audio/mpeg,audio/mp3"
                                            onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                                            className="hidden"
                                            id="audio-upload"
                                        />
                                        <label
                                            htmlFor="audio-upload"
                                            className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-white border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all text-gray-600 font-bold text-sm"
                                        >
                                            <Music className="w-4 h-4" />
                                            {audioFile ? audioFile.name : 'Upload Audio (MP3)'}
                                        </label>
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                            <div className="flex items-center h-5">
                                <input
                                    type="checkbox"
                                    id="isVideoLesson"
                                    checked={isVideoLesson}
                                    onChange={(e) => setIsVideoLesson(e.target.checked)}
                                    className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500 cursor-pointer"
                                />
                            </div>
                            <label htmlFor="isVideoLesson" className="text-sm font-bold text-gray-700 cursor-pointer flex items-center gap-2">
                                <Info className="w-4 h-4 text-blue-500" /> Mark as Video Lesson
                            </label>
                        </div>
                    </div>
                </div>

                <div className="mb-8 p-6 bg-blue-50/30 border border-blue-100 rounded-2xl">
                    <label className="text-sm font-black text-blue-900 mb-2 ml-1 uppercase tracking-wider flex items-center gap-2">
                        <Info className="w-4 h-4 text-blue-500" /> SEO Description / Snippet
                    </label>
                    <textarea
                        value={seo}
                        onChange={(e) => setSeo(e.target.value)}
                        className="w-full h-24 px-4 py-3 bg-white border border-blue-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm leading-relaxed"
                        placeholder="Enter a brief, engaging description for search results and social sharing..."
                    />
                    <p className="mt-2 text-[10px] text-blue-400 font-medium ml-1 italic">
                        This summary appears on the lesson list page and helps with search engine visibility.
                    </p>
                </div>

                <div className="mb-10">
                    <div className="flex flex-wrap items-center justify-between mb-3 ml-1">
                        <label className="text-sm font-black text-gray-700 uppercase tracking-wider flex items-center gap-2">
                            <FileJson className="w-4 h-4" /> Worksheet JSON Content
                        </label>
                        <div className="flex flex-wrap items-center gap-2">
                            <div className="flex items-center gap-2 mr-4 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                                <label className="text-[10px] font-black text-gray-500 cursor-pointer flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={isMinified}
                                        onChange={toggleMinify}
                                        className="w-3.5 h-3.5 rounded text-green-600 focus:ring-green-500"
                                    />
                                    Check JSON
                                </label>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setShowVisualEditor(true)}
                                className="text-[10px] font-bold flex items-center gap-1.5"
                            >
                                <Layout className="w-4 h-4" /> Visual Editor
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handlePasteFromClipboard}
                                className="text-[10px] font-bold flex items-center gap-1.5 border-blue-200 text-blue-700 hover:bg-blue-50"
                            >
                                <ClipboardPaste className="w-4 h-4" /> Paste
                            </Button>
                            {lessonType ? (
                                <a
                                    href={lessonType === 'information-gap'
                                        ? "https://gemini.google.com/gem/1bdsM9tYk1Qb4lcCsnPVOTK1FR_37HYnX?usp=sharing"
                                        : lessonType === 'focused-reading'
                                            ? "https://gemini.google.com/gem/1ZcCIp-jD0vhJk_nZziTbmGv0eVz-vfHV?usp=sharing"
                                            : lessonType === 'word-blaster'
                                                ? "https://gemini.google.com/gem/1-FCaGzHScc5c3pAIAJ8SuzuaT-LwbXzU?usp=sharing"
                                                : "https://gemini.google.com/gem/1a183ceHi_da5ac9scUQ3AXs0A5-TcOtn?usp=sharing"
                                    }
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
                        onChange={(e) => setJsonContent(e.target.value)}
                        required
                        className="w-full h-[500px] p-6 bg-gray-900 text-green-400 font-mono text-sm leading-relaxed rounded-2xl focus:ring-2 focus:ring-green-500 outline-none border-none shadow-inner"
                        spellCheck={false}
                    />
                    {error && (
                        <div className="my-2 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700">
                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                            <p className="text-sm font-bold">{error}</p>
                        </div>
                    )}

                    <Modal
                        isOpen={showVisualEditor}
                        onClose={() => setShowVisualEditor(false)}
                        title="Worksheet Content Editor"
                    >
                        {(() => {
                            try {
                                const data = JSON.parse(jsonContent);
                                return (
                                    <JSONKeyValueEditor
                                        initialData={data}
                                        onApply={handleVisualEditorApply}
                                        onCancel={() => setShowVisualEditor(false)}
                                    />
                                );
                            } catch (e) {
                                return (
                                    <div className="p-12 text-center">
                                        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">Invalid JSON Content</h3>
                                        <p className="text-gray-500 max-w-sm mx-auto">Please fix the syntax errors in the JSON textarea before using the visual editor.</p>
                                        <Button variant="outline" onClick={() => setShowVisualEditor(false)} className="mt-8">
                                            Go Back
                                        </Button>
                                    </div>
                                );
                            }
                        })()}
                    </Modal>
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-100 flex-wrap">
                    <Button variant="secondary" onClick={onCancel} type="button" className="px-6 order-last sm:order-none">
                        Cancel
                    </Button>
                    <Button variant="outline" type="button" onClick={handlePreview} disabled={!lessonType} className="px-6 border-green-200 text-green-700 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed">
                        <Eye className="w-4 h-4 mr-2" /> Preview
                    </Button>
                    <Button variant="outline" type="button" onClick={handleDownloadJSON} className="border-blue-200 text-blue-700 hover:bg-blue-50">
                        <FileJson className="w-4 h-4" /> Download JSON
                    </Button>
                    <Button variant="outline" type="button" onClick={handleCopyEmbed} className="border-indigo-200 text-indigo-700 hover:bg-indigo-50">
                        <Code className="w-4 h-4" /> Copy Embed
                    </Button>
                    <Button variant="success" type="button" onClick={handleDownloadHTML} className="shadow-lg shadow-green-100 px-6">
                        <Globe className="w-4 h-4" /> Save as HTML
                    </Button>

                    {!isPublicCreator && (
                        <div className="ml-auto flex flex-col items-end w-full sm:w-auto mt-4 sm:mt-0">
                            <Button variant="success" size="lg" type="submit" isLoading={loading} disabled={!isPocketbaseSupportedLanguage} className="px-10 shadow-lg shadow-green-100 w-full disabled:opacity-50 disabled:cursor-not-allowed">
                                <Save className="w-4 h-4 mr-2" /> {lessonId ? 'Update Online Worksheet' : 'Create Online Worksheet'}
                            </Button>
                            {!isPocketbaseSupportedLanguage && language && (
                                <p className="text-[10px] text-red-500 font-bold mt-1.5 text-right max-w-[250px] leading-tight mb-[-10px]">
                                    Online saving is disabled: '{language}' is not an officially supported platform language. You can still save as HTML.
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
};
