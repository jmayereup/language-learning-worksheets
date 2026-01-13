export const normalizeString = (str: string): string => {
  if (!str) return '';
  // Remove all punctuation and normalize whitespace (mobile browsers can add extra spaces)
  return str.trim().toLowerCase().replace(/[.!,?;:"'()\[\]{}]/g, '').replace(/\s+/g, ' ').trim();
};

export const shuffleArray = <T,>(array: T[]): T[] => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export const getLangCode = (langName: string): string => {
  const map: Record<string, string> = {
    "English": "en-US",
    "French": "fr-FR",
    "Spanish": "es-ES",
    "German": "de-DE"
  };
  return map[langName] || "en-US";
};

export const speakText = (text: string, language: string, rate: number = 1.0) => {
  if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = getLangCode(language);
  utterance.rate = rate;
  window.speechSynthesis.speak(utterance);
};

export const shouldShowAudioControls = (): boolean => {
  const ua = navigator.userAgent.toLowerCase();
  
  // 1. Block known in-app browsers and WebViews
  if (ua.includes("wv") || ua.includes("webview") || 
      ua.includes("instagram") || ua.includes("facebook") || 
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
