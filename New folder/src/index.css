@import "tailwindcss";

@theme {
  --color-indigo-950: #1a1b4b;
  --shadow-3xl: 0 35px 60px -15px rgba(0, 0, 0, 0.3);
  
  /* Natural Tones Colors */
  --bg-natural: #fdfbf7;
  --accent-sage: #8b9d83;
  --accent-clay: #b87d64;
  --accent-sand: #e6ccb2;
  --text-main: #3d3d3d;
  --text-muted: #7c7c7c;
  --border-natural: #e5e0d8;
  
  --font-serif: "Georgia", serif;
  --font-sans: "Helvetica Neue", Arial, sans-serif;
}

@layer base {
  body {
    @apply antialiased bg-[var(--bg-natural)] text-[var(--text-main)] font-sans;
  }
}

@utility custom-scrollbar {
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--accent-sand);
    border-radius: 9999px;
  }
  &:hover::-webkit-scrollbar-thumb {
    background: var(--accent-sage);
  }
}

@keyframes legend-pulse {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.animate-legend-bg {
  background: linear-gradient(-45deg, #fdfbf7, #faedcd, #faedcd, #ffeb3b, #fdfbf7);
  background-size: 400% 400%;
  animation: legend-pulse 10s ease infinite;
}

.ultimate-glow {
  box-shadow: 0 0 50px rgba(255, 215, 0, 0.4);
}

@keyframes text-shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}

.animate-text-shimmer {
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.8) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  background-size: 200% auto;
  background-clip: text;
  -webkit-background-clip: text;
  animation: text-shimmer 3s infinite linear;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

@keyframes shake {
  0% { transform: translate(1px, 1px) rotate(0deg); }
  10% { transform: translate(-1px, -2px) rotate(-1deg); }
  20% { transform: translate(-3px, 0px) rotate(1deg); }
  30% { transform: translate(3px, 2px) rotate(0deg); }
  40% { transform: translate(1px, -1px) rotate(1deg); }
  50% { transform: translate(-1px, 2px) rotate(-1deg); }
  60% { transform: translate(-3px, 1px) rotate(0deg); }
  70% { transform: translate(3px, 1px) rotate(-1deg); }
  80% { transform: translate(-1px, -1px) rotate(1deg); }
  90% { transform: translate(1px, 2px) rotate(0deg); }
  100% { transform: translate(1px, -2px) rotate(-1deg); }
}

.animate-shake {
  animation: shake 0.5s;
  animation-iteration-count: infinite;
}
