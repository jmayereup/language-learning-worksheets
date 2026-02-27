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
  variant?: 'white' | 'green';
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
              : 'border-green-400 bg-green-500 text-white hover:bg-green-400'
          }`}
          title="Voice Settings"
        >
          <Settings2 className={`w-4 h-4 mr-1.5 ${variant === 'white' ? 'text-gray-500' : 'text-white'}`} />
        </button>
      )}

      <div className={`flex bg-white rounded-xl border shadow-sm overflow-hidden ${variant === 'white' ? 'border-gray-200' : 'border-green-400'}`}>
        <button
          onClick={onSlowToggle}
          className={`flex items-center px-1 py-1.5 text-sm font-bold transition-all border-r ${
            isSlowActive 
              ? 'bg-green-50 text-green-700' 
              : 'hover:bg-gray-50 text-gray-700'
          } ${variant === 'white' ? 'border-gray-100' : 'border-green-100'}`}
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
