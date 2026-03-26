import React, { useState } from 'react';
import { 
  MessageSquare, 
  User, 
  Play, 
  BookOpen, 
  CheckCircle2, 
  ArrowRight, 
  RefreshCcw,
  Sparkles,
  Languages,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Data ---

interface DialogueLine {
  character: 'Gor' | 'Gayane';
  spanish: string;
  armenian: string;
}

const DIALOGUE: DialogueLine[] = [
  { character: 'Gor', spanish: "Hola, Gayane. ¿Cómo estás?", armenian: "Բարև, Գայանե։ Ինչպե՞ս ես։" },
  { character: 'Gayane', spanish: "Hola, Gor. Estoy bien. Tengo mucha tarea hoy.", armenian: "Բարև, Գոռ։ Լավ եմ։ Այսօր շատ տնային աշխատանք ունեմ։" },
  { character: 'Gor', spanish: "Yo también tengo tarea. Tengo que estudiar español.", armenian: "Ես էլ ունեմ տնային աշխատանք։ Պետք է իսպաներեն սովորեմ։" },
  { character: 'Gayane', spanish: "Sí, yo también tengo que estudiar. Quiero aprender más palabras.", armenian: "Այո, ես էլ պետք է սովորեմ։ Ուզում եմ ավելի շատ բառեր սովորել։" },
  { character: 'Gor', spanish: "Yo quiero hablar español bien.", armenian: "Ես ուզում եմ լավ իսպաներեն խոսել։" },
  { character: 'Gayane', spanish: "¿Tienes libro de español?", armenian: "Դու իսպաներենի գիրք ունե՞ս։" },
  { character: 'Gor', spanish: "Sí, tengo un libro y un cuaderno.", armenian: "Այո, ես ունեմ գիրք և տետր։" },
  { character: 'Gayane', spanish: "Perfecto. Tenemos que estudiar juntos.", armenian: "Հիանալի։ Մենք պետք է միասին սովորենք։" },
  { character: 'Gor', spanish: "Sí, quiero estudiar contigo.", armenian: "Այո, ուզում եմ քեզ հետ սովորել։" },
  { character: 'Gayane', spanish: "¡Vamos a estudiar ahora!", armenian: "Եկ, հիմա սովորենք։" },
];

const GOR_IMG = "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=300&q=80";
const GAYANE_IMG = "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80";

// --- Components ---

export default function DialogueGame() {
  const [view, setView] = useState<'menu' | 'reading' | 'roleplay_select' | 'roleplay_game' | 'finish'>('menu');
  const [selectedRole, setSelectedRole] = useState<'Gor' | 'Gayane' | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const startRoleplay = (role: 'Gor' | 'Gayane') => {
    setSelectedRole(role);
    setCurrentStep(0);
    generateOptions(0, role);
    setView('roleplay_game');
  };

  const generateOptions = (step: number, role: 'Gor' | 'Gayane') => {
    const correct = DIALOGUE[step].spanish;
    const others = DIALOGUE
      .filter(line => line.character === role && line.spanish !== correct)
      .map(line => line.spanish)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);
    
    setOptions([correct, ...others].sort(() => Math.random() - 0.5));
  };

  const handleChoice = (choice: string) => {
    if (feedback) return;
    
    if (choice === DIALOGUE[currentStep].spanish) {
      setFeedback('correct');
      setTimeout(() => {
        setFeedback(null);
        if (currentStep < DIALOGUE.length - 1) {
          const next = currentStep + 1;
          setCurrentStep(next);
          // If next line is not user's role, auto-advance after showing it
          if (DIALOGUE[next].character !== selectedRole) {
            setTimeout(() => {
              if (next < DIALOGUE.length - 1) {
                const afterNext = next + 1;
                setCurrentStep(afterNext);
                generateOptions(afterNext, selectedRole!);
              } else {
                setView('finish');
              }
            }, 2000);
          } else {
            generateOptions(next, selectedRole!);
          }
        } else {
          setView('finish');
        }
      }, 1000);
    } else {
      setFeedback('wrong');
      setTimeout(() => setFeedback(null), 1000);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF0] text-slate-900 font-sans selection:bg-amber-200">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-200 rotate-3">
              <MessageSquare className="text-white w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter uppercase italic text-amber-900">Estudiar Juntos</h1>
              <p className="text-[10px] font-bold text-amber-600 uppercase tracking-[0.2em]">Gor & Gayane Dialogue</p>
            </div>
          </div>
          {view !== 'menu' && (
            <button 
              onClick={() => setView('menu')}
              className="p-3 bg-white rounded-full shadow-md hover:scale-110 transition-transform text-amber-600"
            >
              <RefreshCcw className="w-5 h-5" />
            </button>
          )}
        </header>

        <AnimatePresence mode="wait">
          {view === 'menu' && (
            <motion.div 
              key="menu"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-12 text-center"
            >
              <div className="flex justify-center gap-8 mb-8">
                <div className="relative group">
                  <img src={GOR_IMG} alt="Gor" className="w-32 h-32 rounded-3xl object-cover shadow-xl border-4 border-white group-hover:rotate-3 transition-transform" referrerPolicy="no-referrer" />
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full font-black text-xs shadow-lg">ԳՈՌ</span>
                </div>
                <div className="relative group">
                  <img src={GAYANE_IMG} alt="Gayane" className="w-32 h-32 rounded-3xl object-cover shadow-xl border-4 border-white group-hover:-rotate-3 transition-transform" referrerPolicy="no-referrer" />
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-pink-500 text-white px-4 py-1 rounded-full font-black text-xs shadow-lg">ԳԱՅԱՆԵ</span>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-amber-900 uppercase italic leading-none">
                  ՍՈՎՈՐԵՆՔ <br />
                  <span className="text-amber-500">ՄԻԱՍԻՆ</span>
                </h2>
                <p className="text-lg font-medium text-slate-500 max-w-md mx-auto">
                  Կարդա երկխոսությունը և խաղա դերերով՝ ամրապնդելու համար իսպաներենի գիտելիքներդ:
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button 
                  onClick={() => setView('reading')}
                  className="bg-white text-amber-600 px-10 py-6 rounded-[32px] font-black text-xl shadow-xl shadow-amber-100 hover:translate-y-1 transition-all flex items-center justify-center gap-3 border-2 border-amber-50"
                >
                  <BookOpen />
                  ԿԱՐԴԱԼ ՏԵՔՍՏԸ
                </button>
                <button 
                  onClick={() => setView('roleplay_select')}
                  className="bg-amber-500 text-white px-10 py-6 rounded-[32px] font-black text-xl shadow-xl shadow-amber-200 hover:translate-y-1 transition-all flex items-center justify-center gap-3"
                >
                  <Play />
                  ԽԱՂԱԼ ԴԵՐԵՐՈՎ
                </button>
              </div>
            </motion.div>
          )}

          {view === 'reading' && (
            <motion.div 
              key="reading"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-8"
            >
              <div className="bg-white rounded-[40px] p-6 md:p-10 shadow-2xl border-4 border-amber-50">
                <div className="flex items-center gap-4 mb-8">
                  <Languages className="text-amber-500 w-8 h-8" />
                  <h3 className="text-2xl font-black uppercase italic text-amber-900">Երկխոսություն</h3>
                </div>

                <div className="space-y-6">
                  {DIALOGUE.map((line, i) => (
                    <div key={i} className={`flex gap-4 ${line.character === 'Gayane' ? 'flex-row-reverse text-right' : ''}`}>
                      <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center font-black text-white shadow-md ${line.character === 'Gor' ? 'bg-blue-500' : 'bg-pink-500'}`}>
                        {line.character[0]}
                      </div>
                      <div className={`max-w-[80%] p-4 rounded-3xl shadow-sm border ${line.character === 'Gor' ? 'bg-blue-50 rounded-bl-none border-blue-100' : 'bg-pink-50 rounded-br-none border-pink-100'}`}>
                        <p className="text-lg font-black text-slate-800">{line.spanish}</p>
                        <p className="text-sm font-medium text-slate-500 mt-1">{line.armenian}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-center">
                <button 
                  onClick={() => setView('roleplay_select')}
                  className="bg-amber-500 text-white px-12 py-5 rounded-full font-black text-2xl shadow-xl hover:scale-105 transition-transform flex items-center gap-4"
                >
                  ԱՆՑՆԵԼ ԽԱՂԻՆ
                  <ArrowRight />
                </button>
              </div>
            </motion.div>
          )}

          {view === 'roleplay_select' && (
            <motion.div 
              key="select"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-12 text-center"
            >
              <h2 className="text-4xl font-black text-amber-900 uppercase italic">Ընտրիր քո կերպարին</h2>
              
              <div className="flex flex-col sm:flex-row gap-8 justify-center">
                <button 
                  onClick={() => startRoleplay('Gor')}
                  className="group bg-white p-8 rounded-[48px] shadow-xl border-4 border-transparent hover:border-blue-500 transition-all text-center space-y-4"
                >
                  <img src={GOR_IMG} alt="Gor" className="w-40 h-40 rounded-3xl object-cover mx-auto shadow-lg group-hover:scale-105 transition-transform" referrerPolicy="no-referrer" />
                  <p className="text-2xl font-black text-blue-500">ԳՈՌ</p>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Խաղալ որպես տղա</p>
                </button>

                <button 
                  onClick={() => startRoleplay('Gayane')}
                  className="group bg-white p-8 rounded-[48px] shadow-xl border-4 border-transparent hover:border-pink-500 transition-all text-center space-y-4"
                >
                  <img src={GAYANE_IMG} alt="Gayane" className="w-40 h-40 rounded-3xl object-cover mx-auto shadow-lg group-hover:scale-105 transition-transform" referrerPolicy="no-referrer" />
                  <p className="text-2xl font-black text-pink-500">ԳԱՅԱՆԵ</p>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Խաղալ որպես աղջիկ</p>
                </button>
              </div>
            </motion.div>
          )}

          {view === 'roleplay_game' && (
            <motion.div 
              key="game"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              <div className="bg-white rounded-[48px] p-8 md:p-16 shadow-2xl border-8 border-amber-50 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Sparkles className="w-32 h-32" />
                </div>

                <div className="relative z-10 space-y-12">
                  {/* Current Dialogue Display */}
                  <div className="space-y-8">
                    {DIALOGUE.slice(0, currentStep + 1).map((line, i) => {
                      const isUser = line.character === selectedRole;
                      const isCurrent = i === currentStep;
                      
                      if (isCurrent && isUser) {
                        return (
                          <div key={i} className={`flex gap-4 ${line.character === 'Gayane' ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center font-black text-white shadow-lg animate-bounce ${line.character === 'Gor' ? 'bg-blue-500' : 'bg-pink-500'}`}>
                              ?
                            </div>
                            <div className="p-6 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex-1">
                              <p className="text-slate-400 font-bold italic">Ընտրիր ճիշտ պատասխանը...</p>
                              <p className="text-sm text-slate-400 mt-1">({line.armenian})</p>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <motion.div 
                          key={i} 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex gap-4 ${line.character === 'Gayane' ? 'flex-row-reverse text-right' : ''}`}
                        >
                          <img 
                            src={line.character === 'Gor' ? GOR_IMG : GAYANE_IMG} 
                            className="w-12 h-12 rounded-2xl object-cover shadow-md border-2 border-white" 
                            referrerPolicy="no-referrer"
                          />
                          <div className={`max-w-[80%] p-5 rounded-3xl shadow-sm border-2 ${line.character === 'Gor' ? 'bg-blue-50 rounded-bl-none border-blue-100' : 'bg-pink-50 rounded-br-none border-pink-100'}`}>
                            <p className="text-xl font-black text-slate-800">{line.spanish}</p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Options for User */}
                  {DIALOGUE[currentStep].character === selectedRole && (
                    <div className="grid gap-4">
                      {options.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => handleChoice(opt)}
                          className={`p-5 rounded-3xl font-black text-lg transition-all border-4 text-left flex items-center justify-between group ${
                            feedback === 'correct' && opt === DIALOGUE[currentStep].spanish
                              ? 'bg-green-500 border-green-400 text-white'
                              : feedback === 'wrong' && opt !== DIALOGUE[currentStep].spanish
                              ? 'bg-red-50 border-red-100 text-red-400'
                              : 'bg-white border-slate-100 text-slate-700 hover:border-amber-400 hover:bg-amber-50'
                          }`}
                        >
                          {opt}
                          <ChevronRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))}
                    </div>
                  )}

                  {feedback && (
                    <div className={`text-center font-black text-2xl uppercase italic ${feedback === 'correct' ? 'text-green-500' : 'text-red-500'}`}>
                      {feedback === 'correct' ? 'Հիանալի է!' : 'Փորձիր նորից!'}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {view === 'finish' && (
            <motion.div 
              key="finish"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 flex flex-col items-center justify-center text-center space-y-12"
            >
              <div className="relative">
                <div className="w-56 h-56 bg-amber-500 rounded-[48px] flex items-center justify-center shadow-2xl rotate-6 relative z-10">
                  <CheckCircle2 className="w-28 h-28 text-white" />
                </div>
                <div className="absolute inset-0 bg-amber-400 blur-3xl opacity-30 animate-pulse" />
              </div>

              <div className="space-y-6">
                <h2 className="text-6xl font-black tracking-tighter uppercase italic text-amber-900">ԱՊՐԵՍ!</h2>
                <p className="text-xl font-medium text-slate-500 max-w-md mx-auto">
                  Դու հաջողությամբ ավարտեցիր երկխոսությունը {selectedRole === 'Gor' ? 'Գոռի' : 'Գայանեի'} դերում:
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => setView('menu')}
                  className="bg-amber-500 text-white px-12 py-6 rounded-full font-black text-2xl shadow-xl hover:scale-105 transition-all flex items-center gap-4"
                >
                  <RefreshCcw />
                  ԽԱՂԱԼ ՆՈՐԻՑ
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <footer className="mt-12 py-8 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-sm border border-amber-100">
            <User className="w-4 h-4 text-amber-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              Gor & Gayane • Roleplay Edition
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
