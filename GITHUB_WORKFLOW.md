# 🔄 Workflow de Atualização do GitHub

Este documento descreve o processo para atualizar o repositório no GitHub após validar novas funcionalidades.

## 📋 Checklist Antes de Commitar

- [ ] Todas as funcionalidades testadas e funcionando
- [ ] Servidor rodando sem erros (`pnpm dev`)
- [ ] Código revisado e limpo
- [ ] Documentação atualizada (README.md, se necessário)
- [ ] Variáveis de ambiente documentadas em `.env.example`

## 🚀 Processo de Atualização

### 1. Verificar Status
```bash
git status
```

### 2. Adicionar Arquivos Modificados
```bash
# Adicionar todos os arquivos
git add .

# OU adicionar arquivos específicos
git add src/components/exemplo.tsx
```

### 3. Criar Commit com Mensagem Descritiva

Use o padrão **Conventional Commits**:

```bash
git commit -m "tipo: descrição curta

- Detalhe 1
- Detalhe 2
- Detalhe 3"
```

#### Tipos de Commit:
- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `refactor:` - Refatoração de código
- `perf:` - Melhoria de performance
- `style:` - Mudanças de estilo/formatação
- `docs:` - Atualização de documentação
- `test:` - Adição/modificação de testes
- `chore:` - Tarefas de manutenção

#### Exemplos:
```bash
# Nova funcionalidade
git commit -m "feat: adicionar sistema de notificações

- Implementado WebSocket para notificações em tempo real
- Criado componente NotificationBell
- Adicionado badge de contador"

# Correção de bug
git commit -m "fix: corrigir erro ao deletar projeto

- Adicionado tratamento de erro na action deleteProject
- Melhorado feedback visual com toast
- Corrigido refresh da lista após deleção"

# Melhoria de performance
git commit -m "perf: otimizar queries do Kanban

- Implementado eager loading de relações
- Reduzido número de queries de N+1 para 3
- Adicionado cache de 5 minutos"
```

### 4. Enviar para o GitHub
```bash
git push origin main
```

## 🔍 Comandos Úteis

### Ver Histórico de Commits
```bash
git log --oneline -10
```

### Ver Diferenças Antes de Commitar
```bash
git diff
```

### Desfazer Último Commit (mantendo alterações)
```bash
git reset --soft HEAD~1
```

### Ver Branches
```bash
git branch -a
```

### Criar Nova Branch para Feature
```bash
git checkout -b feature/nome-da-feature
```

## 📝 Template de Commit para Sprints

```bash
git commit -m "feat: Sprint X - [Nome da Sprint]

Funcionalidades:
- [Funcionalidade 1]
- [Funcionalidade 2]

Correções:
- [Bug 1]
- [Bug 2]

Melhorias:
- [Melhoria 1]
- [Melhoria 2]"
```

## ⚠️ Boas Práticas

1. **Commits Atômicos**: Cada commit deve representar uma mudança lógica completa
2. **Mensagens Claras**: Descreva O QUE foi feito e POR QUÊ
3. **Teste Antes**: Sempre valide localmente antes de fazer push
4. **Commits Frequentes**: Melhor vários commits pequenos que um grande
5. **Evite Commits de "WIP"**: Finalize a funcionalidade antes de commitar

## 🔐 Segurança

**NUNCA commite:**
- Arquivos `.env` (já está no .gitignore)
- Senhas ou tokens
- Dados sensíveis de usuários
- Chaves de API

## 📊 Exemplo de Workflow Completo

```bash
# 1. Verificar status
git status

# 2. Ver o que mudou
git diff

# 3. Adicionar arquivos
git add .

# 4. Commit com mensagem descritiva
git commit -m "feat: implementar filtros avançados no Kanban

- Adicionado filtro por prioridade
- Adicionado filtro por responsável
- Adicionado filtro por data de vencimento
- Criado componente FilterBar
- Persistência de filtros no localStorage"

# 5. Push para GitHub
git push origin main

# 6. Verificar no GitHub
# Acesse: https://github.com/seu-usuario/workflow-hub-v2
```

## 🎯 Próximos Passos Após Push

1. Verificar se o push foi bem-sucedido no GitHub
2. Criar uma Release/Tag para versões importantes
3. Atualizar o README.md se necessário
4. Documentar breaking changes no CHANGELOG.md (se houver)

---

**Última atualização:** Sprint 5 - Sistema de Colaboração
