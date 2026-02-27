import React, { useState, useEffect } from 'react';
import { fetchLessonById, createLesson, updateLesson } from '../../services/pocketbase';
import { triggerRebuild } from '../../services/deploy';
import { Button } from '../UI/Button';
import { Save, X, AlertCircle, FileJson, Info, Globe, Layers, Tag as TagIcon, Video, Check, Image as ImageIcon, Music, Layout, ClipboardPaste } from 'lucide-react';
import { Modal } from '../UI/Modal';
import { JSONKeyValueEditor } from './JSONKeyValueEditor';

const TAG_OPTIONS = ['science', 'video', 'general', 'fable', 'M1-2'];

interface LessonEditorProps {
    lessonId: string | null;
    onSave: () => void;
    onCancel: () => void;
}

export const LessonEditor: React.FC<LessonEditorProps> = ({ lessonId, onSave, onCancel }) => {
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(!!lessonId);
    const [error, setError] = useState<string | null>(null);

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

    useEffect(() => {
        if (lessonId) {
            const loadLesson = async () => {
                try {
                    const lesson = await fetchLessonById(lessonId);
                    setTitle(lesson.title || '');
                    setLanguage(lesson.language);
                    setLevel(lesson.level);
                    setSelectedTags(lesson.tags || []);
                    setVideoUrl(lesson.videoUrl || '');
                    setIsVideoLesson(lesson.isVideoLesson || false);
                    setLessonType(lesson.lessonType || 'worksheet');
                    setJsonContent(JSON.stringify(lesson.content, null, 2));
                    setSeo(lesson.seo || '');
                } catch (err) {
                    setError('Failed to load lesson for editing');
                } finally {
                    setFetching(false);
                }
            };
            loadLesson();
        } else {
            // New lesson starts with empty JSON content
            setJsonContent('');
        }
    }, [lessonId]);

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

    const handleVisualEditorApply = (updatedData: any) => {
        setJsonContent(JSON.stringify(updatedData, null, 2));
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
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-3">
                    <div className="bg-green-600 p-2 rounded-lg">
                        <FileJson className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-gray-900">{lessonId ? 'Edit Worksheet' : 'Create New Worksheet'}</h2>
                        <p className="text-xs text-gray-500 font-medium">{lessonId ? `Editing ID: ${lessonId}` : 'Define your worksheet properties and content'}</p>
                    </div>
                </div>
                <Button variant="outline" size="sm" onClick={onCancel} className="gap-2">
                    <X className="w-4 h-4" /> Cancel
                </Button>
            </div>

            <form onSubmit={handleSubmit} className="p-8">
                {error && (
                    <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700">
                        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                        <p className="text-sm font-bold">{error}</p>
                    </div>
                )}

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
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <Globe className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <select
                                        value={language}
                                        onChange={(e) => setLanguage(e.target.value)}
                                        required
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none appearance-none"
                                    >
                                        <option value="" disabled>Select language...</option>
                                        <option value="English">English</option>
                                        <option value="Spanish">Spanish</option>
                                        <option value="French">French</option>
                                        <option value="German">German</option>
                                    </select>
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
                                        <option value="A1">A1 (Beginner)</option>
                                        <option value="A2">A2 (Elementary)</option>
                                        <option value="B1">B1 (Intermediate)</option>
                                        <option value="B2">B2 (Upper Int)</option>
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
                                    <option value="worksheet">Worksheet (Standard)</option>
                                    <option value="information-gap">Information-Gap</option>
                                    <option value="focused-reading">Focused Reading</option>
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
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                                            selectedTags.includes(tag)
                                                ? 'bg-green-600 border-green-700 text-white shadow-sm'
                                                : 'bg-white border-gray-200 text-gray-600 hover:border-green-300 hover:bg-green-50'
                                        }`}
                                    >
                                        <TagIcon className="w-3 h-3" />
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
                                    <label
                                        htmlFor="image-upload"
                                        className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-white border-2 border-dashed border-gray-300 rounded-xl hover:border-green-500 hover:bg-green-50 cursor-pointer transition-all text-gray-600 font-bold text-sm"
                                    >
                                        <ImageIcon className="w-5 h-5" />
                                        {imageFile ? imageFile.name : 'Upload Image (JPG/PNG)'}
                                    </label>
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
                                    <Music className="w-5 h-5" />
                                    {audioFile ? audioFile.name : 'Upload Audio (MP3)'}
                                </label>
                            </div>
                        </div>

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
                    <div className="flex items-center justify-between mb-3 ml-1">
                        <label className="text-sm font-black text-gray-700 uppercase tracking-wider flex items-center gap-2">
                            <FileJson className="w-4 h-4" /> Worksheet JSON Content
                        </label>
                        <div className="flex items-center gap-2">
                            <Button 
                                type="button" 
                                variant="outline" 
                                size="sm" 
                                onClick={() => setShowVisualEditor(true)}
                                className="text-[10px] font-bold flex items-center gap-1.5"
                            >
                                <Layout className="w-3 h-3" /> Visual Editor
                            </Button>
                            <Button 
                                type="button" 
                                variant="outline" 
                                size="sm" 
                                onClick={handlePasteFromClipboard}
                                className="text-[10px] font-bold flex items-center gap-1.5 border-blue-200 text-blue-700 hover:bg-blue-50"
                            >
                                <ClipboardPaste className="w-3 h-3" /> Paste from Clipboard
                            </Button>
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
                                <Info className="w-3 h-3" /> Get JSON from Gemini
                            </a>
                        </div>
                    </div>
                    <textarea
                        value={jsonContent}
                        onChange={(e) => setJsonContent(e.target.value)}
                        required
                        className="w-full h-[500px] p-6 bg-gray-900 text-green-400 font-mono text-sm leading-relaxed rounded-2xl focus:ring-2 focus:ring-green-500 outline-none border-none shadow-inner"
                        spellCheck={false}
                    />

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

                <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                    <Button variant="outline" onClick={onCancel} type="button" className="px-8">
                        Cancel
                    </Button>
                    <Button type="submit" isLoading={loading} className="px-12 py-3 rounded-xl shadow-lg shadow-green-200">
                        <Save className="w-5 h-5 mr-2" /> {lessonId ? 'Update Worksheet' : 'Create Worksheet'}
                    </Button>
                </div>
            </form>
        </div>
    );
};
