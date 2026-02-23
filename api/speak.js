// api/speak.js   ← Create this file
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'No text provided' });
  }

  try {
    const mp3 = await openai.audio.speech.create({
      model: 'gpt-4o-mini-tts',   // best quality/price in 2026
      voice: 'onyx',              // deep, dramatic bard voice (or 'echo', 'fable', 'nova')
      input: text,
      response_format: 'mp3',
      speed: 0.92,                // slightly slower for poetic feel
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());
    const base64Audio = buffer.toString('base64');

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ 
      success: true, 
      audio: `data:audio/mp3;base64,${base64Audio}` 
    });

  } catch (error) {
    console.error('TTS error:', error);
    res.status(500).json({ error: 'Failed to generate voice' });
  }
}
