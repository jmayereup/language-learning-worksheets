export const normalizeString = (str: string): string => {
  if (!str) return '';
  return str.trim().toLowerCase().replace(/[.!,?]/g, '');
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
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = getLangCode(language);
  utterance.rate = rate;
  window.speechSynthesis.speak(utterance);
};
