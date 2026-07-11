import React, { useState, useEffect } from 'react';
import { useLesson, useCreateLesson, useUpdateLesson } from '../../hooks/useLessons';
import { LANGUAGE_OPTIONS, LEVEL_OPTIONS, TAG_OPTIONS, LESSON_TYPE_OPTIONS, POCKETBASE_SUPPORTED_LANGUAGES } from '../../types';
import { Button } from '../UI/Button';
import { Save, X, AlertCircle, FileJson, Info, Globe, Layers, Tag as TagIcon, Video, Check, Image as ImageIcon, Music, Layout, ClipboardPaste, Eye, Code, ShieldCheck } from 'lucide-react';
import { Modal } from '../UI/Modal';
import { JSONKeyValueEditor } from './JSONKeyValueEditor';
import { SearchableSelect } from '../UI/SearchableSelect';
import { VisualHTMLEditor } from './VisualHTMLEditor';
import geminiCopyExample from '../../assets/copy-from-gemini-example.png';
import { compileLessonHtml } from '../../utils/htmlCompiler';
import { parseContent, detectContentFormat, getFormatLabel, DetectedContent } from '../../utils/contentFormat';



interface LessonEditorProps {
    lessonId: string | null;
    initialData?: any;
    isPublicCreator?: boolean;
    onSave: () => void;
    onCancel: () => void;
    onPreview: (lesson: any) => void;
}

