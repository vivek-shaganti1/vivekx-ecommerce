/* ============================================================
   PREMIUM UI AUDIO ENGINE (PRODUCTION READY)
   ============================================================ */

// Create Audio Context
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// Master Gain (global volume control)
const masterGain = audioCtx.createGain();
masterGain.gain.value = 0.3;
masterGain.connect(audioCtx.destination);

/* ============================================================
   GLOBAL SOUND STATE (WITH PERSISTENCE)
   ============================================================ */

// Load from localStorage
let soundEnabled = localStorage.getItem("sound") !== "off";

export const setSoundEnabled = (value) => {
  soundEnabled = value;
  localStorage.setItem("sound", value ? "on" : "off");

  // Smooth fade effect (premium feel)
  masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
  masterGain.gain.linearRampToValueAtTime(
    value ? 0.3 : 0.0,
    audioCtx.currentTime + 0.15
  );
};

export const isSoundEnabled = () => soundEnabled;

/* ============================================================
   CORE SOUND GENERATOR
   ============================================================ */

const playTone = ({
  frequency = 800,
  duration = 0.03,
  volume = 0.2,
  type = "sine"
}) => {
  if (!soundEnabled) return;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = type;
  osc.frequency.value = frequency;

  // Premium soft envelope
  gain.gain.setValueAtTime(0, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(volume, audioCtx.currentTime + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

  osc.connect(gain);
  gain.connect(masterGain);

  osc.start();
  osc.stop(audioCtx.currentTime + duration);
};

/* ============================================================
   INTERACTION SOUNDS
   ============================================================ */

// Hover (throttled + subtle randomness)
let lastHoverTime = 0;

export const playHoverSound = () => {
  if (!soundEnabled) return;

  const now = Date.now();
  if (now - lastHoverTime < 120) return;
  lastHoverTime = now;

  playTone({
    frequency: 580 + Math.random() * 60,
    duration: 0.02,
    volume: 0.04
  });
};

// Click (layered premium tap)
export const playClickSound = () => {
  if (!soundEnabled) return;

  // High-frequency crisp tap
  playTone({
    frequency: 720 + Math.random() * 80,
    duration: 0.025,
    volume: 0.10
  });

  // Low-frequency depth layer
  playTone({
    frequency: 180,
    duration: 0.04,
    volume: 0.05,
    type: "triangle"
  });
};

// Panther Edition Crazy Click (Futuristic Sci-Fi Zap)
export const playPantherClickSound = () => {
  if (!soundEnabled) return;

  // Ultra-high sci-fi chirp
  playTone({
    frequency: 2400 + Math.random() * 200,
    duration: 0.02,
    volume: 0.06,
    type: "sine"
  });

  // Mid-frequency digital crunch
  setTimeout(() => {
    playTone({
      frequency: 900,
      duration: 0.04,
      volume: 0.08,
      type: "sawtooth"
    });
  }, 15);

  // Deep cybernetic thump
  setTimeout(() => {
    playTone({
      frequency: 110,
      duration: 0.08,
      volume: 0.15,
      type: "square"
    });
  }, 30);
};


// Success (ascending pleasant tone)
export const playSuccessSound = () => {
  if (!soundEnabled) return;

  playTone({
    frequency: 600,
    duration: 0.05,
    volume: 0.12
  });

  setTimeout(() => {
    playTone({
      frequency: 900,
      duration: 0.06,
      volume: 0.14
    });
  }, 40);
};

/* ============================================================
   AUDIO INIT (REQUIRED FOR BROWSER AUTOPLAY POLICY)
   ============================================================ */

export const initAudio = () => {
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
};

// Auto-unlock on first user interaction
document.addEventListener(
  "click",
  () => {
    initAudio();
  },
  { once: true }
);