import React, { useMemo, useState } from 'react';
import { Video, Printer, Copy, Check } from 'lucide-react';
import { ParsedLesson, StandardLessonContent, UserAnswers, ReportData, ReportScorePill, ReportWrittenResponse, CompletionStates } from '../../types';
import { normalizeString, seededShuffle } from '../../utils/textUtils';
import { GenericLessonLayout } from './GenericLessonLayout';
import { Vocabulary } from '../Activities/Vocabulary';
import { FillInBlanks } from '../Activities/FillInBlanks';
import { Comprehension } from '../Activities/Comprehension';
import { Scrambled } from '../Activities/Scrambled';
import { ReadingPassage } from '../Activities/ReadingPassage';
import { WrittenExpression } from '../Activities/WrittenExpression';
import { VoiceSelectorModal } from '../UI/VoiceSelectorModal';
import { LessonFooter } from './LessonFooter';
import { CollapsibleActivity } from '../UI/CollapsibleActivity';

interface WorksheetViewProps {
  lesson: ParsedLesson & { content: StandardLessonContent };
  studentName: string;
  setStudentName: (name: string) => void;
  studentId: string;
  setStudentId: (id: string) => void;
  homeroom: string;
  setHomeroom: (homeroom: string) => void;
  isNameLocked: boolean;
  onFinish: (data: ReportData) => void;
  onReset: () => void;
  answers: UserAnswers;
  setAnswers: React.Dispatch<React.SetStateAction<UserAnswers>>;
  completionStates: CompletionStates;
  setCompletionStates: React.Dispatch<React.SetStateAction<CompletionStates>>;
  toggleTTS: (rate: number, overrideText?: string) => void;
  ttsState: { status: 'playing' | 'paused' | 'stopped', rate: number };
  availableVoices: SpeechSynthesisVoice[];
  selectedVoiceName: string | null;
  setSelectedVoiceName: (name: string) => void;
  isVoiceModalOpen: boolean;
  setIsVoiceModalOpen: (isOpen: boolean) => void;
  audioPreference: 'recorded' | 'tts';
  setAudioPreference: (pref: 'recorded' | 'tts') => void;
  passageRef: React.RefObject<HTMLDivElement>;
}

