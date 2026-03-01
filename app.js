// app.js — Keter Aether (FINAL WORKING)

let currentMode = "transmute";

// -------------------- MODE SWITCHING --------------------
document.querySelectorAll(".pill").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".pill").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentMode = btn.dataset.mode;
  });
});

// -------------------- MAIN TRANSMUTE --------------------
document.getElementById("transmuteBtn").addEventListener("click", async () => {
  const text = document.getElementById("modernInput").value.trim();
  const style = document.getElementById("styleSelect").value;
  const output = document.getElementById("outputText");
  const outputSection = document.getElementById("outputSection");

  if (!text) {
    alert("Please enter text first.");
    return;
  }

  outputSection.style.display = "block";
  output.textContent = "✨ Transmuting…";

  try {
    const res = await fetch("/api/transmute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        style,
        mode: currentMode
      })
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.error || "Transmutation failed");
    }

    renderOutput(data.transmuted || data.output || "");

  } catch (err) {
    console.error(err);
    output.textContent = "⚠️ Transmutation failed. Check console.";
  }
});

// -------------------- OUTPUT RENDER --------------------
function renderOutput(text) {
  const output = document.getElementById("outputText");
  const typewriter = document.getElementById("typewriterSwitch")?.checked;

  output.textContent = "";

  if (!typewriter) {
    output.textContent = text;
    return;
  }

  let i = 0;
  const click = document.getElementById("typewriterClick");

  const interval = setInterval(() => {
    output.textContent += text.charAt(i);
    if (click) click.currentTime = 0, click.play();
    i++;
    if (i >= text.length) clearInterval(interval);
  }, 20);
}

// -------------------- ACTIONS --------------------
function copyText() {
  navigator.clipboard.writeText(
    document.getElementById("outputText").innerText
  );
  alert("Copied ✨");
}

function speakText() {
  const text = document.getElementById("outputText").innerText;
  if (!text) return;
  speechSynthesis.speak(new SpeechSynthesisUtterance(text));
}

function shareText() {
  const text = document.getElementById("outputText").innerText;
  if (navigator.share) {
    navigator.share({ text });
  } else {
    alert("Sharing not supported on this device.");
  }
    }
