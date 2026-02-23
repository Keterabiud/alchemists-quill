  /**
 * The Alchemist's Quill — Complete Application
 * Conjured by Abiud Keter & Kimi
 */

const transmutations = {
    shakespeare: {
        greetings: {
            "hello": "Hail", "hi": "Hark", "hey": "Ho there", "good morning": "Good morrow",
            "good night": "Good e'en", "how are you": "How fares thee", "thank you": "I give thee thanks",
            "please": "Prithee", "sorry": "I do beseech thy pardon", "yes": "Aye", "no": "Nay",
            "goodbye": "Farewell", "love": "love most true", "friend": "companion dear", "money": "coin",
            "work": "toil", "happy": "most glad", "sad": "heavy of heart", "angry": "wroth",
            "beautiful": "fair", "ugly": "ill-favored", "good": "virtuous", "bad": "foul",
            "great": "grand", "little": "petty", "big": "gross", "small": "wee",
            "old": "aged", "young": "green", "new": "fresh", "true": "veritable",
            "false": "counterfeit", "strong": "stout", "weak": "feeble", "brave": "valiant",
            "coward": "craven", "smart": "cunning", "stupid": "dull-witted", "rich": "opulent",
            "poor": "destitute", "hungry": "famished", "tired": "weary", "sick": "ailing",
            "healthy": "hale", "dead": "deceased", "alive": "living", "here": "hither",
            "there": "thither", "where": "whither", "now": "anon", "soon": "ere long",
            "today": "this day", "tomorrow": "on the morrow", "yesterday": "yestereve", "always": "ever",
            "never": "ne'er", "often": "oft", "again": "once more", "very": "exceeding",
            "really": "in truth", "certainly": "forsooth", "probably": "likely", "maybe": "perchance",
            "however": "howbeit", "therefore": "wherefore", "because": "for that", "why": "wherefore",
            "man": "sirrah", "woman": "mistress", "lady": "milady", "lord": "milord",
            "king": "sire", "queen": "majesty", "father": "sire", "mother": "dam",
            "brother": "frater", "sister": "soror", "son": "issue", "daughter": "maid",
            "child": "babe", "husband": "spouse", "wife": "matron", "food": "viands",
            "drink": "libation", "water": "aqua", "wine": "sack", "bread": "loaf",
            "meat": "flesh", "house": "abode", "home": "hearth", "room": "chamber",
            "bed": "couch", "door": "portal", "window": "casement", "fire": "blaze",
            "light": "glow", "dark": "dim", "sun": "sol", "moon": "luna",
            "star": "stellar body", "sky": "firmament", "earth": "terra", "sea": "brine",
            "ocean": "main", "river": "stream", "mountain": "peak", "hill": "knoll",
            "tree": "wood", "flower": "blossom", "bird": "fowl", "dog": "hound",
            "cat": "mouser", "horse": "steed", "book": "tome", "paper": "parchment",
            "pen": "quill", "sword": "blade", "war": "strife", "peace": "accord",
            "battle": "fray", "fight": "combat", "kill": "slay", "die": "perish",
            "death": "demise", "life": "existence", "world": "globe", "time": "tempus",
            "year": "twelvemonth", "month": "moon", "week": "se'nnight", "word": "term",
            "name": "appellation", "story": "tale", "song": "lay", "poem": "verse",
            "music": "melody", "art": "craft", "play": "drama", "game": "sport",
            "fun": "mirth", "laugh": "guffaw", "cry": "weep", "smile": "grin",
            "kiss": "buss", "hug": "embrace", "look": "gaze", "see": "behold",
            "watch": "observe", "hear": "hark", "listen": "attend", "speak": "discourse",
            "talk": "converse", "say": "utter", "tell": "relate", "ask": "inquire",
            "answer": "respond", "think": "ponder", "know": "wit", "learn": "study",
            "teach": "instruct", "read": "peruse", "write": "indite", "count": "reckon",
            "cut": "cleave", "break": "rend", "make": "fashion", "build": "erect",
            "create": "forge", "destroy": "ruin", "begin": "commence", "start": "originate",
            "end": "terminate", "finish": "complete", "stop": "cease", "go": "wend",
            "come": "hie", "leave": "depart", "arrive": "reach", "enter": "penetrate",
            "exit": "egress", "sit": "be seated", "stand": "arise", "walk": "stride",
            "run": "hasten", "jump": "leap", "fall": "tumble", "rise": "ascend",
            "give": "bestow", "take": "seize", "get": "obtain", "have": "possess",
            "keep": "retain", "find": "discover", "lose": "forfeit", "win": "prevail",
            "pay": "render", "buy": "purchase", "sell": "vend", "send": "dispatch",
            "bring": "convey", "carry": "bear", "hold": "grasp", "catch": "seize",
            "throw": "cast", "hit": "smite", "push": "thrust", "pull": "draw",
            "turn": "wheel", "open": "unclose", "close": "shut", "wash": "lave",
            "cook": "prepare", "eat": "feed", "drink": "quaff", "sleep": "slumber",
            "wake": "awaken", "help": "aid", "save": "preserve", "use": "employ",
            "put": "place", "move": "stir", "live": "dwell", "grow": "wax",
            "change": "alter", "become": "grow to be", "seem": "appear", "feel": "sense",
            "want": "desire", "need": "require", "like": "fancy", "hate": "abhor",
            "fear": "dread", "hope": "trust", "wish": "long", "try": "attempt",
            "fail": "miscarry", "succeed": "prosper", "believe": "credit", "trust": "rely",
            "remember": "bethink", "forget": "disremember", "understand": "comprehend",
            "agree": "concur", "disagree": "differ", "accept": "take", "refuse": "reject",
            "allow": "permit", "prevent": "hinder", "promise": "pledge", "threaten": "menace",
            "warn": "caution", "advise": "counsel", "encourage": "embolden", "discourage": "dismay",
            "praise": "commend", "blame": "censure", "insult": "affront", "compliment": "flatter",
            "welcome": "bid welcome", "celebrate": "observe", "mourn": "lament", "marry": "wed",
            "divorce": "put away", "meet": "encounter", "visit": "call upon", "invite": "bid",
            "join": "unite with", "separate": "part from", "include": "comprehend", "exclude": "shut out",
            "support": "uphold", "oppose": "withstand", "attack": "assail", "defend": "protect",
            "serve": "attend", "rule": "govern", "lead": "guide", "follow": "succeed",
            "obey": "be ruled by", "command": "bid", "order": "direct", "request": "sue for",
            "demand": "require", "offer": "tender", "suggest": "move", "recommend": "commend",
            "choose": "elect", "prefer": "rather", "compare": "liken", "match": "equal",
            "fit": "suit", "deserve": "merit", "earn": "win", "waste": "squander",
            "spend": "expend", "collect": "gather", "scatter": "disperse", "hide": "conceal",
            "search": "seek", "find out": "ascertain", "discover": "detect", "invent": "devise",
            "imagine": "conceive", "guess": "surmise", "wonder": "marvel", "surprise": "amaze",
            "shock": "appall", "please": "gratify", "displease": "offend", "satisfy": "content",
            "disappoint": "frustrate", "amuse": "divert", "bore": "weary", "tire": "fatigue",
            "excite": "stir", "calm": "quiet", "comfort": "console", "disturb": "trouble",
            "worry": "vex", "relax": "rest", "rest": "repose", "prepare": "make ready",
            "ready": "prepared", "complete": "finished", "incomplete": "unfinished", "perfect": "flawless",
            "imperfect": "faulty", "possible": "feasible", "impossible": "impracticable", "necessary": "needful",
            "unnecessary": "needless", "important": "momentous", "unimportant": "trivial", "serious": "grave",
            "funny": "droll", "strange": "uncanny", "common": "ordinary", "rare": "scarce",
            "familiar": "well-known", "foreign": "strange", "public": "open", "private": "privy",
            "safe": "secure", "dangerous": "perilous", "easy": "facile", "difficult": "hard",
            "simple": "plain", "complicated": "involved", "clear": "manifest", "unclear": "obscure",
            "bright": "luminous", "dull": "dim", "sharp": "keen", "blunt": "dull",
            "smooth": "sleek", "rough": "rugged", "soft": "tender", "hard": "firm",
            "wet": "moist", "dry": "arid", "hot": "torrid", "cold": "frigid",
            "warm": "tepid", "cool": "chill", "sweet": "luscious", "sour": "tart",
            "bitter": "acrid", "salty": "brackish", "fresh": "unsalted", "rotten": "putrid",
            "fragrant": "odoriferous", "stinking": "fetid", "loud": "stentorian", "quiet": "hushed",
            "silent": "mute", "noisy": "clamorous", "quick": "swift", "slow": "sluggish",
            "fast": "fleet", "near": "nigh", "distant": "remote", "deep": "profound",
            "shallow": "superficial", "high": "lofty", "low": "base", "tall": "stately",
            "short": "stubby", "long": "lengthy", "wide": "broad", "narrow": "strait",
            "thick": "fat", "thin": "lean", "heavy": "ponderous", "light": "buoyant",
            "full": "replete", "empty": "void", "solid": "firm", "liquid": "fluid",
            "gas": "vapor", "open": "unclosed", "shut": "closed", "free": "at liberty",
            "bound": "chained", "joined": "united", "separated": "sundered", "mixed": "mingled",
            "pure": "unmixed", "clean": "undefiled", "dirty": "foul", "whole": "entire",
            "broken": "fractured", "fixed": "repaired", "loose": "unfastened", "tight": "strait",
            "straight": "direct", "crooked": "awry", "round": "circular", "square": "quadrate",
            "flat": "plane", "curved": "bent", "hollow": "concave", "pointed": "acuminate",
            "safe": "secure", "free": "at liberty", "caught": "captured", "lost": "missing",
            "found": "recovered", "born": "begotten", "growing": "waxing", "living": "alive",
            "existing": "subsisting", "remaining": "abiding", "passing": "transient", "changing": "altering",
            "moving": "stirring", "stopping": "staying", "standing": "upright", "sitting": "seated",
            "lying": "reclining", "hanging": "suspended", "flowing": "running", "flying": "soaring",
            "swimming": "floating", "crawling": "creeping", "walking": "treading", "running": "hasting",
            "riding": "mounted", "driving": "whipped", "sailing": "afloat", "floating": "buoyant",
            "sinking": "foundering", "rising": "ascending", "falling": "descending", "climbing": "scaling",
            "descending": "going down", "entering": "ingress", "exiting": "egress", "approaching": "drawing nigh",
            "leaving": "withdrawing", "returning": "coming back", "arriving": "reaching", "reaching": "attaining",
            "touching": "feeling", "holding": "grasping", "grasping": "seizing", "releasing": "letting go",
            "throwing": "casting", "catching": "snatching", "hitting": "striking", "missing": "failing",
            "cutting": "cleaving", "joining": "uniting", "tying": "binding", "loosening": "unbinding",
            "rubbing": "chafing", "wiping": "drying", "pulling": "drawing", "pushing": "thrusting",
            "lifting": "heaving", "dropping": "letting fall", "throwing away": "discarding", "picking up": "taking up",
            "putting down": "setting down", "turning over": "inverting", "turning around": "wheeling",
            "opening up": "expanding", "closing up": "contracting", "filling up": "replenishing", "emptying": "voiding",
            "covering": "overspreading", "uncovering": "disclosing", "hiding": "secreting", "showing": "manifesting",
            "lighting": "kindling", "extinguishing": "quenching", "burning": "consuming", "melting": "liquefying",
            "freezing": "congealing", "boiling": "seething", "cooking": "dressing", "eating": "feeding",
            "drinking": "imbibing", "biting": "munching", "chewing": "masticating", "smelling": "scenting",
            "tasting": "savoring", "hearing": "hearkening", "seeing": "beholding", "feeling": "perceiving",
            "wanting": "desiring", "needing": "requiring", "liking": "favoring", "loving": "adore",
            "hating": "detest", "fearing": "dread", "hoping": "trust", "wishing": "long",
            "trying": "endeavor", "failing": "miscarry", "succeeding": "thrive", "believing": "credit",
            "trusting": "rely", "remembering": "recollect", "forgetting": "omit", "understanding": "apprehend",
            "agreeing": "accord", "disagreeing": "differ", "accepting": "receive", "refusing": "reject",
            "allowing": "permit", "preventing": "hinder", "promising": "vow", "threatening": "menace",
            "warning": "admonish", "advising": "counsel", "encouraging": "hearten", "discouraging": "dishearten",
            "praising": "commend", "blaming": "censure", "insulting": "revile", "complimenting": "flatter",
            "welcoming": "salute", "celebrating": "observe", "mourning": "bewail", "marrying": "wed",
            "divorcing": "repudiate", "meeting": "encounter", "visiting": "frequent", "inviting": "summon",
            "joining": "associate", "separating": "disunite", "including": "comprehend", "excluding": "except",
            "supporting": "sustain", "opposing": "resist", "attacking": "assail", "defending": "guard",
            "serving": "minister", "ruling": "dominate", "leading": "conduct", "following": "pursue",
            "obeying": "submit", "commanding": "order", "ordering": "direct", "requesting": "sue",
            "demanding": "exact", "offering": "proffer", "suggesting": "propose", "recommending": "advise",
            "choosing": "select", "preferring": "favor", "comparing": "collate", "matching": "equal",
            "fitting": "suit", "deserving": "merit", "earning": "win", "wasting": "squander",
            "spending": "expend", "collecting": "gather", "scattering": "disperse", "hiding": "conceal",
            "searching": "seek", "finding out": "ascertain", "discovering": "detect", "inventing": "contrive",
            "imagining": "conceive", "guessing": "surmise", "wondering": "marvel", "surprising": "astonish",
            "shocking": "appall", "pleasing": "gratify", "displeasing": "disgust", "satisfying": "content",
            "disappointing": "frustrate", "amusing": "divert", "boring": "weary", "tiring": "fatigue",
            "exciting": "agitate", "calming": "tranquilize", "comforting": "console", "disturbing": "perturb",
            "worrying": "trouble", "relaxing": "repose", "resting": "repose", "preparing": "ready",
            "readying": "prepare", "completing": "finish", "finishing": "complete", "incompleting": "leave undone",
            "perfecting": "refine", "imperfecting": "mar"
        },
        suffixes: [
            "— dost thou comprehend?", "— pray, tell me true.", "— by my troth!", "— what sayest thou?",
            "— forsooth!", "— verily!", "— in sooth!", "— marry!", "— indeed!", "— in faith!",
            "— on my honor!", "— as I live!", "— upon my word!", "— fare thee well!",
            "— adieu, good friend!", "— till we meet again!", "— God be with thee!",
            "— all's well that ends well!", "— to thine own self be true!",
            "— parting is such sweet sorrow!", "— the play's the thing!",
            "— we are such stuff as dreams are made on!", "— good night, good night!",
            "— much ado about nothing!", "— as you like it!", "— the rest is silence!"
        ],
        prefixes: [
            "Hark! ", "O! ", "Pray, ", "Mark me: ", "List! ", "Anon, ", "Hearken, ",
            "Attend, ", "Lo! ", "Behold! ", "Fie! ", "Zounds! ", "S'blood! ",
            "Marry, ", "In truth, ", "In sooth, ", "Forsooth, ", "Verily, ",
            "In faith, ", "By my troth, ", "Upon my word, ", "As I live, ",
            "Before my eyes, ", "On my life, ", "As I am true man, ",
            "God's blessing on thee, ", "Good morrow to thee, ",
            "Well met, ", "Give ear, ", "Lend me thy ears, ",
            "O happy day! ", "What light through yonder window breaks! ",
            "To be or not to be, ", "Alas, poor Yorick! ", "Et tu, Brute? ",
            "The lady doth protest too much, ", "Though she be but little, she is fierce! ",
            "The course of true love never did run smooth, ",
            "All the world's a stage, ", "The readiness is all, "
        ]
    },
    
    victorian: {
        greetings: {
            "hello": "How do you do", "hi": "I bid you good day", "love": "affection most profound",
            "friend": "dearest acquaintance", "money": "pecuniary resources", "work": "occupation",
            "happy": "in good spirits", "sad": "rather low", "beautiful": "quite becoming",
            "ugly": "unfortunate in appearance"
        },
        suffixes: ["— I remain, etc.", "— Most sincerely.", "— Your humble servant.", "."],
        prefixes: ["I daresay ", "It is my understanding that ", "One finds that ", "It is quite the thing to say that "]
    },
    
    poe: {
        greetings: {
            "hello": "Dark greetings", "hi": "Hark, from the shadow", "love": "obsession eternal",
            "friend": "fellow traveler in darkness", "money": "cursed gold", "work": "endless toil",
            "happy": "fleeting moment of light", "sad": "abyssal despair", "beautiful": "hauntingly lovely",
            "ugly": "twisted by sorrow"
        },
        suffixes: ["— nevermore.", "— in the shadows of the night.", "— till the raven calls.", "— through the mists of time.", "."],
        prefixes: ["Once upon a midnight dreary, ", "In the bleak December, ", "From out the shadow, ", "Hark! "]
    },
    
    romantic: {
        greetings: {
            "hello": "Dearest salutations", "hi": "My heart leaps", "love": "passion unbound",
            "friend": "kindred spirit", "money": "earthly means", "work": "noble pursuit",
            "happy": "swept by joy", "sad": "tears adrift", "beautiful": "transcendent",
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
    
    const prefix = Math.random() > 0.7 ? patterns.prefixes[Math.floor(Math.random() * patterns.prefixes.length)] : "";
    const suffix = patterns.suffixes[Math.floor(Math.random() * patterns.suffixes.length)];
    
    result = result.charAt(0).toUpperCase() + result.slice(1);
    
    return prefix + result + suffix;
}

document.addEventListener('DOMContentLoaded', () => {
    const candle = document.getElementById('candleLoader');
    if (candle) {
        setTimeout(() => candle.remove(), 3000);
    }
    initAlchemicalSymbols();
    
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
    
    transmuteBtn.addEventListener('click', (e) => {
        const input = modernInput.value.trim();
        if (!input) {
            alert("Prithee, enter some text first!");
            return;
        }
        
        const rect = transmuteBtn.getBoundingClientRect();
        createInkDrop(rect.left + rect.w      
