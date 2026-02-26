async function callOpenAI(text, style, mode) {
  try {
    console.log('Sending request to /api/transmute with:', { text, style, mode });

    const response = await fetch('/api/transmute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, style, mode })
    });

    console.log('Response status:', response.status);

    const textResponse = await response.text();
    console.log('Raw response body:', textResponse);

    const data = JSON.parse(textResponse);

    if (!response.ok || !data.success) {
      throw new Error(`Error ${response.status}: ${data.error || 'Unknown'}`);
    }

    return data.transmuted || 'The spirits whisper faintly...';
  } catch (error) {
    console.error('callOpenAI failed:', error.message);
    return "Fallback: " + text;
  }
}
