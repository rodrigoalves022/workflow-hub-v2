# Sprint 5 - Implementation Plan: Collaboration System

## Goal
Implement a complete collaboration system for tasks, including threaded comments and automatic activity history tracking via audit logs.

---

## User Review Required

> [!IMPORTANT]
> **Schema Changes Required**
> This sprint adds two new database tables (`comments` and `audit_logs`). After schema update, you'll need to run:
> ```bash
> pnpm db:generate
> pnpm db:push
> ```

---

## Proposed Changes

### Phase 1: Database Schema

#### [MODIFY] [index.ts](file:///c:/Users/rodrigo.silva/Music/Atividades/src/lib/db/schema/index.ts)

**New Enums:**
```typescript
export const entityTypeEnum = pgEnum('entity_type', ['TASK', 'PROJECT']);
export const auditActionEnum = pgEnum('audit_action', [
  'CREATED', 'UPDATED', 'DELETED', 'STATUS_CHANGED', 
  'ASSIGNED', 'COMMENTED'
]);
```

**New Table: `comments`**
- `id` (uuid, primary key)
- `taskId` (uuid, foreign key → tasks.id, cascade delete)
- `userId` (uuid, foreign key → users.id)
- `content` (text, not null)
- `createdAt` (timestamp, default now)
- `updatedAt` (timestamp, default now)

**New Table: `audit_logs`**
- `id` (uuid, primary key)
- `entityId` (uuid, not null) - ID of task/project
- `entityType` (enum: TASK, PROJECT)
- `action` (enum: CREATED, UPDATED, etc.)
- `userId` (uuid, foreign key → users.id)
- `details` (text) - JSON stringified details
- `createdAt` (timestamp, default now)

**Relations:**
- `comments` → `tasks` (many-to-one)
- `comments` → `users` (many-to-one)
- `audit_logs` → `users` (many-to-one)

---

### Phase 2: Server Actions

#### [NEW] [collaboration-actions.ts](file:///c:/Users/rodrigo.silva/Music/Atividades/src/lib/db/actions/collaboration-actions.ts)

```typescript
// Get all comments for a task
export async function getComments(taskId: string);

// Add a new comment
export async function addComment(
  taskId: string, 
  userId: string, 
  content: string
);

// Get activity timeline for a task
export async function getActivityTimeline(
  entityId: string, 
  entityType: 'TASK' | 'PROJECT'
);

// Helper: Log an activity (internal use)
export async function logActivity(
  entityId: string,
  entityType: 'TASK' | 'PROJECT',
  action: string,
  userId: string,
  details?: object
);
```

#### [MODIFY] [task-actions.ts](file:///c:/Users/rodrigo.silva/Music/Atividades/src/lib/db/actions/task-actions.ts)

Update existing functions to log activities:

**`createTask`**: Log "CREATED" action
**`updateTask`**: Log "UPDATED" or "STATUS_CHANGED" action
**`deleteTask`**: Log "DELETED" action

---

### Phase 3: UI Components

#### [NEW] [CommentSection.tsx](file:///c:/Users/rodrigo.silva/Music/Atividades/src/components/tasks/collaboration/CommentSection.tsx)

Features:
- Display list of comments (newest first)
- Each comment shows: avatar, name, relative time, content
- Textarea + button for new comment
- Empty state: "Seja o primeiro a comentar!"
- Auto-refresh after posting

#### [NEW] [ActivityTimeline.tsx](file:///c:/Users/rodrigo.silva/Music/Atividades/src/components/tasks/collaboration/ActivityTimeline.tsx)

Features:
- Display audit log entries
- Format: "Rodrigo mudou status para Em Progresso • há 2 horas"
- Icon per action type (created, updated, status changed, etc.)
- Empty state: "Nenhuma atividade registrada"

#### [NEW] [date-utils.ts](file:///c:/Users/rodrigo.silva/Music/Atividades/src/lib/date-utils.ts)

Helper function:
```typescript
export function formatRelativeTime(date: Date): string;
// Returns: "há 2 horas", "há 3 dias", etc.
```

---

### Phase 4: TaskDialog Integration

#### [MODIFY] [task-dialog.tsx](file:///c:/Users/rodrigo.silva/Music/Atividades/src/components/tasks/task-dialog.tsx)

Changes:
1. Install shadcn `tabs` component
2. Restructure dialog content with tabs:
   - "Detalhes" (existing form)
   - "Comentários" (CommentSection)
   - "Histórico" (ActivityTimeline)
3. Disable "Comentários" and "Histórico" tabs if `!task.id` (new task)
4. Pass `currentUserId` to CommentSection (hardcoded for now, will be from auth later)

---

## Verification Plan

### Database Migration
```bash
# Check current schema
pnpm db:studio

# Generate migration
pnpm db:generate

# Apply to Neon
pnpm db:push

# Verify in Neon dashboard
```

### Manual Testing Steps

**Test 1: Comment Creation**
1. Open existing task in TaskDialog (edit mode)
2. Click "Comentários" tab
3. Type "Teste de comentário" and click "Adicionar"
4. Verify comment appears immediately
5. Refresh page and verify comment persists

**Test 2: Activity Logging**
1. Create a new task
2. Go to "Histórico" tab
3. Verify "Tarefa criada" log entry
4. Change status from PENDING to IN_PROGRESS
5. Verify "Status alterado para Em Progresso" log entry

**Test 3: Empty States**
1. Create new task (not saved yet)
2. Verify "Comentários" and "Histórico" tabs are disabled
3. Save task, open again
4. Verify tabs are now enabled
5. Verify empty state messages

**Test 4: Avatars & Formatting**
1. Add multiple comments
2. Verify each has correct avatar (user initials)
3. Verify relative time formatting ("há X minutos/horas")

---

## Dependencies

**New shadcn/ui components:**
```bash
npx shadcn@latest add tabs
```

**npm packages (if needed):**
- None (relative time will be custom implementation)

---

## Success Criteria

- [ ] Database has `comments` and `audit_logs` tables
- [ ] Can add comments to tasks
- [ ] Comments display with avatar and relative time
- [ ] Activity timeline shows all task changes
- [ ] TaskDialog has 3 tabs (Detalhes, Comentários, Histórico)
- [ ] Tabs disabled for unsaved tasks
- [ ] Empty states are user-friendly
- [ ] All CRUD operations log to audit_logs

---

**Estimated Time:** 3-4 hours  
**Complexity:** Medium (database changes + UI updates)
