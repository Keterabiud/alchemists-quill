/**
 * The Alchemist's Quill
 * Conjured by Abiud Kipkemboi Keter
 */

// Local fallback transmutations (rich dataset)
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
      "beautiful": "fair", "ugly": "ill-favored", "cool": "passing fine",
      "awesome": "marvelous", "bad": "wretched", "tired": "weary"
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
  },
  genz: {
    greetings: {
      "hello": "Yo what's good", "hi": "Heyyy", "hey": "Sup bestie",
      "good morning": "Morningggg", "how are you": "You good?",
      "thank you": "Tysm", "please": "Pls", "sorry": "My bad fr",
      "yes": "Bet", "no": "Cap", "goodbye": "I'm out", "love": "I got mad rizz for you",
      "friend": "Bestie", "money": "Bread", "work": "Grind", "happy": "Slay",
      "sad": "This is so depressing", "cool": "Fire", "awesome": "No cap this is bussin"
    },
    suffixes: [" fr", " no cap", " periodt", " ong", " that's crazy"],
    prefixes: ["Lowkey ", "Highkey ", "Bro ", "Fam "]
  }
};

/**
 * Local fallback transmutation
 */
function transmuteText(text, style) {
  const patterns = transmutations[style] || transmutations.shakespeare;
  let result = text.toLowerCase();

  for (let [modern, archaic] of Object.entries(patterns.greetings || {})) {
    const regex = new RegExp(`\\b${modern}\\b`, 'gi');
    result = result.replace(regex, archaic);
  }

  const prefix = Math.random() > 0.7 ? (patterns.prefixes?.[Math.floor(Math.random() * patterns.prefixes.length)] || '') : '';
  const suffix = patterns.suffixes?.[Math.floor(Math.random() * patterns.suffixes.length)] || '';

  result = result.charAt(0).toUpperCase() + result.slice(1);
  return prefix + result + suffix;
}

/**
 * Unified OpenAI call (transmute / generate / analyze)
 */
async function callOpenAI(text, style, mode) {
  try {
    const response = await fetch('/api/transmute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, style, mode })
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.error || 'Failed');
    return data.transmuted || data.poem || data.analysis || "The spirits whisper faintly...";
  } catch (error) {
    console.warn('OpenAI failed → fallback');
    if (mode === 'transmute') return transmuteText(text, style);
    if (mode === 'ghostwriter') return "In shadowed halls where moonlight gleams,\nA lonely soul doth chase its dreams...";
    if (mode === 'critic') return "Meter: iambic pentameter\nRhyme: ABAB\nDevices: metaphor, alliteration, imagery";
    return "The veil is thin tonight...";
  }
}

/**
 * Ink drop visual effect
 */
function createInkDrop(x, y) {
  const drop = document.createElement('div');
  drop.className = 'ink-drop';
  drop.style.left = `${x}px`;
  drop.style.top = `${y}px`;
  document.body.appendChild(drop);
  setTimeout(() => drop.remove(), 1000);
}

/**
 * Glow on alchemical symbols
 */
function initAlchemicalSymbols() {
  document.querySelectorAll('.alchemical-symbol').forEach(symbol => {
    symbol.addEventListener('mouseenter', () => {
      const colors = ['#BFAF8F', '#D4A017', '#A0895F'];
      symbol.style.textShadow = `0 0 20px ${colors[Math.floor(Math.random() * colors.length)]}`;
    });
    symbol.addEventListener('mouseleave', () => {
      symbol.style.textShadow = '';
    });
  });
}

