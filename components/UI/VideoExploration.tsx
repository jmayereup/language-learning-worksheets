import React from 'react';
import { Video } from 'lucide-react';

interface VideoExplorationProps {
  videoUrl?: string;
  isVideoLesson?: boolean;
}

export const VideoExploration: React.FC<VideoExplorationProps> = ({ videoUrl, isVideoLesson }) => {
  if (isVideoLesson || !videoUrl) return null;

  return (
    <section className="bg-white p-6 rounded-xl shadow-sm border border-green-50 mb-8 max-w-4xl mx-auto text-center animate-fade-in print:hidden">
      <div className="inline-flex items-center justify-center w-12 h-12 not-visited:rounded-full mb-4">
        <Video className="w-6 h-6 text-green-600" />
      </div>
      <h2 className="text-2xl font-bold text-green-900 mb-2">Explore Further</h2>
      <p className="text-gray-600 mb-6 text-lg">
        Want to learn more about this topic? Watch this video to dive deeper!
      </p>
      <a
        href={videoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-green-50 text-white px-8 py-3 rounded-full font-bold hover:bg-green-700 transform hover:scale-105 transition-all shadow-md"
      >
        Watch Video on YouTube
      </a>
    </section>
  );
};
