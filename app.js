/**
 * Keter Aether – Production-Safe app.js
 * Auth-aware, mobile-safe, Clerk-friendly
 */

/* ===================== API ===================== */
async function callOpenAI(text, style, mode) {
  try {
    const response = await fetch("/api/transmute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, style, mode })
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || `HTTP ${response.status}`);
    }

    return data.transmuted || "The spirits whisper faintly...";
  } catch (error) {
    console.error("API call failed:", error);
    alert("The spirits are restless — try again ✨");
    return text;
  }
}

/* ===================== APP BOOT ===================== */
function bootKeterAetherApp() {
  if (window.__KETER_APP_BOOTED__) return;
  window.__KETER_APP_BOOTED__ = true;

  /* ---------- DOM ---------- */
  const input = document.getElementById("modernInput");
  const transmuteBtn = document.getElementById("transmuteBtn");
  const styleSelect = document.getElementById("styleSelect");
  const outputSection = document.getElementById("outputSection");
  const outputText = document.getElementById("outputText");
  const styleLabel = document.getElementById("styleLabel");
  const emojiSwitch = document.getElementById("emojiSwitch");
  const typewriterSwitch = document.getElementById("typewriterSwitch");

  if (!input || !transmuteBtn) return;

  /* ---------- RANDOM TEXT ---------- */
  const buttonPhrases = [
    "Let's Go! 🚀",
    "Transmute Now ✨",
    "Unleash the Words 🪶",
    "Begin the Alchemy 🔥",
    "Awaken the Quill 🪄"
  ];

  const placeholders = [
    "Type your plea...",
    "Whisper your desire...",
    "Offer your words to the void...",
    "Reveal your incantation..."
  ];

  const randomPlaceholder =
    placeholders[Math.floor(Math.random() * placeholders.length)];

  input.placeholder = randomPlaceholder;
  transmuteBtn.textContent =
    buttonPhrases[Math.floor(Math.random() * buttonPhrases.length)];

  /* ---------- MODE SYSTEM ---------- */
  let currentMode = "transmute";
  let addEmojis = emojiSwitch?.checked ?? true;

  emojiSwitch?.addEventListener("change", e => {
    addEmojis = e.target.checked;
  });

  const modeContainer = document.createElement("div");
  modeContainer.className = "mode-pills";
  modeContainer.innerHTML = `
    <button data-mode="transmute" class="pill active">Transmutation Engine</button>
    <button data-mode="ghostwriter" class="pill">Ghostwriter's Quill</button>
    <button data-mode="critic" class="pill">Critic's Eye</button>
  `;

  transmuteBtn.parentNode.insertBefore(modeContainer, transmuteBtn);

  modeContainer.querySelectorAll(".pill").forEach(btn => {
    btn.addEventListener("click", () => {
      currentMode = btn.dataset.mode;

      modeContainer.querySelectorAll(".pill")
        .forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      if (currentMode === "critic") {
        styleSelect.style.display = "none";
        input.placeholder = "Paste text to analyze...";
      } else {
        styleSelect.style.display = "block";
        input.placeholder =
          currentMode === "ghostwriter"
            ? "Describe the poem you want..."
            : randomPlaceholder;
      }
    });
  });

  /* ---------- TRANSMUTE ---------- */
  transmuteBtn.addEventListener("click", async () => {
    const value = input.value.trim();
    if (!value) return alert("Type something first 😅");

    transmuteBtn.disabled = true;
    const originalText = transmuteBtn.textContent;
    transmuteBtn.innerHTML = '<span class="spinner">✨</span> Working...';

    let result = await callOpenAI(
      value,
      styleSelect?.value,
      currentMode
    );

    if (addEmojis) {
      const emojis = ["✨", "🔥", "💫", "🌟", "🪄"];
      result += " " + emojis[Math.floor(Math.random() * emojis.length)];
    }

    const useTypewriter = typewriterSwitch?.checked;
    outputText.textContent = "";

    if (useTypewriter) {
      typeWriter(result, outputText);
    } else {
      outputText.textContent = result;
    }

    styleLabel.textContent =
      styleSelect?.selectedOptions[0]?.text || "";
    outputSection.style.display = "block";
    outputSection.scrollIntoView({ behavior: "smooth" });

    transmuteBtn.textContent = originalText;
    transmuteBtn.disabled = false;
  });
}

/* ===================== TYPEWRITER ===================== */
function typeWriter(text, target, index = 0) {
  if (index >= text.length) return;

  target.textContent += text.charAt(index);
  setTimeout(
    () => typeWriter(text, target, index + 1),
    45 + Math.random() * 80
  );
}

/* ===================== AUTH GATE ===================== */
document.addEventListener("DOMContentLoaded", () => {
  if (!window.Clerk) return;

  Clerk.addListener(({ user }) => {
    if (user) {
      bootKeterAetherApp();
    }
  });
});

/* ===================== UTILITIES ===================== */
window.copyText = () => {
  const text = document.getElementById("outputText")?.textContent;
  if (!text) return;
  navigator.clipboard.writeText(text);
};

window.speakText = () => {
  const text = document.getElementById("outputText")?.textContent;
  if (!text) return;

  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9;
  speechSynthesis.speak(utterance);
};

window.shareText = () => {
  const text = document.getElementById("outputText")?.textContent;
  if (!text) return;

  if (navigator.share) {
    navigator.share({ title: "Keter Aether", text });
  } else {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  }
};
