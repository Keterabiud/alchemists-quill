export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { text, style, mode } = req.body;

  if (!text) {
    return res.status(400).json({ success: false, error: 'No text provided' });
  }

  try {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `You are a master poet and literary alchemist. Transform the input text into perfect ${style} style. Be elegant, immersive, and creative.
${mode === 'ghostwriter' ? 'Write a full, original poem based on the prompt.' : ''}
${mode === 'critic' ? 'Provide a detailed literary analysis: meter, rhyme scheme, literary devices, tone, imagery, symbolism.' : ''}
Output only the final result — no explanations or extra text.`
          },
          { role: 'user', content: text }
        ],
        temperature: 0.9,
        max_tokens: 800,
        top_p: 0.95
      })
    });

    if (!groqRes.ok) {
      return res.status(groqRes.status).json({ success: false, error: 'Groq API error' });
    }

    const data = await groqRes.json();
    const transmuted = data.choices?.[0]?.message?.content?.trim() || 'No response...';

    return res.status(200).json({ success: true, transmuted });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
