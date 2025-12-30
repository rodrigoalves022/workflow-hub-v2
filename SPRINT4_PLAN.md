# Sprint 4 - Implementation Plan: Kanban Board

## Goal
Implement a fully functional Kanban board with drag-and-drop functionality for visualizing and managing tasks across different status columns.

---

## Proposed Changes

### 1. TaskCard Component
**File:** `src/components/tasks/task-card.tsx`

Compact card component optimized for Kanban view:
- Display task title and description (truncated)
- Show priority badge/indicator
- Display assignee avatar (if available)
- Show due date with icon
- Task type badge
- Draggable functionality

### 2. KanbanColumn Component
**File:** `src/components/tasks/kanban-column.tsx`

Column container for each status:
- Column header with status name and task count
- Droppable area using dnd-kit
- Scrollable task list
- Empty state when no tasks
- Visual feedback during drag (highlight)

### 3. KanbanBoard Component
**File:** `src/components/tasks/kanban-board.tsx`

Main board orchestrator:
- `DndContext` wrapper for drag-and-drop
- Horizontal layout with all status columns
- Drag handlers (`onDragStart`, `onDragEnd`, `onDragOver`)
- Update task status via server action on drop
- Optimistic UI updates
- Toast notifications for status changes

### 4. Kanban Page
**File:** `src/app/projects/[id]/kanban/page.tsx`

Dedicated Kanban view page:
- Server-side fetch project and tasks
- Group tasks by status
- Render KanbanBoard component
- Header with project info and back button
- Toggle between Kanban and List view

### 5. Navigation Links
**Updates to:** `src/app/projects/[id]/page.tsx`

Add button/link to switch to Kanban view:
- "Ver Kanban" button in header
- Tab navigation (List | Kanban)

---

## Technical Specifications

### Status Columns (Order):
1. **PENDING** - Pendente
2. **IN_PLANNING** - Planejamento
3. **IN_PROGRESS** - Em Progresso
4. **BLOCKED** - Bloqueada
5. **COMPLETED** - Concluída
6. **CANCELLED** - Cancelada

### Drag-and-Drop Logic:
```typescript
// On drag end, update task status
const handleDragEnd = async (event) => {
  const { active, over } = event;
  if (!over || active.id === over.id) return;
  
  const taskId = active.id;
  const newStatus = over.id; // Column ID = status
  
  await updateTask(taskId, { status: newStatus });
};
```

### Server Action Enhancement:
Add to `task-actions.ts`:
```typescript
export async function updateTaskStatus(id: string, status: TaskStatus) {
  return await updateTask(id, { status });
}
```

---

## Verification Plan

### Automated Tests
None - this is a UI-heavy feature. Focus on manual/browser testing.

### Browser Testing

**Test 1: Kanban Navigation**
1. Navigate to `http://localhost:3000/projects/[id]`
2. Click "Ver Kanban" button
3. Verify redirect to `/projects/[id]/kanban`
4. Verify Kanban board renders with columns

**Test 2: Task Cards Display**
1. On Kanban board, verify:
   - All tasks from project appear
   - Tasks are grouped by status
   - Each card shows: title, priority, due date
   - Empty columns show placeholder message

**Test 3: Drag-and-Drop**
1. Drag a task from "PENDING" column
2. Drop it in "IN_PROGRESS" column
3. Verify:
   - Card moves to new column visually
   - Toast notification appears
   - Page refresh shows task in new status
   - Database persists the change

**Test 4: Multi-Task Drag**
1. Create 3+ tasks in different statuses
2. Drag tasks between multiple columns
3. Verify all status updates work correctly

**Test 5: Edge Cases**
1. Try dragging and dropping in same column (should not update)
2. Try dragging outside droppable area (should cancel)
3. Verify empty columns display correctly

### Manual Verification by User
After implementation, user should:
1. Create multiple tasks with different statuses
2. Test drag-and-drop workflow
3. Verify the Kanban view matches their workflow expectations
4. Check mobile responsiveness

---

## Dependencies
- ✅ `@dnd-kit/core` - DnD context and sensors
- ✅ `@dnd-kit/sortable` - Sortable lists
- ✅ `@dnd-kit/utilities` - Helper functions
- ✅ `avatar` component (shadcn/ui)

---

## Design Considerations

### Visual Design:
- Columns: Fixed width (300px), scrollable vertically
- Cards: Compact, rounded corners, shadow on hover
- Drag overlay: Semi-transparent version of card
- Empty state: Dashed border, centered message
- Responsive: Stack columns on mobile (< 768px)

### Performance:
- Optimistic updates for instant feedback
- Revalidate path after server action
- Virtualization if > 50 tasks per column (future)

---

**Estimated Implementation Time:** 2-3 hours  
**Complexity:** Medium-High (drag-and-drop state management)
