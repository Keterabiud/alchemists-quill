/**
 * Keter Aether – Final Complete Version with Cloudflare Worker + Groq
 * Conjured by Abiud Kipkemboi Keter
 * Last updated: February 2025
 */

// Fallback dictionary (used only when Worker fails)
const transmutations = {
  shakespeare: {
    greetings: {
      "hello": "Hail", "hi": "Hark", "hey": "Ho there",
      "good morning": "Good morrow", "good evening": "Good den",
      "how are you": "How fares thee", "thank you": "I give thee thanks",
      "please": "Prithee", "sorry": "I do beseech thy pardon",
      "yes": "Aye", "no": "Nay", "goodbye": "Fare thee well",
      "love": "love most true", "friend": "companion dear", "money": "coin",
      "happy": "most glad", "sad": "heavy of heart", "beautiful": "fair"
    },
    suffixes: ["— dost thou comprehend?", "— by my troth!", "— forsooth!"],
    prefixes: ["Hark! ", "Pray, ", "Mark me: "]
  },
  kiswahili: {
    greetings: {
      "hello": "Habari", "hi": "Mambo", "hey": "Sasa",
      "good morning": "Habari za asubuhi", "how are you": "Habari yako?",
      "thank you": "Asante", "please": "Tafadhali", "sorry": "Samahani",
      "yes": "Ndiyo", "no": "Hapana", "goodbye": "Kwaheri",
      "love": "Mapenzi", "friend": "Rafiki", "happy": "Furaha", "sad": "Huzuni"
    },
    suffixes: ["— kweli?", "— sawa?", "— ndiyo basi."],
    prefixes: ["Eeeh, ", "Mambo ", "Sasa "]
  }
  // Add more styles if needed
};

/**
 * Local fallback when Worker fails
 */
function transmuteText(text, style) {
  const patterns = transmutations[style] || transmutations.shakespeare;
  let result = text.toLowerCase();

  for (let [modern, archaic] of Object.entries(patterns.greetings || {})) {
    result = result.replace(new RegExp(`\\b${modern}\\b`, 'gi'), archaic);
  }

  const prefix = Math.random() > 0.7 ? patterns.prefixes?.[Math.floor(Math.random() * patterns.prefixes.length)] || '' : '';
  const suffix = patterns.suffixes?.[Math.floor(Math.random() * patterns.suffixes.length)] || '';

  return prefix + result.charAt(0).toUpperCase() + result.slice(1) + suffix;
}

/**
 * Calls your Cloudflare Worker → which calls Groq
 */
async function callOpenAI(text, style, mode) {
  try {
    const response = await fetch('https://alchemists-quill.keter-abuid.workers.dev/api/transmute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, style, mode })
    });

    if (!response.ok) {
      throw new Error(`Worker HTTP error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Worker returned failure');
    }

    console.log('Worker success:', data.transmuted.substring(0, 100) + '...');
    return data.transmuted || 'The spirits whisper faintly...';
  } catch (error) {
    console.error('Worker / Groq call failed:', error.message);
    // Fallback to dictionary
    return transmuteText(text, style);
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

// ────────────────────────────────────────────────
// MAIN APP LOGIC
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

  emojiSwitch.addEventListener('change', e => addEmojis = e.target.checked);

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
      } else {
        input.placeholder = currentMode === 'ghostwriter' ? "Describe the poem you desire..." : "Paste lines to analyze...";
        styleSelect.style.display = 'none';
      }
    });
  });

  // Add Kiswahili option
  if (!styleSelect.querySelector('option[value="kiswahili"]')) {
    const opt = document.createElement('option');
    opt.value = 'kiswahili';
    opt.textContent = 'Kiswahili';
    styleSelect.appendChild(opt);
  }

  // Main button handler
  transmuteBtn.addEventListener('click', async () => {
    const value = input.value.trim();
    if (!value) {
      alert("Heyy, type something first 😅");
      return;
    }

    transmuteBtn.textContent = "Cooking... ✨";
    transmuteBtn.disabled = true;

    const rect = transmuteBtn.getBoundingClientRect();
    createInkDrop(rect.left + rect.width/2, rect.top + rect.height/2);

    let result = '';

    try {
      result = await callOpenAI(value, styleSelect.value, currentMode);

      if (addEmojis) {
        const emojis = ['🔥','✨','😎','💫','🌟','🥳','🚀','🪄','💖','😂'];
        result += ' ' + emojis[Math.floor(Math.random() * emojis.length)];
      }

      outputText.textContent = result;
      styleLabel.textContent = styleSelect.options[styleSelect.selectedIndex].text;

      outputSection.style.display = 'block';
      outputSection.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      console.error('Transformation error:', err);
      alert("Oops, spirits acting up 😂 Try again?");
      result = transmuteText(value, styleSelect.value);
      outputText.textContent = result;
      outputSection.style.display = 'block';
    } finally {
      transmuteBtn.textContent = "Let's Go! 🚀";
      transmuteBtn.disabled = false;
    }
  });
});

// Utilities
function copyText() {
  const text = document.getElementById('outputText').textContent;
  navigator.clipboard.writeText(text).then(() => alert("Copied! 🎉"));
}

function speakText() {
  const text = document.getElementById('outputText').textContent;
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 0.9;
  speechSynthesis.speak(u);
}

function shareText() {
  const text = document.getElementById('outputText').textContent;
  navigator.share?.({ title: "Keter Aether", text }) ||
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
                                                             }
