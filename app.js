/**
 * Keter Aether – Final Version
 * Casual, friendly, magical text transformation tool
 * Conjured by Abiud Kipkemboi Keter
 */

// ────────────────────────────────────────────────
// FALLBACK TRANSMUTATIONS (local dictionary)
const transmutations = {
  shakespeare: {
    greetings: {
      "hello": "Hail", "hi": "Hark", "hey": "Ho there",
      "good morning": "Good morrow", "good evening": "Good den",
      "how are you": "How fares thee", "how you doing": "What cheer?",
      "thank you": "I give thee thanks", "thanks": "Gramercy",
      "please": "Prithee", "sorry": "I do beseech thy pardon",
      "yes": "Aye", "no": "Nay", "goodbye": "Fare thee well", "bye": "Adieu",
      "love": "love most true", "friend": "companion dear", "my friend": "good my friend",
      "money": "coin", "work": "toil", "happy": "most glad", "sad": "heavy of heart",
      "angry": "wroth", "beautiful": "fair", "pretty": "comely", "ugly": "ill-favoured",
      "cool": "passing fine", "awesome": "marvelous", "great": "noble",
      "bad": "wretched", "tired": "weary", "hungry": "fain would eat", "food": "meat"
    },
    suffixes: [
      "— dost thou comprehend?", "— by my troth!", "— what sayest thou?",
      "— forsooth!", "— marry!", "— i' faith!", "— verily!"
    ],
    prefixes: ["Hark! ", "Pray, ", "Mark me: ", "List! ", "Good sir, ", "Alas! "]
  },

  victorian: {
    greetings: {
      "hello": "How do you do", "hi": "Good day to you",
      "good morning": "Good morning", "good evening": "Good evening",
      "how are you": "How are you keeping?", "how you doing": "How do you fare?",
      "thank you": "Much obliged", "thanks": "I am most grateful",
      "please": "If you please", "sorry": "I beg your pardon",
      "yes": "Indeed", "no": "Not at all", "goodbye": "Farewell",
      "love": "my dear", "friend": "my good fellow", "money": "funds",
      "work": "occupation", "happy": "in good spirits", "sad": "rather low"
    },
    suffixes: ["— Most sincerely.", "— Your humble servant.", "— I remain yours truly."],
    prefixes: ["I daresay ", "It is my understanding that ", "Pray allow me to say "]
  },

  poe: {
    greetings: {
      "hello": "Dark greetings", "hi": "Hail from the shadows",
      "good morning": "Bleak morn", "good evening": "Dismal eve",
      "how are you": "How fares thy soul?", "thank you": "Gratitude from the void",
      "sorry": "Pardon from the abyss", "yes": "So be it", "no": "Nevermore",
      "goodbye": "Farewell into darkness", "love": "eternal torment", "friend": "fellow shade",
      "happy": "fleeting illusion", "sad": "abyssal despair", "beautiful": "ghastly fair",
      "cool": "sepulchral chill"
    },
    suffixes: ["— nevermore.", "— in the shadows of the night.", "— lost to eternity."],
    prefixes: ["Once upon a midnight dreary, ", "In the bleak December, ", "Deep into that darkness peering, "]
  },

  romantic: {
    greetings: {
      "hello": "Dearest salutations", "hi": "My heart greets thee",
      "good morning": "Dawn's tender kiss", "good evening": "Twilight's embrace",
      "how are you": "How does thy spirit soar?", "thank you": "My soul is grateful",
      "please": "I beseech thee", "sorry": "Forgive my trembling heart",
      "yes": "With all my being", "no": "Alas, nay", "goodbye": "Until we meet again",
      "love": "my eternal flame", "friend": "kindred spirit", "beautiful": "divine beauty",
      "happy": "rapture fills me", "sad": "my heart weeps"
    },
    suffixes: ["— my heart swells!", "— forever thine.", "— in passion's thrall."],
    prefixes: ["Oh! ", "My dearest, ", "In rapture, ", "Beloved, "]
  },

  genz: {
    greetings: {
      "hello": "Yo what's good", "hi": "Heyyy", "hey": "Sup bestie",
      "good morning": "Morningggg", "good evening": "Eveninggg",
      "how are you": "You good?", "how you holding up": "You holding?",
      "thank you": "Tysm", "thanks": "Appreciate you fr",
      "please": "Pls", "sorry": "My bad fr", "yes": "Bet", "no": "Cap",
      "goodbye": "I'm out", "bye": "Deuces", "love": "I got mad rizz for you",
      "friend": "Bestie", "money": "Bread", "work": "Grind", "happy": "Slay",
      "sad": "This is so depressing", "cool": "Fire", "awesome": "Bussin",
      "beautiful": "Serving looks", "tired": "I'm cooked", "hungry": "Starving fr"
    },
    suffixes: ["fr", "no cap", "periodt", "ong", "that's crazy", "lowkey", "highkey"],
    prefixes: ["Lowkey ", "Highkey ", "Bro ", "Fam ", "Deadass ", "Nahhh "]
  },

  kiswahili: {
    greetings: {
      "hello": "Habari", "hi": "Mambo", "hey": "Sasa",
      "good morning": "Habari za asubuhi", "good evening": "Habari za jioni",
      "how are you": "Habari yako?", "how you doing": "Uko aje?",
      "thank you": "Asante", "thanks": "Asante sana",
      "please": "Tafadhali", "sorry": "Samahani",
      "yes": "Ndiyo", "no": "Hapana", "goodbye": "Kwaheri",
      "love": "Mapenzi", "friend": "Rafiki", "my friend": "Rafiki yangu",
      "money": "Pesa", "work": "Kazi", "happy": "Furaha", "sad": "Huzuni",
      "beautiful": "Mzuri sana", "cool": "Poa", "awesome": "Mshangao mkubwa",
      "tired": "Nimechoka", "hungry": "Njaa inanisumbua", "food": "Chakula"
    },
    suffixes: [
      "— kweli?", "— sawa?", "— ndiyo basi.", "— pole sana.", "— asante kwa moyo wangu.",
      "— basi hivyo.", "— yapo!"
    ],
    prefixes: [
      "Eeeh, ", "Mambo ", "Sasa ", "Rafiki, ", "Ndugu, ", "Jamani, "
    ]
  }
};

