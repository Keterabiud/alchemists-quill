const transmutations = {
    shakespeare: {
        greetings: {
            "hello": "Hail",
            "hi": "Hark",
            "hey": "Ho there",
            "good morning": "Good morrow",
            "good night": "Good e'en",
            "how are you": "How fares thee",
            "thank you": "I give thee thanks",
            "please": "Prithee",
            "sorry": "I do beseech thy pardon",
            "yes": "Aye",
            "no": "Nay",
            "goodbye": "Farewell",
            "love": "love most true",
            "friend": "companion dear",
            "money": "coin",
            "work": "toil",
            "happy": "most glad",
            "sad": "heavy of heart",
            "angry": "wroth",
            "beautiful": "fair",
            "ugly": "ill-favored"
        },
        suffixes: ["— dost thou comprehend?", "— pray, tell me true.", "— by my troth!", "— what sayest thou?", "."],
        prefixes: ["Hark! ", "O! ", "Pray, ", "Mark me: ", "List! "]
    },
    
    victorian: {
        greetings: {
            "hello": "How do you do",
            "hi": "I bid you good day",
            "love": "affection most profound",
            "friend": "dearest acquaintance",
            "money": "pecuniary resources",
            "work": "occupation",
            "happy": "in good spirits",
            "sad": "rather low",
            "beautiful": "quite becoming",
            "ugly": "unfortunate in appearance"
        },
        suffixes: ["— I remain, etc.", "— Most sincerely.", "— Your humble servant.", "."],
        prefixes: ["I daresay ", "It is my understanding that ", "One finds that ", "It is quite the thing to say that "]
    },
    
    poe: {
        greetings: {
            "hello": "Dark greetings",
            "hi": "Hark, from the shadow",
            "love": "obsession eternal",
            "friend": "fellow traveler in darkness",
            "money": "cursed gold",
            "work": "endless toil",
            "happy": "fleeting moment of light",
            "sad": "abyssal despair",
            "beautiful": "hauntingly lovely",
            "ugly": "twisted by sorrow"
        },
        suffixes: ["— nevermore.", "— in the shadows of the night.", "— till the raven calls.", "— through the mists of time.", "."],
        prefixes: ["Once upon a midnight dreary, ", "In the bleak December, ", "From out the shadow, ", "Hark! "]
    },
    
    romantic: {
        greetings: {
            "hello": "Dearest salutations",
            "hi": "My heart leaps",
            "love": "passion unbound",
            "friend": "kindred spirit",
            "money": "earthly means",
            "work": "noble pursuit",
            "happy": "swept by joy",
            "sad": "tears adrift",
            "beautiful": "transcendent",
            "ugly": "unseen by loving eyes"
        },
        suffixes: ["— my heart swells!", "— forever thine.", "— until the stars fade.", "— with all my soul.", "."],
        prefixes: ["Oh! ", "Behold! ", "My dearest, ", "In rapture, "]
    }
};

function transmuteText(text, style) {
    const patterns = transmutations[style];
    let result = text.toLowerCase();
    
    for (let [modern, archaic] of Object.entries(patterns.greetings)) {
        const regex = new RegExp(`\\b${modern}\\b`, 'gi');
        result = result.replace(regex, archaic);
    }
    
    const prefix = Math.random() > 0.7 ? 
        patterns.prefixes[Math.floor(Math.random() * patterns.prefixes.length)] : "";
    const suffix = patterns.suffixes[Math.floor(Math.random() * patterns.suffixes.length)];
    
    result = result.charAt(0).toUpperCase() + result.slice(1);
    
    return prefix + result + suffix;
}

