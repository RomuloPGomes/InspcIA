// api/ia.js  (raiz do projeto)
// Compatível com Vercel Functions (Node 18/20) em projetos estáticos.

module.exports = async (req, res) => {
  // CORS básico (seguro mesmo em mesma origem)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST em /api/ia' });

  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_API_KEY) {
    return res.status(500).json({ error: 'OPENAI_API_KEY não configurada na Vercel' });
  }

  // Lê body (funciona mesmo sem auto-parse)
  const bodyText = await new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
      if (data.length > 1e6) req.socket.destroy(); // evita body gigante
    });
    req.on('end', () => resolve(data || '{}'));
    req.on('error', reject);
  });

  let payload;
  try { payload = JSON.parse(bodyText); }
  catch { return res.status(400).json({ error: 'JSON inválido' }); }

  const {
    prompt = '',
    context = '',
    mode = 'observacao' // observacao | diagnostico | plano | resumo
  } = payload;

  const instructionByMode = {
    observacao: 'Você é engenheiro de estruturas. Escreva observação técnica objetiva, em pt-BR, clara e curta.',
    diagnostico: 'Você é engenheiro de estruturas. Diga, em pt-BR, diagnóstico curto do problema e possíveis causas.',
    plano: 'Você é engenheiro de estruturas. Proponha um plano de ação prático, priorizado e seguro (pt-BR).',
    resumo: 'Faça um resumo técnico conciso (pt-BR) sobre os pontos-chave.'
  };
  const system = instructionByMode[mode] || instructionByMode.observacao;

  const userContent = [
    'Contexto da inspeção:',
    context || '(sem contexto)',
    '',
    'Pedido:',
    prompt || '(sem pergunta)'
  ].join('\n');

  try {
    const upstream = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',   // pode trocar pelo modelo que preferir
        temperature: 0.3,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: userContent }
        ]
      })
    });

    const out = await upstream.json();
    if (!upstream.ok) {
      return res.status(500).json({ error: out?.error?.message || 'Erro ao falar com a OpenAI' });
    }

    const text = out?.choices?.[0]?.message?.content?.trim() || '';
    return res.status(200).json({ text });
  } catch (e) {
    console.error('Erro /api/ia:', e);
    return res.status(500).json({ error: 'Falha interna na função /api/ia' });
  }
};
