import React from 'react';
import { Settings2, Turtle, Volume2, Pause, Play } from 'lucide-react';

interface AudioControlsProps {
  onVoiceOpen?: () => void;
  onSlowToggle: () => void;
  onListenToggle: () => void;
  ttsStatus: 'playing' | 'paused' | 'stopped';
  currentRate: number;
  hasVoices?: boolean;
  className?: string;
}

export const AudioControls: React.FC<AudioControlsProps> = ({
  onVoiceOpen,
  onSlowToggle,
  onListenToggle,
  ttsStatus,
  currentRate,
  hasVoices = false,
  className = ""
}) => {
  const isSlowActive = currentRate === 0.6 && (ttsStatus === 'playing' || ttsStatus === 'paused');
  const isListenActive = currentRate === 1.0 && (ttsStatus === 'playing' || ttsStatus === 'paused');

  return (
    <div className={`flex flex-wrap items-center justify-center sm:justify-start gap-2 ${className}`}>


      {hasVoices && onVoiceOpen && (
        <button
          onClick={onVoiceOpen}
          className="flex items-center px-3 py-1.5 text-sm font-bold border border-gray-200 rounded-xl shadow-sm hover:border-green-300 hover:bg-green-50 hover:text-green-600 transition-all bg-white text-gray-700"
          title="Voice Settings"
        >
          <Settings2 className="w-4 h-4 mr-1.5 text-gray-500" />
        </button>
      )}

      <div className="flex bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <button
          onClick={onSlowToggle}
          className={`flex items-center px-1 py-1.5 text-sm font-bold transition-all border-r border-gray-100 ${
            isSlowActive 
              ? 'bg-green-50 text-green-700' 
              : 'hover:bg-gray-50 text-gray-700'
          }`}
          title="Slow Speed"
        >
          {isSlowActive && ttsStatus === 'playing' ? (
            <Pause className="w-4 h-4 mr-1.5" />
          ) : isSlowActive && ttsStatus === 'paused' ? (
            <Play className="w-4 h-4 mr-1.5" />
          ) : (
            <Turtle className="w-4 h-4 mr-0 text-gray-500" />
          )}

        </button>

        <button
          onClick={onListenToggle}
          className={`flex items-center px-1 py-1.5 text-sm font-bold transition-all ${
            isListenActive 
              ? 'bg-green-50 text-green-700' 
              : 'hover:bg-gray-50 text-gray-700'
          }`}
          title="Normal Speed"
        >
          {isListenActive && ttsStatus === 'playing' ? (
            <Pause className="w-4 h-4 mr-1.5" />
          ) : isListenActive && ttsStatus === 'paused' ? (
            <Play className="w-4 h-4 mr-1.5" />
          ) : (
            <Volume2 className="w-4 h-4 mr-1 text-gray-500" />
          )}
        </button>
      </div>
    </div>
  );
};
