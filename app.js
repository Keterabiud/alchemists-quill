/**
 * The Alchemist's Quill — Clean Version
 * Conjured by Abiud Kipkemboi Keter
 * Modern → Archaic + Gen Z Slang
 */

// Rich transmutation database
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
      "come": "come hither", "stop": "forbear", "fast": "swift"
    },
    suffixes: ["— dost thou comprehend?", "— by my troth!", "— what sayest thou?", "— forsooth!", "— mark me well!"],
    prefixes: ["Hark! ", "Pray, ", "Mark me: ", "List! ", "Verily, "]
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
      "bad": "dreadful", "tired": "quite fatigued"
    },
    suffixes: ["— Most sincerely.", "— Your humble servant.", "— I remain yours."],
    prefixes: ["I daresay ", "It is my understanding that ", "One must admit "]
  },
  poe: {
    greetings: {
      "hello": "Dark greetings", "hi": "Shadowed salutations", "hey": "From the abyss...",
      "good morning": "A grim morrow", "thank you": "Thy gratitude echoes in the void",
      "sorry": "Alas, I repent", "yes": "So it is written", "no": "Nevermore",
      "goodbye": "Farewell into the night", "love": "obsession eternal",
      "friend": "fellow wanderer of shadows", "happy": "fleeting illusion of light",
      "sad": "abyssal despair", "cool": "hauntingly fine"
    },
    suffixes: ["— nevermore.", "— in the shadows of the night.", "— quoth the raven."],
    prefixes: ["Once upon a midnight dreary, ", "In the bleak December, ", "Deep into that darkness peering, "]
  },
  romantic: {
    greetings: {
      "hello": "Dearest salutations", "hi": "My heart greets thee", "hey": "Oh joy!",
      "good morning": "Dawn kisses thy soul", "thank you": "My soul sings with gratitude",
      "sorry": "Forgive this aching heart", "yes": "With all my being", "no": "Alas, not so",
      "goodbye": "Until the stars reunite us", "love": "passion unbound",
      "friend": "kindred spirit", "happy": "swept by joy", "sad": "wounded by longing",
      "beautiful": "radiant as the dawn", "cool": "ethereal"
    },
    suffixes: ["— my heart swells!", "— forever thine.", "— in eternal rapture."],
    prefixes: ["Oh! ", "My dearest, ", "In rapture, ", "Beneath the moon, "]
  },
  genz: {
    greetings: {
      "hello": "Yo what's good", "hi": "Heyyy", "hey": "Sup bestie",
      "good morning": "Morningggg", "how are you": "You good?",
      "thank you": "Tysm", "please": "Pls", "sorry": "My bad fr",
      "yes": "Bet", "no": "Cap", "goodbye": "I'm out", "love": "I got mad rizz for you",
      "friend": "Bestie", "money": "Bread", "work": "Grind", "happy": "Slay",
      "sad": "This is so depressing", "cool": "Fire", "awesome": "No cap this is bussin",
      "bad": "Sus", "tired": "I'm cooked", "hungry": "I'm starving fr", "eat": "Munch",
      "go": "Let's dip", "come": "Pull up", "stop": "Pause"
    },
    suffixes: [" fr", " no cap", " periodt", " ong", " that's crazy"],
    prefixes: ["Lowkey ", "Highkey ", "Bro ", "Fam "]
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

// OpenAI-powered transmutation (fallback to local if API fails)
async function transmuteWithAI(text, style) {
  try {
    const response = await fetch('/api/transmute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, style })
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.error || 'Failed');
    return data.transmuted;
  } catch (error) {
    console.warn('AI failed → using rich local fallback');
    return transmuteText(text, style);
  }
}

// Visual effects (unchanged)
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

// Main app
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

  // Add Gen Z option dynamically if not in your HTML
  if (!styleSelect.querySelector('option[value="genz"]')) {
    const genzOption = document.createElement('option');
    genzOption.value = 'genz';
    genzOption.textContent = 'Gen Z Slang';
    styleSelect.appendChild(genzOption);
  }

  transmuteBtn.addEventListener('click', async () => {
    const input = modernInput.value.trim();
    if (!input) {
      alert("Prithee, enter some text first!");
      return;
    }

    const originalBtnText = transmuteBtn.textContent;
    transmuteBtn.textContent = 'Transmuting...';
    transmuteBtn.disabled = true;

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
    } catch (err) {
      alert('The spirits are restless. Try again anon.');
      console.error(err);
    } finally {
      transmuteBtn.textContent = originalBtnText;
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
