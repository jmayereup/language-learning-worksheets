import React, { useState, useMemo, useEffect } from 'react';
import { ParsedLesson, UserAnswers } from '../../types';
import { speakText, shuffleArray, getLangCode, shouldShowAudioControls, getAndroidIntentLink } from '../../utils/textUtils';
import { Button } from '../UI/Button';
import { Vocabulary } from '../Activities/Vocabulary';
import { FillInBlanks } from '../Activities/FillInBlanks';
import { Comprehension } from '../Activities/Comprehension';
import { Scrambled } from '../Activities/Scrambled';
import { Volume2, Turtle, Printer, Eye, EyeOff, Languages, Pause, Play } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  lesson: ParsedLesson;
  onBack: () => void;
}

const ScorePill = ({ label, score, total }: { label: string, score: number, total: number }) => (
  <div className="bg-white border border-gray-200 rounded p-2 flex justify-between items-center shadow-sm">
      <span className="text-xs text-gray-600 font-medium truncate mr-2">{label}</span>
      <span className={`text-sm font-bold ${score === total ? 'text-green-600' : 'text-blue-600'}`}>
          {score}/{total}
      </span>
  </div>
);

export const LessonView: React.FC<Props> = ({ lesson, onBack }) => {
  const [answers, setAnswers] = useState<UserAnswers>({
    vocabulary: {},
    fillBlanks: {},
    comprehension: {},
    scrambled: {},
    writing: {}
  });

  const [showResults, setShowResults] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [isNameLocked, setIsNameLocked] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  const [finishTime, setFinishTime] = useState<string>('');
  
  // TTS State
  const [ttsState, setTtsState] = useState<{ status: 'playing' | 'paused' | 'stopped', rate: number }>({ status: 'stopped', rate: 1.0 });

  const displayTitle = lesson.title || lesson.content.title;

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const toggleTTS = (rate: number) => {
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
    
    const utterance = new SpeechSynthesisUtterance(lesson.content.readingText);
    utterance.lang = getLangCode(lesson.language);
    utterance.rate = rate;
    
    utterance.onend = () => {
        setTtsState(prev => ({ ...prev, status: 'stopped' }));
    };

    synth.speak(utterance);
    setTtsState({ status: 'playing', rate });
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

  const handleTranslate = () => {
    const text = encodeURIComponent(lesson.content.readingText);
    const langMap: Record<string, string> = {
      "English": "en",
      "French": "fr",
      "Spanish": "es",
      "German": "de"
    };
    const sourceLang = langMap[lesson.language] || 'auto';
    window.open(`https://translate.google.com/?sl=${sourceLang}&text=${text}&op=translate`, '_blank');
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
        if ((answers.fillBlanks[idx] || '').trim().toLowerCase().replace(/[.!?]/g,'') === item.answer.trim().toLowerCase().replace(/[.!?]/g,'')) fillScore++;
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
        if ((answers.scrambled[idx] || '').trim().toLowerCase().replace(/[.!?]/g,'') === item.answer.trim().toLowerCase().replace(/[.!?]/g,'')) scrambledScore++;
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
    if (!studentName.trim()) return;

    // Lock the name once submitted
    setIsNameLocked(true);
    
    setFinishTime(new Date().toLocaleString('en-US', { 
      dateStyle: 'short', 
      timeStyle: 'short' 
    }));
    setShowResults(true);
    
    // Only fire confetti if it's the first time or if score improved (optional, keeping simple here)
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  if (showResults) {
    const scores = calculateBreakdown();

    return (
      <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-lg border-t-4 border-blue-600 animate-fade-in my-4 print:hidden">
        {/* Compact Header */}
        <div className="flex justify-between items-start mb-3 pb-2 border-b border-gray-100">
           <div className="pr-4">
              <h2 className="text-xl font-bold text-blue-900 leading-tight">Report Card</h2>
              <div className="text-xs text-gray-500 mt-1 leading-tight">{displayTitle}</div>
           </div>
           <div className="text-right whitespace-nowrap">
              <div className="text-3xl font-bold text-blue-600 leading-none">
                 {scores.totalScore}<span className="text-lg text-gray-400">/{scores.maxScore}</span>
              </div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wide font-bold mt-1">Total Score</div>
           </div>
        </div>

        {/* Student Info Bar */}
        <div className="bg-gray-50 rounded-lg p-2.5 mb-3 flex justify-between items-center text-sm border border-gray-100">
            <div>
               <div className="text-[10px] text-gray-500 uppercase font-bold">Student</div>
               <div className="font-bold text-gray-800 text-sm">{studentName || 'Anonymous'}</div>
            </div>
            <div className="text-right">
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
                            <p className="font-semibold text-blue-800 text-xs mb-1 line-clamp-2 leading-tight">{i+1}. {q.text}</p>
                            <p className="text-gray-600 text-xs pl-2 border-l-2 border-blue-200 italic bg-gray-50 p-1.5 rounded-r leading-snug">
                                {answers.writing[i] || 'No answer provided'}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* Footer Message */}
        <div className="mt-3 text-center">
            <p className="text-[10px] text-gray-400 italic">Take a screenshot to send to your teacher.</p>
        </div>

        <div className="mt-4 flex justify-center gap-2 print:hidden">
          <Button onClick={() => window.print()} variant="secondary" size="sm">Print</Button>
          {/* Back button now returns to the lesson for revisions instead of exiting */}
          <Button onClick={() => setShowResults(false)} size="sm">Back to Lesson</Button>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="max-w-4xl mx-auto pb-20 print:hidden">
      {/* Header */}
      <header className="mb-8 text-center">
         <Button variant="outline" size="sm" onClick={onBack} className="mb-4">← Change Lesson</Button>
         <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-2">{displayTitle}</h1>
         <div className="flex items-center justify-center gap-4 text-gray-600">
           <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold">{lesson.level}</span>
           <button onClick={handlePrint} className="flex items-center hover:text-blue-600 transition-colors">
             <Printer className="w-4 h-4 mr-1" /> Print
           </button>
         </div>
      </header>

      {/* Media Section */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-indigo-100 mb-8">
        <h2 className="text-xl font-bold text-indigo-900 mb-4">Reading Passage</h2>

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
        <div className="flex flex-wrap gap-2 mb-4 justify-end">
            <Button size="sm" variant="secondary" onClick={handleTranslate} title="Translate via Google">
                <Languages className="w-4 h-4 mr-2" /> Translate
            </Button>
            
            {shouldShowAudioControls() ? (
              <>
                <Button size="sm" variant="secondary" onClick={() => toggleTTS(0.6)}>
                    {ttsState.rate === 0.6 && ttsState.status === 'playing' ? (
                        <><Pause className="w-4 h-4 mr-2" /> Pause</>
                    ) : ttsState.rate === 0.6 && ttsState.status === 'paused' ? (
                        <><Play className="w-4 h-4 mr-2" /> Resume</>
                    ) : (
                        <><Turtle className="w-4 h-4 mr-2" /> Slow</>
                    )}
                </Button>

                <Button size="sm" variant="secondary" onClick={() => toggleTTS(1.0)}>
                    {ttsState.rate === 1.0 && ttsState.status === 'playing' ? (
                        <><Pause className="w-4 h-4 mr-2" /> Pause</>
                    ) : ttsState.rate === 1.0 && ttsState.status === 'paused' ? (
                        <><Play className="w-4 h-4 mr-2" /> Resume</>
                    ) : (
                        <><Volume2 className="w-4 h-4 mr-2" /> Listen</>
                    )}
                </Button>
              </>
            ) : (
               <div className="flex items-center gap-2 bg-yellow-50 p-2 rounded border border-yellow-200">
                  <span className="text-xs text-yellow-800">⚠️ Audio unavailable.</span>
                  {getAndroidIntentLink() ? (
                      <a href={getAndroidIntentLink()} className="text-xs font-bold text-blue-600 underline">Open in Chrome</a>
                  ) : (
                      <span className="text-xs text-gray-500">Please use Chrome or Safari.</span>
                  )}
               </div>
            )}
        </div>

        <div className="prose max-w-none font-serif text-lg md:text-xl leading-relaxed text-gray-800 bg-indigo-50/50 p-6 rounded-lg">
            {lesson.content.readingText}
        </div>
      </section>

      {/* Activity 1: Vocabulary */}
      <Vocabulary 
        data={lesson.content.activities.vocabulary} 
        savedAnswers={answers.vocabulary}
        onChange={(a) => updateAnswers('vocabulary', a)}
      />

      {/* Activity 2: Fill in Blanks */}
      <FillInBlanks 
        data={lesson.content.activities.fillInTheBlanks} 
        vocabItems={lesson.content.activities.vocabulary.items}
        level={lesson.level.replace('Level ', '')}
        savedAnswers={answers.fillBlanks}
        onChange={(a) => updateAnswers('fillBlanks', a)}
      />
      
      {/* Activity 3: Comprehension */}
      <Comprehension
        data={lesson.content.activities.comprehension}
        readingText={lesson.content.readingText}
        savedAnswers={answers.comprehension}
        onChange={(a) => updateAnswers('comprehension', a)}
      />
      
      {/* Activity 4: Scrambled */}
      <Scrambled 
        data={lesson.content.activities.scrambled}
        level={lesson.level.replace('Level ', '')}
        language={lesson.language}
        savedAnswers={answers.scrambled}
        onChange={(a) => updateAnswers('scrambled', a)}
      />

      {/* Activity 5: Writing */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
         <div className="flex justify-between items-center mb-4">
             <h2 className="text-2xl font-bold text-blue-800">Activity 5: Written Expression</h2>
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
             <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg animate-fade-in">
                 <h3 className="font-semibold text-blue-900 mb-2">Examples:</h3>
                 <div 
                   className="prose prose-sm text-blue-800"
                   dangerouslySetInnerHTML={{__html: lesson.content.activities.writtenExpression.examples}} 
                 />
             </div>
         )}

         <div className="space-y-6">
            {lesson.content.activities.writtenExpression.questions.map((q, i) => (
                <div key={i}>
                    <label className="block font-medium text-gray-800 mb-2 text-lg">{i+1}. {q.text}</label>
                    <textarea 
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow text-lg"
                      rows={3}
                      placeholder="Your answer..."
                      value={answers.writing[i] || ''}
                      onChange={(e) => updateAnswers('writing', {...answers.writing, [i]: e.target.value})}
                    />
                </div>
            ))}
         </div>
      </section>

      {/* Submission */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 rounded-xl shadow-lg text-white text-center">
         <h2 className="text-2xl font-bold mb-4">{isNameLocked ? 'Update Score' : 'Finished?'}</h2>
         <div className="max-w-md mx-auto mb-6">
            <label className="block text-blue-100 mb-2 text-sm font-semibold uppercase tracking-wider">Nickname and Student Number</label>
            {isNameLocked ? (
              <div className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white font-bold text-xl backdrop-blur-sm">
                 {studentName}
              </div>
            ) : (
              <input 
                type="text" 
                className="w-full p-3 rounded-lg text-gray-800 focus:outline-none focus:ring-4 focus:ring-blue-400"
                placeholder="Jake 01"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
              />
            )}
         </div>
         <button 
           onClick={handleFinish}
           disabled={!studentName.trim()}
           className="bg-white text-blue-700 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
         >
           {isNameLocked ? 'See Updated Report Card' : 'See My Score'}
         </button>
      </section>
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
             <div className="text-xs text-justify leading-snug columns-2 gap-6">
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
                           <span className="font-bold mr-1">{String.fromCharCode(97+i)}.</span> 
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
                         {i+1}. {item.before} <span className="inline-block w-16 border-b border-black"></span> {item.after}
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
                          {i+1}. {q.text} <span className="ml-2 whitespace-nowrap">[ ] True [ ] False</span>
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
                          <p className="italic mb-1">{i+1}. {item.scrambledText}</p>
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
                          <p className="font-semibold mb-1">{i+1}. {q.text}</p>
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