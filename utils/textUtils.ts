import { speak } from './tts';

export const normalizeString = (str: string): string => {
  if (!str) return '';
  // Remove all punctuation and normalize whitespace (mobile browsers can add extra spaces)
  // Included smart quotes (curly quotes) which are common on iOS
  return str.trim().toLowerCase().replace(/[.!,?;:"'()\[\]{}‘’“”]/g, '').replace(/\s+/g, ' ').trim();
};

export const shuffleArray = <T,>(array: T[]): T[] => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export const seededShuffle = <T,>(array: T[], seed: string): T[] => {
  if (!seed) return shuffleArray(array);
  
  const arr = [...array];
  
  // Simple consistent string hash (FNV-1a variant)
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  }

  // SplitMix32 PRNG
  const random = () => {
    h = (h + 0x9E3779B9) | 0;
    let t = h ^ (h >>> 16);
    t = Math.imul(t, 0x21F0AAAD);
    t = t ^ (t >>> 15);
    t = Math.imul(t, 0x735A2D97);
    t = t ^ (t >>> 15);
    return (t >>> 0) / 4294967296;
  };

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    if (i !== j) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  return arr;
};

export const getLangCode = (langName: string): string => {
  if (!langName) return "en-US";
  const normalized = langName.toLowerCase().trim();
  const map: Record<string, string> = {
    "english": "en-US",
    "french": "fr-FR",
    "spanish": "es-ES",
    "german": "de-DE",
    "thai": "th-TH"
  };
  return map[normalized] || "en-US";
};

export const speakText = (text: string, language: string, rate: number = 1.0, voiceName?: string | null) => {
  const langCode = getLangCode(language);
  speak(text, langCode, rate, voiceName);
};

export const shouldShowAudioControls = (): boolean => {
  const ua = navigator.userAgent.toLowerCase();

  // 1. Block known in-app browsers and WebViews
  if (ua.includes("wv") || ua.includes("webview") ||
    ua.includes("instagram") || ua.includes("facebook") ||
    ua.includes("messenger") || ua.includes("fb_iab") ||
    ua.includes("fban") || ua.includes("fbav") ||
    ua.includes("line")) {
    return false;
  }

  return true;
};

export const getAndroidIntentLink = (lessonId?: string): string => {
  const isAndroid = /android/i.test(navigator.userAgent);
  if (!isAndroid) return '';

  const url = new URL(window.location.href);
  if (lessonId) {
    url.searchParams.set('lesson', lessonId);
  }

  const urlString = url.toString();
  const urlNoScheme = urlString.replace(/^https?:\/\//, '');
  const scheme = window.location.protocol.replace(':', '');

  return `intent://${urlNoScheme}#Intent;scheme=${scheme};package=com.android.chrome;end`;
};

export const selectElementText = (element: HTMLElement | null) => {
  if (!element) return;
  const selection = window.getSelection();
  const range = document.createRange();
  range.selectNodeContents(element);
  selection?.removeAllRanges();
  selection?.addRange(range);
};