export const WorksheetView: React.FC<WorksheetViewProps> = ({
  lesson,
  studentName,
  setStudentName,
  studentId,
  setStudentId,
  homeroom,
  setHomeroom,
  isNameLocked,
  onFinish,
  onReset,
  answers,
  setAnswers,
  completionStates,
  setCompletionStates,
  toggleTTS,
  ttsState,
  availableVoices,
  selectedVoiceName,
  setSelectedVoiceName,
  isVoiceModalOpen,
  setIsVoiceModalOpen,
  audioPreference,
  setAudioPreference,
  passageRef,
}) => {
  const [showExamples, setShowExamples] = useState(false);
  const isStandard = true; // By definition in this component
  const standardContent = lesson.content;
  const displayTitle = lesson.title || standardContent.title;

  const updateAnswers = (section: keyof UserAnswers, data: any) => {
    setAnswers(prev => ({ ...prev, [section]: data }));
  };

  const handleTranslate = async () => {
    const text = standardContent.readingText;
    const langMap: Record<string, string> = {
      "English": "en",
      "French": "fr",
      "Spanish": "es",
      "German": "de"
    };
    const sourceLang = langMap[lesson.language] || 'auto';

    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.warn('Failed to copy to clipboard:', err);
    }

    const isAndroid = /android/i.test(navigator.userAgent);

    if (isAndroid) {
      const intentUrl = `intent://translate.google.com/?sl=${sourceLang}&text=${encodeURIComponent(text)}&op=translate#Intent;scheme=https;package=com.google.android.apps.translate;end`;
      const intentWindow = window.open(intentUrl, '_blank');
      setTimeout(() => {
        if (!intentWindow || intentWindow.closed) {
          window.open(`https://translate.google.com/?sl=${sourceLang}&text=${encodeURIComponent(text)}&op=translate`, '_blank');
        }
      }, 1000);
    } else {
      window.open(`https://translate.google.com/?sl=${sourceLang}&text=${encodeURIComponent(text)}&op=translate`, '_blank');
    }
  };
  const vocabScore = useMemo(() => {
    let score = 0;
    const vocabData = standardContent.activities.vocabulary;
    vocabData.items.forEach((item, idx) => {
      const userAnswer = answers.vocabulary[`vocab_${idx}`] || '';
      const correctDefIndex = vocabData.definitions.findIndex(d => d.id === item.answer);
      const correctChar = String.fromCharCode(97 + correctDefIndex);
      if (userAnswer.toLowerCase() === correctChar) score++;
    });
    return score;
  }, [standardContent, answers.vocabulary]);

  const fillScore = useMemo(() => {
    let score = 0;
    const fillData = standardContent.activities.fillInTheBlanks;
    fillData.forEach((item, idx) => {
      if (normalizeString(answers.fillBlanks[idx] || '') === normalizeString(item.answer)) score++;
    });
    return score;
  }, [standardContent, answers.fillBlanks]);
  const compScore = useMemo(() => {
    let score = 0;
    const compData = standardContent.activities.comprehension;
    compData.questions.forEach((q, idx) => {
      if ((answers.comprehension[idx] || '').toLowerCase() === q.answer.toLowerCase()) score++;
    });
    return score;
  }, [standardContent, answers.comprehension]);

  const scrambledScore = useMemo(() => {
    let score = 0;
    const scrambledData = standardContent.activities.scrambled;
    scrambledData.forEach((item, idx) => {
      if (normalizeString(answers.scrambled[idx] || '') === normalizeString(item.answer)) score++;
    });
    return score;
  }, [standardContent, answers.scrambled]);



  const calculateReportData = (): ReportData => {
    const pills: ReportScorePill[] = [];
    let totalScore = 0;
    let maxScore = 0;

    // 1. Vocabulary
    let vocabScore = 0;
    const vocabData = standardContent.activities.vocabulary;
    vocabData.items.forEach((item, idx) => {
      const userAnswer = answers.vocabulary[`vocab_${idx}`] || '';
      const correctDefIndex = vocabData.definitions.findIndex(d => d.id === item.answer);
      const correctChar = String.fromCharCode(97 + correctDefIndex);
      if (userAnswer.toLowerCase() === correctChar) vocabScore++;
    });
    pills.push({ label: 'Vocabulary', score: vocabScore, total: vocabData.items.length });
    totalScore += vocabScore;
    maxScore += vocabData.items.length;

    // 2. Fill in Blanks
    let fillScore = 0;
    const fillData = standardContent.activities.fillInTheBlanks;
    fillData.forEach((item, idx) => {
      if (normalizeString(answers.fillBlanks[idx] || '') === normalizeString(item.answer)) fillScore++;
    });
    pills.push({ label: 'Fill Blanks', score: fillScore, total: fillData.length });
    totalScore += fillScore;
    maxScore += fillData.length;

    // 3. Comprehension
    let compScore = 0;
    const compData = standardContent.activities.comprehension;
    compData.questions.forEach((q, idx) => {
      if ((answers.comprehension[idx] || '').toLowerCase() === q.answer.toLowerCase()) compScore++;
    });
    pills.push({ label: 'Comprehension', score: compScore, total: compData.questions.length });
    totalScore += compScore;
    maxScore += compData.questions.length;

    // 4. Scrambled
    let scrambledScore = 0;
    const scrambledData = standardContent.activities.scrambled;
    scrambledData.forEach((item, idx) => {
      if (normalizeString(answers.scrambled[idx] || '') === normalizeString(item.answer)) scrambledScore++;
    });
    pills.push({ label: 'Scrambled', score: scrambledScore, total: scrambledData.length });
    totalScore += scrambledScore;
    maxScore += scrambledData.length;

    // Written Expressions
    const writtenResponses: ReportWrittenResponse[] = standardContent.activities.writtenExpression.questions.map((q, i) => ({
      question: q.text,
      answer: answers.writing[i] || ''
    }));

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    return {
      title: displayTitle,
      nickname: studentName,
      studentId: studentId,
      homeroom: homeroom,
      finishTime: `${dateStr}, ${timeStr}`,
      totalScore,
      maxScore,
      pills,
      writtenResponses
    };
  };

  const handleFinishClick = () => {
    onFinish(calculateReportData());
  };

  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopyForGoogleDocs = async () => {
    const vocabItems = seededShuffle([...standardContent.activities.vocabulary.items], `${lesson.id}-print-vocab`);
    const scrambledItems = standardContent.activities.scrambled.map((item, idx) => {
      const words = item.answer.replace(/[.!?]+$/, '').split(/\s+/).filter((w: string) => w);
      const shuffled = seededShuffle([...words], `${lesson.id}-print-scramble-${idx}`);
      return { ...item, scrambledText: shuffled.join(' / ') };
    });

    const html = `
<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;max-width:750px;margin:0 auto;padding:16px;font-size:13px">
<table style="width:100%;border-collapse:collapse;margin-bottom:8px">
<tr>
<td style="vertical-align:bottom;padding-right:24px;width:55%">
<h1 style="font-size:18px;font-weight:bold;margin:0 0 2px 0">${displayTitle}</h1>
<p style="color:#666;margin:0;font-size:11px">Language: ${lesson.language} | Level: ${lesson.level}</p>
</td>
<td style="vertical-align:top;width:45%">
<table style="width:100%;border-collapse:collapse;font-size:11px">
<tr><td style="padding:3px 4px 0;color:#555;white-space:nowrap">Name</td><td style="padding:3px 6px 0"><u>${studentName || '____________________________'}</u></td></tr>
<tr><td style="padding:3px 4px 0;color:#555;white-space:nowrap">Student ID</td><td style="padding:3px 6px 0"><u>${studentId || '____________________________'}</u></td></tr>
<tr><td style="padding:3px 4px 0;color:#555;white-space:nowrap">Homeroom</td><td style="padding:3px 6px 0"><u>${homeroom || '____________________________'}</u></td></tr>
</table>
</td>
</tr>
</table>
<hr style="border:1px solid #ccc;margin:6px 0 10px">

<h2 style="font-size:13px;font-weight:bold;background:#f3f4f6;padding:4px 6px;margin:8px 0 4px">Reading Passage</h2>
<p style="font-size:12px;line-height:1.6;margin:0">${standardContent.readingText.replace(/\n/g, '<br>')}</p>

<h2 style="font-size:13px;font-weight:bold;background:#f3f4f6;padding:4px 6px;margin:10px 0 4px">1. Vocabulary Matching</h2>
<table style="width:100%;border-collapse:collapse">
<tr>
<td style="width:50%;vertical-align:top;padding-right:12px">
${vocabItems.map((item) => `<p style="margin:3px 0;font-size:12px">☐ &nbsp; ${item.label}</p>`).join('')}
</td>
<td style="width:50%;vertical-align:top">
${standardContent.activities.vocabulary.definitions.map((def, i) => `<p style="margin:3px 0;font-size:12px"><strong>${String.fromCharCode(97 + i)}.</strong> ${def.text}</p>`).join('')}
</td>
</tr>
</table>

<h2 style="font-size:13px;font-weight:bold;background:#f3f4f6;padding:4px 6px;margin:10px 0 4px">2. Fill in the Blanks</h2>
${standardContent.activities.fillInTheBlanks.map((item, i) => `<p style="margin:4px 0;font-size:12px">${i + 1}. ${item.before} <u>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</u> ${item.after}</p>`).join('')}

<h2 style="font-size:13px;font-weight:bold;background:#f3f4f6;padding:4px 6px;margin:10px 0 4px">3. Reading Comprehension</h2>
${standardContent.activities.comprehension.questions.map((q, i) => `<p style="margin:4px 0;font-size:12px">${i + 1}. ${q.text} &nbsp;&nbsp; <strong>True</strong> &nbsp; <strong>False</strong></p>`).join('')}

<h2 style="font-size:13px;font-weight:bold;background:#f3f4f6;padding:4px 6px;margin:10px 0 4px">4. Scrambled Sentences</h2>
${scrambledItems.map((item) => `<p style="color:#555;font-style:italic;margin:2px 0;font-size:12px">(${item.scrambledText})</p><p style="border-bottom:1px solid #ddd;margin:0 0 8px 0">&nbsp;</p>`).join('')}

<h2 style="font-size:13px;font-weight:bold;background:#f3f4f6;padding:4px 6px;margin:10px 0 4px">5. Written Expression</h2>
${standardContent.activities.writtenExpression.questions.map((q, i) => `<p style="font-size:12px;font-weight:medium;margin:4px 0 2px">${i + 1}. ${q.text}</p><p style="border-bottom:1px solid #ccc;margin:3px 0 10px">&nbsp;</p>`).join('')}

</body></html>`;

    try {
      await navigator.clipboard.write([
        new ClipboardItem({ 'text/html': new Blob([html], { type: 'text/html' }) })
      ]);
    } catch {
      try { await navigator.clipboard.writeText(html); } catch { /* ignore */ }
    }
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 6000);
  };

  const renderVideoExploration = () => {
    if (lesson.isVideoLesson || !lesson.videoUrl) return null;

    return (
      <section className="bg-white p-6 rounded-xl shadow-sm border border-green-100 mb-8 max-w-4xl mx-auto text-center animate-fade-in print:hidden">
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



  const printVocabItems = useMemo(() =>
    seededShuffle([...standardContent.activities.vocabulary.items], `${lesson.id}-print-vocab`),
    [standardContent, lesson.id]
  );

  const printScrambledItems = useMemo(() => {
    return standardContent.activities.scrambled.map((item, idx) => {
      const words = item.answer.replace(/[.!?]+$/, '').split(/\s+/).filter(w => w);
      const shuffled = seededShuffle([...words], `${lesson.id}-print-scramble-${idx}`);
      return {
        ...item,
        scrambledText: shuffled.join(' / ')
      };
    });
  }, [standardContent, lesson.id]);

  return (
    <GenericLessonLayout
      lesson={lesson}
      displayTitle={displayTitle}
      studentName={studentName}
      setStudentName={setStudentName}
      studentId={studentId}
      setStudentId={setStudentId}
      homeroom={homeroom}
      setHomeroom={setHomeroom}
      isNameLocked={isNameLocked}
      onBack={onReset}
      showBack={false}
    >
      {/* Media Section */}
      <div className="max-w-4xl mx-auto space-y-6 mb-6 print:hidden">
        {lesson.isVideoLesson && lesson.videoUrl && (
          <div className="relative pt-[56.25%] rounded-2xl overflow-hidden bg-black shadow-lg border border-green-100 animate-fade-in group">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={lesson.videoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
              allowFullScreen
            />
          </div>
        )}

        {lesson.imageUrl && (
          <div className="w-full flex justify-center">
            <img
              src={lesson.imageUrl}
              alt="Lesson topic"
              className="w-full h-auto max-h-[500px] object-contain rounded-2xl shadow-lg bg-white p-4 border border-green-100 animate-fade-in"
            />
          </div>
        )}
      </div>

      <div className="print:hidden">
        <ReadingPassage
          text={standardContent.readingText}
          language={lesson.language}
          onSlowToggle={() => toggleTTS(0.6)}
          onListenToggle={() => toggleTTS(1.0)}
          ttsStatus={ttsState.status}
          currentRate={ttsState.rate}
          hasVoices={availableVoices.length > 0}
          onVoiceOpen={availableVoices.length > 0 ? () => setIsVoiceModalOpen(true) : undefined}
          onTranslate={handleTranslate}
          passageRef={passageRef}
        />
      </div>

      <div className="print:hidden">
        {availableVoices.length > 0 && (
          <VoiceSelectorModal
            isOpen={isVoiceModalOpen}
            onClose={() => setIsVoiceModalOpen(false)}
            voices={availableVoices}
            selectedVoiceName={selectedVoiceName}
            onSelectVoice={setSelectedVoiceName}
            language={lesson.language}
            hasRecordedAudio={!!lesson.audioFileUrl}
            audioPreference={audioPreference}
            onSelectPreference={setAudioPreference}
          />
        )}
      </div>

      {/* Worksheet Actions */}
      <div className="max-w-4xl mx-auto mb-2 print:hidden">
        <div className="flex gap-3 justify-end">
          <button
            onClick={handleCopyForGoogleDocs}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm"
          >
            {copySuccess ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
            {copySuccess ? 'Copied!' : 'Copy for Google Docs'}
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
        </div>
        {copySuccess && (
          <div className="mt-2 flex items-start gap-3 bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm text-green-800 animate-fade-in">
            <Check className="w-4 h-4 mt-0.5 text-green-600 shrink-0" />
            <div className="flex-1">
              <span className="font-semibold">Worksheet copied!</span>{' '}
              Paste it into a Google Doc to get started.
            </div>
            <a
              href="https://docs.new"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-1 bg-green-700 text-white text-xs font-semibold px-3 py-1.5 rounded-md hover:bg-green-800 transition-colors"
            >
              Open Google Docs →
            </a>
          </div>
        )}
      </div>

      {/* Activities Section */}
      <div className="space-y-2 pb-4 print:hidden">
        <section id="vocabulary">
          <CollapsibleActivity 
            isCompleted={completionStates.vocabularyChecked} 
            title="Vocabulary Matching"
            score={`${vocabScore}/${standardContent.activities.vocabulary.items.length}`}
          >
            <Vocabulary 
              data={standardContent.activities.vocabulary}
              language={lesson.language}
              onChange={(data) => updateAnswers('vocabulary', data)}
              savedAnswers={answers.vocabulary}
              voiceName={selectedVoiceName}
              savedIsChecked={completionStates.vocabularyChecked}
              onComplete={(isChecked) => setCompletionStates(prev => ({ ...prev, vocabularyChecked: isChecked }))}
              toggleTTS={toggleTTS}
              ttsState={ttsState}
              lessonId={lesson.id}
            />
          </CollapsibleActivity>
        </section>

        <section id="fill-blanks">
          <CollapsibleActivity 
            isCompleted={completionStates.fillBlanksChecked} 
            title="Fill in the Blanks"
            score={`${fillScore}/${standardContent.activities.fillInTheBlanks.length}`}
          >
            <FillInBlanks 
              data={standardContent.activities.fillInTheBlanks}
              vocabItems={standardContent.activities.vocabulary.items}
              level={lesson.level.replace('Level ', '')}
              language={lesson.language}
              onChange={(data) => updateAnswers('fillBlanks', data)}
              savedAnswers={answers.fillBlanks}
              voiceName={selectedVoiceName}
              savedIsChecked={completionStates.fillBlanksChecked}
              onComplete={(isChecked) => setCompletionStates(prev => ({ ...prev, fillBlanksChecked: isChecked }))}
              toggleTTS={toggleTTS}
              ttsState={ttsState}
              lessonId={lesson.id}
            />
          </CollapsibleActivity>
        </section>

        <section id="comprehension">
          <CollapsibleActivity
            isCompleted={completionStates.comprehensionCompleted}
            title="Comprehension Check"
            score={`${compScore}/${standardContent.activities.comprehension.questions.length}`}
          >
            <Comprehension
              data={standardContent.activities.comprehension}
              readingText={standardContent.readingText}
              language={lesson.language}
              onChange={(data) => updateAnswers('comprehension', data)}
              savedAnswers={answers.comprehension}
              voiceName={selectedVoiceName}
              savedIsCompleted={completionStates.comprehensionCompleted}
              onComplete={(isChecked) => setCompletionStates(prev => ({ ...prev, comprehensionCompleted: isChecked }))}
              toggleTTS={toggleTTS}
              ttsState={ttsState}
              lessonId={lesson.id}
              showReferenceText={false}
            />
          </CollapsibleActivity>
        </section>

        <section id="scrambled">
          <CollapsibleActivity
            isCompleted={completionStates.scrambledCompleted}
            title="Scrambled Sentences"
            score={`${scrambledScore}/${standardContent.activities.scrambled.length}`}
          >
            <Scrambled 
              data={standardContent.activities.scrambled}
              level={lesson.level.replace('Level ', '')}
              language={lesson.language}
              onChange={(data) => updateAnswers('scrambled', data)}
              savedAnswers={answers.scrambled}
              voiceName={selectedVoiceName}
              savedIsChecked={completionStates.scrambledCompleted}
              onComplete={(isChecked) => setCompletionStates(prev => ({ ...prev, scrambledCompleted: isChecked }))}
              toggleTTS={toggleTTS}
              ttsState={ttsState}
              lessonId={lesson.id}
            />
          </CollapsibleActivity>
        </section>

        <section id="writing">
          <WrittenExpression
            data={standardContent.activities.writtenExpression}
            savedAnswers={answers.writing}
            onChange={(newWriting) => updateAnswers('writing', newWriting)}
          />
        </section>

        <LessonFooter
          studentName={studentName}
          setStudentName={setStudentName}
          studentId={studentId}
          setStudentId={setStudentId}
          homeroom={homeroom}
          setHomeroom={setHomeroom}
          isNameLocked={isNameLocked}
          onFinish={handleFinishClick}
          onReset={onReset}
        />

        <div className="mt-8">
          {renderVideoExploration()}
        </div>
      </div>

      {/* Print-only Layout */}
      <div className="hidden print:block" style={{ fontSize: '12px', padding: '16px 24px' }}>
        {/* Header */}
        <div className="flex justify-between items-start border-b border-gray-300 pb-2 mb-3">
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">{displayTitle}</h1>
            <p className="text-xs text-gray-500">Language: {lesson.language} | Level: {lesson.level}</p>
          </div>
          <div className="text-right space-y-1 text-xs text-gray-500">
            <div className="border-b border-gray-300 w-44 text-left">Name: <span className="font-medium text-gray-800">{studentName || ''}</span></div>
            <div className="border-b border-gray-300 w-44 text-left">Student ID: <span className="font-medium text-gray-800">{studentId || ''}</span></div>
            <div className="border-b border-gray-300 w-44 text-left">Homeroom: <span className="font-medium text-gray-800">{homeroom || ''}</span></div>
          </div>
        </div>

        <div className="space-y-3">
          <section>
            <h2 className="text-sm font-bold mb-1 bg-gray-100 px-2 py-1">Reading Passage</h2>
            <p className="text-xs leading-relaxed">{standardContent.readingText}</p>
          </section>

          <section>
            <h2 className="text-sm font-bold mb-1 bg-gray-100 px-2 py-1">1. Vocabulary Matching</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                {printVocabItems.map((item, i) => (
                  <div key={i} className="flex gap-1 items-center">
                    <span className="w-5 h-5 border border-gray-400 shrink-0 inline-block"></span>
                    <span className="text-xs">{item.label}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-1">
                {standardContent.activities.vocabulary.definitions.map((def, i) => (
                  <div key={i} className="text-xs">
                    <span className="font-bold">{String.fromCharCode(97 + i)}.</span> {def.text}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-sm font-bold mb-1 bg-gray-100 px-2 py-1">2. Fill in the Blanks</h2>
            <div className="space-y-1">
              {standardContent.activities.fillInTheBlanks.map((item, i) => (
                <div key={i} className="text-xs">
                  {i + 1}. {item.before} <u>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</u> {item.after}
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-sm font-bold mb-1 bg-gray-100 px-2 py-1">3. Reading Comprehension</h2>
            <div className="space-y-1">
              {standardContent.activities.comprehension.questions.map((q, i) => (
                <div key={i} className="flex justify-between items-center border-b border-gray-100 pb-1">
                  <span className="text-xs">{i + 1}. {q.text}</span>
                  <span className="font-bold text-xs flex gap-3 shrink-0 ml-2">
                    <span>True</span>
                    <span>False</span>
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-sm font-bold mb-1 bg-gray-100 px-2 py-1">4. Scrambled Sentences</h2>
            <div className="space-y-2">
              {printScrambledItems.map((item, i) => (
                <div key={i}>
                  <p className="text-xs text-gray-500 italic mb-0.5">({item.scrambledText})</p>
                  <div className="border-b border-gray-300 h-5"></div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-sm font-bold mb-1 bg-gray-100 px-2 py-1">5. Written Expression</h2>
            <div className="space-y-3">
              {standardContent.activities.writtenExpression.questions.map((q, i) => (
                <div key={i}>
                  <p className="text-xs font-bold mb-1">{i + 1}. {q.text}</p>
                  <div className="space-y-2">
                    <div className="border-b border-gray-300 h-5"></div>
                    <div className="border-b border-gray-300 h-5"></div>
                    <div className="border-b border-gray-300 h-5"></div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

    </GenericLessonLayout>
  );
};
