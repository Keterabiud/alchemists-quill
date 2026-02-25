export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const body = await request.json();
    const { text, style, mode } = body;

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.GROQ_API_KEY}`
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

    if (!groqResponse.ok) {
      return new Response(JSON.stringify({ success: false, error: 'Groq API error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data = await groqResponse.json();
    const transmuted = data.choices?.[0]?.message?.content?.trim() || 'The spirits are silent...';

    return new Response(JSON.stringify({ success: true, transmuted }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
