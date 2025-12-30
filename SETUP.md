# 🚀 WorkFlow Hub v2.0 - Instruções de Setup

## Fase 1 - Sprint 1: Fundação do Projeto

Este documento contém os comandos para configurar o ambiente de desenvolvimento.

---

## 📋 Pré-requisitos

- **Node.js 20+** instalado
- **Docker Desktop** instalado e rodando
- **pnpm** (recomendado) ou npm

---

## 🔧 Passo a Passo de Instalação

### 1. Instalar Dependências

```powershell
# Instalar pnpm globalmente (se ainda não tiver)
npm install -g pnpm

# Instalar as dependências do projeto
pnpm install
```

### 2. Subir o Banco de Dados PostgreSQL (Docker)

```powershell
# Iniciar o container PostgreSQL
docker-compose up -d

# Verificar se está rodando
docker-compose ps

# Ver logs do banco (opcional)
docker-compose logs -f postgres
```

### 3. Configurar Variáveis de Ambiente

O arquivo `.env.example` já foi criado. Copie-o para `.env`:

```powershell
Copy-Item .env.example .env
```

O arquivo `.env` contém:
```
DATABASE_URL="postgresql://workflow_user:workflow_dev_password@localhost:5432/workflow_hub"
REDIS_URL="redis://localhost:6379"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Executar Migrações do Banco (Drizzle)

```powershell
# Gerar migrações (por enquanto não há schema, então pode dar warning)
pnpm run db:generate

# Aplicar migrações
pnpm run db:push
```

> **Nota**: Como o schema está vazio por enquanto, esse passo não fará nada ainda. Mas a configuração está pronta.

### 5. Iniciar o Servidor de Desenvolvimento

```powershell
pnpm run dev
```

Acesse: **http://localhost:3000**

Você verá a tela de boas-vindas com o status de todas as configurações!

---

## ✅ Checklist de Verificação

Após rodar os comandos acima, você deve ver:

- ✅ **Next.js 15** → App Router funcionando
- ✅ **TypeScript** → Sem erros de compilação
- ✅ **Tailwind CSS** → Estilos aplicados (gradientes, dark mode support)
- ✅ **Shadcn/ui** → Botões renderizando corretamente
- ✅ **Drizzle ORM** → Configurado (schema vazio por enquanto)
- ✅ **PostgreSQL** → Conexão testada com sucesso (status na página inicial)

---

## 📁 Estrutura de Pastas Criada

```
c:\Users\rodrigo.silva\Music\Atividades\
├── .env                          # Variáveis de ambiente (gitignored)
├── .env.example                  # Template de .env
├── .gitignore                    # Atualizado para Next.js
├── docker-compose.yml            # PostgreSQL + Redis
├── package.json                  # Dependências do projeto
├── tsconfig.json                 # Configuração TypeScript
├── tailwind.config.ts            # Configuração Tailwind
├── components.json               # Configuração Shadcn/ui
├── drizzle.config.ts             # Configuração Drizzle ORM
├── next.config.ts                # Configuração Next.js
├── postcss.config.mjs            # PostCSS para Tailwind
├── evolution_specs.md            # Especificações v2.0
│
├── src/
│   ├── app/
│   │   ├── layout.tsx            # Root Layout
│   │   ├── page.tsx              # Homepage (Hello World + Status)
│   │   └── globals.css           # Estilos globais + Tailwind
│   │
│   ├── components/
│   │   └── ui/
│   │       └── button.tsx        # Componente Button (shadcn/ui)
│   │
│   ├── lib/
│   │   ├── utils.ts              # Utility functions (cn)
│   │   └── db/
│   │       ├── client.ts         # Database connection
│   │       └── schema/
│   │           └── index.ts      # Schema placeholder (vazio)
│   │
│   └── modules/                  # Domínios (projects, tasks, auth) - VAZIO
│
└── _LEGACY_DJANGO_V1/            # Projeto Django antigo (ignorado)
```

---

## 🛠️ Scripts Disponíveis

```powershell
pnpm run dev          # Inicia servidor de desenvolvimento (porta 3000)
pnpm run build        # Build de produção
pnpm run start        # Inicia servidor de produção
pnpm run lint         # Executa ESLint
pnpm run db:generate  # Gera migrações do Drizzle
pnpm run db:push      # Aplica schema ao banco (sem migrações)
pnpm run db:migrate   # Aplica migrações
pnpm run db:studio    # Abre Drizzle Studio (GUI do banco)
```

---

## 🐳 Gerenciamento do Docker

```powershell
# Parar os containers
docker-compose down

# Parar e remover volumes (APAGA O BANCO!)
docker-compose down -v

# Ver logs em tempo real
docker-compose logs -f

# Reiniciar apenas o PostgreSQL
docker-compose restart postgres
```

---

## 🔍 Troubleshooting

### Erro: "Cannot connect to database"

1. Verifique se o Docker está rodando: `docker-compose ps`
2. Tente reiniciar o container: `docker-compose restart postgres`
3. Verifique o `.env`: a `DATABASE_URL` deve estar correta

### Erro: "Module not found"

Execute novamente: `pnpm install`

### Porta 3000 já está em uso

Altere a porta no comando:
```powershell
pnpm run dev -- -p 3001
```

---

## 🎯 Próximos Passos (Sprint 2-4)

- [ ] Criar schema de dados (Projetos, Tarefas, Usuários)
- [ ] Implementar autenticação (NextAuth.js)
- [ ] CRUD de Projetos
- [ ] CRUD de Tarefas
- [ ] Kanban Board

---

**Status Atual**: ✅ **Fase 1 - Sprint 1 COMPLETA!**

Ambiente configurado e pronto para desenvolvimento.
