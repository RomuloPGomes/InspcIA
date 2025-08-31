# InspcIA - Sistema de Inspeção OAE

Sistema offline para inspeções de Obras de Arte Especiais (OAE).

## 🚀 Como executar

### Executar o servidor
```bash
# Usando Python
python server.py

# Ou usando Node.js
npm install
npm start
```

O sistema estará disponível em: http://localhost:3000

## 🔧 Funcionalidades

- ✅ **Sistema Offline**: Funciona sem internet para coleta de dados
- 📊 **Exportação**: Planilhas Excel com dados completos
- 📱 **Responsivo**: Interface adaptada para mobile
- 📸 **Controle de Fotos**: Numeração automática para câmera e drone
- 🗺️ **Geolocalização**: Captura automática de coordenadas
- 📋 **Gestão Completa**: Criação e gerenciamento de inspeções

## 🛠️ Solução de Problemas

### O sistema não está funcionando?

1. **Verifique se o servidor está rodando:**
   - Acesse http://localhost:3000
   - Deve carregar a interface principal

2. **Verifique o console do navegador:**
   - Pressione F12
   - Vá na aba "Console"
   - Procure por erros em vermelho

3. **Verifique a conexão:**
   - O sistema funciona offline para coleta de dados
   - Apenas a exportação pode precisar de internet

### Erros comuns:

- **"Servidor não encontrado"**: Verifique se o servidor está rodando
- **"Arquivo não encontrado"**: Verifique se todos os arquivos estão na pasta correta

## 📁 Estrutura do Projeto

```
InspcIA-main/
├── index.html          # Interface principal
├── server.py           # Servidor Python (recomendado)
├── server.js           # Servidor Node.js (alternativo)
├── package.json        # Dependências Node.js
├── api/
│   └── ia.js          # API de IA (não usado)
└── README.md          # Este arquivo
```

## 🔒 Segurança

- Use apenas em ambiente de desenvolvimento/teste
- Mantenha backups dos dados de inspeção

## 📞 Suporte

Para problemas técnicos, verifique:
1. Console do navegador (F12)
2. Logs do servidor no terminal
3. Se o servidor está rodando na porta 3000