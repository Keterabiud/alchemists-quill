// /api/transmute.js
// Groq + GPT-OSS-120B — FINAL STABLE VERSION

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res
      .status(405)
      .json({ success: false, error: 'Method not allowed – use POST' });
  }

  try {
    const { text, style = 'Modern', mode = 'transmute' } = req.body;

    /* -----------------------------
       VALIDATION
    -------------------------------- */
    if (!text || typeof text !== 'string' || !text.trim()) {
      return res
        .status(400)
        .json({ success: false, error: 'Text is required' });
    }

    if (text.length > 8000) {
      return res.status(400).json({
        success: false,
        error: 'Input text too long (max ~8000 characters)',
      });
    }

    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    if (!GROQ_API_KEY) {
      console.error('Missing GROQ_API_KEY');
      return res
        .status(500)
        .json({ success: false, error: 'Server configuration error' });
    }

    /* -----------------------------
       MODE-AWARE PROMPTING
    -------------------------------- */
    let systemPrompt = '';
    let userPrompt = '';

    if (mode === 'ghostwriter') {
      systemPrompt = `
You are Keter Aether, a master poet and literary ghostwriter.

RULES:
- Write ORIGINAL poetry or prose
- Do NOT rewrite the user's text
- Do NOT explain
- Do NOT add meta commentary
- Output ONLY the finished literary work
- Use elegant, expressive modern English
`;

      userPrompt = `
Write an original piece in the style of ${style}.
Theme or idea:
"${text}"
`;

    } else if (mode === 'critic') {
      systemPrompt = `
You are Keter Aether, a precise and insightful literary critic.

RULES:
- Write in clear modern English
- Be constructive, not poetic
- Use readable formatting
`;

      userPrompt = `
Critically analyze the following text.

Include:
- Brief overview
- Strengths
- Weaknesses
- Suggestions for improvement

Text:
"${text}"
`;

    } else {
      // TRANSMUTATION (DEFAULT)
      systemPrompt = `
You are Keter Aether — a refined text transmutation engine.

TASK:
Rewrite the user's text in the style of ${style}.

STRICT RULES:
- Preserve the original meaning
- Use modern, readable English
- Imitate tone, rhythm, and vocabulary ONLY
- DO NOT use archaic spellings or symbols (Þ, ð, æ, etc.)
- Do NOT explain
- Return ONLY the transformed text
`;

      userPrompt = `
Rewrite the following text:

"${text}"
`;
    }

    /* -----------------------------
       GROQ API CALL
    -------------------------------- */
    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'openai/gpt-oss-120b',
          messages: [
            { role: 'system', content: systemPrompt.trim() },
            { role: 'user', content: userPrompt.trim() },
          ],
          temperature: mode === 'critic' ? 0.4 : 0.75,
          max_tokens: 1024,
          top_p: 0.95,
          stream: false,
        }),
      }
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      console.error('Groq API error:', err);
      return res.status(response.status).json({
        success: false,
        error: err?.error?.message || 'Groq API error',
      });
    }

    const data = await response.json();
    let result = data?.choices?.[0]?.message?.content?.trim();

    /* -----------------------------
       SAFETY FALLBACK
    -------------------------------- */
    if (!result) {
      result = text;
    }

    return res.status(200).json({
      success: true,
      transmuted: result,
    });

  } catch (error) {
    console.error('Transmutation error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    });
  }
}
