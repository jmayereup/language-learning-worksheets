import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
    fetchLessons, 
    fetchLessonById, 
    fetchAllLessons, 
    fetchPaginatedLessons,
    createLesson, 
    updateLesson, 
    deleteLesson 
} from '../services/pocketbase';
import { triggerRebuild } from '../services/deploy';

export const lessonKeys = {
    all: ['lessons'] as const,
    lists: () => [...lessonKeys.all, 'list'] as const,
    list: (language: string, level: string) => [...lessonKeys.lists(), { language, level }] as const,
    adminLists: () => [...lessonKeys.all, 'admin-list'] as const,
    adminList: (creatorId?: string) => [...lessonKeys.adminLists(), { creatorId }] as const,
    adminPaginatedList: (page: number, perPage: number, searchQuery: string, creatorId?: string, language?: string, lessonType?: string) => 
        [...lessonKeys.adminLists(), { page, perPage, searchQuery, creatorId, language, lessonType }] as const,
    details: () => [...lessonKeys.all, 'detail'] as const,
    detail: (id: string) => [...lessonKeys.details(), id] as const,
};

export const useLessons = (language: string, level: string) => {
    return useQuery({
        queryKey: lessonKeys.list(language, level),
        queryFn: () => fetchLessons(language, level),
    });
};

export const useAllLessons = (creatorId?: string) => {
    return useQuery({
        queryKey: lessonKeys.adminList(creatorId),
        queryFn: () => fetchAllLessons(creatorId),
    });
};

export const usePaginatedLessons = (page: number, perPage: number, searchQuery: string = '', creatorId?: string, language?: string, lessonType?: string) => {
    return useQuery({
        queryKey: lessonKeys.adminPaginatedList(page, perPage, searchQuery, creatorId, language, lessonType),
        queryFn: () => fetchPaginatedLessons(page, perPage, searchQuery, creatorId, language, lessonType),
    });
};

export const useLesson = (id: string | null) => {
    return useQuery({
        queryKey: lessonKeys.detail(id || ''),
        queryFn: () => fetchLessonById(id!),
        enabled: !!id,
    });
};

export const useCreateLesson = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createLesson,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: lessonKeys.all });
            triggerRebuild();
        },
    });
};

export const useUpdateLesson = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => updateLesson(id, data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: lessonKeys.all });
            // Also update the individual lesson cache
            queryClient.invalidateQueries({ queryKey: lessonKeys.detail(variables.id) });
            triggerRebuild();
        },
    });
};

export const useDeleteLesson = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteLesson,
        onSuccess: (data, id) => {
            queryClient.invalidateQueries({ queryKey: lessonKeys.all });
            queryClient.removeQueries({ queryKey: lessonKeys.detail(id) });
            triggerRebuild();
        },
    });
};
