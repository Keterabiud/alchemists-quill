// ===============================
// KETER AETHER — FINAL APP LOGIC
// ===============================

let currentStyle = "poetic";
let currentMode = "transmute";

const input = document.getElementById("inputText");
const outputSection = document.getElementById("outputSection");
const outputText = document.getElementById("outputText");
const strengthSlider = document.getElementById("strength");
const transmuteBtn = document.getElementById("transmuteBtn");
const historyList = document.getElementById("historyList");

// -------------------------------
// STYLE DROPDOWN
// -------------------------------
const styleBtn = document.getElementById("styleBtn");
const styleMenu = document.getElementById("styleMenu");

styleBtn.onclick = () => {
  styleMenu.classList.toggle("hidden");
};

styleMenu.querySelectorAll("li").forEach(item => {
  item.onclick = () => {
    currentStyle = item.dataset.style;
    styleBtn.textContent = item.textContent + " ▼";
    styleMenu.classList.add("hidden");
  };
});

// -------------------------------
// MODE BUTTONS
// -------------------------------
document.querySelectorAll(".mode").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".mode").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentMode = btn.dataset.mode;
  };
});

// -------------------------------
// MAIN TRANSMUTE
// -------------------------------
transmuteBtn.onclick = async () => {
  const text = input.value.trim();
  if (!text) return alert("Write something first.");

  transmuteBtn.disabled = true;
  transmuteBtn.textContent = "✨ Working...";

  const res = await fetch("/api/transmute", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text,
      style: currentStyle,
      mode: currentMode,
      strength: strengthSlider.value
    })
  });

  const data = await res.json();
  transmuteBtn.disabled = false;
  transmuteBtn.textContent = "✨ Transmute";

  if (!data.success) {
    alert(data.error || "Something failed.");
    return;
  }

  animateOutput(data.transmuted);
  saveHistory(data.transmuted);
};

// -------------------------------
// TYPEWRITER / INK ANIMATION
// -------------------------------
function animateOutput(text) {
  outputSection.classList.remove("hidden");
  outputText.textContent = "";
  let i = 0;

  const interval = setInterval(() => {
    outputText.textContent += text[i];
    i++;
    if (i >= text.length) clearInterval(interval);
  }, 18);
}

// -------------------------------
// REWRITE
// -------------------------------
function rewrite() {
  input.value = outputText.textContent;
  transmuteBtn.click();
}

// -------------------------------
// COPY
// -------------------------------
function copyText() {
  navigator.clipboard.writeText(outputText.textContent);
  alert("Copied ✨");
}

// -------------------------------
// VOICE (STYLE AWARE)
// -------------------------------
function speak() {
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(outputText.textContent);
  u.rate = currentStyle === "shakespearean" ? 0.85 : 1;
  u.pitch = currentStyle === "victorian" ? 0.9 : 1;
  speechSynthesis.speak(u);
}

// -------------------------------
// HISTORY
// -------------------------------
function saveHistory(text) {
  const li = document.createElement("li");
  li.textContent = text.slice(0, 80) + "...";
  li.onclick = () => {
    outputText.textContent = text;
    outputSection.classList.remove("hidden");
  };
  historyList.prepend(li);
     }
