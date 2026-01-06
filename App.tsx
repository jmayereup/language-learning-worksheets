import React, { useState, useEffect } from 'react';
import { fetchLessons, fetchLessonById } from './services/pocketbase';
import { ParsedLesson } from './types';
import { LessonView } from './components/Lesson/LessonView';
import { Button } from './components/UI/Button';
import { BookOpen, Search } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'lesson'>('home');
  const [currentLesson, setCurrentLesson] = useState<ParsedLesson | null>(null);
  
  // Filter States
  const [language, setLanguage] = useState('English');
  const [level, setLevel] = useState('A1');
  const [tag, setTag] = useState('All');

  const [lessons, setLessons] = useState<{id: string, title: string, tags: string[]}[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingLesson, setLoadingLesson] = useState(false);

  // Parse URL params for routing
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const lessonId = params.get('lesson');
    
    // Sync filters from URL if present
    const urlLang = params.get('language');
    const urlLevel = params.get('level');
    const urlTag = params.get('category');
    
    if (urlLang) setLanguage(urlLang);
    if (urlLevel) setLevel(urlLevel);
    if (urlTag) setTag(urlTag);

    if (lessonId) {
       handleSelectLesson(lessonId);
    }
  }, []);

  const updateURL = (params: Record<string, string>) => {
    const url = new URL(window.location.href);
    Object.keys(params).forEach(key => {
        if (params[key]) {
            url.searchParams.set(key, params[key]);
        } else {
            url.searchParams.delete(key);
        }
    });
    window.history.pushState({}, '', url);
  };

  useEffect(() => {
    const loadLessons = async () => {
      setLoading(true);
      try {
        const data = await fetchLessons(language, level);
        setLessons(data);
        
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

  const handleViewChange = (newView: 'home' | 'lesson') => {
      setView(newView);
      if (newView === 'home') {
          updateURL({ lesson: '', language, level, category: tag });
      }
  };

  const filteredLessons = lessons.filter(l => {
    if (tag === 'All') return true;
    return l.tags?.some(t => t.toLowerCase() === tag.toLowerCase());
  });

  return (
    <div className="min-h-screen font-sans">
      {/* Navbar - Hidden on print */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 print:hidden">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleViewChange('home')}>
                {/* <img src="https://blog.teacherjake.com/apps/assets/tj-logo.png" alt="Logo" className="h-10 w-auto" /> */}
                   <a href="https://blog.teacherjake.com" className="hover:opacity-80 transition-opacity">
                <img src="https://blog.teacherjake.com/apps/assets/tj-logo.png" alt="Teacher Jake Logo"
                    className="h-10 w-auto "></img>
            </a>
                <span className="hidden md:block font-bold text-gray-700">Worksheets</span>
            </div>
            {view === 'lesson' && (
                <div className="flex items-center gap-2">
                    <div className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full truncate max-w-[150px] md:max-w-[200px]">
                        {currentLesson?.title || currentLesson?.content.title}
                    </div>
                    <Button 
                        size="sm" 
                        variant="secondary" 
                        onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            alert('Link copied to clipboard!');
                        }}
                        className="hidden md:inline-flex"
                    >
                        Share
                    </Button>
                </div>
            )}
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {view === 'home' ? (
          <div className="max-w-3xl mx-auto print:hidden">
             <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-blue-900 mb-4 tracking-tight">Interactive Worksheets</h1>
                <p className="text-lg text-gray-600">Select a language and level to start learning.</p>
             </div>

             <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Language</label>
                        <select 
                            value={language} 
                            onChange={(e) => setLanguage(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            <option value="English">English</option>
                            <option value="Spanish">Spanish</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Level</label>
                        <select 
                            value={level} 
                            onChange={(e) => setLevel(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            <option value="A1">A1 (Beginner)</option>
                            <option value="A2">A2 (Elementary)</option>
                            <option value="B1">B1 (Intermediate)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                        <select 
                            value={tag} 
                            onChange={(e) => setTag(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            <option value="All">All Categories</option>
                            <option value="science">Science</option>
                            <option value="general">General</option>
                            <option value="video">Video</option>
                            <option value="fable">Fable</option>
                        </select>
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Select a Topic</label>
                    <div className="relative">
                        <select 
                           onChange={(e) => handleSelectLesson(e.target.value)}
                           className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white appearance-none cursor-pointer"
                           disabled={loading || lessons.length === 0}
                           defaultValue=""
                           value="" 
                        >
                            <option value="" disabled>
                                {loading ? 'Loading topics...' : (lessons.length === 0 ? 'No lessons found' : 'Choose a lesson...')}
                            </option>
                            {filteredLessons.map(l => (
                                <option key={l.id} value={l.id}>{l.title}</option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-3.5 pointer-events-none text-gray-500">
                            {loading ? <div className="animate-spin h-5 w-5 border-2 border-blue-600 rounded-full border-t-transparent"></div> : <Search size={20} />}
                        </div>
                    </div>
                    <div className="mt-2 text-right text-xs text-gray-400">
                      Showing {filteredLessons.length} of {lessons.length} lessons
                    </div>
                </div>
                
                {loadingLesson && (
                    <div className="flex justify-center items-center py-4 text-blue-600">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Loading Lesson content...
                    </div>
                )}
             </div>

             <div className="mt-12 flex justify-center text-blue-200">
                 <BookOpen size={64} opacity={0.5} />
             </div>
          </div>
        ) : (
          currentLesson && <LessonView lesson={currentLesson} onBack={() => handleViewChange('home')} />
        )}
      </main>
    </div>
  );
};

export default App;