/* ===============================
   KETER AETHER — FRONTEND LOGIC
   =============================== */

const input = document.getElementById("inputText");
const output = document.getElementById("output");
const styleSelect = document.getElementById("style");
const strengthSlider = document.getElementById("strength");

const transmuteBtn = document.getElementById("transmuteBtn");
const rewriteBtn = document.getElementById("rewriteBtn");

const exportImgBtn = document.getElementById("exportImg");
const exportPdfBtn = document.getElementById("exportPdf");
const speakBtn = document.getElementById("speak");

const historyList = document.getElementById("history");
const themeToggle = document.getElementById("themeToggle");

let lastResult = "";

/* ===============================
   CORE TRANSMUTATION
   =============================== */

async function transmute(text) {
  if (!text || !text.trim()) return;

  output.textContent = "⏳ Transmuting...";
  output.classList.remove("animate");

  try {
    const response = await fetch("/api/transmute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        style: styleSelect.value,
        strength: strengthSlider.value
      })
    });

    const data = await response.json();

    if (!data.success) {
      output.textContent = "❌ Transmutation failed";
      return;
    }

    lastResult = data.transmuted;
    renderOutput(lastResult);
    saveToHistory(lastResult);

  } catch (err) {
    output.textContent = "❌ Network error";
    console.error(err);
  }
}

/* ===============================
   OUTPUT RENDER + ANIMATION
   =============================== */

function renderOutput(text) {
  output.textContent = text;

  // restart animation reliably
  output.classList.remove("animate");
  void output.offsetWidth;
  output.classList.add("animate");
}

/* ===============================
   BUTTON EVENTS
   =============================== */

transmuteBtn.addEventListener("click", () => {
  transmute(input.value);
});

rewriteBtn.addEventListener("click", () => {
  if (!lastResult) return;
  transmute(lastResult);
});

/* ===============================
   HISTORY
   =============================== */

function saveToHistory(text) {
  const li = document.createElement("li");
  li.textContent = text.slice(0, 90) + "...";

  li.addEventListener("click", () => {
    renderOutput(text);
    lastResult = text;
  });

  historyList.prepend(li);

  // keep history short
  if (historyList.children.length > 10) {
    historyList.removeChild(historyList.lastChild);
  }
}

/* ===============================
   EXPORT FUNCTIONS
   =============================== */

exportImgBtn.addEventListener("click", async () => {
  const canvas = await html2canvas(output);
  const link = document.createElement("a");
  link.download = "keter-aether.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});

exportPdfBtn.addEventListener("click", async () => {
  const canvas = await html2canvas(output);
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jspdf.jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
  pdf.save("keter-aether.pdf");
});

/* ===============================
   VOICE SYNTHESIS
   =============================== */

speakBtn.addEventListener("click", () => {
  if (!output.textContent) return;

  const utter = new SpeechSynthesisUtterance(output.textContent);
  utter.rate = 0.9;
  utter.pitch = 1;

  // optional: choose deeper voice if available
  const voices = speechSynthesis.getVoices();
  const preferred = voices.find(v => v.lang.startsWith("en"));
  if (preferred) utter.voice = preferred;

  speechSynthesis.cancel();
  speechSynthesis.speak(utter);
});

/* ===============================
   THEME TOGGLE
   =============================== */

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  document.body.classList.toggle("light");

  themeToggle.textContent =
    document.body.classList.contains("dark") ? "🌙" : "☀️";
});

/* ===============================
   SAFETY: LOAD VOICES
   =============================== */

window.speechSynthesis.onvoiceschanged = () => {};
