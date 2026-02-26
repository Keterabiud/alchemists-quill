// api/transmute.js - Vercel API route (using active Groq model)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed - use POST'
    });
  }

  try {
    // Read raw body (Vercel way)
    let body = '';
    for await (const chunk of req) {
      body += chunk.toString();
    }

    const parsedBody = body ? JSON.parse(body) : {};
    const { text, style, mode } = parsedBody;

    if (!text || typeof text !== 'string' || text.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'No valid text provided'
      });
    }

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-20b',// ← ACTIVE & POWERFUL MODEL (Feb 2026)
        messages: [
          {
            role: 'system',
            content: `You are a master poet and literary alchemist. Transform the input text into perfect ${style} style. Be elegant, immersive, and creative.
${mode === 'ghostwriter' ? 'Write a full, original poem based on the prompt.' : ''}
${mode === 'critic' ? 'Provide a detailed literary analysis: meter, rhyme scheme, literary devices, tone, imagery, symbolism.' : ''}
Output ONLY the final result — no explanations, no introductions, no markdown fences, no extra text.`
          },
          { role: 'user', content: text.trim() }
        ],
        temperature: 0.85,
        max_tokens: 900,
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
    let transmuted = data.choices?.[0]?.message?.content?.trim() || 'The spirits are silent...';

    transmuted = transmuted
      .replace(/^```[\w]*\n?/, '')
      .replace(/```$/, '')
      .trim();

    return res.status(200).json({
      success: true,
      transmuted
    });

  } catch (error) {
    console.error('Function error:', error.message);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
}