export const LessonEditor: React.FC<LessonEditorProps> = ({ lessonId, initialData, isPublicCreator = false, onSave, onCancel, onPreview }) => {
    const { data: lesson, isLoading: fetching, error: fetchError } = useLesson(lessonId);
    const createMutation = useCreateLesson();
    const updateMutation = useUpdateLesson();
    const [error, setError] = useState<string | null>(null);
    
    // Original lesson data stored here to handle things like audio file preview/keeping
    const [lessonData, setLessonData] = useState<any>(null); 

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
    const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null);
    const [lessonType, setLessonType] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [showVisualEditor, setShowVisualEditor] = useState(false);
    const [seo, setSeo] = useState('');
    const [html, setHtml] = useState('');
    const [teacherCode, setTeacherCode] = useState('');
    const [customConfig, setConfig] = useState<Record<string, any>>({});
    const [testMode, setTestMode] = useState(false);
    const [validationMessage, setValidationMessage] = useState<{ ok: boolean; text: string } | null>(null);

    useEffect(() => {
        if (audioFile) {
            const url = URL.createObjectURL(audioFile);
            setAudioPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setAudioPreviewUrl(null);
        }
    }, [audioFile]);

    const isPocketbaseSupportedLanguage = React.useMemo(() => {
        if (!language) return false;
        return (POCKETBASE_SUPPORTED_LANGUAGES as readonly string[]).includes(language);
    }, [language]);

    useEffect(() => {
        if (lesson) {
            setLessonData(lesson);
            setTitle(lesson.title || '');
            setLanguage(lesson.language);
            setLevel(lesson.level);
            setSelectedTags(lesson.tags || []);
            setVideoUrl(lesson.videoUrl || '');
            setIsVideoLesson(lesson.isVideoLesson || false);
            setLessonType(lesson.lessonType || 'worksheet');
            const rawContent = typeof lesson.content === 'string'
                ? lesson.content
                : JSON.stringify(lesson.content, null, 2);
            setJsonContent(rawContent);
            setSeo(lesson.seo || '');
            setHtml(lesson.html || '');
            setTeacherCode(lesson.teacherCode || '');
            const configObj = lesson.customConfig || {};
            setConfig(configObj);
            setTestMode(configObj.testMode || false);
            if (lesson.imageUrl) setImagePreview(lesson.imageUrl);
        }
    }, [lesson]);

    useEffect(() => {
        if (!lessonId) {
            // New lesson starts with empty JSON content or initial data from props
            if (initialData) {
                try {
                    setTitle(initialData.title || '');
                    setLessonType(initialData.lessonType || '');
                    
                    const newJsonContent = typeof initialData.content === 'string'
                        ? initialData.content
                        : initialData.content ? JSON.stringify(initialData.content, null, 2) : '';
                    
                    setJsonContent(newJsonContent);
                    setLanguage(initialData.language || '');
                    setLevel(initialData.level || '');
                    setSeo(initialData.seo || '');
                    setHtml(initialData.html || '');
                    setTeacherCode(initialData.teacherCode || '');
                    const configObj = initialData.customConfig || {};
                    setConfig(configObj);
                    setTestMode(configObj.testMode || false);
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
                setHtml('');
                setTeacherCode('');
                setConfig({});
                setTestMode(false);
                setImagePreview(null);
            }
        }
    }, [lessonId, initialData]);

    // Automatically sync SEO from jsonContent if empty (JSON content only)
    useEffect(() => {
        if (!seo.trim() && jsonContent.trim()) {
            if (detectContentFormat(jsonContent) !== 'json') return;
            const detected = parseContent(jsonContent);
            if (detected.format === 'json') {
                const parsed = detected.value as any;
                if (parsed && typeof parsed === 'object' && !Array.isArray(parsed) && parsed.seo_intro) {
                    setSeo(parsed.seo_intro);
                }
            }
        }
    }, [jsonContent, seo]);

    // Live-detect content format and surface a persistent status badge
    const liveDetection = React.useMemo<DetectedContent>(() => {
        if (!jsonContent.trim()) return { format: 'invalid', error: 'Empty content' };
        return parseContent(jsonContent);
    }, [jsonContent]);

    const isContentValid = liveDetection.format !== 'invalid';
    const isJsonContent = liveDetection.format === 'json';

    // Build a lesson object from the current form state. Used by both preview
    // and save so the htmlCompiled field is always derived from the same
    // current input values, and the save path can attach it to the same
    // request that writes the rest of the record.
    const buildLessonForCompile = (idOverride?: string) => {
        const detected = parseContent(jsonContent);
        if (detected.format === 'invalid') {
            throw new Error(detected.error || 'Invalid content. Must be JSON or a custom HTML element.');
        }

        let parsedContent: any;
        if (detected.format === 'json') {
            parsedContent = detected.value;
            // Sync title from form to content if they differ (objects only)
            if (title && parsedContent && typeof parsedContent === 'object' && !Array.isArray(parsedContent) && parsedContent.title !== title) {
                parsedContent.title = title;
            }
        } else {
            // HTML: pass the raw element string through; the compiler handles it.
            parsedContent = jsonContent.trim();
        }

        return {
            id: idOverride || lessonId || undefined,
            title,
            language,
            level,
            tags: selectedTags,
            videoUrl,
            isVideoLesson,
            lessonType,
            seo,
            html,
            teacherCode,
            customConfig: { ...customConfig, testMode },
            content: parsedContent,
            imageUrl: imagePreview || lessonData?.imageUrl,
            audioFileUrl: lessonData?.audioFileUrl,
            created: lessonData?.created || new Date().toISOString(),
            updated: new Date().toISOString()
        };
    };

    const handlePreview = () => {
        try {
            const tempLesson = buildLessonForCompile(`preview-${lessonId || 'new'}-${Date.now()}`);
            onPreview(tempLesson);
        } catch (e: any) {
            setError(e.message || 'Cannot preview: Invalid JSON content.');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Ensure at least one tag is selected
        if (!isPublicCreator && selectedTags.length === 0) {
            setError('Please select at least one tag.');
            return;
        }

        try {
            const lessonForCompile = buildLessonForCompile();

            // Derive htmlCompiled from the current input values *before* the
            // database update so the saved record is consistent in a single
            // request and the user doesn't see a stale compiled value.
            const htmlCompiled = compileLessonHtml(lessonForCompile, html || '');

            const formData = new FormData();
            formData.append('title', title);
            formData.append('language', language);
            formData.append('level', level);
            selectedTags.forEach(tag => formData.append('tags', tag));
            formData.append('videoUrl', videoUrl);
            formData.append('isVideoLesson', String(isVideoLesson));
            formData.append('lessonType', lessonType);
            formData.append('seo', seo);
            formData.append('html', html);
            formData.append('teacherCode', teacherCode);
            formData.append('customConfig', JSON.stringify(lessonForCompile.customConfig));
            formData.append('content', JSON.stringify(lessonForCompile.content));
            formData.append('htmlCompiled', htmlCompiled);

            if (imageFile) {
                formData.append('image', imageFile);
            }
            if (audioFile) {
                formData.append('audioFile', audioFile);
            }

            if (lessonId) {
                await updateMutation.mutateAsync({ id: lessonId, data: formData });
            } else {
                await createMutation.mutateAsync(formData);
            }

            onSave();
        } catch (err: any) {
            setError(err.message || 'Failed to save lesson');
        }
    };

    const handleDownloadJSON = () => {
        try {
            const detected = parseContent(jsonContent);
            if (detected.format === 'invalid') {
                setError(detected.error || 'Invalid content. Must be JSON or a custom HTML element.');
                return;
            }

            let parsedContent: any;
            if (detected.format === 'json') {
                parsedContent = detected.value;
                if (title && parsedContent && typeof parsedContent === 'object' && !Array.isArray(parsedContent) && parsedContent.title !== title) {
                    parsedContent.title = title;
                }
            } else {
                // HTML: download a JSON envelope with the raw element string as content
                parsedContent = jsonContent.trim();
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
                html,
                teacherCode,
                customConfig: { ...customConfig, testMode },
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
            const detected = parseContent(jsonContent);
            if (detected.format === 'invalid') {
                setError(detected.error || 'Invalid content. Must be JSON or a custom HTML element.');
                return null;
            }

            let parsedContent: any;
            if (detected.format === 'json') {
                parsedContent = detected.value;
                if (title && parsedContent && typeof parsedContent === 'object' && !Array.isArray(parsedContent) && parsedContent.title !== title) {
                    parsedContent.title = title;
                }
            } else {
                parsedContent = jsonContent.trim();
            }

            const tempLesson = {
                id: lessonId || '',
                title,
                level,
                language,
                tags: selectedTags,
                imageUrl: imagePreview || undefined,
                audioFileUrl: lessonData?.audioFileUrl || undefined,
                videoUrl,
                isVideoLesson,
                lessonType,
                creatorId: lessonData?.creatorId || undefined,
                seo,
                html,
                teacherCode,
                customConfig: { ...customConfig, testMode },
                content: parsedContent,
                isStandalone: isPublicCreator
            };

            return compileLessonHtml(tempLesson, html || '');
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
        setJsonContent(JSON.stringify(updatedData, null, 2));
        setShowVisualEditor(false);
    };

    const handlePasteFromClipboard = async () => {
        try {
            const text = await navigator.clipboard.readText();
            if (text) {
                setJsonContent(text);
                // Attempt to sync title/SEO if valid JSON
                const detected = parseContent(text);
                if (detected.format === 'json') {
                    const parsed = detected.value as any;
                    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
                        if (parsed.title) {
                            setTitle(parsed.title);
                        }
                        if (parsed.seo_intro && !seo) {
                            setSeo(parsed.seo_intro);
                        }
                    }
                }
                // For HTML content, also surface its tag name in the validation feedback
                if (detected.format === 'html') {
                    setValidationMessage({ ok: true, text: `Detected custom element <${detected.value.tagName}>` });
                }
            }
        } catch (err) {
            setError('Failed to read from clipboard. Please ensure you have granted permission.');
        }
    };

    const runFormatCheck = () => {
        const detected = parseContent(jsonContent);
        if (detected.format === 'json') {
            setValidationMessage({ ok: true, text: 'Valid JSON content.' });
        } else if (detected.format === 'html') {
            setValidationMessage({ ok: true, text: `Valid custom element: <${detected.value.tagName}>.` });
        } else {
            setValidationMessage({ ok: false, text: detected.error });
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
                        <h2 className="text-base md:text-lg font-black text-gray-900 leading-tight">
                            {isPublicCreator ? 'Create Standalone Worksheet' : (lessonId ? 'Edit Worksheet' : 'Create New Worksheet')}
                        </h2>
                        <p className="text-[10px] md:text-xs text-gray-500 font-medium">
                            {isPublicCreator 
                                ? 'Generate standalone HTML worksheets for personal use. Use the Admin dashboard for live worksheets.' 
                                : (lessonId ? `Editing ID: ${lessonId}` : 'Define your worksheet properties and content')}
                        </p>
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
                    <div className="mb-5 p-4 bg-amber-50 border border-amber-250 rounded-xl text-amber-900 flex items-start gap-3 shadow-sm">
                        <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                            <span className="font-bold block text-sm mb-0.5">Personal Use / Standalone HTML Generation Only</span>
                            <span className="text-xs text-amber-800 leading-relaxed font-medium">
                                Worksheets created here are <strong>not saved to the database</strong> and will not appear in the online library. This tool is designed to generate standalone interactive HTML files for offline use, email, or personal websites. To publish or manage live worksheets in the library, please use the <strong className="font-bold text-amber-950">Admin</strong> tab instead.
                            </span>
                        </div>
                    </div>
                    <h3 className="font-bold flex items-center gap-2 mb-2">
                        <Info className="w-5 h-5 text-blue-600" />
                        How to create a standalone worksheet
                    </h3>
                    <ol className="list-decimal pl-5 space-y-1.5 ml-2">
                        <li>Select a <strong>Lesson Type</strong> to enable the Gemini generator link.</li>
                        <li>
                            Click <strong>Get JSON from Gemini</strong> to open a pre-prompted AI chat.<br /> Tell Gemini to generate the worksheet content for the topic, language, and difficulty level desired.<br />
                            <div className="my-2 p-3 bg-white/60 rounded-lg border border-blue-200/60 inline-block">
                                <p className="text-xs font-bold mb-2">⚠️ Important: Use the copy icon at the TOP-RIGHT corner of Gemini's response:</p>
                                <img src={geminiCopyExample} alt="Copy from Gemini Example" className="rounded border border-gray-200 shadow-sm max-w-full md:max-w-sm" />
                            </div>
                            <br />Then return to this tab and click the paste button above the WORKSHEET JSON CONTENT area below.
                        </li>
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
                                placeholder="Gemini will fill this in..."
                            />
                        </div>

                        {!isPublicCreator && (
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
                                            required={!isPublicCreator}
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
                        )}

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

                        {!isPublicCreator && (
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
                        )}
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

                        <div className={lessonType === 'quiz-element' ? "grid grid-cols-1 md:grid-cols-2 gap-4" : ""}>
                            <div>
                                <label className="block text-sm font-black text-gray-700 mb-2 ml-1 uppercase tracking-wider">Teacher Code</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <span className="text-gray-400 font-bold text-sm">#</span>
                                    </div>
                                    <input
                                        type="text"
                                        value={teacherCode}
                                        onChange={(e) => setTeacherCode(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                                        placeholder="6767 (Default)"
                                    />
                                </div>
                            </div>
 
                            {lessonType === 'quiz-element' && (
                                <div>
                                    <label className="block text-sm font-black text-gray-700 mb-2 ml-1 uppercase tracking-wider">Quiz Settings</label>
                                    <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl min-h-[50px]">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-gray-800">Test Mode</span>
                                            <span className="text-xs text-gray-400">Lock quiz behind Teacher Code</span>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                checked={testMode} 
                                                onChange={(e) => setTestMode(e.target.checked)}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                        </label>
                                    </div>
                                </div>
                            )}
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
                                    <div className="flex flex-col gap-3">
                                        {/* New Audio File Preview */}
                                        {audioFile && (
                                            <div className="flex flex-col gap-2 p-3 bg-blue-50/50 rounded-xl border border-blue-200">
                                                <div className="flex items-center gap-2 text-sm text-blue-700 font-medium">
                                                    <Music className="w-4 h-4 text-blue-500 shrink-0" />
                                                    <span className="font-bold text-blue-800 shrink-0">New:</span>
                                                    <span className="truncate" title={audioFile.name}>{audioFile.name}</span>
                                                    <button 
                                                        type="button" 
                                                        onClick={() => setAudioFile(null)}
                                                        className="ml-auto text-xs text-red-500 hover:text-red-700 font-bold"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                                {audioPreviewUrl && (
                                                    <audio 
                                                        src={audioPreviewUrl} 
                                                        controls 
                                                        className="w-full h-8 text-xs" 
                                                    />
                                                )}
                                            </div>
                                        )}

                                        {/* Existing Audio File Preview */}
                                        {!audioFile && lessonData?.audioFile && (
                                            <div className="flex flex-col gap-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
                                                <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                                                    <Music className="w-4 h-4 text-blue-500 shrink-0" />
                                                    <span className="font-bold text-gray-800 shrink-0">Current:</span>
                                                    <span className="truncate" title={lessonData.audioFile}>{lessonData.audioFile}</span>
                                                </div>
                                                {lessonData?.audioFileUrl && (
                                                    <audio 
                                                        src={lessonData.audioFileUrl} 
                                                        controls 
                                                        className="w-full h-8 text-xs" 
                                                    />
                                                )}
                                            </div>
                                        )}

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
                                                {audioFile ? 'Change New Audio' : (lessonData?.audioFile ? 'Replace Audio (MP3)' : 'Upload Audio (MP3)')}
                                            </label>
                                        </div>
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
                        placeholder="Gemini will fill this in for you..."
                    />
                    <p className="mt-2 text-sm text-blue-400 font-medium ml-1 italic">
                        This summary appears on the lesson list page and helps with search engine visibility. You only need it if you plan to use your worksheet on websites.
                    </p>
                </div>

                <div className="mb-8 p-6 bg-green-50/30 border border-green-100 rounded-2xl">
                    <label className="text-sm font-black text-green-900 mb-2 ml-1 uppercase tracking-wider flex items-center gap-2">
                        <Code className="w-4 h-4 text-green-600" /> HTML Content / Lesson Instructions
                    </label>
                    <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 mb-3 text-xs text-blue-700 leading-relaxed">
                        <strong>Tip:</strong> You can enter standard HTML here. To place the interactive web component / game in the middle of your text on occasion, simply insert the <code>&lt;lesson-component&gt;&lt;/lesson-component&gt;</code> or <code>&lt;web-component&gt;&lt;/web-component&gt;</code> tag where you want it to appear. If omitted, the web component renders automatically at the bottom.
                    </div>
                    <VisualHTMLEditor
                        value={html}
                        onChange={setHtml}
                    />
                </div>

                <div className="mb-10">
                    <div className="flex flex-wrap items-center justify-between mb-3 ml-1 gap-2">
                        <div className="flex items-center gap-3">
                            <label className="text-sm font-black text-gray-700 uppercase tracking-wider flex items-center gap-2">
                                <FileJson className="w-4 h-4" /> Worksheet JSON Content
                            </label>
                            {(() => {
                                const format = liveDetection.format;
                                const tone =
                                    format === 'json'
                                        ? 'bg-green-100 text-green-800 border-green-200'
                                        : format === 'html'
                                            ? 'bg-blue-100 text-blue-800 border-blue-200'
                                            : 'bg-red-100 text-red-800 border-red-200';
                                let detail = '';
                                let tooltip = getFormatLabel(format);
                                if (format === 'html' && liveDetection.value) {
                                    detail = ` <${liveDetection.value.tagName}>`;
                                    tooltip = `${getFormatLabel(format)}${detail}`;
                                } else if (format === 'invalid') {
                                    tooltip = liveDetection.error;
                                }
                                return (
                                    <span
                                        className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${tone}`}
                                        title={tooltip}
                                    >
                                        {getFormatLabel(format)}{detail}
                                    </span>
                                );
                            })()}
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={runFormatCheck}
                                disabled={!jsonContent.trim()}
                                className="text-[10px] font-bold flex items-center gap-1.5"
                            >
                                <ShieldCheck className="w-4 h-4" /> Check Format
                            </Button>
                            {isJsonContent && lessonType !== 'quiz-element' && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowVisualEditor(true)}
                                    className="text-[10px] font-bold flex items-center gap-1.5"
                                >
                                    <Layout className="w-4 h-4" /> Visual Editor
                                </Button>
                            )}
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
                        onChange={(e) => {
                            setJsonContent(e.target.value);
                            if (validationMessage) setValidationMessage(null);
                        }}
                        required
                        aria-invalid={!isContentValid}
                        className={`w-full h-[500px] p-6 bg-gray-900 text-green-400 font-mono text-sm leading-relaxed rounded-2xl focus:ring-2 outline-none border-2 shadow-inner ${
                            isContentValid
                                ? 'border-transparent focus:ring-green-500'
                                : 'border-red-500/70 focus:ring-red-500'
                        }`}
                        spellCheck={false}
                    />
                    {validationMessage && (
                        <div
                            className={`my-2 p-4 border rounded-xl flex items-start gap-3 ${
                                validationMessage.ok
                                    ? 'bg-green-50 border-green-200 text-green-700'
                                    : 'bg-red-50 border-red-200 text-red-700'
                            }`}
                        >
                            {validationMessage.ok
                                ? <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                                : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
                            <p className="text-sm font-bold">{validationMessage.text}</p>
                        </div>
                    )}
                    {!isContentValid && !validationMessage && (
                        <div className="my-2 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700">
                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                            <p className="text-sm font-bold">{liveDetection.format === 'invalid' ? liveDetection.error : 'Invalid content.'}</p>
                        </div>
                    )}
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
                            const detected = parseContent(jsonContent);
                            if (detected.format !== 'json') {
                                return (
                                    <div className="p-12 text-center">
                                        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">Visual Editor is JSON-only</h3>
                                        <p className="text-gray-500 max-w-sm mx-auto">
                                            The visual editor works on JSON content. Switch your content to a JSON object
                                            (starts with <code className="bg-gray-100 px-1 rounded">&#123;</code> or <code className="bg-gray-100 px-1 rounded">[</code>)
                                            to use it.
                                        </p>
                                        <Button variant="outline" onClick={() => setShowVisualEditor(false)} className="mt-8">
                                            Go Back
                                        </Button>
                                    </div>
                                );
                            }
                            return (
                                <JSONKeyValueEditor
                                    initialData={detected.value}
                                    onApply={handleVisualEditorApply}
                                    onCancel={() => setShowVisualEditor(false)}
                                />
                            );
                        })()}
                    </Modal>
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-100 flex-wrap">
                    <Button variant="secondary" onClick={onCancel} type="button" className="px-6 order-last sm:order-none">
                        Cancel
                    </Button>
                    <Button variant="outline" type="button" onClick={handlePreview} disabled={!lessonType || !isContentValid} title={!isContentValid ? 'Fix the content format first' : undefined} className="px-6 border-green-200 text-green-700 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed">
                        <Eye className="w-4 h-4 mr-2" /> Preview
                    </Button>
                    <Button variant="outline" type="button" onClick={handleCopyEmbed} disabled={!isContentValid} title={!isContentValid ? 'Fix the content format first' : undefined} className="border-indigo-200  text-indigo-700 hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed">
                        <Code className="w-4 h-4 mr-2" /> Copy Embed
                    </Button>
                    <Button variant="success" type="button" onClick={handleDownloadHTML} disabled={!isContentValid} title={!isContentValid ? 'Fix the content format first' : undefined} className="shadow-lg shadow-green-100 px-6 disabled:opacity-50 disabled:cursor-not-allowed">
                        <Globe className="w-4 h-4 mr-2" /> Save as HTML
                    </Button>

                    {!isPublicCreator && (
                        <div className="ml-auto flex flex-col items-end w-full sm:w-auto mt-4 sm:mt-0">
                            <Button variant="success" size="lg" type="submit" isLoading={createMutation.isPending || updateMutation.isPending} disabled={!isPocketbaseSupportedLanguage || !isContentValid} title={!isContentValid ? 'Fix the content format first' : undefined} className="px-10 shadow-lg shadow-green-100 w-full disabled:opacity-50 disabled:cursor-not-allowed">
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
