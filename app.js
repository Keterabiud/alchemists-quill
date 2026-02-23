/**
 * The Alchemist's Quill
 * Conjured by Abiud Kipkemboi Keter
 */

// Rich fallback transmutations
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

// Unified AI call handler
async function callOpenAI(text, style, mode) {
  try {
    const res = await fetch('/api/transmute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, style, mode })
    });
    const data = await res.json();
    if (data.success) return data.transmuted || data.poem || data.analysis;
    throw new Error(data.error || 'Failed');
  } catch (err) {
    console.warn('OpenAI failed, using fallback');
    if (mode === 'transmute') return transmuteText(text, style);
    if (mode === 'ghostwriter') return "In ancient halls where moonlight gleams,\nA weary soul doth chase its dreams...";
    if (mode === 'critic') return "Meter: mostly iambic\nRhyme: ABAB\nDevices: metaphor, alliteration";
    return "The veil is thin tonight...";
  }
}

// Visuals
function createInkDrop(x, y) {
  const drop = document.createElement('div');
  drop.className = 'ink-drop';
  drop.style.left = x + 'px';
  drop.style.top = y + 'px';
  document.body.appendChild(drop);
  setTimeout(() => drop.remove(), 1000);
}

function initAlchemicalSymbols() {
  document.querySelectorAll('.alchemical-symbol').forEach(s => {
    s.addEventListener('mouseenter', () => {
      const c = ['#8B4513','#DAA520','#CD853F','#B8860B'];
      s.style.textShadow = `0 0 30px ${c[Math.floor(Math.random()*c.length)]}`;
    });
    s.addEventListener('mouseleave', () => s.style.textShadow = '');
  });
}

// Main
document.addEventListener('DOMContentLoaded', () => {
  // Remove loader
  const candle = document.getElementById('candleLoader');
  if (candle) setTimeout(() => candle.remove(), 3000);

  initAlchemicalSymbols();

  // Core elements
  const input = document.getElementById('modernInput');
  const styleSel = document.getElementById('styleSelect');
  const transmuteBtn = document.getElementById('transmuteBtn');
  const outputSec = document.getElementById('outputSection');
  const outputTxt = document.getElementById('outputText');
  const label = document.getElementById('styleLabel');

  let currentMode = 'transmute';

  // Create mode selector pills (beside TRANSMUTE)
  const modeContainer = document.createElement('div');
  modeContainer.className = 'mode-pills';
  modeContainer.innerHTML = `
    <button data-mode="transmute" class="pill active">Transmutation Engine 🪶</button>
    <button data-mode="ghostwriter" class="pill">Ghostwriter's Quill 🪶</button>
    <button data-mode="critic" class="pill">Critic's Eye 👁️</button>
  `;

  // Insert mode pills right before the TRANSMUTE button
  transmuteBtn.parentNode.insertBefore(modeContainer, transmuteBtn);

  // Mode switching
  modeContainer.querySelectorAll('.pill').forEach(btn => {
    btn.addEventListener('click', () => {
      currentMode = btn.dataset.mode;
      modeContainer.querySelectorAll('.pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (currentMode === 'transmute') {
        input.placeholder = "Enter thy modern tongue here...";
        styleSel.style.display = 'block';
        label.style.display = 'block';
      } else if (currentMode === 'ghostwriter') {
        input.placeholder = "Tell me what kind of poem/verse you desire...";
        styleSel.style.display = 'none';
        label.style.display = 'none';
      } else if (currentMode === 'critic') {
        input.placeholder = "Paste the verse you wish to analyze...";
        styleSel.style.display = 'none';
        label.style.display = 'none';
      }
    });
  });

  // Add Gen Z to dropdown
  if (!styleSel.querySelector('[value="genz"]')) {
    const opt = document.createElement('option');
    opt.value = 'genz';
    opt.textContent = 'Gen Z Slang';
    styleSel.appendChild(opt);
  }

  // Transmute action
  transmuteBtn.addEventListener('click', async () => {
    const val = input.value.trim();
    if (!val) {
      alert("Prithee, enter some text first!");
      return;
    }

    const origBtn = transmuteBtn.textContent;
    transmuteBtn.textContent = currentMode === 'critic' ? 'Analyzing...' : 
                              currentMode === 'ghostwriter' ? 'Summoning...' : 'Transmuting...';
    transmuteBtn.disabled = true;

    const rect = transmuteBtn.getBoundingClientRect();
    createInkDrop(rect.left + rect.width/2, rect.top + rect.height/2);

    let result = '';

    try {
      if (currentMode === 'transmute') {
        result = await callOpenAI(val, styleSel.value, 'transmute');
      } else if (currentMode === 'ghostwriter') {
        result = await callOpenAI(val, 'shakespeare', 'ghostwriter');
      } else if (currentMode === 'critic') {
        result = await callOpenAI(val, 'shakespeare', 'critic');
      }

      outputTxt.textContent = result;
      label.textContent = currentMode === 'transmute' ? 
        (styleSel.options[styleSel.selectedIndex]?.text || 'Rendered Verse') : 
        (currentMode === 'ghostwriter' ? "The Ghostwriter's Quill" : "Critic's Eye Analysis");

      outputSec.style.display = 'block';
      outputSec.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } catch (e) {
      alert('The spirits are restless. Try again anon.');
      console.error(e);
    } finally {
      transmuteBtn.textContent = origBtn;
      transmuteBtn.disabled = false;
    }
  });
});

// Utilities (unchanged)
function copyText() {
  const t = document.getElementById('outputText').textContent;
  navigator.clipboard.writeText(t).then(() => alert("Copied to thy parchment!"));
}

function speakText() {
  const t = document.getElementById('outputText').textContent;
  const u = new SpeechSynthesisUtterance(t);
  u.rate = 0.85;
  u.pitch = 0.95;
  speechSynthesis.speak(u);
}

function shareText() {
  const t = document.getElementById('outputText').textContent;
  if (navigator.share) {
    navigator.share({ title: "The Alchemist's Quill", text: t });
  } else {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(t)}`, '_blank');
  }
}

console.log("The Alchemist's Quill — Conjured by Abiud Kipkemboi Keter");
console.log("We are such stuff as dreams are made on.");
