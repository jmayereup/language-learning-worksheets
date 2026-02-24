import React, { useState, useMemo, useEffect } from 'react';
import { ParsedLesson, UserAnswers } from '../../types';
import { speakText, shuffleArray, getLangCode, shouldShowAudioControls, getAndroidIntentLink, normalizeString } from '../../utils/textUtils';
import { Button } from '../UI/Button';
import { Vocabulary } from '../Activities/Vocabulary';
import { FillInBlanks } from '../Activities/FillInBlanks';
import { Comprehension } from '../Activities/Comprehension';
import { Scrambled } from '../Activities/Scrambled';
import { Volume2, Turtle, Printer, RotateCcw, Eye, EyeOff, Languages, Pause, Play, ChevronDown, Video } from 'lucide-react';
import confetti from 'canvas-confetti';
import { getVoicesForLang, getBestVoice } from '../../utils/tts';
import { selectElementText } from '../../utils/textUtils';
import { VoiceSelectorModal } from '../UI/VoiceSelectorModal';
import { Mic, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { config } from '../../config';

interface Props {
  lesson: ParsedLesson;
}

const ScorePill = ({ label, score, total }: { label: string, score: number, total: number }) => (
  <div className="bg-white border border-gray-200 rounded p-2 flex justify-between items-center shadow-sm">
    <span className="text-xs text-gray-600 font-medium truncate mr-2">{label}</span>
    <span className={`text-sm font-bold ${score === total ? 'text-green-600' : 'text-green-600'}`}>
      {score}/{total}
    </span>
  </div>
);

interface CompletionStates {
  vocabularyChecked: boolean;
  fillBlanksChecked: boolean;
  comprehensionCompleted: boolean;
  scrambledCompleted: boolean;
}

const defaultAnswers: UserAnswers = {
  vocabulary: {},
  fillBlanks: {},
  comprehension: {},
  scrambled: {},
  writing: {}
};

const defaultCompletionStates: CompletionStates = {
  vocabularyChecked: false,
  fillBlanksChecked: false,
  comprehensionCompleted: false,
  scrambledCompleted: false,
};

export const LessonView: React.FC<Props> = ({ lesson }) => {
  const STORAGE_KEY = `lesson-progress-${lesson.id}`;

  const getInitialAnswers = (): UserAnswers => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.answers ?? defaultAnswers;
      }
    } catch (e) {
      console.warn('Failed to read saved answers:', e);
    }
    return defaultAnswers;
  };

  const getInitialValue = (key: string, defaultValue: string = ''): string => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed[key] ?? defaultValue;
      }
    } catch (e) { /* ignore */ }
    return defaultValue;
  };

  const getInitialCompletionStates = (): CompletionStates => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.completionStates ?? defaultCompletionStates;
      }
    } catch (e) { /* ignore */ }
    return defaultCompletionStates;
  };

  const [answers, setAnswers] = useState<UserAnswers>(getInitialAnswers);
  const [completionStates, setCompletionStates] = useState<CompletionStates>(getInitialCompletionStates);

  const [showResults, setShowResults] = useState(false);
  const [studentName, setStudentName] = useState(() => getInitialValue('studentName'));
  const [studentId, setStudentId] = useState(() => getInitialValue('studentId'));
  const [homeroom, setHomeroom] = useState(() => getInitialValue('homeroom'));
  
  const [isNameLocked, setIsNameLocked] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  const [finishTime, setFinishTime] = useState<string>('');
  const passageRef = React.useRef<HTMLDivElement>(null);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const userHasSelectedVoice = React.useRef(false);

  // TTS State
  const [ttsState, setTtsState] = useState<{ status: 'playing' | 'paused' | 'stopped', rate: number }>({ status: 'stopped', rate: 1.0 });
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [audioPreference, setAudioPreference] = useState<'recorded' | 'tts'>(lesson.audioFileUrl ? 'recorded' : 'tts');

  // Submission State
  const [teacherCode, setTeacherCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submissionMessage, setSubmissionMessage] = useState('');

  const displayTitle = lesson.title || lesson.content.title;

  // Setup voices
  useEffect(() => {
    const updateVoices = () => {
      const langCode = getLangCode(lesson.language);
      const voices = getVoicesForLang(langCode);
      setAvailableVoices(voices);

      const mobile = /android|iphone|ipad|ipod/i.test(navigator.userAgent.toLowerCase());
      setIsMobile(mobile);

      // Set initial best voice only if user hasn't explicitly chosen one
      if (!userHasSelectedVoice.current) {
        const best = getBestVoice(langCode);
        if (best) setSelectedVoiceName(best.name);
      }
    };

    updateVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }

    return () => {
      window.speechSynthesis.cancel();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, [lesson.language]);

  // Persist answers, student info, and completion states to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, studentName, studentId, homeroom, completionStates }));
    } catch (e) {
      console.warn('Failed to save progress:', e);
    }
  }, [answers, studentName, studentId, homeroom, completionStates]);

  const handleReset = () => {
    if (window.confirm('Are you sure you want to clear all your progress? This cannot be undone.')) {
      try {
        localStorage.removeItem(STORAGE_KEY);
        setAnswers(defaultAnswers);
        setStudentName('');
        setStudentId('');
        setHomeroom('');
        setTeacherCode('');
        setCompletionStates(defaultCompletionStates);
        setShowResults(false);
        setIsNameLocked(false);
        setSubmissionStatus('idle');
        window.scrollTo(0, 0);
      } catch (e) {
        console.warn('Failed to clear progress:', e);
      }
    }
  };

  const toggleTTS = (rate: number) => {
    const synth = window.speechSynthesis;

    // Use audio file if available and preferred
    if (lesson.audioFileUrl && audioPreference === 'recorded') {
      if (!audioRef.current) {
        audioRef.current = new Audio(lesson.audioFileUrl);
        audioRef.current.onended = () => {
          setTtsState(prev => ({ ...prev, status: 'stopped' }));
        };
      }

      const audio = audioRef.current;

      // If clicking the active button
      if (ttsState.rate === rate && ttsState.status !== 'stopped') {
        if (ttsState.status === 'playing') {
          audio.pause();
          setTtsState(prev => ({ ...prev, status: 'paused' }));
        } else {
          audio.play();
          setTtsState(prev => ({ ...prev, status: 'playing' }));
        }
        return;
      }

      // New start or changing rate
      synth.cancel(); // Stop any TTS that might be playing
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
          playTTS(rate);
        });

      // Highlight the reading passage
      if (passageRef.current) {
        selectElementText(passageRef.current);
      }
      return;
    }

    playTTS(rate);
  };

  const playTTS = (rate: number) => {
    const synth = window.speechSynthesis;

    // If clicking the active button
    if (ttsState.rate === rate && ttsState.status !== 'stopped') {
      if (ttsState.status === 'playing') {
        synth.pause();
        setTtsState(prev => ({ ...prev, status: 'paused' }));
      } else {
        synth.resume();
        setTtsState(prev => ({ ...prev, status: 'playing' }));
      }
      return;
    }

    // New start or changing rate
    synth.cancel();
    if (audioRef.current) {
      audioRef.current.pause();
    }

    const utterance = new SpeechSynthesisUtterance(lesson.content.readingText);
    const langCode = getLangCode(lesson.language);
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

    // Highlight the reading passage when audio starts
    if (passageRef.current) {
      selectElementText(passageRef.current);
    }
  };

  // Memoize shuffled vocab for print layout to ensure consistency
  const printVocabItems = useMemo(() =>
    shuffleArray([...lesson.content.activities.vocabulary.items]),
    [lesson.content.activities.vocabulary.items]
  );

  // Memoize scrambled sentences for print layout
  const printScrambledItems = useMemo(() => {
    return lesson.content.activities.scrambled.map(item => {
      // Create scrambled version of the answer
      const words = item.answer.replace(/[.!?]+$/, '').split(/\s+/).filter(w => w);
      const shuffled = shuffleArray([...words]);
      return {
        ...item,
        scrambledText: shuffled.join(' / ')
      };
    });
  }, [lesson.content.activities.scrambled]);

  const updateAnswers = (section: keyof UserAnswers, data: any) => {
    setAnswers(prev => ({ ...prev, [section]: data }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleTranslate = async () => {
    const text = lesson.content.readingText;
    const langMap: Record<string, string> = {
      "English": "en",
      "French": "fr",
      "Spanish": "es",
      "German": "de"
    };
    const sourceLang = langMap[lesson.language] || 'auto';

    // Copy to clipboard as backup for mobile browsers
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.warn('Failed to copy to clipboard:', err);
    }

    // Check if Android and try intent first
    const isAndroid = /android/i.test(navigator.userAgent);

    if (isAndroid) {
      // Try Android intent for Google Translate app
      const intentUrl = `intent://translate.google.com/?sl=${sourceLang}&text=${encodeURIComponent(text)}&op=translate#Intent;scheme=https;package=com.google.android.apps.translate;end`;

      // Try to open intent, fall back to web if it fails
      const intentWindow = window.open(intentUrl, '_blank');

      // Fallback to web version after a short delay if intent fails
      setTimeout(() => {
        if (!intentWindow || intentWindow.closed) {
          window.open(`https://translate.google.com/?sl=${sourceLang}&text=${encodeURIComponent(text)}&op=translate`, '_blank');
        }
      }, 1000);
    } else {
      // Non-Android: just open web version
      window.open(`https://translate.google.com/?sl=${sourceLang}&text=${encodeURIComponent(text)}&op=translate`, '_blank');
    }
  };

  const handleWordClick = (word: string) => {
    // Clean word of any surrounding punctuation for better TTS
    const cleanWord = word.replace(/^[.,!?;:"'()\[\]{}]+|[.,!?;:"'()\[\]{}]+$/g, '');
    if (cleanWord) {
      speakText(cleanWord, lesson.language, 0.7, selectedVoiceName);
    }
  };

  const renderReadingPassage = (text: string) => {
    if (!text) return null;

    // Split by whitespace but keep the whitespace segments
    const segments = text.split(/(\s+)/);

    return segments.map((segment, i) => {
      // If it's just whitespace (including newlines), return as is
      if (/^\s+$/.test(segment)) return segment;

      // Split word from punctuation
      // Matches punctuation at start or end of word
      const subSegments = segment.split(/([.,!?;:"'()\[\]{}]+)/).filter(Boolean);

      return (
        <React.Fragment key={i}>
          {subSegments.map((sub, j) => {
            // If it's punctuation, render as plain span
            if (/^[.,!?;:"'()\[\]{}]+$/.test(sub)) {
              return <span key={j}>{sub}</span>;
            }

            // Otherwise it's a word, make it clickable
            return (
              <span
                key={j}
                onClick={() => handleWordClick(sub)}
                className="cursor-pointer hover:text-green-600 hover:bg-green-100/50 rounded transition-colors"
                title="Click to hear pronunciation"
              >
                {sub}
              </span>
            );
          })}
        </React.Fragment>
      );
    });
  };

  const renderVideoExploration = () => {
    if (lesson.isVideoLesson || !lesson.videoUrl) return null;

    return (
      <section className="bg-white p-6 rounded-xl shadow-sm border border-green-100 mb-8 text-center animate-fade-in print:hidden">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
          <Video className="w-6 h-6 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-green-900 mb-2">Explore Further</h2>
        <p className="text-gray-600 mb-6 text-lg">
          Want to learn more about this topic? Watch this video to dive deeper!
        </p>
        <a
          href={lesson.videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-green-600 text-white px-8 py-3 rounded-full font-bold hover:bg-green-700 transform hover:scale-105 transition-all shadow-md"
        >
          Watch Video on YouTube
        </a>
      </section>
    );
  };

  const calculateBreakdown = () => {
    // Vocab
    let vocabScore = 0;
    const vocabTotal = lesson.content.activities.vocabulary.items.length;
    lesson.content.activities.vocabulary.items.forEach((item, idx) => {
      const correctDefIndex = lesson.content.activities.vocabulary.definitions.findIndex(d => d.id === item.answer);
      const correctChar = String.fromCharCode(97 + correctDefIndex);
      if ((answers.vocabulary[`vocab_${idx}`] || '').toLowerCase() === correctChar) vocabScore++;
    });

    // Fill Blanks
    let fillScore = 0;
    const fillTotal = lesson.content.activities.fillInTheBlanks.length;
    lesson.content.activities.fillInTheBlanks.forEach((item, idx) => {
      if (normalizeString(answers.fillBlanks[idx] || '') === normalizeString(item.answer)) fillScore++;
    });

    // Comprehension
    let compScore = 0;
    const compTotal = lesson.content.activities.comprehension.questions.length;
    lesson.content.activities.comprehension.questions.forEach((q, idx) => {
      if (answers.comprehension[idx] === q.answer) compScore++;
    });

    // Scrambled
    let scrambledScore = 0;
    const scrambledTotal = lesson.content.activities.scrambled.length;
    lesson.content.activities.scrambled.forEach((item, idx) => {
      if (normalizeString(answers.scrambled[idx] || '') === normalizeString(item.answer)) scrambledScore++;
    });

    return {
      vocab: { score: vocabScore, total: vocabTotal },
      fill: { score: fillScore, total: fillTotal },
      comp: { score: compScore, total: compTotal },
      scrambled: { score: scrambledScore, total: scrambledTotal },
      totalScore: vocabScore + fillScore + compScore + scrambledScore,
      maxScore: vocabTotal + fillTotal + compTotal + scrambledTotal
    };
  };

  const handleFinish = () => {
    if (!studentName.trim() || !studentId.trim() || !homeroom.trim()) {
      alert('Please fill in your Nickname, Student ID, and Homeroom.');
      return;
    }

    // Explicitly dismiss keyboard before major DOM change to prevent iOS hang
    if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    // Lock the name once submitted
    setIsNameLocked(true);

    const now = new Date();
    // Simplified date formatting for better device compatibility
    const dateStr = now.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    setFinishTime(`${dateStr}, ${timeStr}`);

    setShowResults(true);

    // Decouple heavy confetti animation from state update to prevent UI thread blocking
    setTimeout(() => {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        console.warn('Confetti failed:', e);
      }
    }, 200);
  };

  const handleSubmitScore = async () => {
    if (teacherCode !== '6767') {
      alert('Incorrect Teacher Code. Please take a screenshot of your report card and show it to your teacher.');
      return;
    }

    setIsSubmitting(true);
    setSubmissionStatus('idle');
    setSubmissionMessage('');

    const scores = calculateBreakdown();
    const payload = {
      nickname: studentName,
      homeroom: homeroom,
      studentId: studentId,
      quizName: displayTitle,
      score: scores.totalScore,
      total: scores.maxScore
    };

    const submissionUrl = config?.submissionUrl || 'https://script.google.com/macros/s/AKfycbzqV42jFksBwJ_3jFhYq4o_d6o7Y63K_1oA4oZ1UeWp-M4y3F25r0xQ-Kk1n8F1uG1Q/exec';

    if (submissionUrl === 'YOUR_WEB_APP_URL_HERE') {
      alert('WARNING: Submission URL is not configured. Please contact your teacher.');
      setIsSubmitting(false);
      return;
    }

    try {
      await fetch(submissionUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload)
      });
      
      // With 'no-cors', the response is opaque and we cannot read its content
      // We assume success if the fetch promise doesn't reject (network error)
      setSubmissionStatus('success');
      setSubmissionMessage('Score submitted successfully!');
    } catch (error) {
      console.error('Submission failed:', error);
      setSubmissionStatus('error');
      setSubmissionMessage('Failed to submit score. Please check your connection or take a screenshot.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showResults) {
    const scores = calculateBreakdown();

    return (
      <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-lg border-t-4 border-green-600 animate-fade-in my-4 print:hidden">
        {/* Compact Header */}
        <div className="flex justify-between items-start mb-3 pb-2 border-b border-gray-100">
          <div className="pr-4">
            <h2 className="text-xl font-bold text-green-900 leading-tight">Report Card</h2>
            <div className="text-xs text-gray-500 mt-1 leading-tight">{displayTitle}</div>
          </div>
          <div className="text-right whitespace-nowrap">
            <div className="text-3xl font-bold text-green-600 leading-none">
              {scores.totalScore}<span className="text-lg text-gray-400">/{scores.maxScore}</span>
            </div>
            <div className="text-[10px] text-gray-400 uppercase tracking-wide font-bold mt-1">Total Score</div>
          </div>
        </div>

        {/* Student Info Bar */}
        <div className="bg-gray-50 rounded-lg p-2.5 mb-3 flex flex-col sm:flex-row justify-between sm:items-center text-sm border border-gray-100 gap-2">
          <div className="flex gap-4 flex-wrap">
            <div>
              <div className="text-[10px] text-gray-500 uppercase font-bold">Nickname</div>
              <div className="font-bold text-gray-800 text-sm">{studentName || 'Anonymous'}</div>
            </div>
            <div>
              <div className="text-[10px] text-gray-500 uppercase font-bold">ID</div>
              <div className="font-bold text-gray-800 text-sm">{studentId || '-'}</div>
            </div>
            <div>
              <div className="text-[10px] text-gray-500 uppercase font-bold">Homeroom</div>
              <div className="font-bold text-gray-800 text-sm">{homeroom || '-'}</div>
            </div>
          </div>
          <div className="sm:text-right">
            <div className="text-[10px] text-gray-500 uppercase font-bold">Date</div>
            <div className="font-medium text-gray-800 text-xs">{finishTime}</div>
          </div>
        </div>

        {/* Scores Grid - Compact */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <ScorePill label="Vocabulary" score={scores.vocab.score} total={scores.vocab.total} />
          <ScorePill label="Fill Blanks" score={scores.fill.score} total={scores.fill.total} />
          <ScorePill label="Comprehension" score={scores.comp.score} total={scores.comp.total} />
          <ScorePill label="Scrambled" score={scores.scrambled.score} total={scores.scrambled.total} />
        </div>

        {/* Written Responses - Compact */}
        {lesson.content.activities.writtenExpression.questions.length > 0 && (
          <div className="border-t border-gray-100 pt-2 mb-2">
            <h3 className="font-bold text-gray-700 text-[10px] uppercase mb-2 tracking-wider">Written Responses</h3>
            <div className="space-y-2">
              {lesson.content.activities.writtenExpression.questions.map((q, i) => (
                <div key={i} className="text-sm">
                  <p className="font-semibold text-green-800 text-xs mb-1 line-clamp-2 leading-tight">{i + 1}. {q.text}</p>
                  <p className="text-gray-600 text-xs pl-2 border-l-2 border-green-200 italic bg-gray-50 p-1.5 rounded-r leading-snug">
                    {answers.writing[i] || 'No answer provided'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Message */}
        <div className="mt-3 text-center">
          <p className="text-[12px] text-gray-600 italic mb-4">Take a screenshot to send to your teacher.</p>
        </div>

        {/* Submission Section */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-4 mb-4">
          <h3 className="font-bold text-gray-800 text-sm mb-2">Submit to Teacher</h3>
          
          {submissionStatus === 'success' ? (
            <div className="flex items-center gap-2 text-green-700 bg-green-50 p-3 rounded-lg border border-green-200">
              <CheckCircle className="w-5 h-5 shrink-0" />
              <p className="text-sm font-medium">{submissionMessage}</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Teacher Code</label>
                <input
                  type="text"
                  placeholder="Enter 4-digit code"
                  value={teacherCode}
                  onChange={(e) => setTeacherCode(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full sm:w-1/2 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-400 focus:outline-none text-sm"
                />
              </div>

              {submissionStatus === 'error' && (
                <div className="flex items-start gap-2 text-red-700 text-xs bg-red-50 p-2 rounded">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>{submissionMessage}</p>
                </div>
              )}

              <Button
                onClick={handleSubmitScore}
                disabled={isSubmitting || !teacherCode.trim()}
                className="w-full sm:w-auto flex items-center justify-center gap-2"
                size="sm"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Score'
                )}
              </Button>
            </div>
          )}
        </div>

        <div className="mt-4 flex justify-center gap-2 print:hidden">
          {/* Back button now returns to the lesson for revisions instead of exiting */}
          <Button onClick={() => setShowResults(false)} size="sm">Back to Lesson</Button>
        </div>
        <div className="mt-8">
          {renderVideoExploration()}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-4xl mx-auto pb-20 print:hidden">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-green-900 mb-2">{displayTitle}</h1>
          <div className="flex items-center justify-center gap-4 text-gray-600">
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">{lesson.level}</span>
            <div className="flex gap-4">
              <button 
                onClick={handleReset} 
                className="flex items-center hover:text-red-600 transition-colors"
                title="Clear all progress"
              >
                <RotateCcw className="w-4 h-4 mr-1" /> Reset
              </button>
              <button onClick={handlePrint} className="flex items-center hover:text-green-600 transition-colors">
                <Printer className="w-4 h-4 mr-1" /> Print
              </button>
            </div>
          </div>
        </header>

        {/* Media Section */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-green-100 mb-8">
          <div translate="no">
            <h2 className="text-xl font-bold text-green-900 mb-4">Reading Passage</h2>
          </div>

          {lesson.isVideoLesson && lesson.videoUrl && (
            <div className="relative pt-[56.25%] mb-6 rounded-lg overflow-hidden bg-black shadow-md">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={lesson.videoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                allowFullScreen
              />
            </div>
          )}

          {/* Image now displays regardless of video status */}
          {lesson.imageUrl && (
            <div className="w-full flex justify-center mb-6">
              <img
                src={lesson.imageUrl}
                alt="Lesson topic"
                className="w-full h-auto max-h-[500px] object-contain rounded-lg shadow-sm"
              />
            </div>
          )}

          {/* Buttons moved above text */}
          <div className="flex flex-wrap gap-3 mb-4 justify-end text-gray-700">
            <button className="flex items-center px-3 py-1.5 text-sm font-medium border border-gray-200 rounded-lg shadow-sm hover:border-green-300 hover:bg-green-50 hover:text-green-600 transition-all" onClick={handleTranslate} title="Translate via Google">
              <Languages className="w-4 h-4 mr-1.5" /> Translate
            </button>

            {shouldShowAudioControls() ? (
              <div className="flex flex-wrap items-center gap-3">
                {availableVoices.length > 0 && (
                  <>
                    <button
                      className="flex items-center px-3 py-1.5 text-sm font-medium border border-gray-200 rounded-lg shadow-sm hover:border-green-300 hover:bg-green-50 hover:text-green-600 transition-all"
                      onClick={() => setIsVoiceModalOpen(true)}
                      title="Select TTS Voice"
                    >
                      <Mic className="w-4 h-4 mr-1.5" />
                      <span className="hidden sm:inline">Voice</span>
                    </button>

                    <VoiceSelectorModal
                      isOpen={isVoiceModalOpen}
                      onClose={() => setIsVoiceModalOpen(false)}
                      voices={availableVoices}
                      selectedVoiceName={selectedVoiceName}
                      onSelectVoice={(name) => {
                        userHasSelectedVoice.current = true;
                        setSelectedVoiceName(name);
                      }}
                      language={lesson.language}
                      hasRecordedAudio={!!lesson.audioFileUrl}
                      audioPreference={audioPreference}
                      onSelectPreference={(pref) => {
                        userHasSelectedVoice.current = true;
                        setAudioPreference(pref);
                        // Stop current playback if switching
                        window.speechSynthesis.cancel();
                        if (audioRef.current) audioRef.current.pause();
                        setTtsState(prev => ({ ...prev, status: 'stopped' }));
                      }}
                    />
                  </>
                )}

                <button className="flex items-center px-3 py-1.5 text-sm font-medium border border-gray-200 rounded-lg shadow-sm hover:border-green-300 hover:bg-green-50 hover:text-green-600 transition-all" onClick={() => toggleTTS(0.6)}>
                  {ttsState.rate === 0.6 && ttsState.status === 'playing' ? (
                    <><Pause className="w-4 h-4 mr-1.5" /> Pause</>
                  ) : ttsState.rate === 0.6 && ttsState.status === 'paused' ? (
                    <><Play className="w-4 h-4 mr-1.5" /> Resume</>
                  ) : (
                    <><Turtle className="w-4 h-4 mr-1.5" /> Slow</>
                  )}
                </button>

                <button className="flex items-center px-3 py-1.5 text-sm font-medium border border-gray-200 rounded-lg shadow-sm hover:border-green-300 hover:bg-green-50 hover:text-green-600 transition-all" onClick={() => toggleTTS(1.0)}>
                  {ttsState.rate === 1.0 && ttsState.status === 'playing' ? (
                    <><Pause className="w-4 h-4 mr-1.5" /> Pause</>
                  ) : ttsState.rate === 1.0 && ttsState.status === 'paused' ? (
                    <><Play className="w-4 h-4 mr-1.5" /> Resume</>
                  ) : (
                    <><Volume2 className="w-4 h-4 mr-1.5" /> Listen</>
                  )}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-yellow-50 p-2 rounded border border-yellow-200">
                <span className="text-xs text-yellow-800">⚠️ Audio unavailable.</span>
                {getAndroidIntentLink(lesson.id) ? (
                  <a href={getAndroidIntentLink(lesson.id)} className="text-xs font-bold text-green-600 underline">Open in Chrome</a>
                ) : (
                  <span className="text-xs text-gray-500">Please use Chrome or Safari.</span>
                )}
              </div>
            )}
          </div>

          <div
            ref={passageRef}
            className="prose max-w-none font-serif text-2xl md:text-2xl leading-relaxed text-gray-800 bg-gray-50/70 p-6 rounded-lg whitespace-pre-line border border-gray-200"
            translate="no"
          >
            {renderReadingPassage(lesson.content.readingText)}
          </div>
        </section>

        {/* Activity 1: Vocabulary */}
        <Vocabulary
          data={lesson.content.activities.vocabulary}
          language={lesson.language}
          savedAnswers={answers.vocabulary}
          onChange={(a) => updateAnswers('vocabulary', a)}
          voiceName={selectedVoiceName}
          savedIsChecked={completionStates.vocabularyChecked}
          onComplete={() => setCompletionStates(prev => ({ ...prev, vocabularyChecked: true }))}
        />

        {/* Activity 2: Fill in Blanks */}
        <FillInBlanks
          data={lesson.content.activities.fillInTheBlanks}
          vocabItems={lesson.content.activities.vocabulary.items}
          level={lesson.level.replace('Level ', '')}
          language={lesson.language}
          savedAnswers={answers.fillBlanks}
          onChange={(a) => updateAnswers('fillBlanks', a)}
          voiceName={selectedVoiceName}
          savedIsChecked={completionStates.fillBlanksChecked}
          onComplete={() => setCompletionStates(prev => ({ ...prev, fillBlanksChecked: true }))}
        />

        {/* Activity 3: Comprehension */}
        <Comprehension
          data={lesson.content.activities.comprehension}
          readingText={lesson.content.readingText}
          language={lesson.language}
          savedAnswers={answers.comprehension}
          onChange={(a) => updateAnswers('comprehension', a)}
          voiceName={selectedVoiceName}
          savedIsCompleted={completionStates.comprehensionCompleted}
          onComplete={() => setCompletionStates(prev => ({ ...prev, comprehensionCompleted: true }))}
        />

        {/* Activity 4: Scrambled */}
        <Scrambled
          data={lesson.content.activities.scrambled}
          level={lesson.level.replace('Level ', '')}
          language={lesson.language}
          savedAnswers={answers.scrambled}
          onChange={(a) => updateAnswers('scrambled', a)}
          voiceName={selectedVoiceName}
          savedIsCompleted={completionStates.scrambledCompleted}
          onComplete={() => setCompletionStates(prev => ({ ...prev, scrambledCompleted: true }))}
        />

        {/* Activity 5: Writing */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-green-800">Activity 5: Written Expression</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowExamples(!showExamples)}
              className="flex items-center gap-2"
            >
              {showExamples ? <EyeOff size={16} /> : <Eye size={16} />}
              {showExamples ? 'Hide Examples' : 'See Examples'}
            </Button>
          </div>

          <p className="text-gray-600 mb-6 text-lg">Answer the questions with 1 or 2 complete sentences.</p>

          {showExamples && lesson.content.activities.writtenExpression.examples && (
            <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg animate-fade-in shadow-sm">
              <div
                className="prose prose-sm text-green-800"
                dangerouslySetInnerHTML={{ __html: lesson.content.activities.writtenExpression.examples }}
              />
            </div>
          )}

          <div className="space-y-6">
            {lesson.content.activities.writtenExpression.questions.map((q, i) => (
              <div key={i}>
                <div className="flex items-start gap-3 mb-2">
                  <label className="block font-medium text-gray-800 text-lg flex-1">{i + 1}. {q.text}</label>
                  <button
                    onClick={() => {
                      const studentAnswer = answers.writing[i];
                      const textToSpeak = studentAnswer && studentAnswer.trim() ? studentAnswer : q.text;
                      speakText(textToSpeak, lesson.language, 0.7, selectedVoiceName);
                    }}
                    className="text-gray-400 hover:text-green-600 transition-colors p-1 shrink-0"
                    title={answers.writing[i]?.trim() ? "Hear your answer" : "Hear question"}
                  >
                    <Volume2 size={20} />
                  </button>
                </div>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow text-lg"
                  rows={3}
                  placeholder="Your answer..."
                  value={answers.writing[i] || ''}
                  onChange={(e) => updateAnswers('writing', { ...answers.writing, [i]: e.target.value })}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Submission */}
        <section className="bg-green-700 p-8 rounded-xl shadow-lg text-white text-center mb-8">
          <h2 className="text-2xl font-bold mb-4">{isNameLocked ? 'Update Score' : 'Finished?'}</h2>
          <div className="max-w-xl mx-auto mb-6">
            {isNameLocked ? (
              <div className="w-full p-3 rounded-lg bg-white text-green-900 font-bold text-xl shadow-sm mb-4">
                {studentName} • {studentId} • {homeroom}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-white mb-2 text-xs font-semibold uppercase tracking-wider text-left">Nickname</label>
                  <input
                    type="text"
                    className="w-full p-3 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-green-400 text-lg font-semibold"
                    placeholder="Jake"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-white mb-2 text-xs font-semibold uppercase tracking-wider text-left">Student ID</label>
                  <input
                    type="text"
                    className="w-full p-3 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-green-400 text-lg font-semibold"
                    placeholder="01"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-white mb-2 text-xs font-semibold uppercase tracking-wider text-left">Homeroom</label>
                  <input
                    type="text"
                    className="w-full p-3 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-green-400 text-lg font-semibold"
                    placeholder="M1/1"
                    value={homeroom}
                    onChange={(e) => setHomeroom(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
          <button
            onClick={handleFinish}
            disabled={!studentName.trim() || !studentId.trim() || !homeroom.trim()}
            className="bg-white text-green-800 border border-green-800 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isNameLocked ? 'See Updated Report Card' : 'See My Score'}
          </button>
        </section>

        {renderVideoExploration()}
      </div>

      {/* PRINT LAYOUT (Visible only on print) */}
      <div className="hidden print:block font-serif text-black max-w-[210mm] mx-auto p-4">
        <div className="flex justify-between items-end mb-4 border-b border-gray-400 pb-2">
          <div>
            <h1 className="text-xl font-bold leading-tight">{displayTitle}</h1>
            <p className="text-xs text-gray-600">{lesson.level}</p>
          </div>
          <div className="text-right text-xs">
            <p className="mb-2">Name: _______________________________</p>
            <p>Date: _______________________________</p>
          </div>
        </div>

        {/* Reading */}
        <div className="mb-6">
          {lesson.imageUrl && (
            <img
              src={lesson.imageUrl}
              className="h-32 object-contain mx-auto mb-3"
              alt="Lesson"
            />
          )}
          <div className="text-xs text-justify leading-snug columns-2 gap-6 whitespace-pre-line">
            {lesson.content.readingText}
          </div>
        </div>

        <div className="space-y-5">
          {/* Vocab */}
          <div className="break-inside-avoid">
            <h2 className="font-bold text-sm mb-2 border-b border-gray-300 pb-1">1. Vocabulary</h2>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="font-bold mb-1 text-[10px] text-gray-500 uppercase">Definitions</p>
                {lesson.content.activities.vocabulary.definitions.map((def, i) => (
                  <div key={def.id} className="mb-1">
                    <span className="font-bold mr-1">{String.fromCharCode(97 + i)}.</span>
                    {def.text}
                  </div>
                ))}
              </div>
              <div>
                <p className="font-bold mb-1 text-[10px] text-gray-500 uppercase">Words</p>
                {printVocabItems.map(item => (
                  <div key={item.label} className="mb-1">
                    <span className="inline-block w-8 border-b border-black mr-2"></span> {item.label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Fill Blanks */}
          <div className="break-inside-avoid">
            <h2 className="font-bold text-sm mb-2 border-b border-gray-300 pb-1">2. Fill in the Blanks</h2>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
              {lesson.content.activities.fillInTheBlanks.map((item, i) => (
                <div key={i}>
                  {i + 1}. {item.before} <span className="inline-block w-16 border-b border-black"></span> {item.after}
                </div>
              ))}
            </div>
          </div>

          {/* Comprehension */}
          <div className="break-inside-avoid">
            <h2 className="font-bold text-sm mb-2 border-b border-gray-300 pb-1">3. Comprehension</h2>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
              {lesson.content.activities.comprehension.questions.map((q, i) => (
                <div key={i}>
                  {i + 1}. {q.text} <span className="ml-2 whitespace-nowrap">[ ] True [ ] False</span>
                </div>
              ))}
            </div>
          </div>

          {/* Scrambled */}
          <div className="break-inside-avoid">
            <h2 className="font-bold text-sm mb-2 border-b border-gray-300 pb-1">4. Scrambled Sentences</h2>
            <div className="text-xs space-y-3">
              {printScrambledItems.map((item, i) => (
                <div key={i}>
                  <p className="italic mb-1">{i + 1}. {item.scrambledText}</p>
                  <div className="border-b border-gray-300 h-4 w-full"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Writing */}
          <div className="break-inside-avoid">
            <h2 className="font-bold text-sm mb-2 border-b border-gray-300 pb-1">5. Written Expression</h2>
            <div className="text-xs space-y-4">
              {lesson.content.activities.writtenExpression.questions.map((q, i) => (
                <div key={i}>
                  <p className="font-semibold mb-1">{i + 1}. {q.text}</p>
                  <div className="border-b border-gray-300 h-4 w-full mb-2"></div>
                  <div className="border-b border-gray-300 h-4 w-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-[10px] text-gray-400">
          worksheets.teacherjake.com
        </div>
      </div>
    </>
  );
};