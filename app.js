let currentMode = "transmute";
let lastRequest = null;
let remixTone = "neutral";

const input = document.getElementById("inputText");
const outputText = document.getElementById("outputText");
const outputBox = document.getElementById("outputBox");
const submitBtn = document.getElementById("submitBtn");
const rewriteBtn = document.getElementById("rewriteBtn");
const historyList = document.getElementById("historyList");
const styleSelect = document.getElementById("styleSelect");
const emojiToggle = document.getElementById("emojiToggle");
const typeToggle = document.getElementById("typeToggle");

/* MODE SWITCH */
document.querySelectorAll(".mode-btn").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".mode-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentMode = btn.dataset.mode;

    if (currentMode === "ghostwriter") {
      input.placeholder = "Describe the poem you want...";
    } else if (currentMode === "critic") {
      input.placeholder = "Paste text for critique...";
    } else {
      input.placeholder = "Type your plea...";
    }
  };
});

/* REMIX */
document.querySelectorAll(".remix button").forEach(b => {
  b.onclick = () => remixTone = b.dataset.tone;
});

/* SUBMIT */
submitBtn.onclick = () => run(false);
rewriteBtn.onclick = () => lastRequest && run(true);

async function run(rewrite) {
  const text = rewrite ? lastRequest.text : input.value.trim();
  if (!text) return alert("Write something first.");

  const style = styleSelect.value;
  const strength = document.getElementById("strength").value;

  lastRequest = { text, style };

  outputBox.style.display = "block";
  animate("✨ Conjuring...");

  const promptMap = {
    transmute: text,
    ghostwriter: `Write a complete original poem based on this idea:\n${text}`,
    critic: `Critically analyze the following text. Discuss tone, strengths, weaknesses, and suggestions:\n${text}`
  };

  const res = await fetch("/api/transmute", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: promptMap[currentMode],
      style: `${style} | strength ${strength}% | tone ${remixTone}`,
      mode: currentMode
    })
  });

  const data = await res.json();
  let result = data.transmuted || "Silence answers.";

  if (emojiToggle.checked && currentMode !== "critic") {
    const emojis = ["✨","🔥","🌟","🪶","🔮"];
    result += " " + emojis[Math.floor(Math.random() * emojis.length)];
  }

  animate(result);
  saveHistory(result);
}

/* TYPEWRITER + INK */
function animate(text) {
  outputText.textContent = "";
  outputText.classList.remove("ink");
  void outputText.offsetWidth;
  outputText.classList.add("ink");

  let i = 0;
  const speed = typeToggle.checked ? 22 : 0;

  const t = setInterval(() => {
    outputText.textContent += text[i++] || "";
    if (i >= text.length) clearInterval(t);
  }, speed || 1);
}

/* HISTORY */
function saveHistory(text) {
  let h = JSON.parse(localStorage.keterHistory || "[]");
  h.unshift(text);
  h = h.slice(0, 20);
  localStorage.keterHistory = JSON.stringify(h);
  renderHistory();
}

function renderHistory() {
  historyList.innerHTML = "";
  JSON.parse(localStorage.keterHistory || "[]").forEach(t => {
    const d = document.createElement("div");
    d.className = "history-item";
    d.textContent = t.slice(0, 90) + "…";
    d.onclick = () => animate(t);
    historyList.appendChild(d);
  });
}
renderHistory();

/* VOICE */
function speakText() {
  const text = outputText.textContent.trim();
  if (!text) return;

  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 0.9;

  const voices = speechSynthesis.getVoices();
  if (styleSelect.value.includes("Shakespeare")) {
    u.voice = voices.find(v => v.lang.includes("en-GB")) || voices[0];
  }
  speechSynthesis.speak(u);
}

/* EXPORT */
function exportImage() {
  html2canvas(outputText).then(c => {
    const a = document.createElement("a");
    a.href = c.toDataURL();
    a.download = "keter-aether.png";
    a.click();
  });
}

function exportPDF() {
  html2canvas(outputText).then(c => {
    const pdf = new jspdf.jsPDF();
    pdf.addImage(c.toDataURL(), "PNG", 10, 10, 190, 0);
    pdf.save("keter-aether.pdf");
  });
}

/* THEME */
const themeBtn = document.getElementById("themeBtn");
if (localStorage.theme === "light") document.body.classList.add("light");

themeBtn.onclick = () => {
  document.body.classList.toggle("light");
  localStorage.theme = document.body.classList.contains("light") ? "light" : "dark";
};
