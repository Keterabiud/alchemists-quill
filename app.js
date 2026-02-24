/**
 * Keter Aether – Final Complete Version
 * Casual, friendly, magical text transformation
 * Conjured by Abiud Kipkemboi Keter
 */

// Fallback transmutations (rich dictionary)
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
      "beautiful": "fair", "cool": "passing fine", "awesome": "marvelous"
    },
    suffixes: ["— dost thou comprehend?", "— by my troth!", "— forsooth!"],
    prefixes: ["Hark! ", "Pray, ", "Mark me: ", "List! "]
  },
  kiswahili: {
    greetings: {
      "hello": "Habari", "hi": "Mambo", "hey": "Sasa",
      "good morning": "Habari za asubuhi", "how are you": "Habari yako?",
      "thank you": "Asante", "please": "Tafadhali", "sorry": "Samahani",
      "yes": "Ndiyo", "no": "Hapana", "goodbye": "Kwaheri",
      "love": "Mapenzi", "friend": "Rafiki", "money": "Pesa",
      "happy": "Furaha", "sad": "Huzuni", "beautiful": "Mzuri sana",
      "cool": "Poa", "awesome": "Mshangao mkubwa"
    },
    suffixes: ["— kweli?", "— sawa?", "— ndiyo basi."],
    prefixes: ["Eeeh, ", "Mambo ", "Sasa "]
  }
  // Add other styles as needed (victorian, poe, romantic, genz)
};

/**
 * Local fallback transmutation
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
 * Call backend or fallback
 */
async function callOpenAI(text, style, mode) {
  try {
    const response = await fetch('/api/transmute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, style, mode })
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return data.transmuted || "The spirits whisper faintly...";
  } catch (e) {
    console.warn('OpenAI failed → fallback');
    return transmuteText(text, style);
  }
}

/**
 * Ink drop animation
 */
function createInkDrop(x, y) {
  const drop = document.createElement('div');
  drop.className = 'ink-drop';
  drop.style.left = x + 'px';
  drop.style.top = y + 'px';
  document.body.appendChild(drop);
  setTimeout(() => drop.remove(), 1000);
}

// Main app
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
  emojiSwitch.addEventListener('change', e => addEmojis = e.target.checked);

  // Mode pills
  const modeContainer = document.querySelector('.mode-pills');
  modeContainer.querySelectorAll('.pill').forEach(btn => {
    btn.addEventListener('click', () => {
      currentMode = btn.dataset.mode;
      modeContainer.querySelectorAll('.pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (currentMode === 'transmute') {
        input.placeholder = "Type something fun here... 😏";
        styleSelect.style.display = 'block';
      } else {
        input.placeholder = currentMode === 'ghostwriter' ? "Tell me what poem vibe..." : "Paste lines to roast...";
        styleSelect.style.display = 'none';
      }
    });
  });

  // Transmute button
  transmuteBtn.addEventListener('click', async () => {
    const text = input.value.trim();
    if (!text) return alert("Heyy, type something first 😅");

    transmuteBtn.textContent = "Cooking... ✨";
    transmuteBtn.disabled = true;

    const rect = transmuteBtn.getBoundingClientRect();
    createInkDrop(rect.left + rect.width/2, rect.top + rect.height/2);

    let result = await callOpenAI(text, styleSelect.value, currentMode);

    if (addEmojis) {
      const emojis = ['🔥','✨','😎','💫','🌟','🥳','🚀','🪄','💖','😂'];
      result += ' ' + emojis[Math.floor(Math.random() * emojis.length)];
    }

    outputText.textContent = result;
    styleLabel.textContent = styleSelect.options[styleSelect.selectedIndex].text;
    outputSection.style.display = 'block';
    outputSection.scrollIntoView({ behavior: 'smooth' });

    transmuteBtn.textContent = "Let's Go! 🚀";
    transmuteBtn.disabled = false;
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
