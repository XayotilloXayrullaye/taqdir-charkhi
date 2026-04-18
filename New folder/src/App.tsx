import React, { useState, useCallback, useEffect } from 'react';
import { Wheel } from './components/Wheel';
import { EntriesList } from './components/EntriesList';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Entry, DEFAULT_ENTRIES, WheelSettings, THEMES } from './types';
import { Settings, Volume2, VolumeX, Trophy, X, Share2, Download, Star, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Howl } from 'howler';

const WIN_SOUND = 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3';
const ULTIMATE_WIN_SOUND = 'https://assets.mixkit.co/active_storage/sfx/1433/1433-preview.mp3';
const START_SOUND = 'https://assets.mixkit.co/active_storage/sfx/2578/2578-preview.mp3';

export default function App() {
  const [entries, setEntries] = useState<Entry[]>(DEFAULT_ENTRIES);
  const [history, setHistory] = useState<Entry[]>([]);
  const [settings, setSettings] = useState<WheelSettings>({
    spinDuration: 5,
    showWinnerDialog: true,
    enableSound: true,
    theme: 'natural',
  });

  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<Entry | null>(null);
  const [winSound, setWinSound] = useState<Howl | null>(null);
  const [ultimateWinSound, setUltimateWinSound] = useState<Howl | null>(null);
  const [startSound, setStartSound] = useState<Howl | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWinSound(new Howl({ src: [WIN_SOUND], volume: 0.7 }));
      setUltimateWinSound(new Howl({ src: [ULTIMATE_WIN_SOUND], volume: 0.9 }));
      setStartSound(new Howl({ src: [START_SOUND], volume: 0.6 }));
    }
  }, []);

  const handleFinish = useCallback((wonEntry: Entry) => {
    setWinner(wonEntry);
    setHistory(prev => [wonEntry, ...prev].slice(0, 10));
    
    const isUltimate = wonEntry.text.toLowerCase().includes('xayotillo');

    if (settings.enableSound) {
      if (isUltimate && ultimateWinSound) {
        ultimateWinSound.play();
      } else if (winSound) {
        winSound.play();
      }
    }
    
    // Fire confetti / Fireworks
    if (isUltimate) {
      const end = Date.now() + (10 * 1000);
      const colors = ['#FFE400', '#FFBD00', '#E89400', '#FFCA00', '#ff0000', '#00ff00', '#0000ff'];

      (function frame() {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.6 },
          colors: colors,
          zIndex: 100,
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.6 },
          colors: colors,
          zIndex: 100,
        });

        // Random bursts (fireworks style)
        if (Math.random() < 0.2) {
          confetti({
            particleCount: 80,
            startVelocity: 30,
            spread: 360,
            origin: { x: Math.random(), y: Math.random() - 0.2 },
            colors: colors,
            shapes: ['star'],
            zIndex: 100,
          });
        }

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());
    } else {
      // Standard win
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8b9d83', '#b87d64', '#e6ccb2'],
        zIndex: 100,
      });
    }
  }, [settings.enableSound, winSound, ultimateWinSound, setWinner, setHistory]);

  const spin = () => {
    if (entries.length < 2 || isSpinning) return;
    setWinner(null);
    setIsSpinning(true);
    if (settings.enableSound && startSound) {
      startSound.play();
    }
  };

  return (
    <div className={`min-h-screen text-[var(--text-main)] font-sans selection:bg-[var(--accent-sand)] transition-all duration-1000 relative overflow-hidden ${
      winner?.text.toLowerCase().includes('xayotillo') ? 'animate-shake' : ''
    } ${isSpinning && entries.some(e => e.text.toLowerCase().includes('xayotillo')) ? 'animate-legend-bg opacity-90' : 'bg-[var(--bg-natural)]'}`}>
      
      {/* Legendary background layer */}
      <AnimatePresence>
        {winner?.text.toLowerCase().includes('xayotillo') && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-0 animate-legend-bg pointer-events-none"
          />
        )}
      </AnimatePresence>
      <header className="relative z-10 p-8 border-b border-[var(--border-natural)] flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold font-serif italic text-[var(--accent-clay)]">
            Taqdir Charkhi
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#f0ede6] rounded-full text-[11px] uppercase tracking-widest text-[var(--accent-sage)] font-bold">
            <div className="w-1.5 h-1.5 bg-[var(--accent-sage)] rounded-full animate-pulse" />
            Offline Rejim Yoqilgan
          </div>
          <button
            onClick={() => setSettings({ ...settings, enableSound: !settings.enableSound })}
            className="p-3 hover:bg-[var(--accent-sand)]/20 rounded-full transition-all text-[var(--text-muted)]"
          >
            {settings.enableSound ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-8 py-10 grid lg:grid-cols-[320px_1fr_320px] gap-8 items-start">
        {/* Left Column: Entries */}
        <div className="h-[600px] lg:sticky lg:top-10">
          <EntriesList
            entries={entries}
            setEntries={setEntries}
            isSpinning={isSpinning}
          />
        </div>

        {/* Center Column: Wheel */}
        <div className="flex flex-col items-center justify-center space-y-12">
          <div className="relative">
            <Wheel
              entries={entries}
              onFinish={handleFinish}
              isSpinning={isSpinning}
              setIsSpinning={setIsSpinning}
              theme={settings.theme}
              soundEnabled={settings.enableSound}
            />
          </div>
          
          <button
            onClick={spin}
            disabled={isSpinning || entries.length < 2}
            className="group relative px-16 py-5 bg-[var(--accent-clay)] text-white rounded-full text-lg font-bold tracking-widest shadow-xl shadow-[var(--accent-clay)]/20 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none"
          >
            AYLANTIRISH
          </button>
        </div>

        {/* Right Column: History */}
        <div className="h-[600px] lg:sticky lg:top-10 flex flex-col bg-white border border-[var(--border-natural)] rounded-[24px] p-6 shadow-sm">
          <h3 className="font-serif text-xl mb-6 flex items-center gap-2">
            <Trophy size={20} className="text-[var(--accent-sage)]" />
            Natijalar Tarixi
          </h3>
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {history.length > 0 ? (
              <div className="space-y-4">
                {history.map((entry, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2 border-b border-[var(--border-natural)] last:border-0">
                    <span className="text-xs text-[var(--text-muted)] font-mono">{idx === 0 ? 'Hozirgi' : 'Kechroq'}</span>
                    <span className="font-bold text-[var(--accent-sage)] truncate max-w-[150px]">{entry.text}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-[var(--text-muted)] opacity-50 space-y-2">
                <RotateCcw size={32} />
                <p className="text-sm">Hali natijalar yo'q</p>
              </div>
            )}
          </div>
          {history.length > 0 && (
            <button 
              onClick={() => setHistory([])}
              className="mt-6 text-xs font-bold uppercase tracking-widest text-[var(--accent-clay)] hover:opacity-80 transition-all"
            >
              Tarixni Tozalash
            </button>
          )}
        </div>
      </main>

      {/* Winner Modal */}
      <AnimatePresence>
        {winner && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setWinner(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
              animate={{ 
                scale: 1, 
                opacity: 1, 
                y: 0,
                rotate: 0
              }}
              exit={{ scale: 0.5, opacity: 0, rotate: 10 }}
              className={`relative w-full max-w-2xl rounded-[3rem] p-12 text-center shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden border-8 ${
                winner.text.toLowerCase().includes('xayotillo') 
                ? 'bg-gradient-to-br from-yellow-600 via-orange-500 to-red-700 border-yellow-300 ultimate-glow' 
                : 'bg-white border-[var(--accent-sage)] shadow-[0_0_50px_rgba(139,157,131,0.2)]'
              }`}
            >
              {/* Background Patterns */}
              {winner.text.toLowerCase().includes('xayotillo') && (
                <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay animate-pulse bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
              )}
              
              <button
                onClick={() => setWinner(null)}
                className={`absolute top-8 right-8 p-3 rounded-full transition-all z-20 ${
                  winner.text.toLowerCase().includes('xayotillo') 
                  ? 'bg-white/10 text-white hover:bg-white/20' 
                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600'
                }`}
              >
                <X size={28} />
              </button>

              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="relative z-10"
              >
                <div className="mb-10 flex justify-center">
                  <motion.div 
                    animate={winner.text.toLowerCase().includes('xayotillo') ? { 
                      rotateY: [0, 360],
                      scale: [1, 1.2, 1]
                    } : {}}
                    transition={{ repeat: Infinity, duration: 3 }}
                    className={`w-32 h-32 rounded-full border-4 flex items-center justify-center ${
                      winner.text.toLowerCase().includes('xayotillo') 
                      ? 'bg-gradient-to-t from-yellow-300 to-white text-orange-600 border-yellow-200 shadow-[0_0_30px_rgba(255,255,255,0.5)]' 
                      : 'bg-[var(--accent-sand)]/20 text-[var(--accent-sage)] border-[var(--accent-sand)]'
                    }`}
                  >
                    {winner.text.toLowerCase().includes('xayotillo') ? <Star size={64} fill="currentColor" /> : <Trophy size={64} />}
                  </motion.div>
                </div>

                <motion.h2 
                  animate={winner.text.toLowerCase().includes('xayotillo') ? { scale: [1, 1.05, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className={`text-2xl font-black uppercase tracking-[0.3em] mb-4 ${
                    winner.text.toLowerCase().includes('xayotillo') ? 'text-yellow-200' : 'text-[var(--accent-clay)]'
                  }`}
                >
                  {winner.text.toLowerCase().includes('xayotillo') ? '✨ TAQDDIRNING MUTLAQ G\'OLIBI ✨' : 'G\'OLIB ANIQLANDI'}
                </motion.h2>

                <div className="relative inline-block mb-12">
                  <motion.p 
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    className={`text-7xl md:text-9xl font-black px-8 py-4 leading-none inline-block relative ${
                      winner.text.toLowerCase().includes('xayotillo') 
                      ? 'text-white drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] italic underline decoration-yellow-300 decoration-8' 
                      : 'text-[var(--text-main)] font-serif'
                    }`}
                  >
                    {winner.text}
                    {winner.text.toLowerCase().includes('xayotillo') && (
                      <span className="absolute inset-0 animate-text-shimmer pointer-events-none select-none" aria-hidden="true">
                        {winner.text}
                      </span>
                    )}
                  </motion.p>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-lg mx-auto">
                  <button
                    onClick={spin}
                    className={`flex-1 flex items-center justify-center gap-3 py-6 rounded-[2rem] text-xl font-black transition-all active:scale-95 shadow-2xl ${
                      winner.text.toLowerCase().includes('xayotillo')
                      ? 'bg-white text-orange-700 hover:bg-yellow-50 hover:-translate-y-1'
                      : 'bg-[var(--accent-clay)] text-white hover:opacity-90 hover:-translate-y-1'
                    }`}
                  >
                    Qayta Aylantirish
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`Wheelda g'olib: ${winner.text}! 🎡`);
                      setCopied(true);
                    }}
                    className={`flex-1 flex items-center justify-center gap-3 py-6 rounded-[2rem] text-xl font-bold transition-all active:scale-95 border-2 ${
                      winner.text.toLowerCase().includes('xayotillo')
                      ? 'bg-transparent text-white border-white/40 hover:bg-white/10 backdrop-blur-md'
                      : 'bg-white text-[var(--text-main)] border-[var(--border-natural)] hover:bg-gray-50'
                    }`}
                  >
                    <Share2 size={24} />
                    {copied ? 'Nusxa olindi!' : 'Ulashish'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="relative z-10 p-12 text-center text-[var(--text-muted)] text-[12px] opacity-60">
        <p>Barcha ma'lumotlar qurilmangizning keshida saqlanadi. Internet shart emas.</p>
      </footer>

      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] bg-[var(--text-main)] text-white px-6 py-3 rounded-2xl shadow-2xl font-bold text-sm tracking-wide"
          >
            Nusxa olindi!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Rotate3DIcon({ size = 24 }: { size?: number }) {
  return (
    <div style={{ width: size, height: size }} className="relative flex items-center justify-center">
      <div className="absolute inset-0 border-4 border-white/30 rounded-full" />
      <div className="absolute inset-0 border-4 border-white border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
