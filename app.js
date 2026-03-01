// Keter Aether App.js
document.addEventListener('DOMContentLoaded', () => {

  // --- Mode switching ---
  const pills = document.querySelectorAll('.pill');
  const sections = document.querySelectorAll('.section');

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      const mode = pill.dataset.mode;
      sections.forEach(s => s.classList.remove('active'));
      document.getElementById(mode).classList.add('active');
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
    });
  });

  // --- Variables ---
  const inputText = document.getElementById('inputText');
  const styleSelect = document.getElementById('styleSelect');
  const emojiSwitch = document.getElementById('emojiSwitch');
  const typewriterSwitch = document.getElementById('typewriterSwitch');
  const styleStrength = document.getElementById('styleStrength');
  const outputText = document.getElementById('outputText');
  const outputSection = document.getElementById('outputSection');
  const transmuteBtn = document.getElementById('transmuteBtn');
  const historyToggle = document.getElementById('historyToggle');
  const historySection = document.getElementById('historySection');
  const rewriteBtn = document.getElementById('rewriteBtn');

  const ghostInput = document.getElementById('ghostInput');
  const ghostOutput = document.getElementById('ghostOutput');
  const ghostOutputSection = document.getElementById('ghostOutputSection');
  const ghostBtn = document.getElementById('ghostBtn');

  const criticInput = document.getElementById('criticInput');
  const criticOutput = document.getElementById('criticOutput');
  const criticOutputSection = document.getElementById('criticOutputSection');
  const criticBtn = document.getElementById('criticBtn');

  let history = [];

  // --- Transmutation ---
  transmuteBtn.addEventListener('click', async () => {
    const text = inputText.value.trim();
    if (!text) return alert('Type something first 😅');

    const style = styleSelect.value;
    const emojis = emojiSwitch.checked;
    const typewriter = typewriterSwitch.checked;
    const strength = styleStrength.value;

    // Show loading
    transmuteBtn.disabled = true;
    transmuteBtn.textContent = '✨ Transmuting...';

    const result = await callTransmuteAPI(text, style, strength);

    let finalText = result;
    if (emojis) {
      const emojiList = ['🔥','✨','😎','💫','🌟','🥳','🚀','🪄','💖','😂'];
      finalText += ' ' + emojiList[Math.floor(Math.random() * emojiList.length)];
    }

    addToHistory(text, finalText);

    outputSection.style.display = 'block';
    outputText.textContent = '';
    if (typewriter) typeWriter(finalText, outputText);
    else outputText.textContent = finalText;

    transmuteBtn.disabled = false;
    transmuteBtn.textContent = 'Transmute ✨';
  });

  // --- Rewrite ---
  rewriteBtn.addEventListener('click', () => {
    inputText.value = outputText.textContent;
    outputSection.style.display = 'none';
  });

  // --- History toggle ---
  historyToggle.addEventListener('click', () => {
    historySection.style.display = historySection.style.display === 'block' ? 'none' : 'block';
    historySection.innerHTML = history.map(h => `<p><strong>Input:</strong> ${h.input}<br><strong>Output:</strong> ${h.output}</p>`).join('');
  });

  // --- Ghostwriter ---
  ghostBtn.addEventListener('click', async () => {
    const text = ghostInput.value.trim();
    if (!text) return alert('Write a prompt first 😅');

    ghostOutputSection.style.display = 'block';
    ghostOutput.textContent = '✨ Summoning words...';

    const result = await callTransmuteAPI(text, 'Poetic', 70);
    ghostOutput.textContent = result;
  });

  // --- Critic ---
  criticBtn.addEventListener('click', async () => {
    let text = criticInput.value.trim();
    if (!text) text = outputText.textContent || ghostOutput.textContent;
    if (!text) return alert('Nothing to analyze 😅');

    criticOutputSection.style.display = 'block';
    criticOutput.textContent = '🔍 Analyzing...';

    const result = await callCriticAPI(text);
    criticOutput.textContent = result;
  });

  // --- Typewriter effect ---
  function typeWriter(text, el, i=0) {
    if (i < text.length) {
      el.textContent += text[i];
      setTimeout(() => typeWriter(text, el, i+1), 35 + Math.random()*50);
    }
  }

  // --- History helper ---
  function addToHistory(input, output) {
    history.unshift({input, output});
    if(history.length>20) history.pop();
  }

  // --- API calls ---
  async function callTransmuteAPI(text, style, strength) {
    try {
      const res = await fetch('/api/transmute', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({text, style, strength})
      });
      const data = await res.json();
      return data.success ? data.transmuted : text;
    } catch(e) {
      console.error(e);
      return text;
    }
  }

  async function callCriticAPI(text) {
    // Placeholder – replace with GPT critic call
    return `Critique of text:\n${text}\n\n[Consider clarity, style, grammar, tone]`;
  }

  // --- Copy / Speak / Share ---
  window.copyText = () => navigator.clipboard.writeText(outputText.textContent).then(()=>alert('Copied! 🎉'));
  window.speakText = () => {
    const t = outputText.textContent.trim(); if(!t)return;
    const ut = new SpeechSynthesisUtterance(t); ut.rate=0.9; speechSynthesis.speak(ut);
  };
  window.shareText = () => {
    const t = outputText.textContent;
    navigator.share?.({title:'Keter Aether', text:t}) || window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(t)}`);
  };
});
