/**
 * Keter Aether
 * Conjured by Abiud Kipkemboi Keter
 */

// Enriched fallback transmutations
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
      "today": "this day", "tomorrow": "the morrow", "yesterday": "yestereve"
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
  // ... (add Poe, Romantic, Gen Z from your original if needed)
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
      "tired": "Nimechoka", "hungry": "Njaa inanisumbua"
    },
    suffixes: ["— kweli?", "— sawa?", "— ndiyo basi.", "— pole sana."],
    prefixes: ["Eeeh, ", "Mambo ", "Sasa ", "Rafiki, "]
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
    return "Oops, something went wrong... try again? 😅";
  }
}

// ... (keep your existing createInkDrop, initAlchemicalSymbols functions)

document.addEventListener('DOMContentLoaded', () => {
  // Remove loader if present
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

  // ... (keep your mode pills creation and event listeners)

  // Add Kiswahili option
  if (!styleSelect.querySelector('option[value="kiswahili"]')) {
    const opt = document.createElement('option');
    opt.value = 'kiswahili';
    opt.textContent = 'Kiswahili';
    styleSelect.appendChild(opt);
  }

  transmuteBtn.addEventListener('click', async () => {
    const value = input.value.trim();
    if (!value) {
      alert("Heyy, type something first lah 😅");
      return;
    }

    const originalText = transmuteBtn.textContent;
    transmuteBtn.textContent = "Cooking up some magic... ✨";
    transmuteBtn.disabled = true;

    // ... (keep your ink drop and rect logic)

    let result = '';

    try {
      // Your existing callOpenAI logic
      result = await callOpenAI(value, styleSelect.value, currentMode);

      // Add emoji if toggled
      if (addEmojis) {
        const emojis = ['🔥', '✨', '😎', '💫', '🌟', '🥳', '🚀', '🪄', '💖', '😂'];
        result += ' ' + emojis[Math.floor(Math.random() * emojis.length)];
      }

      outputText.textContent = result;
      styleLabel.textContent = styleSelect.options[styleSelect.selectedIndex].text;

      outputSection.style.display = 'block';
      outputSection.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      alert("Oops, spirits acting up today 😂 Try again?");
      console.error(err);
    } finally {
      transmuteBtn.textContent = "Let's Go! 🚀";
      transmuteBtn.disabled = false;
    }
  });
});

// Keep your copyText, speakText, shareText functions unchanged
