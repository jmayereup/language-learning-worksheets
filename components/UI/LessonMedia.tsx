import React from 'react';

interface LessonMediaProps {
  videoUrl?: string;
  imageUrl?: string;
  isVideoLesson?: boolean;
  title?: string;
}

export const LessonMedia: React.FC<LessonMediaProps> = ({
  videoUrl,
  imageUrl,
  isVideoLesson,
  title,
}) => {
  if (!imageUrl && (!isVideoLesson || !videoUrl)) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6 mb-6 print:hidden">
      {isVideoLesson && videoUrl && (
        <div className="relative pt-[56.25%] rounded-2xl overflow-hidden bg-black shadow-lg border border-green-100 animate-fade-in group">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={videoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
            allowFullScreen
            title="Lesson video"
          />
        </div>
      )}

      {imageUrl && (
        <div className="w-full flex justify-center">
          <img
            src={imageUrl}
            alt={title || "Lesson topic"}
            className="w-full h-auto max-h-[500px] object-contain rounded-2xl shadow-lg bg-white p-4 border border-green-100 animate-fade-in"
          />
        </div>
      )}
    </div>
  );
};
