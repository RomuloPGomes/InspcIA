# 🚀 Instruções Rápidas - InspcIA

## ✅ Problema Resolvido!

A IA não estava funcionando porque **faltava um servidor backend**. Agora está corrigido!

## 🔧 Como usar agora:

### 1. Configurar a chave da OpenAI
```bash
python configurar_ia.py
```
- Siga as instruções na tela
- Obtenha sua chave em: https://platform.openai.com/api-keys

### 2. Executar o servidor
```bash
python server.py
```

### 3. Abrir o sistema
- Acesse: http://localhost:3000
- Clique no botão "🤖 Assistente" no canto superior direito

## 🎯 O que foi corrigido:

- ✅ **Servidor Python criado** (`server.py`)
- ✅ **Script de configuração** (`configurar_ia.py`)
- ✅ **API de IA funcionando** (`/api/ia`)
- ✅ **Health check** (`/api/health`)
- ✅ **Instruções atualizadas** (README.md)

## 🔍 Verificar se está funcionando:

1. **Servidor rodando**: http://localhost:3000/api/health
   - Deve retornar: `{"status":"ok","hasOpenAIKey":true}`

2. **Interface funcionando**: http://localhost:3000
   - Botão "🤖 Assistente" deve abrir o modal da IA

3. **IA funcionando**: 
   - Digite uma pergunta no modal
   - Clique em "Perguntar com contexto"
   - Deve receber uma resposta da IA

## ⚠️ Importante:

- **A IA precisa de internet** para funcionar
- **O sistema funciona offline** para coleta de dados
- **A chave da OpenAI é obrigatória** para usar a IA
- **Nunca compartilhe sua chave** com outras pessoas

## 🆘 Se ainda não funcionar:

1. Verifique se o Python está instalado: `python --version`
2. Verifique se a chave está correta (começa com `sk-`)
3. Verifique se tem internet
4. Abra o console do navegador (F12) e procure erros
5. Teste a API: http://localhost:3000/api/health

## 📞 Próximos passos:

1. Configure sua chave da OpenAI
2. Execute o servidor
3. Teste a IA
4. Comece a usar o sistema para suas inspeções!

---
**Desenvolvido por: João Rômulo Gomes**
