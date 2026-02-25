/**
 * Keter Aether – Final Complete Version with Cloudflare Worker + Groq
 * Conjured by Abiud Kipkemboi Keter
 */

// Rich fallback transmutations (used when Worker fails)
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
      "bad": "wretched", "tired": "weary", "hungry": "fain would eat", "food": "meat",
      "today": "this day", "tomorrow": "the morrow", "yesterday": "yestereve"
    },
    suffixes: [
      "— dost thou comprehend?", "— by my troth!", "— what sayest thou?",
      "— forsooth!", "— marry!", "— i' faith!", "— verily!"
    ],
    prefixes: ["Hark! ", "Pray, ", "Mark me: ", "List! ", "Good sir, ", "Alas! "]
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
 * Local fallback transmutation function
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
 * Call the Cloudflare Worker (which calls Groq securely)
 */
async function callOpenAI(text, style, mode) {
  try {
    const response = await fetch('https://alchemists-quill.keter-abuid.workers.dev/api/transmute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, style, mode })
    });

    if (!response.ok) {
      throw new Error(`Worker responded with status ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Worker failed');
    }

    return data.transmuted || 'The spirits whisper faintly...';
  } catch (error) {
    console.warn('Worker / Groq call failed → using local fallback', error);
    return transmuteText(text, style);
  }
}

/**
 * Ink drop animation on button click
 */
function createInkDrop(x, y) {
  const drop = document.createElement('div');
  drop.className = 'ink-drop';
  drop.style.left = `${x}px`;
  drop.style.top = `${y}px`;
  document.body.appendChild(drop);
  setTimeout(() => drop.remove(), 1000);
}

// ────────────────────────────────────────────────
// MAIN APPLICATION
// ────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
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
  emojiSwitch.addEventListener('change', (e) => {
    addEmojis = e.target.checked;
  });

  // Create mode pills dynamically
  const modeContainer = document.createElement('div');
  modeContainer.className = 'mode-pills';
  modeContainer.innerHTML = `
    <button data-mode="transmute" class="pill active">Transmutation Engine 🪶</button>
    <button data-mode="ghostwriter" class="pill">Ghostwriter's Quill 🪶</button>
    <button data-mode="critic" class="pill">Critic's Eye 👁️</button>
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
      } else if (currentMode === 'ghostwriter') {
        input.placeholder = "Describe the poem you desire... 📝";
        styleSelect.style.display = 'none';
      } else if (currentMode === 'critic') {
        input.placeholder = "Paste a verse to analyze... 👀";
        styleSelect.style.display = 'none';
      }
    });
  });

  // Add Kiswahili option if missing
  if (!styleSelect.querySelector('option[value="kiswahili"]')) {
    const opt = document.createElement('option');
    opt.value = 'kiswahili';
    opt.textContent = 'Kiswahili';
    styleSelect.appendChild(opt);
  }

  // Main button click handler
  transmuteBtn.addEventListener('click', async () => {
    const value = input.value.trim();
    if (!value) {
      alert("Heyy, type something first lah 😅");
      return;
    }

    transmuteBtn.textContent = "Cooking up some magic... ✨";
    transmuteBtn.disabled = true;

    const rect = transmuteBtn.getBoundingClientRect();
    createInkDrop(rect.left + rect.width / 2, rect.top + rect.height / 2);

    let result = '';

    try {
      result = await callOpenAI(value, styleSelect.value, currentMode);

      if (addEmojis) {
        const emojis = ['🔥', '✨', '😎', '💫', '🌟', '🥳', '🚀', '🪄', '💖', '😂'];
        result += ' ' + emojis[Math.floor(Math.random() * emojis.length)];
      }

      outputText.textContent = result;
      styleLabel.textContent = styleSelect.options[styleSelect.selectedIndex].text;

      outputSection.style.display = 'block';
      outputSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } catch (err) {
      console.error('Transformation error:', err);
      alert("Oops, spirits acting up today 😂 Try again?");
      result = transmuteText(value, styleSelect.value);
      outputText.textContent = result;
      outputSection.style.display = 'block';
    } finally {
      transmuteBtn.textContent = "Let's Go! 🚀";
      transmuteBtn.disabled = false;
    }
  });
});

// Utility functions
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
    navigator.share({ title: "Keter Aether creation", text });
  } else {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
  }
}
