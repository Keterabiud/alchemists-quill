/**
 * The Alchemist's Quill — with Real Firebase Login
 * Conjured by Abiud Kipkemboi Keter
 */

// Firebase imports (must be at top)
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";

// Your real Firebase config (from console — paste here or use env var)
const firebaseConfig = {
  apiKey: "AIzaSyDj5obiuI5Bghx8yF7UXrkmazTNTAqX1Bk",
  authDomain: "alchemists-quill.firebaseapp.com",
  projectId: "alchemists-quill",
  storageBucket: "alchemists-quill.firebasestorage.app",
  messagingSenderId: "715648815341",
  appId: "1:715648815341:web:88fb5a5496d25e91ec7ce4",
  measurementId: "G-6J6W8HF9ZV"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Rich local fallback transmutations
const transmutations = {
  shakespeare: {
    greetings: {
      "hello": "Hail", "hi": "Hark", "hey": "Ho there",
      "good morning": "Good morrow", "how are you": "How fares thee",
      "thank you": "I give thee thanks", "please": "Prithee",
      "sorry": "I do beseech thy pardon", "yes": "Aye", "no": "Nay",
      "goodbye": "Farewell", "love": "love most true",
      "friend": "companion dear", "money": "coin", "work": "toil",
      "happy": "most glad", "sad": "heavy of heart", "angry": "wroth",
      "beautiful": "fair", "ugly": "ill-favored", "cool": "passing fine",
      "awesome": "marvelous", "bad": "wretched", "tired": "weary"
    },
    suffixes: ["— dost thou comprehend?", "— by my troth!", "— what sayest thou?", "— forsooth!"],
    prefixes: ["Hark! ", "Pray, ", "Mark me: ", "List! "]
  },
  victorian: {
    greetings: {
      "hello": "How do you do", "love": "affection most profound",
      "friend": "dearest acquaintance", "happy": "in good spirits",
      "sad": "rather low"
    },
    suffixes: ["— Most sincerely.", "— Your humble servant."],
    prefixes: ["I daresay ", "It is my understanding that "]
  },
  poe: {
    greetings: {
      "hello": "Dark greetings", "love": "obsession eternal",
      "happy": "fleeting moment of light", "sad": "abyssal despair"
    },
    suffixes: ["— nevermore.", "— in the shadows of the night."],
    prefixes: ["Once upon a midnight dreary, ", "In the bleak December, "]
  },
  romantic: {
    greetings: {
      "hello": "Dearest salutations", "love": "passion unbound",
      "happy": "swept by joy"
    },
    suffixes: ["— my heart swells!", "— forever thine."],
    prefixes: ["Oh! ", "My dearest, ", "In rapture, "]
  },
  genz: {
    greetings: {
      "hello": "Yo what's good", "hi": "Heyyy", "hey": "Sup bestie",
      "good morning": "Morningggg", "how are you": "You good?",
      "thank you": "Tysm", "please": "Pls", "sorry": "My bad fr",
      "yes": "Bet", "no": "Cap", "goodbye": "I'm out", "love": "I got mad rizz for you",
      "friend": "Bestie", "money": "Bread", "work": "Grind", "happy": "Slay",
      "sad": "This is so depressing", "cool": "Fire", "awesome": "No cap this is bussin"
    },
    suffixes: [" fr", " no cap", " periodt", " ong", " that's crazy"],
    prefixes: ["Lowkey ", "Highkey ", "Bro ", "Fam "]
  }
};

function transmuteText(text, style) {
  const patterns = transmutations[style] || transmutations.shakespeare;
  let result = text.toLowerCase();

  for (let [modern, archaic] of Object.entries(patterns.greetings || {})) {
    const regex = new RegExp(`\\b${modern}\\b`, 'gi');
    result = result.replace(regex, archaic);
  }

  const prefix = Math.random() > 0.7 ? (patterns.prefixes?.[Math.floor(Math.random() * patterns.prefixes.length)] || '') : '';
  const suffix = patterns.suffixes?.[Math.floor(Math.random() * patterns.suffixes.length)] || '';

  result = result.charAt(0).toUpperCase() + result.slice(1);
  return prefix + result + suffix;
}

async function callOpenAI(text, style, mode) {
  try {
    const response = await fetch('/api/transmute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, style, mode })
    });
    const data = await response.json();
    if (!data.success) throw new Error(data.error || 'Failed');
    return data.transmuted || data.poem || data.analysis || "The spirits whisper faintly...";
  } catch (error) {
    console.warn('OpenAI failed → fallback');
    if (mode === 'transmute') return transmuteText(text, style);
    if (mode === 'ghostwriter') return "In shadowed halls where moonlight gleams,\nA lonely soul doth chase its dreams...";
    if (mode === 'critic') return "Meter: iambic pentameter\nRhyme: ABAB\nDevices: metaphor, alliteration, imagery";
    return "The veil is thin tonight...";
  }
}

