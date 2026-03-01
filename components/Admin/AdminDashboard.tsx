import React, { useState } from 'react';
import { LoginForm } from './LoginForm';
import { LessonList } from './LessonList';
import { LessonEditor } from './LessonEditor';
import { isAuthenticated, logout } from '../../services/pocketbase';
import { Button } from '../UI/Button';
import { LayoutDashboard, LogOut, ArrowLeft, Plus } from 'lucide-react';

interface AdminDashboardProps {
    onBack: () => void;
    onPreview: (lesson: any) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack, onPreview }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());
    const [adminView, setAdminView] = useState<'list' | 'add' | 'edit'>('list');
    const [editingLessonId, setEditingLessonId] = useState<string | null>(null);

    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        logout();
        setIsLoggedIn(false);
    };

    const handleEditLesson = (id: string) => {
        setEditingLessonId(id);
        setAdminView('edit');
    };

    const handleAddNew = () => {
        setEditingLessonId(null);
        setAdminView('add');
    };

    const handleBackToList = () => {
        setEditingLessonId(null);
        setAdminView('list');
    };

    if (!isLoggedIn) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Button variant="outline" onClick={onBack} className="mb-8 items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back to Lessons
                </Button>
                <LoginForm onLoginSuccess={handleLoginSuccess} />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                    <div className="bg-green-100 p-3 rounded-xl">
                        <LayoutDashboard className="w-8 h-8 text-green-700" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Admin Dashboard</h1>
                        <p className="text-gray-500 text-sm font-medium">Manage your interactive worksheets</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={onBack} className="items-center gap-2">
                        <ArrowLeft className="w-4 h-4" /> Exit Admin
                    </Button>
                    <Button variant="danger" onClick={handleLogout} className="items-center gap-2">
                        <LogOut className="w-4 h-4" /> Logout
                    </Button>
                </div>
            </header>

            <main>
                {adminView === 'list' && (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-800">All Worksheets</h2>
                            <Button onClick={handleAddNew} className="items-center gap-2 px-6">
                                <Plus className="w-5 h-5" /> Add New Worksheet
                            </Button>
                        </div>
                        <LessonList onEdit={handleEditLesson} onPreview={onPreview} />
                    </>
                )}

                {(adminView === 'add' || adminView === 'edit') && (
                    <LessonEditor 
                        lessonId={editingLessonId} 
                        onSave={handleBackToList} 
                        onCancel={handleBackToList} 
                        onPreview={onPreview}
                    />
                )}
            </main>
        </div>
    );
};
