// api/ia.js
export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(405).send('Method Not Allowed');
  }

  try {
    const { system, prompt, context } = req.body || {};
    if (!prompt) return res.status(400).send('missing prompt');

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) return res.status(500).send('OPENAI_API_KEY not set');

    const userContent = `PROMPT DO USUÁRIO:\n${prompt}\n\nCONTEXTO (JSON):\n${JSON.stringify(context || {}, null, 2)}`;

    // Chamada à OpenAI com streaming SSE
    const upstream = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        stream: true,
        messages: [
          { role: 'system', content: system || 'Você é um assistente técnico.' },
          { role: 'user', content: userContent }
        ]
      })
    });

    if (!upstream.ok || !upstream.body) {
      const msg = await upstream.text().catch(() => 'OpenAI upstream error');
      res.status(upstream.status || 500).send(msg);
      return;
    }

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Transfer-Encoding', 'chunked');
    res.setHeader('Access-Control-Allow-Origin', '*');

    const reader = upstream.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    // Converte SSE (data: {...}) -> apenas o texto (delta.content)
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const chunks = buffer.split('\n\n');
      buffer = chunks.pop() || '';

      for (const chunk of chunks) {
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (!line.startsWith('data:')) continue;
          const data = line.replace(/^data:\s*/, '');
          if (data === '[DONE]') {
            res.end();
            return;
          }
          try {
            const json = JSON.parse(data);
            const delta = json?.choices?.[0]?.delta?.content || '';
            if (delta) res.write(delta);
          } catch (_) {
            // ignora pedaços não-JSON
          }
        }
      }
    }
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).send('server error');
  }
}
