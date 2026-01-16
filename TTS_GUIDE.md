# Web Speech API: Voice Selection Guide

This guide explains how to implement a robust Text-to-Speech (TTS) system with a "Best Voice" fallback and a user-selectable dropdown, optimized for language learners.

## 1. Core Logic (Utility)
Create a utility to handle voice filtering and the priority list. Priorities include "Natural" (Edge), "Google" (Chrome), and "Premium/Siri" (Apple).

```typescript
export const getBestVoice = (lang: string): SpeechSynthesisVoice | null => {
  const voices = window.speechSynthesis.getVoices();
  const langPrefix = lang.split(/[-_]/)[0].toLowerCase();
  
  // 1. Filter by language (exact match or prefix)
  let langVoices = voices.filter(v => 
    v.lang.toLowerCase() === lang.toLowerCase() || 
    v.lang.split(/[-_]/)[0].toLowerCase() === langPrefix
  );

  if (langVoices.length === 0) return null;

  // 2. Priority list for high-quality voices
  const priorities = ["natural", "google", "premium", "siri"];
  for (const p of priorities) {
    const found = langVoices.find(v => v.name.toLowerCase().includes(p));
    if (found) return found;
  }

  // 3. Fallback to first non-robotic voice
  const nonRobotic = langVoices.find(v => !v.name.toLowerCase().includes("microsoft"));
  return nonRobotic || langVoices[0];
};
```

## 2. React Integration
Use `useEffect` to manage the `onvoiceschanged` event and track the selected voice.

```tsx
const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
const [selectedVoiceName, setSelectedVoiceName] = useState<string | null>(null);

useEffect(() => {
  const updateVoices = () => {
    const langCode = "en-US"; // Your target language
    const voices = getVoicesForLang(langCode);
    setAvailableVoices(voices);

    if (!selectedVoiceName) {
      const best = getBestVoice(langCode);
      if (best) setSelectedVoiceName(best.name);
    }
  };

  updateVoices();
  window.speechSynthesis.onvoiceschanged = updateVoices;
  return () => { window.speechSynthesis.onvoiceschanged = null; };
}, []);
```

## 3. Playback Controls
Apply the selected voice to the `SpeechSynthesisUtterance`.

```javascript
const speak = (text, lang, voiceName) => {
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const voice = window.speechSynthesis.getVoices().find(v => v.name === voiceName);
  
  if (voice) {
    utterance.voice = voice;
  } else {
    utterance.lang = lang;
  }

  utterance.rate = 0.7; // Slower speed for learners
  window.speechSynthesis.speak(utterance);
};
```

## 4. UI: Voice Selector
A clean dropdown to let users choose their preferred voice.

```tsx
<div className="relative inline-block">
  <select
    value={selectedVoiceName}
    onChange={(e) => setSelectedVoiceName(e.target.value)}
    className="appearance-none bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-medium cursor-pointer shadow-sm"
  >
    {availableVoices.map(voice => (
      <option key={voice.name} value={voice.name}>
        {voice.name} {voice.name.toLowerCase().includes('natural') ? '✨' : ''}
      </option>
    ))}
  </select>
</div>
```

## 5. Performance Tips
- **Pre-fill**: Call `getVoices()` once on load even if the event hasn't fired.
- **Cancel**: Always call `speechSynthesis.cancel()` before starting new speech to prevent overlapping and buffering issues common in Chrome.
- **Cleanup**: Ensure `onvoiceschanged` is set to `null` on unmount to avoid memory leaks.
