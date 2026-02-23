/**
 * The Alchemist's Quill — With OpenAI + Premium TTS
 * Conjured by Abiud Keter & Kimi
 */

// Fallback local transmutation
const transmutations = {
  shakespeare: {
    greetings: {
      "hello": "Hail", "hi": "Hark", "hey": "Ho there",
      "good morning": "Good morrow", "how are you": "How fares thee",
      "thank you": "I give thee thanks", "please": "Prithee",
      "sorry": "I do beseech thy pardon", "yes": "Aye", "no": "Nay",
      "goodbye": "Farewell", "love": "love most true",
      "friend": "companion dear", "money": "coin", "work": "toil",
      "happy": "most glad", "sad": "heavy of heart", "angry": "wroth",
      "beautiful": "fair", "ugly": "ill-favored"
    },
    suffixes: ["— dost thou comprehend?", "— by my troth!", "— what sayest thou?", "— forsooth!"],
    prefixes: ["Hark! ", "Pray, ", "Mark me: ", "List! "]
  },
  victorian: {
    greetings: {
      "hello": "How do you do", "love": "affection most profound",
      "friend": "dearest acquaintance", "happy": "in good spirits",
      "sad": "rather low"
    },
    suffixes: ["— Most sincerely.", "— Your humble servant."],
    prefixes: ["I daresay ", "It is my understanding that "]
  },
  poe: {
    greetings: {
      "hello": "Dark greetings", "love": "obsession eternal",
      "happy": "fleeting moment of light", "sad": "abyssal despair"
    },
    suffixes: ["— nevermore.", "— in the shadows of the night."],
    prefixes: ["Once upon a midnight dreary, ", "In the bleak December, "]
  },
  romantic: {
    greetings: {
      "hello": "Dearest salutations", "love": "passion unbound",
      "happy": "swept by joy"
    },
    suffixes: ["— my heart swells!", "— forever thine."],
    prefixes: ["Oh! ", "My dearest, ", "In rapture, "]
  }
};

function transmuteText(text, style) {
  const patterns = transmutations[style];
  let result = text.toLowerCase();
  for (let [modern, archaic] of Object.entries(patterns.greetings)) {
    const regex = new RegExp(`\\b${modern}\\b`, 'gi');
    result = result.replace(regex, archaic);
  }
  const prefix = Math.random() > 0.7 ? patterns.prefixes[Math.floor(Math.random() * patterns.prefixes.length)] : "";
  const suffix = patterns.suffixes[Math.floor(Math.random() * patterns.suffixes.length)];
  result = result.charAt(0).toUpperCase() + result.slice(1);
  return prefix + result + suffix;
}

// OpenAI-powered transmutation
async function transmuteWithAI(text, style) {
  try {
    const response = await fetch('/api/transmute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, style })
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.error || 'Transmutation failed');
    return data.transmuted;
  } catch (error) {
    console.error('AI failed, using fallback:', error);
    return transmuteText(text, style);
  }
}

// ====================== PREMIUM VOICE (OpenAI TTS) ======================
let usePremiumVoice = true;   // Default: ON (much better than browser voice)
let isSpeaking = false;

async function speakText() {
  if (isSpeaking) {
    if (window.currentAudio) window.currentAudio.pause();
    isSpeaking = false;
    return;
  }

  const text = document.getElementById('outputText').textContent.trim();
  if (!text) return;

  try {
    const res = await fetch('/api/speak', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);

    const audio = new Audio(data.audio);
    window.currentAudio = audio;
    audio.onended = () => { isSpeaking = false; };
    audio.onerror = () => { isSpeaking = false; };

    isSpeaking = true;
    await audio.play();
  } catch (err) {
    console.warn('Premium voice failed → fallback to browser');
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    utterance.pitch = 0.9;
    speechSynthesis.speak(utterance);
  }
}
// ======================================================================

// Visual effects
function createInkDrop(x, y) {
  const drop = document.createElement('div');
  drop.className = 'ink-drop';
  drop.style.left = `${x}px`;
  drop.style.top = `${y}px`;
  document.body.appendChild(drop);
  setTimeout(() => drop.remove(), 1000);
}

