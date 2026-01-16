
export const getBestVoice = (lang: string): SpeechSynthesisVoice | null => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return null;
    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) return null;

    const langPrefix = lang.split(/[-_]/)[0].toLowerCase();

    // 1. Filter by language (exact match or prefix)
    let langVoices = voices.filter(v => v.lang.toLowerCase() === lang.toLowerCase());
    if (langVoices.length === 0) {
        langVoices = voices.filter(v => v.lang.split(/[-_]/)[0].toLowerCase() === langPrefix);
    }

    if (langVoices.length === 0) return null;

    // 2. Priority list for high-quality voices
    // Priority: "natural" (Edge), "google" (Chrome), "premium"/"siri" (iOS/macOS)
    const priorities = ["natural", "google", "premium", "siri"];
    for (const p of priorities) {
        const found = langVoices.find(v => v.name.toLowerCase().includes(p));
        if (found) return found;
    }

    // 3. Fallback to first non-robotic voice if possible
    // On Windows, "Microsoft" usually means the older robotic ones unless it's "Natural" (caught above)
    const nonRobotic = langVoices.find(v => !v.name.toLowerCase().includes("microsoft"));
    return nonRobotic || langVoices[0];
};

export const getVoicesForLang = (lang: string): SpeechSynthesisVoice[] => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return [];
    const voices = window.speechSynthesis.getVoices();
    const langPrefix = lang.split(/[-_]/)[0].toLowerCase();

    return voices.filter(v =>
        v.lang.toLowerCase() === lang.toLowerCase() ||
        v.lang.split(/[-_]/)[0].toLowerCase() === langPrefix
    ).sort((a, b) => a.name.localeCompare(b.name));
};

export const speak = (text: string, lang: string, rate: number = 1.0, voiceName?: string | null) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();

    if (voiceName) {
        const selectedVoice = voices.find(v => v.name === voiceName);
        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }
    }

    if (!utterance.voice) {
        const bestVoice = getBestVoice(lang);
        if (bestVoice) {
            utterance.voice = bestVoice;
        }
    }

    utterance.lang = lang; // Always set lang

    utterance.rate = rate;
    window.speechSynthesis.speak(utterance);
    return utterance;
};
