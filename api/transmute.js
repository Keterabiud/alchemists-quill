// api/transmute.js — Vercel Serverless Function
// This runs on the backend, hiding your API key

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text, style } = req.body;

  if (!text || !style) {
    return res.status(400).json({ error: 'Missing text or style' });
  }

  // Style prompts for OpenAI
  const stylePrompts = {
    shakespeare: `Rewrite this in Shakespearean English. Use thee/thou/thy, archaic words, and Elizabethan flair. Add dramatic flair: "${text}"`,
    victorian: `Rewrite this in Victorian era English. Be formal, proper, and slightly stiff: "${text}"`,
    poe: `Rewrite this in Edgar Allan Poe's gothic, melancholic style. Dark, brooding, poetic: "${text}"`,
    romantic: `Rewrite this in Romantic era poetry style. Passionate, nature-focused, emotional like Byron or Shelley: "${text}"`
  };

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a master of historical literary styles. Rewrite user text exactly as requested.'
          },
          {
            role: 'user',
            content: stylePrompts[style] || stylePrompts.shakespeare
          }
        ],
        max_tokens: 500,
        temperature: 0.8
      })
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    const transmuted = data.choices[0].message.content.trim();

    res.status(200).json({ 
      success: true, 
      original: text,
      style: style,
      transmuted: transmuted 
    });

  } catch (error) {
    console.error('OpenAI Error:', error);
    res.status(500).json({ 
      error: 'Transmutation failed', 
      details: error.message 
    });
  }
}
