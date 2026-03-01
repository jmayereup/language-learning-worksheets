import React, { useState, useEffect } from 'react';
import { fetchAllLessons, deleteLesson, getCurrentUser } from '../../services/pocketbase';
import { triggerRebuild } from '../../services/deploy';
import { Button } from '../UI/Button';
import { Edit, Trash2, ExternalLink, RefreshCw, Layers, Globe, Calendar, Eye, Search } from 'lucide-react';

interface LessonListProps {
    onEdit: (id: string) => void;
    onPreview: (lesson: any) => void;
}

export const LessonList: React.FC<LessonListProps> = ({ onEdit, onPreview }) => {
    const [lessons, setLessons] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const currentUser = getCurrentUser();

    const loadLessons = async () => {
        setLoading(true);
        try {
            const data = await fetchAllLessons(currentUser?.id);
            setLessons(data);
        } catch (err) {
            setError('Failed to load lessons');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadLessons();
    }, []);

    const handleDelete = async (id: string, title: string) => {
        if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
            try {
                await deleteLesson(id);
                setLessons(lessons.filter(l => l.id !== id));
                
                // Trigger Cloudflare rebuild
                triggerRebuild();
            } catch (err) {
                alert('Failed to delete lesson');
            }
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <RefreshCw className="w-10 h-10 text-green-600 animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Fetching lessons registry...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 bg-red-50 border border-red-100 rounded-2xl text-center">
                <p className="text-red-600 font-bold mb-4">{error}</p>
                <Button onClick={loadLessons} variant="outline">Try Again</Button>
            </div>
        );
    }

    const filteredLessons = lessons.filter(lesson => 
        lesson.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-4">
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                </div>
                <input
                    type="text"
                    placeholder="Search worksheets by title..."
                    className="block w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all shadow-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Desktop view: Table */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">Worksheet</th>
                            <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">Details</th>
                            <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">Created</th>
                            <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredLessons.map((lesson) => (
                            <tr key={lesson.id} className="hover:bg-green-50/30 transition-colors group">
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                                            {lesson.imageUrl ? (
                                                <img src={lesson.imageUrl} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    <RefreshCw className="w-4 h-4 opacity-20" />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-extrabold text-gray-900 group-hover:text-green-700 transition-colors line-clamp-1">
                                                {lesson.title}
                                            </div>
                                            <div className="text-[10px] font-mono text-gray-400 mt-0.5">ID: {lesson.id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex flex-wrap gap-2">
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-black border border-blue-100 uppercase">
                                            <Globe className="w-3 h-3" /> {lesson.language}
                                        </span>
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 text-[10px] font-black border border-purple-100 uppercase">
                                            <Layers className="w-3 h-3" /> {lesson.level}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {new Date(lesson.created).toLocaleDateString()}
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-right whitespace-nowrap">
                                    <div className="flex justify-end gap-2">
                                        <Button 
                                            variant="outline" 
                                            size="icon" 
                                            onClick={() => onPreview(lesson)}
                                            title="Preview Worksheet"
                                            className="p-0 h-9 w-9 text-green-600 border-green-200 hover:bg-green-50"
                                        >
                                            <Eye className="w-4 h-4 p-0" /> 
                                        </Button>
                                        <Button 
                                            variant="outline" 
                                            size="icon" 
                                            onClick={() => window.open(`/?lesson=${lesson.id}`, '_blank')}
                                            title="View Public Worksheet"
                                            className="p-2 h-9 w-9"
                                        >
                                            <ExternalLink className="w-4 h-4" /> 
                                        </Button>
                                        {lesson.creatorId === currentUser?.id && (
                                            <>
                                                <Button 
                                                    variant="secondary" 
                                                    size="sm" 
                                                    onClick={() => onEdit(lesson.id)}
                                                    title="Edit Worksheet"
                                                    className="h-9 gap-2"
                                                >
                                                    <Edit className="w-4 h-4" /> Edit
                                                </Button>
                                                <Button 
                                                    variant="danger" 
                                                    size="icon" 
                                                    onClick={() => handleDelete(lesson.id, lesson.title)}
                                                    title="Delete Worksheet"
                                                    className="p-2 h-9 w-9"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>

                {/* Mobile view: Cards */}
                <div className="md:hidden divide-y divide-gray-100">
                    {filteredLessons.map((lesson) => (
                        <div key={lesson.id} className="p-4 space-y-4 hover:bg-green-50/20 transition-colors">
                            <div className="flex items-start gap-3">
                                <div className="w-20 h-14 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-200 shadow-sm">
                                    {lesson.imageUrl ? (
                                        <img src={lesson.imageUrl} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <RefreshCw className="w-5 h-5 opacity-20" />
                                        </div>
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="font-extrabold text-gray-900 leading-snug line-clamp-2">
                                        {lesson.title}
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 text-[9px] font-black border border-blue-100 uppercase">
                                            <Globe className="w-2.5 h-2.5" /> {lesson.language}
                                        </span>
                                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 text-[9px] font-black border border-purple-100 uppercase">
                                            <Layers className="w-2.5 h-2.5" /> {lesson.level}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between pt-2">
                                <div className="text-[10px] font-mono text-gray-400">ID: {lesson.id}</div>
                                <div className="flex items-center gap-1 text-gray-500 text-[10px] font-medium">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(lesson.created).toLocaleDateString()}
                                </div>
                            </div>

                            <div className="grid grid-cols-4 gap-2 pt-2">
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => onPreview(lesson)}
                                    className="flex flex-col items-center justify-center h-auto py-2 px-1 text-green-600 border-green-200 gap-1"
                                >
                                    <Eye className="w-4 h-4" />
                                    <span className="text-[9px] font-black uppercase tracking-tighter">Preview</span>
                                </Button>
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => window.open(`/?lesson=${lesson.id}`, '_blank')}
                                    className="flex flex-col items-center justify-center h-auto py-2 px-1 gap-1"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    <span className="text-[9px] font-black uppercase tracking-tighter">Public</span>
                                </Button>
                                {lesson.creatorId === currentUser?.id && (
                                    <>
                                        <Button 
                                            variant="secondary" 
                                            size="sm" 
                                            onClick={() => onEdit(lesson.id)}
                                            className="flex flex-col items-center justify-center h-auto py-2 px-1 gap-1"
                                        >
                                            <Edit className="w-4 h-4" />
                                            <span className="text-[9px] font-black uppercase tracking-tighter">Edit</span>
                                        </Button>
                                        <Button 
                                            variant="danger" 
                                            size="sm" 
                                            onClick={() => handleDelete(lesson.id, lesson.title)}
                                            className="flex flex-col items-center justify-center h-auto py-2 px-1 gap-1"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            <span className="text-[9px] font-black uppercase tracking-tighter">Delete</span>
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {filteredLessons.length === 0 && (
                <div className="p-12 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-50 mb-3">
                        <Search className="w-6 h-6 text-gray-300" />
                    </div>
                    <p className="text-gray-500 font-medium">
                        {searchQuery ? `No worksheets matching "${searchQuery}"` : 'No worksheets found in the registry.'}
                    </p>
                </div>
            )}
        </div>
    );
};
