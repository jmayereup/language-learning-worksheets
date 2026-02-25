import React, { useState, useEffect } from 'react';
import { fetchAllLessons, deleteLesson, getCurrentUser } from '../../services/pocketbase';
import { triggerRebuild } from '../../services/deploy';
import { Button } from '../UI/Button';
import { Edit, Trash2, ExternalLink, RefreshCw, Layers, Globe, Calendar } from 'lucide-react';

interface LessonListProps {
    onEdit: (id: string) => void;
}

export const LessonList: React.FC<LessonListProps> = ({ onEdit }) => {
    const [lessons, setLessons] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const currentUser = getCurrentUser();

    const loadLessons = async () => {
        setLoading(true);
        try {
            const data = await fetchAllLessons();
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

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
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
                        {lessons.map((lesson) => (
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
                                <td className="px-6 py-5 text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            onClick={() => window.open(`/?lesson=${lesson.id}`, '_blank')}
                                            title="View Worksheet"
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
                                                    className="h-9 px-3 gap-2"
                                                >
                                                    <Edit className="w-4 h-4" /> Edit
                                                </Button>
                                                <Button 
                                                    variant="danger" 
                                                    size="sm" 
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
            {lessons.length === 0 && (
                <div className="p-12 text-center text-gray-500">
                    No worksheets found in the registry.
                </div>
            )}
        </div>
    );
};
