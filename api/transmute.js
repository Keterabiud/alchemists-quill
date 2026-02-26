// api/transmute.js - Vercel API route

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed - use POST' });
  }

  try {
    let body = '';
    for await (const chunk of req) {
      body += chunk.toString();
    }

    const parsedBody = body ? JSON.parse(body) : {};
    const { text, style, mode } = parsedBody;

    if (!text || typeof text !== 'string' || text.trim() === '') {
      return res.status(400).json({ success: false, error: 'No valid text provided' });
    }

    let systemPrompt = '';

    if (mode === 'ghostwriter') {
      systemPrompt = `You are a master poet. Write a full, original poem based on the prompt in the style of ${style}.`;
    } else if (mode === 'critic') {
      systemPrompt = `You are a literary critic. Provide a detailed analysis of the following text: meter, rhyme scheme, literary devices, tone, imagery, symbolism.`;
    } else {
      // Main mode: everyday sentence / tone / dialect shift
      systemPrompt = `You are a master of language styles, dialects, slang and historical tones. Rewrite the following everyday sentence or phrase exactly in the style of ${style}. 
Keep the original meaning and length similar — just change the vocabulary, grammar, expressions, slang and tone to match that era/culture/dialect perfectly.
Do NOT turn it into a poem or add extra content unless the mode is ghostwriter. Output ONLY the rewritten text — no introductions, no explanations.`;
    }

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-120b',
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
      const errorData = await groqResponse.json().catch(() => ({}));
      return res.status(groqResponse.status).json({
        success: false,
        error: errorData.error?.message || `Groq API error (${groqResponse.status})`
      });
    }

    const data = await groqResponse.json();
    let result = data.choices?.[0]?.message?.content?.trim() || 'The spirits are silent...';

    result = result.replace(/^```[\w]*\n?/, '').replace(/```$/, '').trim();

    return res.status(200).json({
      success: true,
      transmuted: result
    });

  } catch (error) {
    console.error('Function error:', error.message);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
}
