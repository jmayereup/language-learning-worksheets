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
  variant?: 'white' | 'green' | 'dark';
}

export const AudioControls: React.FC<AudioControlsProps> = ({
  onVoiceOpen,
  onSlowToggle,
  onListenToggle,
  ttsStatus,
  currentRate,
  hasVoices = false,
  className = "",
  variant = "white"
}) => {
  const isSlowActive = currentRate === 0.6 && (ttsStatus === 'playing' || ttsStatus === 'paused');
  const isListenActive = currentRate === 1.0 && (ttsStatus === 'playing' || ttsStatus === 'paused');

  return (
    <div className={`flex flex-wrap items-center justify-center sm:justify-start gap-2 ${className}`}>


      {hasVoices && onVoiceOpen && (
        <button
          onClick={onVoiceOpen}
          className={`flex items-center px-3 py-1.5 text-sm font-bold border rounded-xl shadow-sm transition-all ${
            variant === 'white' 
              ? 'border-gray-200 bg-white text-gray-700 hover:border-green-300 hover:bg-green-50 hover:text-green-600' 
              : variant === 'green'
              ? 'border-green-400 bg-green-500 text-white hover:bg-green-400'
              : 'border-gray-600 bg-gray-800 text-gray-300 hover:border-gray-500 hover:bg-gray-700 hover:text-white'
          }`}
          title="Voice Settings"
        >
          <Settings2 className={`w-4 h-4 mr-1.5 ${variant === 'white' ? 'text-gray-500' : variant === 'green' ? 'text-white' : 'text-gray-400'}`} />
        </button>
      )}

      <div className={`flex rounded-xl border shadow-sm overflow-hidden ${variant === 'white' ? 'border-gray-200 bg-white' : variant === 'green' ? 'border-green-400 bg-white' : 'border-gray-600 bg-gray-800'}`}>
        <button
          onClick={onSlowToggle}
          className={`flex items-center px-2 py-1.5 text-sm font-bold transition-all border-r ${
            isSlowActive 
              ? (variant === 'dark' ? 'bg-gray-700 text-white' : 'bg-green-50 text-green-700') 
              : (variant === 'dark' ? 'hover:bg-gray-700 text-gray-300 hover:text-white' : 'hover:bg-gray-50 text-gray-700')
          } ${variant === 'white' ? 'border-gray-100' : variant === 'green' ? 'border-green-100' : 'border-gray-600'}`}
          title="Slow Speed"
        >
          {isSlowActive && ttsStatus === 'playing' ? (
            <Pause className="w-4 h-4 mr-1.5" />
          ) : isSlowActive && ttsStatus === 'paused' ? (
            <Play className="w-4 h-4 mr-1.5" />
          ) : (
            <Turtle className={`w-4 h-4 mr-0 ${variant === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
          )}

        </button>

        <button
          onClick={onListenToggle}
          className={`flex items-center px-2 py-1.5 text-sm font-bold transition-all ${
            isListenActive 
              ? (variant === 'dark' ? 'bg-gray-700 text-white' : 'bg-green-50 text-green-700') 
              : (variant === 'dark' ? 'hover:bg-gray-700 text-gray-300 hover:text-white' : 'hover:bg-gray-50 text-gray-700')
          }`}
          title="Normal Speed"
        >
          {isListenActive && ttsStatus === 'playing' ? (
            <Pause className="w-4 h-4 mr-1.5" />
          ) : isListenActive && ttsStatus === 'paused' ? (
            <Play className="w-4 h-4 mr-1.5" />
          ) : (
            <Volume2 className={`w-4 h-4 mr-1 ${variant === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
          )}
        </button>
      </div>
    </div>
  );
};
