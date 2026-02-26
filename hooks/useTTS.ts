import { useState, useEffect, useRef, useCallback } from 'react';
import { getLangCode } from '../utils/textUtils';
import { getVoicesForLang, getBestVoice } from '../utils/tts';

interface UseTTSProps {
  language: string;
  audioFileUrl?: string;
  defaultAudioPreference?: 'recorded' | 'tts';
  onStartCallback?: () => void;
  defaultReadingText?: string;
}

export const useTTS = ({ 
  language, 
  audioFileUrl, 
  defaultAudioPreference = 'tts',
  onStartCallback,
  defaultReadingText
}: UseTTSProps) => {
  const [ttsState, setTtsState] = useState<{ status: 'playing' | 'paused' | 'stopped', rate: number }>({ 
    status: 'stopped', 
    rate: 1.0 
  });
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string | null>(null);
  const [audioPreference, setAudioPreference] = useState<'recorded' | 'tts'>(
    audioFileUrl ? (defaultAudioPreference || 'recorded') : 'tts'
  );
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const userHasSelectedVoice = useRef(false);
  const activeContentRef = useRef<string | null>(null);

  // Initialize and update voices
  useEffect(() => {
    const updateVoices = () => {
      const langCode = getLangCode(language);
      const voices = getVoicesForLang(langCode);
      setAvailableVoices(voices);

      if (!userHasSelectedVoice.current) {
        const best = getBestVoice(langCode);
        if (best) setSelectedVoiceName(best.name);
      }
    };

    updateVoices();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = updateVoices;
      }
    }

    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
          window.speechSynthesis.onvoiceschanged = null;
        }
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [language]);

  const playTTS = useCallback((rate: number, text: string) => {
    const synth = window.speechSynthesis;

    // If clicking the active button (same text and same rate)
    if (ttsState.rate === rate && ttsState.status !== 'stopped' && activeContentRef.current === text) {
      if (ttsState.status === 'playing') {
        synth.pause();
        setTtsState(prev => ({ ...prev, status: 'paused' }));
      } else {
        synth.resume();
        setTtsState(prev => ({ ...prev, status: 'playing' }));
      }
      return;
    }

    // New start or changing rate/content
    activeContentRef.current = text;
    synth.cancel();
    if (audioRef.current) {
      audioRef.current.pause();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const langCode = getLangCode(language);
    utterance.lang = langCode;
    utterance.rate = rate;

    if (selectedVoiceName) {
      const voices = synth.getVoices();
      const voice = voices.find(v => v.name === selectedVoiceName);
      if (voice) utterance.voice = voice;
    }

    utterance.onend = () => {
      setTtsState(prev => ({ ...prev, status: 'stopped' }));
    };

    synth.speak(utterance);
    setTtsState({ status: 'playing', rate });

    if (onStartCallback) onStartCallback();
  }, [language, selectedVoiceName, ttsState, onStartCallback]);

  const toggleTTS = useCallback((rate: number, overrideText?: string) => {
    const synth = window.speechSynthesis;

    // Use audio file if available and preferred, but ONLY if no override text is provided
    if (!overrideText && audioFileUrl && audioPreference === 'recorded') {
      if (!audioRef.current) {
        audioRef.current = new Audio(audioFileUrl);
        audioRef.current.onended = () => {
          setTtsState(prev => ({ ...prev, status: 'stopped' }));
        };
      }

      const audio = audioRef.current;

      // If clicking the active button (same source and same rate)
      if (ttsState.rate === rate && ttsState.status !== 'stopped' && activeContentRef.current === audioFileUrl) {
        if (ttsState.status === 'playing') {
          audio.pause();
          setTtsState(prev => ({ ...prev, status: 'paused' }));
        } else {
          audio.play();
          setTtsState(prev => ({ ...prev, status: 'playing' }));
        }
        return;
      }

      // New start or changing rate/content
      activeContentRef.current = audioFileUrl;
      synth.cancel(); 
      audio.pause();
      audio.currentTime = 0;
      audio.playbackRate = rate;

      audio.play()
        .then(() => {
          setTtsState({ status: 'playing', rate });
        })
        .catch(e => {
          console.error("Audio playback failed, falling back to TTS:", e);
          setAudioPreference('tts');
          // If fallback occurs, we need text. The caller should provide a sensible default if they want TTS fallback.
        });

      if (onStartCallback) onStartCallback();
      return;
    }

    // Default to TTS if not recorded or if override provided
    const textToSpeak = overrideText || defaultReadingText || ""; 
    if (textToSpeak) {
        playTTS(rate, textToSpeak);
    }
  }, [audioFileUrl, audioPreference, ttsState, onStartCallback, playTTS, defaultReadingText]);

  const handleSetSelectedVoiceName = useCallback((name: string | null) => {
    userHasSelectedVoice.current = true;
    setSelectedVoiceName(name);
  }, []);

  const handleSetAudioPreference = useCallback((pref: 'recorded' | 'tts') => {
    userHasSelectedVoice.current = true;
    setAudioPreference(pref);
    if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
    if (audioRef.current) audioRef.current.pause();
    setTtsState(prev => ({ ...prev, status: 'stopped' }));
  }, []);

  return {
    ttsState,
    availableVoices,
    selectedVoiceName,
    setSelectedVoiceName: handleSetSelectedVoiceName,
    audioPreference,
    setAudioPreference: handleSetAudioPreference,
    toggleTTS
  };
};
