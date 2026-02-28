let currentMode = "transmute";

const input = document.getElementById("mainInput");
const styleSelect = document.getElementById("styleSelect");
const outputText = document.getElementById("outputText");
const outputSection = document.getElementById("outputSection");
const btn = document.getElementById("transmuteBtn");
const typewriter = document.getElementById("typewriterSwitch");

/* MODE SWITCHING */
document.querySelectorAll(".pill").forEach(pill => {
  pill.addEventListener("click", () => {
    document.querySelectorAll(".pill").forEach(p => p.classList.remove("active"));
    pill.classList.add("active");
    currentMode = pill.dataset.mode;

    if (currentMode === "critic") {
      input.placeholder = "Paste text to analyze...";
      styleSelect.style.display = "none";
      btn.textContent = "Analyze 🔍";
    } else if (currentMode === "ghostwriter") {
      input.placeholder = "Describe the poem, mood, or theme...";
      styleSelect.style.display = "block";
      btn.textContent = "Summon the Quill 🪶";
    } else {
      input.placeholder = "Utter the forbidden phrase...";
      styleSelect.style.display = "block";
      btn.textContent = "Begin the Alchemy ✨";
    }
  });
});

/* API CALL */
async function callOpenAI(text, style, mode) {
  const res = await fetch("/api/transmute", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, style, mode })
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.error);
  return data.transmuted;
}

/* BUTTON ACTION */
btn.onclick = async () => {
  if (!input.value.trim()) return alert("Type something first 😅");

  btn.disabled = true;
  btn.textContent = "Working… ✨";

  try {
    const result = await callOpenAI(
      input.value,
      styleSelect.value,
      currentMode
    );

    outputSection.classList.add("show");

    if (typewriter.checked) {
      outputText.textContent = "";
      let i = 0;
      const t = setInterval(() => {
        outputText.textContent += result[i++];
        if (i >= result.length) clearInterval(t);
      }, 30);
    } else {
      outputText.textContent = result;
    }

  } catch (e) {
    alert(e.message);
  }

  btn.disabled = false;
};

/* HELPERS */
function copyText() {
  navigator.clipboard.writeText(outputText.textContent);
  alert("Copied ✨");
}

function speakText() {
  speechSynthesis.cancel();
  speechSynthesis.speak(new SpeechSynthesisUtterance(outputText.textContent));
}

function shareText() {
  navigator.share?.({ title: "Keter Aether", text: outputText.textContent });
}
