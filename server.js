const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Rota da API de IA
app.post('/api/ia', async (req, res) => {
  try {
    const { system, prompt, context } = req.body || {};
    if (!prompt) return res.status(400).send('missing prompt');

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY não configurada');
      return res.status(500).send('OPENAI_API_KEY not set');
    }

    const userContent = `PROMPT DO USUÁRIO:\n${prompt}\n\nCONTEXTO (JSON):\n${JSON.stringify(context || {}, null, 2)}`;

    console.log('Fazendo requisição para OpenAI...');

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
      console.error('Erro na API OpenAI:', upstream.status, msg);
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

    console.log('Streaming resposta da OpenAI...');

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
            console.log('Streaming concluído');
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
    console.error('Erro no servidor:', err);
    res.status(500).send('server error');
  }
});

// Rota para verificar se a API está funcionando
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'API funcionando',
    hasOpenAIKey: !!process.env.OPENAI_API_KEY
  });
});

// Servir o arquivo principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🤖 API IA: http://localhost:${PORT}/api/ia`);
  
  if (!process.env.OPENAI_API_KEY) {
    console.warn('⚠️  OPENAI_API_KEY não configurada! Crie um arquivo .env com sua chave da OpenAI.');
  } else {
    console.log('✅ OPENAI_API_KEY configurada');
  }
});
