import { useState, useEffect } from 'react';
import { Award, Compass, Shield, Stars, Target, Trophy } from 'lucide-react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [activeQuote, setActiveQuote] = useState('');
  const [visible, setVisible] = useState(true);

  const quotes = [
    "Preparing ultra-low latency streams...",
    "Connecting to United 2026 feed downlinks...",
    "Synchronizing stream video decoders...",
    "Enabling stadium ambient audio acoustics...",
    "Ready for kick-off. Live from North America!"
  ];

  useEffect(() => {
    // Alternate quotes quickly
    setActiveQuote(quotes[0]);
    let quoteIdx = 1;
    const quoteInterval = setInterval(() => {
      setActiveQuote(quotes[quoteIdx % quotes.length]);
      quoteIdx++;
    }, 850);

    // Load progress loader
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          clearInterval(quoteInterval);
          // Wait briefly at 100% for premium feel
          setTimeout(() => {
            setVisible(false);
            setTimeout(onComplete, 400); // Trigger completion callback
          }, 350);
          return 100;
        }
        // Realistic step speed variation
        const randomStep = Math.floor(Math.random() * 15) + 5;
        return Math.min(prev + randomStep, 100);
      });
    }, 180);

    return () => {
      clearInterval(progressInterval);
      clearInterval(quoteInterval);
    };
  }, []);

  if (!visible) return null;

  return (
    <div 
      id="entrance_loading_overlay"
      className="fixed inset-0 bg-neutral-980 z-100 flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden transition-all duration-500 ease-out"
    >
      {/* Premium background mesh lines simulating turf lines and stadium spotlights */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-dashed border-emerald-500/20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full border border-solid border-emerald-500/10" />
        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-emerald-500/15" />
      </div>

      {/* Floating stars & lights */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-yellow-500/5 blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Main Content Box */}
      <div className="relative z-10 max-w-sm w-full flex flex-col items-center gap-6 animate-fade-in">
        {/* FIFA logo placement */}
        <div className="relative flex flex-col items-center justify-center">
          <img 
            src="https://cdn.prod.website-files.com/68f550992570ca0322737dc2/69f4a666ff876f5a52a1b7ab_fifa-world-cup-2026-official-logo-footylogos-p-1080.png"
            alt="FIFA World Cup 2026 Logo"
            className="w-40 sm:w-48 h-auto object-contain filter drop-shadow-[0_10px_20px_rgba(16,185,129,0.2)]"
          />
          <span className="absolute -bottom-2 px-3 py-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-[10px] font-sans font-extrabold text-neutral-950 tracking-widest rounded-full uppercase shadow-md animate-bounce">
            Official Streaming Portal
          </span>
        </div>

        {/* Dynamic Spinner Soccerball */}
        <div className="relative mt-4">
          <div className="w-16 h-16 rounded-full border-4 border-neutral-900 border-t-emerald-500 border-r-yellow-500 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center text-xl">
            ⚽
          </div>
        </div>

        {/* Progress & quote indicators */}
        <div className="w-full flex flex-col gap-3">
          <div className="flex justify-between items-center text-[11px] font-mono font-bold tracking-wider text-neutral-400">
            <span className="text-emerald-400">ESTABLISHING SERVER FEED</span>
            <span className="text-yellow-500">{progress}%</span>
          </div>

          {/* Golden/Emerald Loading Bar */}
          <div className="w-full h-1.5 bg-neutral-900 border border-neutral-850 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-yellow-500 transition-all duration-300 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Loading quote */}
          <div className="relative h-6 flex items-center justify-center">
            <p className="absolute text-[10px] font-mono text-neutral-400 tracking-wide animate-fade-in text-center px-4 uppercase font-semibold">
              {activeQuote}
            </p>
          </div>
        </div>

        {/* Stadium context metadata details */}
        <div className="flex items-center gap-4 text-[10px] text-neutral-500 font-mono border-t border-neutral-900 pt-4 w-full justify-center">
          <span className="flex items-center gap-1"><Trophy className="w-3.5 h-3.5 text-yellow-500" /> USA • CAN • MEX</span>
          <span>•</span>
          <span className="text-emerald-400">1080P UHD FEED</span>
        </div>
      </div>
    </div>
  );
}
