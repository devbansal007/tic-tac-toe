import confetti from 'canvas-confetti';
import { Player } from '../types/game';

export function fireWinConfetti(winner: Player) {
  const colors = winner === 'X' 
    ? ['#06b6d4', '#3b82f6', '#60a5fa', '#38bdf8', '#ffffff'] // Cyan / Blue spark
    : ['#ec4899', '#f43f5e', '#fb7185', '#fbbf24', '#ffffff']; // Pink / Rose spark

  // Left burst
  confetti({
    particleCount: 40,
    angle: 60,
    spread: 55,
    origin: { x: 0, y: 0.7 },
    colors,
  });

  // Right burst
  confetti({
    particleCount: 40,
    angle: 120,
    spread: 55,
    origin: { x: 1, y: 0.7 },
    colors,
  });

  // Center star fountain
  setTimeout(() => {
    confetti({
      particleCount: 60,
      spread: 100,
      origin: { x: 0.5, y: 0.5 },
      colors,
      shapes: ['circle', 'square'],
      ticks: 200,
    });
  }, 250);
}