/**
 * Local fallback: simple word replacement + random prefix/suffix
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
 * Try to call backend OpenAI endpoint, fallback to local if fails
 */
async function callOpenAI(text, style, mode) {
  try {
    const response = await fetch('/api/transmute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, style, mode })
    });

    if (!response.ok) throw new Error('API response not OK');

    const data = await response.json();

    if (!data.success) throw new Error(data.error || 'API failed');

    return data.transmuted || data.poem || data.analysis || "The spirits whisper faintly...";
  } catch (error) {
    console.warn('OpenAI call failed → using local fallback', error);
    if (mode === 'transmute') {
      return transmuteText(text, style);
    }
    return mode === 'ghostwriter'
      ? "In shadowed halls where moonlight gleams,\nA lonely soul doth chase its dreams..."
      : "Meter: iambic pentameter\nRhyme: ABAB\nDevices: metaphor, alliteration, imagery";
  }
}

/**
 * Create ink drop animation on button click
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
 * Glow effect on alchemical symbols (optional – if you have any)
 */
function initAlchemicalSymbols() {
  document.querySelectorAll('.alchemical-symbol').forEach(symbol => {
    symbol.addEventListener('mouseenter', () => {
      const colors = ['#D4AF37', '#BFAF8F', '#A0895F'];
      symbol.style.textShadow = `0 0 20px ${colors[Math.floor(Math.random() * colors.length)]}`;
    });
    symbol.addEventListener('mouseleave', () => symbol.style.textShadow = '');
  });
}

