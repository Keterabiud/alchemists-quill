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
 * VISUAL FLAIR & ANIMATIONS
 * Ink effects, candle loader, alchemical interactions
 */

// Remove candle loader after animation
document.addEventListener('DOMContentLoaded', () => {
    const candle = document.getElementById('candleLoader');
    if (candle) {
        setTimeout(() => {
            candle.remove();
        }, 3000);
    }
    
    // Initialize alchemical symbol interactions
    initAlchemicalSymbols();
});

// Ink drop effect on transmute
function createInkDrop(x, y) {
    const drop = document.createElement('div');
    drop.className = 'ink-drop';
    drop.style.left = x + 'px';
    drop.style.top = y + 'px';
    document.body.appendChild(drop);
    
    setTimeout(() => drop.remove(), 1000);
}

// Add ink effect to transmute button
document.addEventListener('DOMContentLoaded', () => {
    const transmuteBtn = document.getElementById('transmuteBtn');
    if (transmuteBtn) {
        transmuteBtn.addEventListener('click', (e) => {
            const rect = transmuteBtn.getBoundingClientRect();
            createInkDrop(rect.left + rect.width / 2, rect.top + rect.height / 2);
            
            // Add quill animation to output
            const outputSection = document.getElementById('outputSection');
            if (outputSection) {
                outputSection.classList.add('revealed');
                outputSection.classList.add('quill-writing');
                setTimeout(() => {
                    outputSection.classList.remove('quill-writing');
                }, 500);
            }
        });
    }
});

// Alchemical symbol hover effects
function initAlchemicalSymbols() {
    const symbols = document.querySelectorAll('.alchemical-symbol');
    
    symbols.forEach(symbol => {
        symbol.addEventListener('mouseenter', () => {
            // Random glow color based on symbol
            const colors = ['#8B4513', '#DAA520', '#CD853F', '#B8860B'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            symbol.style.textShadow = `0 0 30px ${randomColor}`;
        });
        
        symbol.addEventListener('mouseleave', () => {
            symbol.style.textShadow = '';
        });
    });
}

// Parallax effect on scroll
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            const symbols = document.querySelectorAll('.alchemical-symbol');
            
            symbols.forEach((symbol, index) => {
                const speed = 0.5 + (index * 0.1);
                symbol.style.transform = `translateY(${scrolled * speed}px)`;
            });
            
            ticking = false;
        });
        ticking = true;
    }
});

// Add subtle flicker to candle on mouse move (if candle still exists)
document.addEventListener('mousemove', (e) => {
    const candle = document.getElementById('candleLoader');
    if (candle && candle.style.opacity !== '0') {
        const x = (e.clientX / window.innerWidth - 0.5) * 10;
        candle.style.transform = `translate(calc(-50% + ${x}px), -50%)`;
    }
});
                
