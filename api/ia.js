// api/ia.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).send('Method Not Allowed');
  }

  try {
    const { system, prompt, context } = req.body || {};
    if (!prompt) return res.status(400).send('missing prompt');

    const userContent = `
PROMPT DO USUÁRIO:
${prompt}

CONTEXTO (JSON):
${JSON.stringify(context || {}, null, 2)}
`.trim();

    const apiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.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}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // use o modelo que você tiver habilitado
        stream: true,
        messages: [
          { role: 'system', content: system || 'Você é um assistente técnico.' },
          { role: 'user', content: userContent }
        ]
      })
    });

    if (!apiRes.ok || !apiRes.body) {
      const errTxt = await apiRes.text();
      return res.status(500).send(errTxt || 'erro na IA');
    }

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Transfer-Encoding', 'chunked');

    for await (const chunk of apiRes.body) {
      res.write(chunk);
    }
    res.end();

  } catch (e) {
    console.error(e);
    res.status(500).send('server error');
  }
}
