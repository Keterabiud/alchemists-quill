/**
 * Keter Aether – Final Vercel Version (openai/gpt-oss-120b)
 */

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
    return text; // keep original text on error
  }
}

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
        input.placeholder = "Type anything — I'll change how it sounds...";
        styleSelect.style.display = 'block';
      } else if (currentMode === 'ghostwriter') {
        input.placeholder = "Describe the poem you want...";
        styleSelect.style.display = 'block';
      } else {
        input.placeholder = "Paste text to analyze...";
        styleSelect.style.display = 'none';
      }
    });
  });

  transmuteBtn.addEventListener('click', async () => {
    const value = input.value.trim();
    if (!value) return alert("Type something first 😅");

    const originalBtnText = transmuteBtn.textContent;
    transmuteBtn.innerHTML = '<span class="spinner">✨</span> Cooking...';
    transmuteBtn.disabled = true;

    let result = await callOpenAI(value, styleSelect.value, currentMode);

    if (addEmojis) {
      const emojis = ['🔥','✨','😎','💫','🌟','🥳','🚀','🪄','💖','😂'];
      result += ' ' + emojis[Math.floor(Math.random() * emojis.length)];
    }

    outputText.textContent = result;
    styleLabel.textContent = styleSelect.options[styleSelect.selectedIndex].text;
    outputSection.style.display = 'block';
    outputSection.scrollIntoView({ behavior: 'smooth' });

    transmuteBtn.textContent = originalBtnText;
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
  navigator.share?.({ title: "Keter Aether creation", text }) ||
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
}
