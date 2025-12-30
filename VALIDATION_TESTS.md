# VALIDATION_TESTS.md - Sprint 5 Collaboration System

## 🧪 Test Execution Order

Execute these tests in order after running `pnpm dev` and `pnpm db:push`.

---

## ✅ Test 1: Navegação de Projetos

**Objetivo:** Verificar se clicar em qualquer lugar da linha do projeto redireciona para a página de detalhes.

**Passos:**
1. Acesse http://localhost:3000/projects
2. Clique em **qualquer lugar** da linha de um projeto (não apenas no nome)
3. Verifique a URL

**Resultado Esperado:**
- ✅ Redireciona para `/projects/[id]`
- ✅ Página de detalhes carrega com nome do projeto e lista de tarefas

**Resultado Falha:**
- ❌ Permanece na mesma página
- ❌ Apenas o nome do projeto é clicável

---

## ✅ Test 2: Criar Tarefa

**Objetivo:** Verificar criação de tarefa e atualização imediata da lista.

**Passos:**
1. Na página de projeto (`/projects/[id]`), clique "Nova Tarefa"
2. Preencha:
   - Título: "Tarefa de Teste"
   - Descrição: "Validando criação"
   - Status: "Em Progresso"
   - Prioridade: "Alta"
3. Clique "Criar Tarefa"

**Resultado Esperado:**
- ✅ Toast de sucesso aparece
- ✅ Tarefa aparece **imediatamente** na lista
- ✅ Dialog fecha automaticamente

**Resultado Falha:**
- ❌ Erro no console (verifique F12)
- ❌ Tarefa não aparece ou precisa refresh manual
- ❌ Dialog não fecha

---

## ✅ Test 3: Adicionar Comentário

**Objetivo:** Verificar que comentários aparecem instantaneamente sem fechar o dialog.

**Passos:**
1. Clique para editar uma tarefa existente
2. Vá para aba "Comentários"
3. Digite "Primeiro comentário de teste!" e clique "Comentar"
4. **NÃO FECHE O DIALOG**
5. Observe se o comentário aparece na lista acima

**Resultado Esperado:**
- ✅ Comentário aparece **IMEDIATAMENTE** na lista
- ✅ Toast "✅ Comentário adicionado!" aparece
- ✅ Campo de texto é limpo
- ✅ Avatar e nome do usuário aparecem corretamente
- ✅ Data relativa ("agora mesmo") é exibida

**Resultado Falha:**
- ❌ Precisa fechar e reabrir dialog para ver
- ❌ Erro "FK constraint" no console (significa MOCK_USER_ID inválido)
- ❌ Comentário não aparece

---

## ✅ Test 4: Histórico de Atividades

**Objetivo:** Verificar que todas as ações são registradas no histórico.

**Passos:**
1. Na mesma tarefa do Test 3, vá para aba "Histórico"
2. Verifique os logs exibidos

**Resultado Esperado:**
- ✅ Ver log "criou a tarefa" (se tarefa foi criada nesta sessão)
- ✅ Ver log "comentou" (do comentário adicionado)
- ✅ Ícones diferentes para cada tipo de ação
- ✅ Datas relativas ("há X minutos")

**Resultado Falha:**
- ❌ Lista vazia
- ❌ Erro no console
- ❌ Logs não aparecem

---

## ✅ Test 5: Alterar Status via Kanban

**Objetivo:** Verificar drag-and-drop e logging automático de mudança de status.

**Passos:**
1. Acesse `/projects/[id]/kanban`
2. Arraste uma tarefa de "Pendente" para "Em Progresso"
3. Aguarde toast de confirmação
4. Volte para a página de detalhes
5. Edite a tarefa e vá para aba "Histórico"

**Resultado Esperado:**
- ✅ Toast "Status atualizado!" aparece
- ✅ Tarefa permanece na nova coluna após refresh
- ✅ Histórico mostra "mudou status para Em Progresso"

**Resultado Falha:**
- ❌ Tarefa volta para coluna original
- ❌ Sem toast ou erro no console
- ❌ Log de status não aparece no histórico

---

## ✅ Test 6: Excluir Projeto

**Objetivo:** Verificar exclusão de projeto e cascade delete de tarefas.

**Passos:**
1. Na lista de projetos, clique no menu (3 pontinhos) de um projeto de teste
2. Clique "Excluir"
3. Confirme no alert do navegador

**Resultado Esperado:**
- ✅ Projeto **desaparece** da lista imediatamente
- ✅ Toast "Projeto excluído com sucesso!" aparece
- ✅ Tarefas do projeto também são excluídas (cascade)

**Resultado Falha:**
- ❌ Projeto permanece na lista
- ❌ Erro no console
- ❌ Sem toast de confirmação

---

## 🐛 Troubleshooting

### Erro: "FK constraint violation" ao criar comentário
**Causa:** `MOCK_USER_ID` não existe no banco.  
**Solução:** Verifique que `getDefaultUserId()` está funcionando e retornando um ID válido.

### Comentários não aparecem imediatamente
**Causa:** Callback `onCommentAdded` não está sendo chamado.  
**Solução:** Verifique que `CommentSection` recebe a prop `onCommentAdded` e que `addComment` retorna `result.comment`.

### Navegação não funciona ao clicar na linha
**Causa:** `onClick` não está no `TableRow` ou está sendo bloqueado.  
**Solução:** Verifique que `handleRowClick` está implementado e que não há `e.stopPropagation()` nos elementos internos.

### Drag-and-drop não funciona
**Causa:** Biblioteca `@dnd-kit` não configurada corretamente.  
**Solução:** Verifique que `DndContext` envolve o Kanban e que `onDragEnd` chama `updateTask`.

---

## 📊 Checklist de Conclusão

Marque cada teste após executá-lo com sucesso:

- [ ] Test 1: Navegação de Projetos
- [ ] Test 2: Criar Tarefa
- [ ] Test 3: Adicionar Comentário
- [ ] Test 4: Histórico de Atividades
- [ ] Test 5: Alterar Status via Kanban
- [ ] Test 6: Excluir Projeto

**Todos os testes passaram?** ✅ Sprint 5 está pronta para produção!
