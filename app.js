/**
 * Keter Aether – Casual & Friendly Version
 * Conjured by Abiud Kipkemboi Keter
 */

// Rich fallback transmutations (expanded + Kiswahili)
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
      "beautiful": "fair", "cool": "passing fine", "awesome": "marvelous",
      "today": "this day", "tomorrow": "the morrow", "yesterday": "yestereve",
      "great": "noble", "bad": "wretched", "tired": "weary"
    },
    suffixes: ["— dost thou comprehend?", "— by my troth!", "— what sayest thou?", "— forsooth!"],
    prefixes: ["Hark! ", "Pray, ", "Mark me: ", "List! "]
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
    suffixes: ["— Most sincerely.", "— Your humble servant."],
    prefixes: ["I daresay ", "It is my understanding that "]
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
    suffixes: ["— nevermore.", "— in the shadows of the night."],
    prefixes: ["Once upon a midnight dreary, ", "In the bleak December, "]
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
    suffixes: ["— my heart swells!", "— forever thine."],
    prefixes: ["Oh! ", "My dearest, ", "In rapture, "]
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
      "sad": "This is so depressing", "cool": "Fire", "awesome": "Bussin"
    },
    suffixes: ["fr", "no cap", "periodt", "ong", "that's crazy"],
    prefixes: ["Lowkey ", "Highkey ", "Bro ", "Fam "]
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
    suffixes: ["— kweli?", "— sawa?", "— ndiyo basi.", "— pole sana.", "— asante kwa moyo wangu."],
    prefixes: ["Eeeh, ", "Mambo ", "Sasa ", "Rafiki, ", "Ndugu, "]
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
 * Call OpenAI or fallback
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
 * Ink drop animation
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
      const colors = ['#D4AF37', '#BFAF8F', '#A0895F'];
      symbol.style.textShadow = `0 0 20px ${colors[Math.floor(Math.random() * colors.length)]}`;
    });
    symbol.addEventListener('mouseleave', () => symbol.style.textShadow = '');
  });
}

// ────────────────────────────────────────────────
// MAIN APP
// ────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  // Remove loader
  const candle = document.getElementById('candleLoader');
  if (candle) setTimeout(() => candle.remove(), 3000);

  initAlchemicalSymbols();

  const input = document.getElementById('modernInput');
  const styleSelect = document.getElementById('styleSelect');
  const transmuteBtn = document.getElementById('transmuteBtn');
  const outputSection = document.getElementById('outputSection');
  const outputText = document.getElementById('outputText');
  const styleLabel = document.getElementById('styleLabel');
  const emojiSwitch = document.getElementById('emojiSwitch');

  let currentMode = 'transmute';
  let addEmojis = true;

  // Emoji toggle
  if (emojiSwitch) {
    emojiSwitch.addEventListener('change', (e) => {
      addEmojis = e.target.checked;
    });
  }

  // Mode pills
  const modeContainer = document.createElement('div');
  modeContainer.className = 'mode-pills';
  modeContainer.innerHTML = `
    <button data-mode="transmute" class="pill active">Normal → Magic 🪄</button>
    <button data-mode="ghostwriter" class="pill">Poem Mode 📜</button>
    <button data-mode="critic" class="pill">Roast Mode 🔥</button>
  `;

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
        input.placeholder = "Tell me what poem vibe you want... 📝";
        styleSelect.style.display = 'none';
        styleLabel.style.display = 'none';
      } else if (currentMode === 'critic') {
        input.placeholder = "Paste some lines for me to roast... 👀";
        styleSelect.style.display = 'none';
        styleLabel.style.display = 'none';
      }
    });
  });

  // Add all styles including Kiswahili
  const styles = [
    { value: 'shakespeare', text: 'Shakespearean' },
    { value: 'victorian', text: 'Victorian' },
    { value: 'poe', text: 'Poe (Gothic)' },
    { value: 'romantic', text: 'Romantic' },
    { value: 'genz', text: 'Gen Z Slang' },
    { value: 'kiswahili', text: 'Kiswahili' }
  ];

  styles.forEach(s => {
    if (!styleSelect.querySelector(`option[value="${s.value}"]`)) {
      const opt = document.createElement('option');
      opt.value = s.value;
      opt.textContent = s.text;
      styleSelect.appendChild(opt);
    }
  });

  // Transmute button
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

      // Add emoji if enabled
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

// Utilities
function copyText() {
  const text = document.getElementById('outputText').textContent;
  navigator.clipboard.writeText(text).then(() => alert("Copied to thy parchment! 🎉"));
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
