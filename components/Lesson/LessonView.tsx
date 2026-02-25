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
import { StandardLessonContent, InformationGapContent, LessonContent } from '../../types';
import { GenericLessonLayout } from './GenericLessonLayout';

const InformationGapView = React.lazy(() => import('./InformationGapView').then(m => ({ default: m.InformationGapView })));
const WorksheetView = React.lazy(() => import('./WorksheetView').then(m => ({ default: m.WorksheetView })));

interface Props {
  lesson: ParsedLesson;
}

const isStandardLesson = (content: LessonContent): content is StandardLessonContent => {
  return 'activities' in content;
};

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

  const isStandard = isStandardLesson(lesson.content);
  const displayTitle = lesson.title || (isStandard ? (lesson.content as StandardLessonContent).title : (lesson.content as InformationGapContent).topic);

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

  const toggleTTS = (rate: number, overrideText?: string) => {
    const synth = window.speechSynthesis;

    // Use audio file if available and preferred, but ONLY if no override text is provided
    if (!overrideText && lesson.audioFileUrl && audioPreference === 'recorded') {
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

    playTTS(rate, overrideText);
  };

  const playTTS = (rate: number, overrideText?: string) => {
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

    const readingText = overrideText || (isStandard ? (lesson.content as StandardLessonContent).readingText : '');
    const utterance = new SpeechSynthesisUtterance(readingText);
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
    if (passageRef.current && !overrideText) {
      selectElementText(passageRef.current);
    }
  };

  // Memoize shuffled vocab for print layout to ensure consistency
  const printVocabItems = useMemo(() =>
    isStandard ? shuffleArray([...(lesson.content as StandardLessonContent).activities.vocabulary.items]) : [],
    [isStandard, lesson.content]
  );

  // Memoize scrambled sentences for print layout
  const printScrambledItems = useMemo(() => {
    if (!isStandard) return [];
    return (lesson.content as StandardLessonContent).activities.scrambled.map(item => {
      // Create scrambled version of the answer
      const words = item.answer.replace(/[.!?]+$/, '').split(/\s+/).filter(w => w);
      const shuffled = shuffleArray([...words]);
      return {
        ...item,
        scrambledText: shuffled.join(' / ')
      };
    });
  }, [isStandard, lesson.content]);

  const updateAnswers = (section: keyof UserAnswers, data: any) => {
    setAnswers(prev => ({ ...prev, [section]: data }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleWordClick = (word: string) => {
    // Clean word of any surrounding punctuation for better TTS
    const cleanWord = word.replace(/^[.,!?;:"'()\[\]{}]+|[.,!?;:"'()\[\]{}]+$/g, '');
    if (cleanWord) {
      speakText(cleanWord, lesson.language, 0.7, selectedVoiceName);
    }
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
    if (!isStandard) {
        let infoGapScore = 0;
        let infoGapTotal = 0;
        
        if (answers.infoGap) {
            Object.values(answers.infoGap).forEach(res => {
                infoGapScore += res.score;
                infoGapTotal += res.total;
            });
        }

        return {
            vocab: { score: 0, total: 0 },
            fill: { score: 0, total: 0 },
            comp: { score: 0, total: 0 },
            scrambled: { score: 0, total: 0 },
            infoGap: { score: infoGapScore, total: infoGapTotal },
            totalScore: infoGapScore,
            maxScore: infoGapTotal
        };
    }
    
    // Vocab
    let vocabScore = 0;
    const standardContent = lesson.content as StandardLessonContent;
    const vocabTotal = standardContent.activities.vocabulary.items.length;
    standardContent.activities.vocabulary.items.forEach((item, idx) => {
      const correctDefIndex = standardContent.activities.vocabulary.definitions.findIndex(d => d.id === item.answer);
      const correctChar = String.fromCharCode(97 + correctDefIndex);
      if ((answers.vocabulary[`vocab_${idx}`] || '').toLowerCase() === correctChar) vocabScore++;
    });

    // Fill Blanks
    let fillScore = 0;
    const fillTotal = standardContent.activities.fillInTheBlanks.length;
    standardContent.activities.fillInTheBlanks.forEach((item, idx) => {
      if (normalizeString(answers.fillBlanks[idx] || '') === normalizeString(item.answer)) fillScore++;
    });

    // Comprehension
    let compScore = 0;
    const compTotal = standardContent.activities.comprehension.questions.length;
    standardContent.activities.comprehension.questions.forEach((q, idx) => {
      if (answers.comprehension[idx] === q.answer) compScore++;
    });

    // Scrambled
    let scrambledScore = 0;
    const scrambledTotal = standardContent.activities.scrambled.length;
    standardContent.activities.scrambled.forEach((item, idx) => {
      if (normalizeString(answers.scrambled[idx] || '') === normalizeString(item.answer)) scrambledScore++;
    });

    return {
      vocab: { score: vocabScore, total: vocabTotal },
      fill: { score: fillScore, total: fillTotal },
      comp: { score: compScore, total: compTotal },
      scrambled: { score: scrambledScore, total: scrambledTotal },
      infoGap: { score: 0, total: 0 },
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

  const handleTranslate = async () => {
    const text = isStandard ? (lesson.content as StandardLessonContent).readingText : '';
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

  const handleSubmitScore = async () => {
    if (teacherCode.trim() !== '6767') {
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
      setSubmissionMessage('Score sent to teacher! (Please take a screenshot as backup.)');
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
          {isStandard ? (
            <>
              <ScorePill label="Vocabulary" score={scores.vocab.score} total={scores.vocab.total} />
              <ScorePill label="Fill Blanks" score={scores.fill.score} total={scores.fill.total} />
              <ScorePill label="Comprehension" score={scores.comp.score} total={scores.comp.total} />
              <ScorePill label="Scrambled" score={scores.scrambled.score} total={scores.scrambled.total} />
            </>
          ) : (
            <div className="col-span-2">
              <ScorePill label="Speaking Activities" score={scores.infoGap?.score || 0} total={scores.infoGap?.total || 0} />
            </div>
          )}
        </div>

        {/* Written Responses - Compact */}
        {isStandard && (lesson.content as StandardLessonContent).activities.writtenExpression.questions.length > 0 && (
          <div className="border-t border-gray-100 pt-2 mb-2">
            <h3 className="font-bold text-gray-700 text-[10px] uppercase mb-2 tracking-wider">Written Responses</h3>
            <div className="space-y-2">
              {(lesson.content as StandardLessonContent).activities.writtenExpression.questions.map((q, i) => (
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
          <h3 className="font-bold text-gray-800 text-sm mb-2">Submit to Teacher (Optional)</h3>
          
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
          {isStandard && renderVideoExploration()}
        </div>
      </div>
    );
  }

  if (lesson.lessonType === 'information-gap') {
    return (
      <React.Suspense fallback={<div className="flex items-center justify-center p-20"><Loader className="w-8 h-8 animate-spin text-green-600" /></div>}>
        <InformationGapView 
          lesson={{...lesson, content: lesson.content as InformationGapContent}} 
          onReset={handleReset}
          onFinish={handleFinish}
          studentName={studentName}
          setStudentName={setStudentName}
          studentId={studentId}
          setStudentId={setStudentId}
          homeroom={homeroom}
          setHomeroom={setHomeroom}
          isNameLocked={isNameLocked}
          toggleTTS={toggleTTS}
          ttsState={ttsState}
          availableVoices={availableVoices}
          selectedVoiceName={selectedVoiceName}
          setSelectedVoiceName={(name) => {
            userHasSelectedVoice.current = true;
            setSelectedVoiceName(name);
          }}
          isVoiceModalOpen={isVoiceModalOpen}
          setIsVoiceModalOpen={setIsVoiceModalOpen}
          audioPreference={audioPreference}
          setAudioPreference={(pref) => {
            userHasSelectedVoice.current = true;
            setAudioPreference(pref);
            window.speechSynthesis.cancel();
            if (audioRef.current) audioRef.current.pause();
            setTtsState(prev => ({ ...prev, status: 'stopped' }));
          }}
          answers={answers}
          setAnswers={setAnswers}
        />
      </React.Suspense>
    );
  }

  // Default to WorksheetView for 'worksheet' or undefined lessonType
  return (
    <React.Suspense fallback={<div className="flex items-center justify-center p-20"><Loader className="w-8 h-8 animate-spin text-green-600" /></div>}>
      <WorksheetView
        lesson={{...lesson, content: lesson.content as StandardLessonContent}}
        studentName={studentName}
        setStudentName={setStudentName}
        studentId={studentId}
        setStudentId={setStudentId}
        homeroom={homeroom}
        setHomeroom={setHomeroom}
        isNameLocked={isNameLocked}
        onFinish={handleFinish}
        onReset={handleReset}
        answers={answers}
        setAnswers={setAnswers}
        toggleTTS={toggleTTS}
        ttsState={ttsState}
        availableVoices={availableVoices}
        selectedVoiceName={selectedVoiceName}
        setSelectedVoiceName={(name) => {
          userHasSelectedVoice.current = true;
          setSelectedVoiceName(name);
        }}
        isVoiceModalOpen={isVoiceModalOpen}
        setIsVoiceModalOpen={setIsVoiceModalOpen}
        audioPreference={audioPreference}
        setAudioPreference={(pref) => {
          userHasSelectedVoice.current = true;
          setAudioPreference(pref);
          window.speechSynthesis.cancel();
          if (audioRef.current) audioRef.current.pause();
          setTtsState(prev => ({ ...prev, status: 'stopped' }));
        }}
        passageRef={passageRef}
      />
    </React.Suspense>
  );
};