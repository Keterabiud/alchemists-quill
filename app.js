/**
 * Keter Aether – Main logic
 */

// API call to your backend (/api/transmute)
async function callOpenAI(text, style, mode) {
  try {
    const response = await fetch('/api/transmute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, style, mode })
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || `HTTP ${response.status}`);
    }

    return data.transmuted || 'The spirits whisper faintly...';
  } catch (error) {
    console.error('API call failed:', error);
    alert(`Oops! ${error.message || 'The spirits are acting up. Try again?'}`);
    return text;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Random button text on load
  const buttonPhrases = [
    "Let's Go! 🚀",
    "Transmute Now ✨",
    "Unleash the Words 🪶",
    "Begin the Alchemy 🔥",
    "Speak Your Desire 🔮",
    "Forge the Verse 🌟",
    "Awaken the Quill 🪄"
  ];
  const randomBtnText = buttonPhrases[Math.floor(Math.random() * buttonPhrases.length)];
  document.getElementById('transmuteBtn').textContent = randomBtnText;

  // Random placeholder
  const placeholders = [
    "Type your plea...",
    "Whisper your desire...",
    "Offer your words to the void...",
    "Speak what the soul craves...",
    "Reveal your hidden incantation...",
    "Pour forth your essence...",
    "Utter the forbidden phrase..."
  ];
  const randomPlaceholder = placeholders[Math.floor(Math.random() * placeholders.length)];
  document.getElementById('modernInput').placeholder = randomPlaceholder;

  const styleSelect = document.getElementById('styleSelect');
  const outputSection = document.getElementById('outputSection');
  const outputText = document.getElementById('outputText');
  const styleLabel = document.getElementById('styleLabel');
  const emojiSwitch = document.getElementById('emojiSwitch');
  const typewriterSwitch = document.getElementById('typewriterSwitch');

  let currentMode = 'transmute';
  let addEmojis = true;

  emojiSwitch.addEventListener('change', e => addEmojis = e.target.checked);

  const modeContainer = document.createElement('div');
  modeContainer.className = 'mode-pills';
  modeContainer.innerHTML = `
    <button data-mode="transmute" class="pill active">Transmutation Engine</button>
    <button data-mode="ghostwriter" class="pill">Ghostwriter's Quill</button>
    <button data-mode="critic" class="pill">Critic's Eye</button>
  `;

  document.getElementById('transmuteBtn').parentNode.insertBefore(modeContainer, document.getElementById('transmuteBtn'));

  modeContainer.querySelectorAll('.pill').forEach(btn => {
    btn.addEventListener('click', () => {
      currentMode = btn.dataset.mode;
      modeContainer.querySelectorAll('.pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (currentMode === 'transmute') {
        document.getElementById('modernInput').placeholder = randomPlaceholder;
        styleSelect.style.display = 'block';
      } else if (currentMode === 'ghostwriter') {
        document.getElementById('modernInput').placeholder = "Describe the poem you want...";
        styleSelect.style.display = 'block';
      } else {
        document.getElementById('modernInput').placeholder = "Paste text to analyze...";
        styleSelect.style.display = 'none';
      }
    });
  });

  document.getElementById('transmuteBtn').addEventListener('click', async () => {
    const value = document.getElementById('modernInput').value.trim();
    if (!value) return alert("Type something first 😅");

    const originalBtnText = document.getElementById('transmuteBtn').textContent;
    document.getElementById('transmuteBtn').innerHTML = '<span class="spinner">✨</span> Cooking...';
    document.getElementById('transmuteBtn').disabled = true;

    let result = await callOpenAI(value, styleSelect.value, currentMode);

    if (addEmojis) {
      const emojis = ['🔥','✨','😎','💫','🌟','🥳','🚀','🪄','💖','😂'];
      result += ' ' + emojis[Math.floor(Math.random() * emojis.length)];
    }

    const useTypewriter = typewriterSwitch.checked;

    outputText.classList.toggle('typewriter', useTypewriter);

    if (useTypewriter) {
      outputText.textContent = '';
      typeWriter(result);
    } else {
      outputText.textContent = result;
    }

    styleLabel.textContent = styleSelect.options[styleSelect.selectedIndex].text;
    outputSection.style.display = 'block';
    outputSection.scrollIntoView({ behavior: 'smooth' });

    document.getElementById('transmuteBtn').textContent = originalBtnText;
    document.getElementById('transmuteBtn').disabled = false;
  });

  function typeWriter(text, index = 0) {
    if (index < text.length) {
      const char = text.charAt(index);
      outputText.textContent += char;

      const sound = document.getElementById('typewriterClick');
      if (sound) {
        sound.currentTime = 0;
        sound.volume = 0.18;
        sound.play().catch(() => {});
      }

      const delay = 50 + Math.random() * 90;
      setTimeout(() => typeWriter(text, index + 1), delay);
    }
  }
});

function copyText() {
  const text = document.getElementById('outputText').textContent;
  navigator.clipboard.writeText(text).then(() => alert("Copied! 🎉"));
}

function speakText() {
  const text = document.getElementById('outputText').textContent.trim();
  if (!text) return alert("Nothing to speak yet 😅");

  speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9;
  utterance.pitch = 1.0;
  speechSynthesis.speak(utterance);
}

function shareText() {
  const text = document.getElementById('outputText').textContent;
  navigator.share?.({ title: "Keter Aether creation", text }) ||
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
        }
