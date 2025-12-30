# WorkFlow Hub v2.0 🚀

Sistema moderno de gerenciamento de projetos e tarefas com recursos avançados de colaboração, desenvolvido com Next.js 15, TypeScript e PostgreSQL.

![Next.js](https://img.shields.io/badge/Next.js-15.5-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-blue?logo=postgresql)
![Drizzle ORM](https://img.shields.io/badge/Drizzle-ORM-green)

## ✨ Funcionalidades

### 📊 Gerenciamento de Projetos
- Criação e edição de projetos com cores e ícones personalizados
- Visualização de estatísticas e progresso
- Navegação intuitiva com clique em qualquer lugar da linha
- Layout full-width para máximo aproveitamento de espaço

### ✅ Sistema de Tarefas
- **Kanban Board Responsivo**: Drag-and-drop otimizado com 6 colunas de status
- **Edição Rápida**: Clique em qualquer tarefa para editar
- **Prioridades Visuais**: Labels coloridas (Crítica, Alta, Média, Baixa)
- **Tipos de Tarefa**: Feature, Bug, Melhoria, Documentação, etc.

### 💬 Colaboração em Tempo Real
- **Sistema de Comentários**: Adição instantânea sem reload
- **Histórico de Atividades**: Timeline visual com todas as ações
- **Audit Logs**: Rastreamento automático de mudanças
- **Avatares e Timestamps**: Interface moderna e informativa

### 🎨 UX/UI Premium
- Design moderno com glassmorphism
- Animações suaves e transições otimizadas
- Tema escuro/claro (shadcn/ui)
- Totalmente responsivo

## 🛠️ Tecnologias

### Frontend
- **Next.js 15** - React framework com App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **shadcn/ui** - Componentes UI de alta qualidade
- **@dnd-kit** - Drag and drop para Kanban

### Backend
- **Next.js Server Actions** - API serverless
- **Drizzle ORM** - Type-safe database toolkit
- **PostgreSQL** - Banco de dados relacional
- **Zod** - Validação de schemas

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ 
- PostgreSQL instalado e rodando
- pnpm (recomendado) ou npm

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/workflow-hub-v2.git
cd workflow-hub-v2
```

2. **Instale as dependências**
```bash
pnpm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
```

Edite o arquivo `.env` e configure:
```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/workflow_hub"
```

4. **Execute as migrações do banco**
```bash
pnpm db:push
```

5. **Inicie o servidor de desenvolvimento**
```bash
pnpm dev
```

Acesse [http://localhost:3000](http://localhost:3000) 🎉

## 📁 Estrutura do Projeto

```
src/
├── app/                          # Next.js App Router
│   ├── projects/                 # Páginas de projetos
│   │   ├── [id]/                 # Detalhes do projeto
│   │   │   ├── kanban/           # Kanban board
│   │   │   └── page.tsx          # Página de detalhes
│   │   └── page.tsx              # Lista de projetos
│   └── page.tsx                  # Homepage
├── components/                   # Componentes React
│   ├── projects/                 # Componentes de projetos
│   ├── tasks/                    # Componentes de tarefas
│   │   ├── collaboration/        # Sistema de colaboração
│   │   ├── kanban-board.tsx      # Kanban principal
│   │   ├── task-card.tsx         # Card de tarefa
│   │   └── task-dialog.tsx       # Dialog de edição
│   └── ui/                       # Componentes shadcn/ui
├── lib/                          # Utilitários e configurações
│   ├── db/                       # Database
│   │   ├── actions/              # Server actions
│   │   ├── schema/               # Drizzle schema
│   │   └── client.ts             # Database client
│   └── utils.ts                  # Funções auxiliares
└── hooks/                        # React hooks customizados
```

## 🗄️ Schema do Banco de Dados

### Principais Tabelas
- **users** - Usuários do sistema
- **projects** - Projetos
- **tasks** - Tarefas com status, prioridade e tipos
- **task_types** - Tipos de tarefa customizáveis
- **comments** - Sistema de comentários
- **audit_logs** - Histórico de atividades

## 🎯 Roadmap

- [ ] Autenticação com NextAuth.js
- [ ] Notificações em tempo real (WebSockets)
- [ ] Dashboard com métricas e gráficos
- [ ] Filtros avançados e busca
- [ ] Exportação de relatórios (PDF/Excel)
- [ ] App mobile (React Native)
- [ ] Integrações (Slack, Discord, Email)

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abrir um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👤 Autor

**Rodrigo Silva**

- GitHub: [@rodrigoalves022](https://github.com/rodrigoalves022)

## 🙏 Agradecimentos

- [Next.js](https://nextjs.org/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Lucide Icons](https://lucide.dev/)

---

⭐ Se este projeto foi útil para você, considere dar uma estrela!
