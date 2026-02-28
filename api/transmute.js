// /api/transmute.js – Keter Aether final version

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed – use POST' });
  }

  try {
    const { text, style, mode = 'transmute' } = req.body;

    if (!text || typeof text !== 'string' || text.trim() === '') {
      return res.status(400).json({ success: false, error: 'Text is required' });
    }

    if (text.length > 8000) {
      return res.status(400).json({ success: false, error: 'Input too long (~8000 max)' });
    }

    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    if (!GROQ_API_KEY) {
      return res.status(500).json({ success: false, error: 'Server config error' });
    }

    // SYSTEM PROMPT per mode
    let systemPrompt = '';

    if (mode === 'transmute') {
      systemPrompt = `You are Keter Aether, a magical transmutation engine.
Transform ONLY the user's input text into the requested ${style} style.
Keep meaning intact. Return ONLY the transformed text. No explanations. No quotes.`;
    } else if (mode === 'ghostwriter') {
      systemPrompt = `You are Keter Aether, the Ghostwriter's Quill.
Turn the user's input into a creative piece of writing (poem, short story, or lyrical text) in the requested ${style} style.
Use rich imagery, rhythm, and literary devices.
Return ONLY the creative text.`;
    } else if (mode === 'critic') {
      systemPrompt = `You are Keter Aether, the Critic's Eye.
Analyze the user's text and provide constructive critique, suggestions, or improvements.
Focus on clarity, style, grammar, tone, and creativity.
Return ONLY the critique or suggestions.`;
    } else {
      systemPrompt = `You are Keter Aether, a magical text transformer. Transform the user's text appropriately.`;
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: text }
        ],
        temperature: 0.75,
        max_tokens: 1024,
        top_p: 0.95,
        stream: false
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Groq API error:', response.status, errorData);
      return res.status(response.status).json({
        success: false,
        error: errorData.error?.message || `Groq API error: ${response.status}`
      });
    }

    const data = await response.json();
    let result = data.choices?.[0]?.message?.content?.trim() || '';

    if (!result) {
      result = text + ' ✨';
    }

    return res.status(200).json({ success: true, transmuted: result });

  } catch (err) {
    console.error('Function error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Internal server error' });
  }
                        }
