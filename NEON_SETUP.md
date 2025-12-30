# 🗄️ Configuração do Banco de Dados Neon

## Passo a Passo para Criar seu Banco PostgreSQL Gratuito

### 1. Acesse o Neon.tech
Abra o navegador em: https://neon.tech

![Página Inicial Neon](file:///C:/Users/rodrigo.silva/.gemini/antigravity/brain/24d8c55a-a66f-49a3-b4cc-0e03d81a0a95/neon_home_page_1767041187011.png)

### 2. Crie sua Conta
Clique em **"Start for Free"** ou **"Sign Up"**

![Tela de Cadastro](file:///C:/Users/rodrigo.silva/.gemini/antigravity/brain/24d8c55a-a66f-49a3-b4cc-0e03d81a0a95/neon_signup_page_1767041217986.png)

**Recomendação**: Use sua conta do **GitHub** para facilitar o login.

### 3. Crie um Projeto
Após fazer login, você verá uma tela para criar seu primeiro projeto:
- **Nome do Projeto**: `workflow-hub-v2` (ou qualquer nome)
- **Região**: Escolha a mais próxima de você (ex: `US East (Ohio)` ou `Europe (Frankfurt)`)
- **PostgreSQL Version**: Deixe a versão mais recente (16)

### 4. Copie a Connection String
Após criar o projeto, você verá uma tela com a **Connection String**.

Ela terá este formato:
```
postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require
```

**COPIE ESSA URL COMPLETA!**

### 5. Configure o Arquivo .env
Abra o arquivo `.env` na raiz do projeto e **substitua** a linha `DATABASE_URL` pela URL que você copiou:

```env
DATABASE_URL="postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require"
```

### 6. Volte Aqui
Depois de configurar o `.env`, **me avise** que vou:
1. Gerar as migrations do banco
2. Aplicar as tabelas no Neon
3. Testar a conexão

---

## ✅ Checklist

- [ ] Acessei https://neon.tech
- [ ] Criei minha conta (GitHub/Google/Email)
- [ ] Criei um projeto chamado `workflow-hub-v2`
- [ ] Copiei a Connection String
- [ ] Colei no arquivo `.env`
- [ ] Avisei o assistente para continuar

---

## 🆓 Plano Gratuito do Neon

O plano gratuito inclui:
- ✅ 512 MB de armazenamento
- ✅ 1 projeto
- ✅ 10 branches
- ✅ Sem cartão de crédito necessário
- ✅ Perfeito para desenvolvimento e MVP

---

**Aguardando você configurar o banco! Me avise quando terminar.** 🚀
