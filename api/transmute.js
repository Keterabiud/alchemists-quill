// api/transmute.js - Vercel API route (production-ready)
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed - use POST' });
  }

  try {
    // Parse body
    const { text, style, mode, modelChoice } = req.body;

    // Validate input
    if (!text || typeof text !== 'string' || text.trim() === '') {
      return res.status(400).json({ success: false, error: 'No valid text provided.' });
    }

    // ------------------------
    // MODEL SELECTION
    // ------------------------
    const MODEL_MAP = {
      fast: 'gpt-oss-6b',
      balanced: 'gpt-oss-13b',
      premium: 'gpt-oss-120b'
    };
    const selectedModel = MODEL_MAP[modelChoice] || MODEL_MAP.balanced;

    // ------------------------
    // SYSTEM PROMPT BASED ON MODE
    // ------------------------
    let systemPrompt = '';
    switch (mode) {
      case 'ghostwriter':
        systemPrompt = `You are a master poet. Write a full, original poem based on the prompt in the style of ${style}.`;
        break;
      case 'critic':
        systemPrompt = `You are a literary critic. Provide a detailed analysis of the following text: meter, rhyme scheme, literary devices, tone, imagery, symbolism.`;
        break;
      default:
        systemPrompt = `You are a master of language styles, dialects, slang and historical tones. Rewrite the following everyday sentence or phrase exactly in the style of ${style}. Keep the meaning similar — just adjust vocabulary, grammar, slang, tone. Output ONLY the rewritten text.`;
    }

    // ------------------------
    // CALL GROQ API
    // ------------------------
    const groqResponse = await fetch(`https://api.groq.ai/v1/models/${selectedModel}/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: text.trim() }
        ],
        temperature: 0.8,
        max_tokens: 600,
        top_p: 0.95
      })
    });

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text().catch(() => 'Unknown Groq error');
      console.error('Groq API error:', errorText);
      return res.status(groqResponse.status).json({
        success: false,
        error: errorText
      });
    }

    const data = await groqResponse.json();

    // Extract the message content
    let result = data.choices?.[0]?.message?.content?.trim() || 'The spirits are silent...';

    // Remove any code fences (``` or ```lang)
    result = result.replace(/^```[\w]*\n?/, '').replace(/```$/, '').trim();

    // Return success
    return res.status(200).json({
      success: true,
      transmuted: result
    });

  } catch (err) {
    console.error('Function error:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Internal server error'
    });
  }
}
