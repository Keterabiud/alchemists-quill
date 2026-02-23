/**
 * The Alchemist's Quill — With OpenAI Integration
 * Conjured by Abiud Keter & Kimi
 */

// Fallback local transmutation (if AI fails)
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

// NEW: OpenAI-powered transmutation
async function transmuteWithAI(text, style) {
  try {
    const response = await fetch('/api/transmute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, style })
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Transmutation failed');
    }

    return data.transmuted;

  } catch (error) {
    console.error('AI Transmutation failed:', error);
    // Fallback to local
    return transmuteText(text, style);
  }
}

// Visual effects
function createInkDrop(x, y) {
  const drop = document.createElement('div');
  drop.className = 'ink-drop';
  drop.style.left = x + 'px';
  drop.style.top = y + 'px';
  document.body.appendChild(drop);
  setTimeout(() => drop.remove(), 1000);
}

function initAlchemicalSymbols() {
  const symbols = document.querySelectorAll('.alchemical-symbol');
  symbols.forEach(symbol => {
    symbol.addEventListener('mouseenter', () => {
      const colors = ['#8B4513', '#DAA520', '#CD853F', '#B8860B'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      symbol.style.textShadow = `0 0 30px ${randomColor}`;
    });
    symbol.addEventListener('mouseleave', () => {
      symbol.style.textShadow = '';
    });
  });
}

let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      const scrolled = window.pageYOffset;
      document.querySelectorAll('.alchemical-symbol').forEach((symbol, index) => {
        symbol.style.transform = `translateY(${scrolled * (0.5 + index * 0.1)}px)`;
      });
      ticking = false;
    });
    ticking = true;
  }
});

// Main application
document.addEventListener('DOMContentLoaded', () => {
  // Remove candle loader
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

  transmuteBtn.addEventListener('click', async (e) => {
    const input = modernInput.value.trim();
    if (!input) {
      alert("Prithee, enter some text first!");
      return;
    }

    // Loading state
    const originalText = transmuteBtn.textContent;
    transmuteBtn.textContent = 'Transmuting...';
    transmuteBtn.disabled = true;

    // Visual effect
    const rect = transmuteBtn.getBoundingClientRect();
    createInkDrop(rect.left + rect.width / 2, rect.top + rect.height / 2);

    const style = styleSelect.value;
    
    try {
      const transmuted = await transmuteWithAI(input, style);
      
      outputText.textContent = transmuted;
      styleLabel.textContent = styleNames[style];
      outputSection.style.display = 'block';
      outputSection.classList.add('revealed', 'quill-writing');
      
      setTimeout(() => outputSection.classList.remove('quill-writing'), 500);
      outputSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    } catch (error) {
      alert('The spirits are restless. Try again anon.');
      console.error(error);
    } finally {
      transmuteBtn.textContent = originalText;
      transmuteBtn.disabled = false;
    }
  });
});

// Utility functions
function copyText() {
  const text = document.getElementById('outputText').textContent;
  navigator.clipboard.writeText(text).then(() => alert("Copied to thy parchment!"));
}

function speakText() {
  const text = document.getElementById('outputText').textContent;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.8;
  utterance.pitch = 0.9;
  speechSynthesis.speak(utterance);
}

function shareText() {
  const text = document.getElementById('outputText').textContent;
  if (navigator.share) {
    navigator.share({ title: "The Alchemist's Quill", text, url: window.location.href });
  } else {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
  }
}

console.log("The Alchemist's Quill — Conjured by Abiud Keter & Kimi");
console.log('"We are such stuff as dreams are made on."');
        