document.addEventListener('DOMContentLoaded', () => {
    const transmuteBtn = document.getElementById('transmuteBtn');
    const modernInput = document.getElementById('modernInput');
    const styleSelect = document.getElementById('styleSelect');
    const outputSection = document.getElementById('outputSection');
    const outputText = document.getElementById('outputText');
    const styleLabel = document.getElementById('styleLabel');
    
    const styleNames = {
        shakespeare: "The Bard's Rendering:",
        victorian: "The Gentleperson's Rendering:",
        poe: "The Gothic Rendering:",
        romantic: "The Lover's Rendering:"
    };
    
    transmuteBtn.addEventListener('click', () => {
        const input = modernInput.value.trim();
        if (!input) {
            alert("Prithee, enter some text first!");
            return;
        }
        
        const style = styleSelect.value;
        const transmuted = transmuteText(input, style);
        
        outputText.textContent = transmuted;
        styleLabel.textContent = styleNames[style];
        outputSection.style.display = 'block';
        
        outputSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
});

function copyText() {
    const text = document.getElementById('outputText').textContent;
    navigator.clipboard.writeText(text).then(() => {
        alert("Copied to thy parchment!");
    });
}

function speakText() {
    const text = document.getElementById('outputText').textContent;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    utterance.pitch = 0.9;
    speechSynthesis.speak(utterance);
}

function shareText() {
    const text = document.getElementById('outputText').textContent;
    const shareData = {
        title: 'The Alchemist\'s Quill',
        text: text,
        url: window.location.href
    };
    
    if (navigator.share) {
        navigator.share(shareData);
    } else {
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`;
        window.open(twitterUrl, '_blank');
    }
}

console.log("The Alchemist's Quill — Conjured by Abiud Keter & Kimi");
console.log('"We are such stuff as dreams are made on."');
          
/**
 * The Alchemist's Quill — With OpenAI Integration
 * Conjured by Abiud Keter & Kimi
 */

// ... keep your existing transmutations object as FALLBACK ...

// NEW: OpenAI-powered transmutation
async function transmuteWithAI(text, style) {
  try {
    const response = await fetch('/api/transmute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text, style })
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Transmutation failed');
    }

    return data.transmuted;

  } catch (error) {
    console.error('AI Transmutation failed:', error);
    // Fallback to local transmutation if API fails
    return transmuteText(text, style);
  }
}

// Update your event listener
document.addEventListener('DOMContentLoaded', () => {
  // ... existing candle and symbol code ...

  const transmuteBtn = document.getElementById('transmuteBtn');
  const modernInput = document.getElementById('modernInput');
  const styleSelect = document.getElementById('styleSelect');
  const outputSection = document.getElementById('outputSection');
  const outputText = document.getElementById('outputText');
  const styleLabel = document.getElementById('styleLabel');

  const styleNames = {
    shakespeare: "The Bard's Rendering (AI):",
    victorian: "The Gentleperson's Rendering (AI):",
    poe: "The Gothic Rendering (AI):",
    romantic: "The Lover's Rendering (AI):"
  };

  transmuteBtn.addEventListener('click', async (e) => {
    const input = modernInput.value.trim();
    if (!input) {
      alert("Prithee, enter some text first!");
      return;
    }

    // Show loading state
    transmuteBtn.textContent = 'Transmuting...';
    transmuteBtn.disabled = true;

    const rect = transmuteBtn.getBoundingClientRect();
    createInkDrop(rect.left + rect.width / 2, rect.top + rect.height / 2);

    const style = styleSelect.value;
    
    try {
      // Use AI transmutation
      const transmuted = await transmuteWithAI(input, style);
      
      outputText.textContent = transmuted;
      styleLabel.textContent = styleNames[style];
      outputSection.style.display = 'block';
      outputSection.classList.add('revealed', 'quill-writing');
      
      setTimeout(() => {
        outputSection.classList.remove('quill-writing');
      }, 500);

      outputSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    } catch (error) {
      alert('The spirits are restless. Try again anon.');
      console.error(error);
    } finally {
      // Reset button
      transmuteBtn.textContent = 'Transmute';
      transmuteBtn.disabled = false;
    }
  });
});