// ────────────────────────────────────────────────
// MAIN APP LOGIC
// ────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  // Remove loader if present
  const candle = document.getElementById('candleLoader');
  if (candle) setTimeout(() => candle.remove(), 3000);

  initAlchemicalSymbols();

  // DOM elements
  const input = document.getElementById('modernInput');
  const styleSelect = document.getElementById('styleSelect');
  const transmuteBtn = document.getElementById('transmuteBtn');
  const outputSection = document.getElementById('outputSection');
  const outputText = document.getElementById('outputText');
  const styleLabel = document.getElementById('styleLabel');
  const emojiSwitch = document.getElementById('emojiSwitch');

  let currentMode = 'transmute';
  let addEmojis = true;

  // ── Emoji toggle ──
  if (emojiSwitch) {
    emojiSwitch.addEventListener('change', (e) => {
      addEmojis = e.target.checked;
    });
  }

  // ── Mode pills ──
  const modeContainer = document.createElement('div');
  modeContainer.className = 'mode-pills';
  modeContainer.innerHTML = `
    <button data-mode="transmute" class="pill active">Transmutation Engine 🪶</button>
    <button data-mode="ghostwriter" class="pill">Ghostwriter's Quill 🪶</button>
    <button data-mode="critic" class="pill">Critic's Eye 👁️</button>
  `;

  // Insert pills right before the transmute button
  transmuteBtn.parentNode.insertBefore(modeContainer, transmuteBtn);

  modeContainer.querySelectorAll('.pill').forEach(btn => {
    btn.addEventListener('click', () => {
      currentMode = btn.dataset.mode;
      modeContainer.querySelectorAll('.pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (currentMode === 'transmute') {
        input.placeholder = "Type something fun here... 😏";
        styleSelect.style.display = 'block';
        styleLabel.style.display = 'block';
      } else if (currentMode === 'ghostwriter') {
        input.placeholder = "Describe the poem you desire... 📝";
        styleSelect.style.display = 'none';
        styleLabel.style.display = 'none';
      } else if (currentMode === 'critic') {
        input.placeholder = "Paste a verse to analyze... 👀";
        styleSelect.style.display = 'none';
        styleLabel.style.display = 'none';
      }
    });
  });

  // ── Add Kiswahili option if missing ──
  if (!styleSelect.querySelector('option[value="kiswahili"]')) {
    const opt = document.createElement('option');
    opt.value = 'kiswahili';
    opt.textContent = 'Kiswahili';
    styleSelect.appendChild(opt);
  }

  // ── TRANSMUTE BUTTON ──
  transmuteBtn.addEventListener('click', async () => {
    const value = input.value.trim();
    if (!value) {
      alert("Heyy, type something first lah 😅");
      return;
    }

    const originalText = transmuteBtn.textContent;
    transmuteBtn.textContent = "Cooking up some magic... ✨";
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

      // Add random emoji if toggle is on
      if (addEmojis) {
        const emojis = ['🔥', '✨', '😎', '💫', '🌟', '🥳', '🚀', '🪄', '💖', '😂'];
        result += ' ' + emojis[Math.floor(Math.random() * emojis.length)];
      }

      outputText.textContent = result;
      styleLabel.textContent = styleSelect.options[styleSelect.selectedIndex].text;

      outputSection.style.display = 'block';
      outputSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } catch (err) {
      alert("Oops, spirits acting up today 😂 Try again?");
      console.error(err);
    } finally {
      transmuteBtn.textContent = "Let's Go! 🚀";
      transmuteBtn.disabled = false;
    }
  });
});

// ────────────────────────────────────────────────
// UTILITY FUNCTIONS
// ────────────────────────────────────────────────

function copyText() {
  const text = document.getElementById('outputText').textContent;
  navigator.clipboard.writeText(text).then(() => alert("Copied! 🎉"));
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
    navigator.share({ title: "Keter Aether", text });
  } else {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
  }
    }
