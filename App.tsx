import React, { useState, useEffect } from 'react';
import { fetchLessons, fetchLessonById } from './services/pocketbase';
import { ParsedLesson, LANGUAGE_OPTIONS, LEVEL_OPTIONS, TAG_OPTIONS } from './types';
import { LessonView } from './components/Lesson/LessonView';
import { Button } from './components/UI/Button';
import { BookOpen, Search, FlaskConical, Video, Feather, FileText, X, Eye } from 'lucide-react';
import { BrowserSupportWarning } from './components/UI/BrowserSupportWarning';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { WebComponentPreview } from './components/Lesson/WebComponentPreview';

const App: React.FC = () => {
    const [view, setView] = useState<'home' | 'lesson' | 'admin'>('home');
    const [currentLesson, setCurrentLesson] = useState<ParsedLesson | null>(null);
    const [showPreview, setShowPreview] = useState(false);

    // Filter States
    const [language, setLanguage] = useState('English');
    const [level, setLevel] = useState('All');
    const [tag, setTag] = useState('All');

    const [lessons, setLessons] = useState<ParsedLesson[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingLesson, setLoadingLesson] = useState(false);

    // Parse URL params for routing
    useEffect(() => {
        const syncParams = () => {
            const params = new URLSearchParams(window.location.search);
            const viewParam = params.get('view');
            const lessonId = params.get('lesson');

            // Sync filters from URL if present
            const urlLang = params.get('language');
            const urlLevel = params.get('level');
            const urlTag = params.get('category');

            if (urlLang) setLanguage(urlLang);
            if (urlLevel) setLevel(urlLevel);
            if (urlTag) setTag(urlTag);

            if (viewParam === 'admin') {
                setView('admin');
            } else if (lessonId && (!currentLesson || currentLesson.id !== lessonId)) {
                handleSelectLesson(lessonId);
            } else if (!lessonId && view === 'lesson') {
                setView('home');
                setCurrentLesson(null);
            } else if (!viewParam && view === 'admin') {
                setView('home');
            }
        };

        syncParams();
        window.addEventListener('popstate', syncParams);
        return () => window.removeEventListener('popstate', syncParams);
    }, [currentLesson?.id, view]);

    const updateURL = (params: Record<string, string>) => {
        try {
            const url = new URL(window.location.href);
            Object.keys(params).forEach(key => {
                const value = params[key];
                if (value !== undefined && value !== null) {
                    if (value === '') {
                        url.searchParams.delete(key);
                    } else {
                        url.searchParams.set(key, value);
                    }
                }
            });

            // Avoid pushing redundant state
            if (url.toString() !== window.location.href) {
                window.history.pushState({}, '', url.toString());
            }
        } catch (e) {
            console.error("Failed to update URL", e);
        }
    };

    useEffect(() => {
        const loadLessons = async () => {
            setLoading(true);
            try {
                const data = await fetchLessons(language, level);
                setLessons(data as any);

                // Update URL to reflect filters without touching the active lesson param.
                // (Clearing `lesson` is handled explicitly when returning to Home.)
                updateURL({ language, level, category: tag });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadLessons();
    }, [language, level]);

    const handleSelectLesson = async (id: string) => {
        if (!id) return;
        setLoadingLesson(true);
        try {
            const lesson = await fetchLessonById(id);
            setCurrentLesson(lesson);
            setView('lesson');
            window.scrollTo(0, 0);
            updateURL({ lesson: id, language, level, category: tag });
        } catch (err) {
            alert("Failed to load lesson.");
        } finally {
            setLoadingLesson(false);
        }
    };

    const handleViewChange = (newView: 'home' | 'lesson' | 'admin') => {
        setView(newView);
        if (newView === 'home') {
            updateURL({ lesson: '', view: '', language, level, category: tag });
        } else if (newView === 'admin') {
            updateURL({ lesson: '', view: 'admin' });
        }
    };

    const filteredLessons = lessons.filter(l => {
        if (tag === 'All') return true;
        return l.tags?.some(t => t.toLowerCase() === tag.toLowerCase());
    }).sort((a, b) => {
        // If "All Categories" and "All Levels" view, show most recent first (descending by created)
        if (tag === 'All' && level === 'All') {
            return b.created.localeCompare(a.created);
        }
        // Otherwise, filtered views should be sorted alphabetically by title (ascending)
        return a.title.localeCompare(b.title);
    });

    const getIconForTag = (tags: string[]) => {
        const mainTag = tags?.[0]?.toLowerCase() || '';
        if (mainTag.includes('science')) return <FlaskConical className="w-6 h-6 text-purple-500" />;
        if (mainTag.includes('m1-2')) return <FlaskConical className="w-6 h-6 text-green-500" />;
        if (mainTag.includes('video')) return <Video className="w-6 h-6 text-red-500" />;
        if (mainTag.includes('fable')) return <Feather className="w-6 h-6 text-amber-600" />;
        return <FileText className="w-6 h-6 text-green-500" />;
    };

    return (
        <div className="tj-worksheet-wrapper min-h-screen font-sans print:min-h-0 print:bg-white bg-gray-50 text-gray-800">
            <BrowserSupportWarning />
            {/* Navbar - Hidden on print */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 print:hidden">
                <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleViewChange('home')}>
                        {/* <img src="https://blog.teacherjake.com/apps/assets/tj-logo.png" alt="Logo" className="h-10 w-auto" /> */}
                        <a href="https://www.teacherjake.com" className="hover:opacity-80 transition-opacity">
                            <img src="https://blog.teacherjake.com/apps/assets/tj-logo.png" alt="Teacher Jake Logo"
                                className="h-10 w-auto "></img>
                        </a>
                        <span className="hidden md:block font-bold text-gray-700">Worksheets</span>
                    </div>
                    {view === 'lesson' && (
                        <div className="flex items-center gap-3">
                            <div className="hidden sm:block text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full truncate sm:max-w-[200px] md:max-w-[300px]">
                                {currentLesson?.title}
                            </div>
                            <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => {
                                    navigator.clipboard.writeText(window.location.href);
                                    alert('Link copied to clipboard!');
                                }}
                                className="hidden sm:inline-flex"
                            >
                                Share
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setShowPreview(true)}
                                className="hidden md:inline-flex gap-2"
                            >
                                <Eye className="w-4 h-4" /> Preview
                            </Button>
                            <button 
                                onClick={() => {
                                    handleViewChange('home');
                                    try {
                                        localStorage.removeItem(`lesson-progress-${currentLesson?.id}`);
                                    } catch (e) {}
                                }}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                                title="Close Lesson"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    )}
                </div>
            </nav>

            <main className="container mx-auto px-0 py-4 print:p-0 print:m-0 print:max-w-none">
                {view === 'home' ? (
                    <div className="max-w-3xl mx-auto print:hidden">
                        <div className="text-center mb-12">
                            <h1 className="text-4xl font-extrabold text-green-900 mb-4 tracking-tight">Interactive Worksheets</h1>
                            <p className="text-lg text-gray-600">Select a language and level to start learning.</p>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Language</label>
                                    <select
                                        value={language}
                                        onChange={(e) => setLanguage(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 bg-white"
                                    >
                                        {LANGUAGE_OPTIONS.map(opt => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Level</label>
                                    <select
                                        value={level}
                                        onChange={(e) => setLevel(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 bg-white"
                                    >
                                        <option value="All">All Levels</option>
                                        {LEVEL_OPTIONS.map(opt => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                                    <select
                                        value={tag}
                                        onChange={(e) => setTag(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 bg-white"
                                    >
                                        <option value="All">All Categories</option>
                                        {TAG_OPTIONS.map(opt => (
                                            <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1).replace('-', ' ')}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-4">Available Lessons</h2>

                                {loading ? (
                                    <div className="text-center py-12">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                                        <p className="text-gray-500">Loading lessons...</p>
                                    </div>
                                ) : filteredLessons.length === 0 ? (
                                    <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                        <p className="text-gray-500">No lessons found matching your criteria.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                                        {filteredLessons.map(l => (
                                            <div
                                                key={l.id}
                                                onClick={() => handleSelectLesson(l.id)}
                                                className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 cursor-pointer flex flex-col h-full"
                                            >
                                                {/* Image Header */}
                                                <div className="aspect-video w-full shrink-0 bg-gray-100 flex items-center justify-center overflow-hidden relative rounded-t-2xl">
                                                    {l.imageUrl ? (
                                                        <img
                                                            src={l.imageUrl}
                                                            alt={l.title}
                                                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 rounded-t-2xl"
                                                        />
                                                    ) : (
                                                        <div className="p-12 opacity-40">
                                                            {getIconForTag(l.tags)}
                                                        </div>
                                                    )}

                                                    {/* Date overlay */}
                                                    <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                        {new Date(l.created).toLocaleDateString()}
                                                    </div>
                                                </div>

                                                {/* Content logic */}
                                                <div className="grow p-6 flex flex-col">
                                                    <div className="mb-4">
                                                        {/* Badge / Code-like Ref */}
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <span className="text-[11px] font-black tracking-wider text-[#1a933f] uppercase bg-[#f4fff7] px-2 py-0.5 rounded border border-[#e0f7e9]">
                                                                {l.language === 'English' ? 'EN' : l.language.substring(0, 2).toUpperCase()}-{l.level}
                                                            </span>
                                                            <div className="h-1 w-1 rounded-full bg-gray-200"></div>
                                                            <span className="text-[11px] text-gray-400 font-medium">#{l.id.substring(0, 4)}</span>
                                                        </div>

                                                        <h3 className="font-extrabold text-[#2563eb] text-xl leading-tight mb-3 group-hover:text-green-700 transition-colors line-clamp-2 min-h-12">
                                                            {l.title}
                                                        </h3>

                                                        {((l.content as any).seo_intro || l.seo || l.description) && (
                                                            <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-0">
                                                                {(l.content as any).seo_intro || l.seo || l.description}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Footer / Read More style */}
                                                    <div className="pt-4 mt-auto border-t border-gray-100 flex items-center justify-between">
                                                        <span className="text-[12px] font-extrabold tracking-widest text-[#2563eb] uppercase transition-colors">
                                                            READ MORE
                                                        </span>
                                                        <div className="w-10 h-10 rounded-full bg-[#f0f7ff] flex items-center justify-center text-[#2563eb] group-hover:bg-[#2563eb] group-hover:text-white shadow-sm group-hover:shadow-md transition-all duration-300">
                                                            <Search size={18} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {loadingLesson && (
                                <div className="flex justify-center items-center py-4 text-green-600">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Loading Lesson content...
                                </div>
                            )}
                        </div>

                        <div className="mt-12 flex justify-center text-green-200">
                            <BookOpen size={64} opacity={0.5} />
                        </div>
                    </div>
                ) : view === 'admin' ? (
                    <AdminDashboard onBack={() => handleViewChange('home')} />
                ) : (
                    currentLesson && <LessonView lesson={currentLesson} />
                )}
            </main>

            {showPreview && currentLesson && (
                <WebComponentPreview 
                    lesson={currentLesson} 
                    onClose={() => setShowPreview(false)} 
                />
            )}
        </div>
    );
};

export default App;