// ====================== MAIN APP ======================
document.addEventListener('DOMContentLoaded', () => {
  // Remove loader
  const candle = document.getElementById('candleLoader');
  if (candle) setTimeout(() => candle.remove(), 3000);

  initAlchemicalSymbols();

  // Core elements
  const input = document.getElementById('modernInput');
  const styleSelect = document.getElementById('styleSelect');
  const transmuteBtn = document.getElementById('transmuteBtn');
  const outputSection = document.getElementById('outputSection');
  const outputText = document.getElementById('outputText');
  const styleLabel = document.getElementById('styleLabel');

  let currentMode = 'transmute';

  // Create mode pills (beside TRANSMUTE)
  const modeContainer = document.createElement('div');
  modeContainer.className = 'mode-pills';
  modeContainer.innerHTML = `
    <button data-mode="transmute" class="pill active">Transmutation Engine 🪶</button>
    <button data-mode="ghostwriter" class="pill">Ghostwriter's Quill 🪶</button>
    <button data-mode="critic" class="pill">Critic's Eye 👁️</button>
  `;

  // Insert mode pills right before TRANSMUTE button
  transmuteBtn.parentNode.insertBefore(modeContainer, transmuteBtn);

  // Mode switching
  modeContainer.querySelectorAll('.pill').forEach(btn => {
    btn.addEventListener('click', () => {
      currentMode = btn.dataset.mode;
      modeContainer.querySelectorAll('.pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (currentMode === 'transmute') {
        input.placeholder = "Enter thy modern tongue here...";
        styleSelect.style.display = 'block';
        styleLabel.style.display = 'block';
      } else if (currentMode === 'ghostwriter') {
        input.placeholder = "Describe the poem you desire...";
        styleSelect.style.display = 'none';
        styleLabel.style.display = 'none';
      } else if (currentMode === 'critic') {
        input.placeholder = "Paste a verse to analyze...";
        styleSelect.style.display = 'none';
        styleLabel.style.display = 'none';
      }
    });
  });

  // Add Gen Z option
  if (!styleSelect.querySelector('option[value="genz"]')) {
    const opt = document.createElement('option');
    opt.value = 'genz';
    opt.textContent = 'Gen Z Slang';
    styleSelect.appendChild(opt);
  }

  // Transmute action
  transmuteBtn.addEventListener('click', async () => {
    const value = input.value.trim();
    if (!value) {
      alert("Prithee, enter some text first!");
      return;
    }

    const originalText = transmuteBtn.textContent;
    transmuteBtn.textContent = currentMode === 'critic' ? 'Analyzing...' : 
                              currentMode === 'ghostwriter' ? 'Summoning...' : 'Transmuting...';
    transmuteBtn.disabled = true;

    const rect = transmuteBtn.getBoundingClientRect();
    createInkDrop(rect.left + rect.width / 2, rect.top + rect.height / 2);

    let result = '';

    try {
      if (currentMode === 'transmute') {
        result = await callOpenAI(value, styleSelect.value, 'transmute');
      } else if (currentMode === 'ghostwriter') {
        result = await callOpenAI(value, 'shakespeare', 'ghostwriter');
      } else if (currentMode === 'critic') {
        result = await callOpenAI(value, 'shakespeare', 'critic');
      }

      outputText.textContent = result;
      styleLabel.textContent = currentMode === 'transmute' ? 
        styleSelect.options[styleSelect.selectedIndex].text : 
        (currentMode === 'ghostwriter' ? "Ghostwriter's Quill" : "Critic's Eye");

      outputSection.style.display = 'block';
      outputSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } catch (err) {
      alert('The spirits are restless. Try again anon.');
      console.error(err);
    } finally {
      transmuteBtn.textContent = originalText;
      transmuteBtn.disabled = false;
    }
  });
});

// Utilities
function copyText() {
  const text = document.getElementById('outputText').textContent;
  navigator.clipboard.writeText(text).then(() => alert("Copied to thy parchment!"));
}

function speakText() {
  const text = document.getElementById('outputText').textContent;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.85;
  utterance.pitch = 0.95;
  speechSynthesis.speak(utterance);
}

function shareText() {
  const text = document.getElementById('outputText').textContent;
  if (navigator.share) {
    navigator.share({ title: "The Alchemist's Quill", text });
  } else {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
  }
      }