function createInkDrop(x, y) {
  const drop = document.createElement('div');
  drop.className = 'ink-drop';
  drop.style.left = `${x}px`;
  drop.style.top = `${y}px`;
  document.body.appendChild(drop);
  setTimeout(() => drop.remove(), 1000);
}

function initAlchemicalSymbols() {
  document.querySelectorAll('.alchemical-symbol').forEach(symbol => {
    symbol.addEventListener('mouseenter', () => {
      const colors = ['#D4AF37', '#BFAF8F', '#A0895F'];
      symbol.style.textShadow = `0 0 20px ${colors[Math.floor(Math.random() * colors.length)]}`;
    });
    symbol.addEventListener('mouseleave', () => symbol.style.textShadow = '');
  });
}

// Main app
document.addEventListener('DOMContentLoaded', () => {
  const candle = document.getElementById('candleLoader');
  if (candle) setTimeout(() => candle.remove(), 3000);

  initAlchemicalSymbols();

  const input = document.getElementById('modernInput');
  const styleSelect = document.getElementById('styleSelect');
  const transmuteBtn = document.getElementById('transmuteBtn');
  const outputSection = document.getElementById('outputSection');
  const outputText = document.getElementById('outputText');
  const styleLabel = document.getElementById('styleLabel');

  let currentMode = 'transmute';

  // Create mode pills
  const modeContainer = document.createElement('div');
  modeContainer.className = 'mode-pills';
  modeContainer.innerHTML = `
    <button data-mode="transmute" class="pill active">Transmutation Engine 🪶</button>
    <button data-mode="ghostwriter" class="pill">Ghostwriter's Quill 🪶</button>
    <button data-mode="critic" class="pill">Critic's Eye 👁️</button>
  `;

  // Insert pills right before TRANSMUTE button
  transmuteBtn.parentNode.insertBefore(modeContainer, transmuteBtn);

  // Mode switching
  modeContainer.querySelectorAll('.pill').forEach(btn => {
    btn.addEventListener('click', () => {
      currentMode = btn.dataset.mode;
      modeContainer.querySelectorAll('.pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (currentMode === 'transmute') {
        input.placeholder = "Enter thy modern plea here...";
        styleSelect.style.display = 'block';
        styleLabel.style.display = 'block';
      } else if (currentMode === 'ghostwriter') {
        input.placeholder = "Describe the poem you desire...";
        styleSelect.style.display = 'none';
        styleLabel.style.display = 'none';
      } else if (currentMode === 'critic') {
        input.placeholder = "Paste a verse to analyze...";
        styleSelect.style.display = 'none';
        styleLabel.style.display = 'none';
      }
    });
  });

  // Add Gen Z option
  if (!styleSelect.querySelector('option[value="genz"]')) {
    const opt = document.createElement('option');
    opt.value = 'genz';
    opt.textContent = 'Gen Z Slang';
    styleSelect.appendChild(opt);
  }

  // Transmute logic
  transmuteBtn.addEventListener('click', async () => {
    const value = input.value.trim();
    if (!value) {
      alert("Prithee, enter some text first!");
      return;
    }

    const originalText = transmuteBtn.textContent;
    transmuteBtn.textContent = currentMode === 'critic' ? 'Analyzing...' : 
                              currentMode === 'ghostwriter' ? 'Summoning...' : 'Transmuting...';
    transmuteBtn.disabled = true;

    const rect = transmuteBtn.getBoundingClientRect();
    createInkDrop(rect.left + rect.width / 2, rect.top + rect.height / 2);

    let result = '';

    try {
      if (currentMode === 'transmute') {
        result = await callOpenAI(value, styleSelect.value, 'transmute');
      } else if (currentMode === 'ghostwriter') {
        result = await callOpenAI(value, 'shakespeare', 'ghostwriter');
      } else if (currentMode === 'critic') {
        result = await callOpenAI(value, 'shakespeare', 'critic');
      }

      outputText.textContent = result;
      styleLabel.textContent = currentMode === 'transmute' ? 
        styleSelect.options[styleSelect.selectedIndex].text : 
        (currentMode === 'ghostwriter' ? "Ghostwriter's Quill" : "Critic's Eye");

      outputSection.style.display = 'block';
      outputSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } catch (err) {
      alert('The spirits are restless. Try again anon.');
      console.error(err);
    } finally {
      transmuteBtn.textContent = originalText;
      transmuteBtn.disabled = false;
    }
  });

  // ────────────────────────────────────────────────
  // REAL LOGIN SYSTEM (Firebase)
  // ────────────────────────────────────────────────

  let currentUser = null;

  // Listen for auth changes
  auth.onAuthStateChanged(user => {
    currentUser = user;
    updateEnterButton();
  });

  // Update ENTER button
  function updateEnterButton() {
    const btn = document.querySelector('.btn-enter');
    if (!btn) return;

    if (currentUser) {
      btn.textContent = currentUser.displayName?.split(' ')[0] || 'Account';
      btn.onclick = () => {
        signOut(auth);
        alert('Signed out');
      };
    } else {
      btn.textContent = 'ENTER';
      btn.onclick = showLoginModal;
    }
  }

  // Show login modal
  function showLoginModal() {
    const modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.9);display:flex;align-items:center;justify-content:center;z-index:9999;color:white;';

    modal.innerHTML = `
      <div style="background:#111;padding:2.5rem;border-radius:12px;width:90%;max-width:400px;text-align:center;">
        <h2 style="font-size:2.2rem;margin-bottom:1.5rem;">Enter the Quill</h2>
        
        <button id="googleBtn" style="width:100%;padding:1rem;background:#4285F4;color:white;border:none;border-radius:6px;margin-bottom:1.5rem;cursor:pointer;font-size:1.1rem;">
          Sign in with Google
        </button>

        <div style="margin:1.5rem 0;color:#777;">or</div>

        <input id="email" type="email" placeholder="Email" style="width:100%;padding:0.9rem;margin-bottom:1rem;background:#222;border:1px solid #444;color:white;border-radius:6px;">
        <input id="password" type="password" placeholder="Password" style="width:100%;padding:0.9rem;margin-bottom:1.5rem;background:#222;border:1px solid #444;color:white;border-radius:6px;">

        <button id="signInBtn" style="width:100%;padding:1rem;background:#D4AF37;color:black;border:none;border-radius:6px;cursor:pointer;margin-bottom:1rem;font-size:1.1rem;">
          Sign In
        </button>

        <button id="signUpBtn" style="background:none;border:none;color:#D4AF37;cursor:pointer;font-size:1rem;">
          Create account
        </button>

        <button onclick="this.closest('div').parentElement.remove()" style="margin-top:2rem;background:none;border:none;color:#777;cursor:pointer;">
          Close
        </button>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('#googleBtn').onclick = async () => {
      try {
        await signInWithPopup(auth, googleProvider);
        modal.remove();
      } catch (e) {
        alert('Google sign-in failed: ' + e.message);
      }
    };

    modal.querySelector('#signInBtn').onclick = async () => {
      const email = modal.querySelector('#email').value;
      const pass = modal.querySelector('#password').value;
      try {
        await signInWithEmailAndPassword(auth, email, pass);
        modal.remove();
      } catch (e) {
        alert('Sign in failed: ' + e.message);
      }
    };

    modal.querySelector('#signUpBtn').onclick = async () => {
      const email = modal.querySelector('#email').value;
      const pass = modal.querySelector('#password').value;
      try {
        await createUserWithEmailAndPassword(auth, email, pass);
        modal.remove();
      } catch (e) {
        alert('Sign up failed: ' + e.message);
      }
    };
  }

  // Initialize button state on load
  updateEnterButton();
});

// Utilities (unchanged)
function copyText() {
  const text = document.getElementById('outputText').textContent;
  navigator.clipboard.writeText(text).then(() => alert("Copied!"));
}

function speakText() {
  const text = document.getElementById('outputText').textContent;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.85;
  utterance.pitch = 0.95;
  speechSynthesis.speak(utterance);
}

function shareText() {
  const text = document.getElementById('outputText').textContent;
  if (navigator.share) {
    navigator.share({ title: "The Alchemist's Quill", text });
  } else {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
  }
      }
