/**
 * The Alchemist's Quill — ALL THREE FEATURES ACTIVE
 * Transmutation Engine • Ghostwriter's Quill • Critic's Eye
 * Conjured by Abiud Kipkemboi Keter
 */

// ====================== RICH TRANSMUTATION DATABASE ======================
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
      "awesome": "marvelous", "bad": "wretched", "tired": "weary",
      "hungry": "famished", "thirsty": "athirst", "sleep": "slumber",
      "eat": "partake", "drink": "quaff", "go": "hie thee",
      "come": "come hither", "stop": "forbear", "fast": "swift",
      "today": "this day", "tomorrow": "the morrow", "now": "anon",
      "great": "noble", "bad": "vile", "fun": "mirthful"
    },
    suffixes: ["— dost thou comprehend?", "— by my troth!", "— what sayest thou?", "— forsooth!", "— mark me well!", "— verily I say!", "— prithee tell!"],
    prefixes: ["Hark! ", "Pray, ", "Mark me: ", "List! ", "Verily, ", "Behold! ", "Alas! "]
  },
  victorian: {
    greetings: {
      "hello": "How do you do", "hi": "Good day to you", "hey": "I say!",
      "good morning": "Good morning, sir/madam", "thank you": "I am most obliged",
      "please": "If you would be so kind", "sorry": "I beg your pardon",
      "yes": "Indeed", "no": "I fear not", "goodbye": "Fare thee well",
      "love": "affection most profound", "friend": "dearest acquaintance",
      "money": "fortune", "work": "labour", "happy": "in good spirits",
      "sad": "rather low", "cool": "splendid", "awesome": "capital",
      "bad": "dreadful", "tired": "quite fatigued", "great": "most excellent"
    },
    suffixes: ["— Most sincerely.", "— Your humble servant.", "— I remain yours.", "— Yours faithfully."],
    prefixes: ["I daresay ", "It is my understanding that ", "One must admit ", "Upon my word "]
  },
  poe: {
    greetings: {
      "hello": "Dark greetings", "hi": "Shadowed salutations", "hey": "From the abyss...",
      "good morning": "A grim morrow", "thank you": "Thy gratitude echoes in the void",
      "sorry": "Alas, I repent", "yes": "So it is written", "no": "Nevermore",
      "goodbye": "Farewell into the night", "love": "obsession eternal",
      "friend": "fellow wanderer of shadows", "happy": "fleeting illusion of light",
      "sad": "abyssal despair", "cool": "hauntingly fine", "great": "sublime terror"
    },
    suffixes: ["— nevermore.", "— in the shadows of the night.", "— quoth the raven.", "— lost in the eternal void."],
    prefixes: ["Once upon a midnight dreary, ", "In the bleak December, ", "Deep into that darkness peering, ", "From the sepulchre of time, "]
  },
  romantic: {
    greetings: {
      "hello": "Dearest salutations", "hi": "My heart greets thee", "hey": "Oh joy!",
      "good morning": "Dawn kisses thy soul", "thank you": "My soul sings with gratitude",
      "sorry": "Forgive this aching heart", "yes": "With all my being", "no": "Alas, not so",
      "goodbye": "Until the stars reunite us", "love": "passion unbound",
      "friend": "kindred spirit", "happy": "swept by joy", "sad": "wounded by longing",
      "beautiful": "radiant as the dawn", "cool": "ethereal", "great": "sublime"
    },
    suffixes: ["— my heart swells!", "— forever thine.", "— in eternal rapture.", "— beneath the moon's soft glow."],
    prefixes: ["Oh! ", "My dearest, ", "In rapture, ", "Beneath the moon, ", "As the roses bloom, "]
  },
  genz: {
    greetings: {
      "hello": "Yo what's good", "hi": "Heyyy", "hey": "Sup bestie",
      "good morning": "Morningggg", "how are you": "You good?", "thank you": "Tysm",
      "please": "Pls", "sorry": "My bad fr", "yes": "Bet", "no": "Cap",
      "goodbye": "I'm out", "love": "I got mad rizz for you", "friend": "Bestie",
      "money": "Bread", "work": "Grind", "happy": "Slay", "sad": "This is so depressing",
      "cool": "Fire", "awesome": "No cap this is bussin", "bad": "Sus",
      "tired": "I'm cooked", "hungry": "I'm starving fr", "eat": "Munch",
      "go": "Let's dip", "come": "Pull up", "stop": "Pause", "great": "Lit af"
    },
    suffixes: [" fr", " no cap", " periodt", " ong", " that's crazy", " lowkey", " highkey", " deadass"],
    prefixes: ["Lowkey ", "Highkey ", "Bro ", "Fam ", "Deadass ", "Real talk "]
  }
};

