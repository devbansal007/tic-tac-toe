# TicTacToe Master

A modern, tactile, and highly competitive Tic Tac Toe game built with React, TypeScript, Tailwind CSS, and Motion. Features an unbeatable Minimax AI, Pass & Play local multiplayer, expandable board dimensions, synthesized tactile audio, and multiple visual themes.

---

## 🎮 Features

### 🤖 Intelligent AI Opponent (Single Player)
- **Rookie (Easy)**: Relaxed, casual moves with occasional tactical awareness.
- **Tactician (Medium)**: Aggressively pursues winning opportunities and blocks immediate threats.
- **Grandmaster (Unbeatable)**: Optimal Minimax algorithm with alpha-beta pruning — mathematically impossible to defeat in 3×3.
- **Side Selection**: Play as **X** (move first) or **O** (AI initiates the game).

### 👥 Local Multiplayer (Pass & Play)
- Compete with friends on the same device.
- Customizable player names for both Player X and Player O.

### 📐 Multiple Grid Dimensions
- **3×3 Classic**: Standard Tic Tac Toe (connect 3 in a row).
- **4×4 Tactical**: Connect 4 in a row to win.
- **5×5 Grand**: Connect 4 in a row (tactical mini-Gomoku rules for high-tempo gameplay).

### ⚡ Blitz Turn Timer (Speed Mode)
- Optional turn timer (5s or 10s per move) with animated color countdown progress bar.
- Turn passes automatically if the timer expires.

### 🔊 Synthesized Web Audio
- Zero external audio assets or network latency.
- Custom Web Audio API synthesizer for tactile clicks, mark placement tones, victory fanfares, and draw chimes.
- Toggle sound on or off anytime.

### ✨ Visual Polish & Effects
- Animated SVG drawing of marks on placement.
- Ghost preview on empty cell hover showing the current player's token.
- Dynamic animated strike-through line spanning winning lines.
- Particle confetti celebration on victory with player-matched color palettes.
- Active move history with **Undo** support (reverts two moves vs AI, one move in PvP).

### 🎨 4 Curated Themes
- **Cyberpunk Neon**: High-contrast glow with neon cyan and magenta accents.
- **Obsidian Minimal**: Sleek dark aesthetic with sky blue and amber highlights.
- **Retro Arcade**: CRT/arcade palette with emerald green and goldenrod.
- **Nordic Clean**: Minimalist light theme with indigo and rose styling.

### 📊 Persistent Stats & Streak Tracking
- Tracks Player X wins, Player O wins, draws, total matches played, and active win streaks.
- Persisted locally using `localStorage` with a 1-click reset option.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **Animation**: Motion (`motion/react`)
- **Icons**: Lucide React
- **Celebrations**: Canvas Confetti
- **Audio**: Web Audio API (native browser synthesizer)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd <project-directory>

# Install dependencies
npm install

# Start the local development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

### Building for Production

```bash
npm run build
```

---

## 📖 Rules & Strategy Guide

1. **Center Control (3×3)**: Controlling the center cell provides access to 4 possible winning paths (horizontal, vertical, and both diagonals).
2. **The Corner Fork**: Placing marks in opposite corners forces opponent defensive responses and can create two winning threats simultaneously.
3. **Vs Grandmaster AI**: The Grandmaster AI evaluates every possible future move down to terminal game states. The best achievable outcome against it is a draw!
