// /api/transmute.js - Groq + GPT-OSS-120B (120 billion parameter model)
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed – use POST' });
  }

  try {
    const { text, style, mode = 'transmute' } = req.body;

    // Basic input validation
    if (!text || typeof text !== 'string' || text.trim() === '') {
      return res.status(400).json({ success: false, error: 'Text is required and must not be empty' });
    }

    // Optional: add more validation if needed (max length, etc.)
    if (text.length > 8000) {
      return res.status(400).json({ success: false, error: 'Input text is too long (max \~8000 characters)' });
    }

    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    if (!GROQ_API_KEY) {
      console.error('GROQ_API_KEY not set in environment variables');
      return res.status(500).json({ success: false, error: 'Server configuration error' });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",           // ← 120B model (strong & capable)
        messages: [
          {
            role: "system",
            content: `You are Keter Aether – a magical transmutation engine. 
Transform ONLY the user's input text into the requested ${style} style.
Return ONLY the transformed text — no explanations, no introductions, no quotes, no prefixes like "Here is..." or "This is a dramatic version...".
Keep the meaning intact but adapt tone, vocabulary, structure, and style perfectly.`
          },
          {
            role: "user",
            content: text
          }
        ],
        temperature: 0.75,           // balanced creativity
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

    // Safety fallback
    if (!result) {
      result = text.toUpperCase() + ' ✨';
    }

    return res.status(200).json({ success: true, transmuted: result });

  } catch (err) {
    console.error('Function error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Internal server error' });
  }
}
