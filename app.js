/**
 * Keter Aether – Quick Groq Direct Test Version
 * Conjured by Abiud Kipkemboi Keter
 */

// Fallback dictionary (only used if Groq fails)
const transmutations = {
  shakespeare: {
    greetings: {
      "hello": "Hail", "hi": "Hark", "hey": "Ho there",
      "good morning": "Good morrow", "how are you": "How fares thee",
      "thank you": "I give thee thanks", "please": "Prithee",
      "sorry": "I do beseech thy pardon", "yes": "Aye", "no": "Nay",
      "goodbye": "Farewell", "love": "love most true",
      "friend": "companion dear", "happy": "most glad", "sad": "heavy of heart",
      "beautiful": "fair", "cool": "passing fine", "awesome": "marvelous"
    },
    suffixes: ["— dost thou comprehend?", "— by my troth!", "— forsooth!"],
    prefixes: ["Hark! ", "Pray, ", "Mark me: "]
  }
  // add more styles later if needed
};

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

// Call Groq directly (temporary – key visible in browser)
async function callGroq(text, style, mode) {
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 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' // 
      },
      body: JSON.stringify({
        model: 'llama-3.1-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `You are a master poet. Transform into ${style} style. ${
              mode === 'ghostwriter' ? 'Write a full poem.' : 
              mode === 'critic' ? 'Analyze meter, rhyme, devices.' : ''
            } Output only the result.`
          },
          { role: 'user', content: text }
        ],
        temperature: 0.9,
        max_tokens: 800
      })
    });

    if (!response.ok) throw new Error('Groq error');

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || 'The spirits are silent...';
  } catch (e) {
    console.error(e);
    return transmuteText(text, style); // fallback
  }
}

// Main app logic (keep this exactly as you have, but use callGroq instead)
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

  transmuteBtn.addEventListener('click', async () => {
    const value = input.value.trim();
    if (!value) return alert("Type something first 😅");

    transmuteBtn.textContent = "Cooking... ✨";
    transmuteBtn.disabled = true;

    let result = await callGroq(value, styleSelect.value, currentMode);

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