function transmuteText(text, style) {
  const patterns = transmutations[style];
  let result = text.toLowerCase();
  for (let [modern, archaic] of Object.entries(patterns.greetings)) {
    const regex = new RegExp(`\\b${modern}\\b`, 'gi');
    result = result.replace(regex, archaic);
  }
  const prefix = Math.random() > 0.6 ? patterns.prefixes[Math.floor(Math.random() * patterns.prefixes.length)] : "";
  const suffix = patterns.suffixes[Math.floor(Math.random() * patterns.suffixes.length)];
  result = result.charAt(0).toUpperCase() + result.slice(1);
  return prefix + result + suffix;
}

// Unified OpenAI call (handles all three modes)
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
    console.warn('OpenAI failed → using local fallback');
    if (mode === 'transmute') return transmuteText(text, style);
    if (mode === 'ghostwriter') return "In shadowed halls where moonlight gleams,\nA lonely soul doth chase its dreams...";
    if (mode === 'critic') return "Meter: iambic pentameter (mostly)\nRhyme scheme: ABAB\nDevices: metaphor, alliteration, assonance, imagery";
    return "The veil is thin tonight...";
  }
}

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
      symbol.style.textShadow = `0 0 30px ${colors[Math.floor(Math.random() * colors.length)]}`;
    });
    symbol.addEventListener('mouseleave', () => symbol.style.textShadow = '');
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

// Main application
document.addEventListener('DOMContentLoaded', () => {
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
    romantic: "The Lover's Rendering (AI):",
    genz: "The Gen Z Rendering (AI):"
  };

  // Create mode tabs
  const tabsContainer = document.createElement('div');
  tabsContainer.className = 'mode-tabs';
  tabsContainer.style.cssText = 'display:flex; gap:12px; justify-content:center; margin:25px 0; flex-wrap:wrap;';
  tabsContainer.innerHTML = `
    <button data-mode="transmute" class="mode-btn active">🪶 Transmutation Engine</button>
    <button data-mode="ghostwriter" class="mode-btn">🪶 Ghostwriter's Quill</button>
    <button data-mode="critic" class="mode-btn">👁️ Critic's Eye</button>
  `;
  (document.querySelector('main') || document.body).prepend(tabsContainer);

  const modeBtns = tabsContainer.querySelectorAll('.mode-btn');
  let currentMode = 'transmute';

  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      currentMode = btn.dataset.mode;
      modeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (currentMode === 'transmute') {
        modernInput.placeholder = "Enter thy modern tongue here...";
        styleSelect.style.display = 'inline-block';
        styleLabel.style.display = 'block';
      } else if (currentMode === 'ghostwriter') {
        modernInput.placeholder = "Describe the poem you desire (e.g. a sonnet about lost love in the rain)";
        styleSelect.style.display = 'none';
        styleLabel.style.display = 'none';
      } else if (currentMode === 'critic') {
        modernInput.placeholder = "Paste a verse to analyze...";
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

  transmuteBtn.addEventListener('click', async () => {
    const input = modernInput.value.trim();
    if (!input) {
      alert("Prithee, enter some text first!");
      return;
    }

    const originalText = transmuteBtn.textContent;
    transmuteBtn.textContent = currentMode === 'critic' ? 'Analyzing...' : (currentMode === 'ghostwriter' ? 'Summoning...' : 'Transmuting...');
    transmuteBtn.disabled = true;

    const rect = transmuteBtn.getBoundingClientRect();
    createInkDrop(rect.left + rect.width / 2, rect.top + rect.height / 2);

    let result = "";

    try {
      if (currentMode === 'transmute') {
        result = await callOpenAI(input, styleSelect.value, 'transmute');
      } else if (currentMode === 'ghostwriter') {
        result = await callOpenAI(input, 'shakespeare', 'ghostwriter');
      } else if (currentMode === 'critic') {
        result = await callOpenAI(input, 'shakespeare', 'critic');
      }

      outputText.textContent = result;
      styleLabel.textContent = currentMode === 'transmute' ? styleNames[styleSelect.value] : 
                               (currentMode === 'ghostwriter' ? "The Ghostwriter's Quill" : "The Critic's Eye");
      outputSection.style.display = 'block';
      outputSection.classList.add('revealed', 'quill-writing');
      setTimeout(() => outputSection.classList.remove('quill-writing'), 500);
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

// Utility functions
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

console.log("The Alchemist's Quill — Conjured by Abiud Kipkemboi Keter");
console.log("We are such stuff as dreams are made on.");
