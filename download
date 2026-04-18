import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Entry, THEMES } from '../types';
import { Howl } from 'howler';
import { motion, AnimatePresence } from 'motion/react';

interface WheelProps {
  entries: Entry[];
  onFinish: (winner: Entry) => void;
  isSpinning: boolean;
  setIsSpinning: (state: boolean) => void;
  theme: keyof typeof THEMES;
  soundEnabled: boolean;
}

// Tick sound for the wheel
const TICK_SOUND = 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3';

export const Wheel: React.FC<WheelProps> = ({
  entries,
  onFinish,
  isSpinning,
  setIsSpinning,
  theme,
  soundEnabled,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const currentRotation = useRef(0);
  const angularVelocity = useRef(0);
  const lastTickIndex = useRef(-1);
  const tickSound = useRef<Howl | null>(null);

  const [activeSegment, setActiveSegment] = useState<string>('');
  const entriesRef = useRef(entries);

  useEffect(() => {
    entriesRef.current = entries;
  }, [entries]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      tickSound.current = new Howl({
        src: [TICK_SOUND],
        volume: 0.5,
      });
    }
  }, []);

  const drawWheel = (ctx: CanvasRenderingContext2D, rotation: number) => {
    const { width, height } = ctx.canvas;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 40;

    ctx.clearRect(0, 0, width, height);

    if (entriesRef.current.length === 0) return;

    const sliceAngle = (2 * Math.PI) / entriesRef.current.length;
    const colors = THEMES[theme];

    entriesRef.current.forEach((entry, i) => {
      const startAngle = i * sliceAngle + rotation;
      const endAngle = (i + 1) * sliceAngle + rotation;
      const isUltimate = entry.text.toLowerCase().includes('xayotillo');

      // Draw slice
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.fillStyle = isUltimate ? '#FFD700' : colors[i % colors.length];
      ctx.fill();
      
      if (isUltimate) {
        // Add a gold shine or pattern to legendary slice
        ctx.save();
        ctx.globalAlpha = 0.2;
        ctx.fillStyle = '#FFF';
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle / 2);
        ctx.fill();
        ctx.restore();
      }

      ctx.strokeStyle = isUltimate ? '#FF8C00' : '#fff';
      ctx.lineWidth = isUltimate ? 4 : 2;
      ctx.stroke();

      // Draw text
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = isUltimate ? '#000' : '#fff';
      ctx.font = isUltimate 
        ? `black ${Math.max(14, 22 - entries.length / 5)}px Inter, sans-serif`
        : `bold ${Math.max(12, 18 - entries.length / 5)}px Inter, sans-serif`;
      
      if (!isUltimate) {
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 4;
      }
      
      const text = entry.text.length > 20 ? entry.text.substring(0, 17) + '...' : entry.text;
      ctx.fillText(text, radius - 20, 5);
      ctx.restore();
    });

    // Draw center pin/decoration
    ctx.beginPath();
    ctx.arc(centerX, centerY, 40, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.shadowBlur = 10;
    ctx.shadowColor = 'rgba(0,0,0,0.1)';
    ctx.stroke();
    
    // Tiny colored dot in the center
    ctx.beginPath();
    ctx.arc(centerX, centerY, 6, 0, 2 * Math.PI);
    ctx.fillStyle = '#b87d64';
    ctx.fill();

    // Draw pointer (static, at the top)
    ctx.save();
    ctx.translate(centerX, centerY - radius);
    
    // Outer shadow for pointer visibility
    ctx.shadowBlur = 15;
    ctx.shadowColor = 'rgba(0,0,0,0.4)';
    
    ctx.beginPath();
    ctx.moveTo(0, 15); // Tip pointing down
    ctx.lineTo(-30, -35); // Left corner
    ctx.lineTo(30, -35); // Right corner
    ctx.closePath();
    
    // Gradient for the pointer
    const grad = ctx.createLinearGradient(0, -35, 0, 15);
    grad.addColorStop(0, '#333');
    grad.addColorStop(1, '#000');
    
    ctx.fillStyle = grad;
    ctx.fill();
    
    // Border for definition
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    ctx.restore();
  };

  const update = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const currentEntries = entriesRef.current;
    if (currentEntries.length === 0) return;

    if (angularVelocity.current > 0.0001) {
      currentRotation.current += angularVelocity.current;
      angularVelocity.current *= 0.985; // Friction

      // Tick sound and live indicator logic
      const sliceAngle = (2 * Math.PI) / currentEntries.length;
      const normalizedRotation = (currentRotation.current % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
      const pointerAngle = -Math.PI / 2;
      const relativeRotation = (pointerAngle - normalizedRotation + 4 * Math.PI) % (2 * Math.PI);
      const currentSection = Math.floor(relativeRotation / sliceAngle) % currentEntries.length;
      
      if (currentSection !== lastTickIndex.current) {
        if (soundEnabled && tickSound.current) {
          tickSound.current.play();
        }
        lastTickIndex.current = currentSection;
        setActiveSegment(currentEntries[currentSection]?.text || '');
      }
    } else if (isSpinning) {
      angularVelocity.current = 0;
      setIsSpinning(false);
      
      const sliceAngle = (2 * Math.PI) / currentEntries.length;
      const normalizedRotation = (currentRotation.current % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
      const pointerAngle = -Math.PI / 2;
      const relativeRotation = (pointerAngle - normalizedRotation + 4 * Math.PI) % (2 * Math.PI);
      const winningIndex = Math.floor(relativeRotation / sliceAngle) % currentEntries.length;
      onFinish(currentEntries[winningIndex]);
      setActiveSegment('');
    }

    drawWheel(ctx, currentRotation.current);
  }, [isSpinning, soundEnabled, onFinish, setIsSpinning]);

  useEffect(() => {
    let frameId: number;
    const loop = () => {
      update();
      frameId = requestAnimationFrame(loop);
    };
    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [update]);

  useEffect(() => {
    if (isSpinning) {
      // Start spin
      angularVelocity.current = 0.4 + Math.random() * 0.3;
    }
  }, [isSpinning]);

  return (
    <div className="relative w-full max-w-[500px] aspect-square mx-auto">
      <div className="absolute inset-0 border-[12px] border-white rounded-full shadow-[0_15px_45px_rgba(139,157,131,0.15)] pointer-events-none z-10" />
      
      {/* Live active segment indicator */}
      <AnimatePresence>
        {isSpinning && activeSegment && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: -20 }}
            animate={{ 
              opacity: 1, 
              scale: 1.1, 
              y: 0,
              backgroundColor: activeSegment.toLowerCase().includes('xayotillo') ? '#FFD700' : 'rgba(255, 255, 255, 0.9)',
              color: activeSegment.toLowerCase().includes('xayotillo') ? '#000' : 'var(--text-main)',
              boxShadow: activeSegment.toLowerCase().includes('xayotillo') ? '0 0 20px rgba(255, 215, 0, 0.6)' : '0 10px 25px rgba(0,0,0,0.1)'
            }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="absolute -top-16 left-1/2 -translate-x-1/2 backdrop-blur-md px-8 py-3 rounded-full border border-[var(--border-natural)] z-20 text-lg font-black tracking-tight truncate max-w-[250px]"
          >
            {activeSegment}
          </motion.div>
        )}
      </AnimatePresence>

      <canvas
        ref={canvasRef}
        width={1000}
        height={1000}
        className="w-full h-full relative"
      />
    </div>
  );
};