function initAlchemicalSymbols() {
  const symbols = document.querySelectorAll('.alchemical-symbol');
  symbols.forEach(symbol => {
    symbol.addEventListener('mouseenter', () => {
      const colors = ['#8B4513', '#DAA520', '#CD853F', '#B8860B'];
      symbol.style.textShadow = `0 0 30px ${colors[Math.floor(Math.random()*colors.length)]}`;
    });
    symbol.addEventListener('mouseleave', () => {
      symbol.style.textShadow = '';
    });
  });
}

let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      const scrolled = window.pageYOffset;
      document.querySelectorAll('.alchemical-symbol').forEach((s, i) => {
        s.style.transform = `translateY(${scrolled * (0.5 + i * 0.1)}px)`;
      });
      ticking = false;
    });
    ticking = true;
  }
});

// Main app
document.addEventListener('DOMContentLoaded', () => {
  // Candle loader
  const candle = document.getElementById('candleLoader');
  if (candle) setTimeout(() => candle.remove(), 3000);

  initAlchemicalSymbols();

  const transmuteBtn = document.getElementById('transmuteBtn');
  const modernInput = document.getElementById('modernInput');
  const styleSelect = document.getElementById('styleSelect');
  const outputSection = document.getElementById('outputSection');
  const outputText = document.getElementById('outputText');
  const styleLabel = document.getElementById('styleLabel');

  const styleNames = {
    shakespeare: "The Bard's Rendering (AI):",
    victorian: "The Gentleperson's Rendering (AI):",
    poe: "The Gothic Rendering (AI):",
    romantic: "The Lover's Rendering (AI):"
  };

  // Premium voice toggle
  const voiceLabel = document.createElement('label');
  voiceLabel.style.marginLeft = '15px';
  voiceLabel.style.color = '#8B4513';
  voiceLabel.style.fontSize = '0.95rem';
  voiceLabel.innerHTML = `
    <input type="checkbox" id="premiumChk" checked style="margin-right:5px;"> 
    Premium Bard Voice (OpenAI)
  `;
  styleSelect.parentNode.insertBefore(voiceLabel, styleSelect.nextSibling);

  document.getElementById('premiumChk').addEventListener('change', e => {
    usePremiumVoice = e.target.checked;
  });

  transmuteBtn.addEventListener('click', async () => {
    const input = modernInput.value.trim();
    if (!input) {
      alert("Prithee, enter some text first!");
      return;
    }

    const originalBtnText = transmuteBtn.textContent;
    transmuteBtn.textContent = 'Transmuting...';
    transmuteBtn.disabled = true;

    const rect = transmuteBtn.getBoundingClientRect();
    createInkDrop(rect.left + rect.width/2, rect.top + rect.height/2);

    const style = styleSelect.value;

    try {
      const transmuted = await transmuteWithAI(input, style);

      outputText.textContent = transmuted;
      styleLabel.textContent = styleNames[style];
      outputSection.style.display = 'block';
      outputSection.classList.add('revealed', 'quill-writing');

      setTimeout(() => outputSection.classList.remove('quill-writing'), 500);
      outputSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      // AUTO-NARRATE with premium voice
      if (usePremiumVoice) {
        setTimeout(() => speakText(), 800);
      }

    } catch (err) {
      alert('The spirits are restless. Try again anon.');
      console.error(err);
    } finally {
      transmuteBtn.textContent = originalBtnText;
      transmuteBtn.disabled = false;
    }
  });
});

// Utility functions
function copyText() {
  const text = document.getElementById('outputText').textContent;
  navigator.clipboard.writeText(text).then(() => alert("Copied to thy parchment!"));
}

function shareText() {
  const text = document.getElementById('outputText').textContent;
  if (navigator.share) {
    navigator.share({ title: "The Alchemist's Quill", text });
  } else {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
  }
}

console.log("The Alchemist's Quill — Conjured by Abiud Keter & Kimi");
console.log("We are such stuff as dreams are made on.");
