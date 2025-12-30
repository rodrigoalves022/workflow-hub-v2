# Sprint 3 - Implementation Plan

## Goal
Implement a complete task management system with CRUD operations, Kanban board visualization, and seamless integration with the existing project management system.

---

## Phase 1: Task UI Components (2-3 hours)

### Components to Create

#### 1. TaskList Component
**File:** `src/components/tasks/task-list.tsx`
- Table view similar to ProjectList
- Columns: Title, Project, Status, Priority, Assignee, Due Date, Actions
- Filter controls (project, status, priority)
- Search bar
- Empty state

#### 2. TaskDialog Component
**File:** `src/components/tasks/task-dialog.tsx`
- Form fields:
  - Title (required)
  - Description (textarea)
  - Project (select - required)
  - Type (select)
  - Priority (select)
  - Status (select)
  - Assignee (select)
  - Due Date (date picker)
  - Estimated Hours (number)
- Validation
- Create/Edit modes

#### 3. TaskCard Component
**File:** `src/components/tasks/task-card.tsx`
- Compact card for Kanban
- Shows: title, priority badge, assignee avatar, due date
- Click to open details
- Drag handle

---

## Phase 2: Tasks Page (1-2 hours)

### Main Tasks Page
**File:** `src/app/tasks/page.tsx`
- Server-side data fetching with `getTasks()`
- Filter state management
- Integration with TaskList and TaskDialog
- Header with "New Task" button
- Breadcrumb navigation

### Features
- Filter by project (dropdown)
- Filter by status (tabs or select)
- Filter by priority
- Search by title
- Sort by due date, priority, created date

---

## Phase 3: Kanban Board (3-4 hours)

### Dependencies
```bash
pnpm add @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

### Components

#### 1. KanbanBoard
**File:** `src/components/tasks/kanban-board.tsx`
- DndContext wrapper
- Columns for each status (PENDING, IN_PROGRESS, COMPLETED, etc)
- Drag-and-drop logic
- Status update on drop

#### 2. KanbanColumn
**File:** `src/components/tasks/kanban-column.tsx`
- Droppable area
- Column header with count
- TaskCard list
- Empty state per column

#### 3. Kanban Page
**File:** `src/app/projects/[id]/kanban/page.tsx`
- Fetch tasks for specific project
- Group by status
- Real-time updates after drag

---

## Phase 4: Additional UI Components

### Components to Install
```bash
npx shadcn@latest add dropdown-menu popover calendar
```

### Custom Components

#### DatePicker
**File:** `src/components/ui/date-picker.tsx`
- Calendar integration
- Clear button
- Formatted display

#### UserSelect
**File:** `src/components/tasks/user-select.tsx`
- Dropdown with user list
- Avatar + name display
- Search functionality

---

## Phase 5: Data Seeding

### Seed Script Enhancement
Update `src/lib/db/actions/project-actions.ts`:
- Create 3-5 sample users
- Create 5 task types (Development, Design, Bug, Meeting, Documentation)
- Create 2-3 sample projects
- Create 10-15 sample tasks across different statuses

---

## Phase 6: Integration & Polish

### Updates to Existing Pages

#### Project Detail Page
**File:** `src/app/projects/[id]/page.tsx`
- Show task count
- Link to Kanban board
- Recent tasks list

#### Homepage
- Add task statistics
- Quick access to tasks

---

## Technical Considerations

### Server Actions
- All existing task actions are ready
- May need to add `updateTaskStatus()` for Kanban

### Database
- Schema is complete
- All relationships in place

### TypeScript
- Use existing types from schema
- Create view models if needed (e.g., `TaskWithRelations`)

---

## Verification Plan

### Manual Testing
1. Create task from /tasks page
2. Edit task details
3. Delete task
4. Filter tasks by project
5. Search tasks
6. Drag task in Kanban
7. Verify status updates
8. Check task assignment
9. Test due date selection

### Automated Checks
- TypeScript compilation
- No console errors
- All links working
- Responsive design

---

## Success Criteria

- [ ] Can create, read, update, delete tasks
- [ ] Tasks display in table view with all fields
- [ ] Kanban board shows tasks grouped by status
- [ ] Drag-and-drop updates task status
- [ ] Filters work correctly
- [ ] Search finds tasks by title
- [ ] Task assignment works
- [ ] Due dates can be set and displayed
- [ ] UI is responsive and polished

---

**Estimated Time:** 6-9 hours
**Priority:** High
**Dependencies:** Sprint 2 (Projects) ✅
