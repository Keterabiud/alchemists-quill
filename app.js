/**
 * The Alchemist's Quill — With OpenAI TTS (Premium Voice)
 * Conjured by Abiud Keter & Kimi
 */

// ... (keep all your existing transmutations, transmuteText, transmuteWithAI, visual effects, etc.)

// === PREMIUM VOICE (OpenAI TTS) ===
let usePremiumVoice = true;   // Default: ON (sounds amazing)
let isSpeaking = false;

async function speakText() {
  if (isSpeaking) {
    // stop any playing audio
    if (window.currentAudio) window.currentAudio.pause();
    isSpeaking = false;
    return;
  }

  const text = document.getElementById('outputText').textContent.trim();
  if (!text) return;

  try {
    const response = await fetch('/api/speak', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.error);

    const audio = new Audio(data.audio);
    window.currentAudio = audio;   // for stopping later

    audio.onended = () => { isSpeaking = false; };
    audio.onerror = () => { isSpeaking = false; };

    isSpeaking = true;
    audio.play();

  } catch (err) {
    console.warn('Premium voice failed, falling back to browser...');
    // Fallback to your old browser speak
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    utterance.pitch = 0.9;
    speechSynthesis.speak(utterance);
  }
}
// ==================================

// (keep all your existing code until DOMContentLoaded)

// Inside DOMContentLoaded, after styleSelect, add the toggle:
const voiceToggleLabel = document.createElement('label');
voiceToggleLabel.style.marginLeft = '15px';
voiceToggleLabel.style.color = '#8B4513';
voiceToggleLabel.innerHTML = `
  <input type="checkbox" id="premiumVoiceChk" checked> Premium Bard Voice (OpenAI)
`;
styleSelect.parentNode.insertBefore(voiceToggleLabel, styleSelect.nextSibling);

document.getElementById('premiumVoiceChk').addEventListener('change', (e) => {
  usePremiumVoice = e.target.checked;
});

// In the transmute success block, after scrollIntoView, change the auto-narrate to:
if (usePremiumVoice || voicesLoaded) {   // always try premium if enabled
  setTimeout(() => {
    speakText();
  }, 800);
}
