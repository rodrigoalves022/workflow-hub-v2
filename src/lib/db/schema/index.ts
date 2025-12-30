import { pgTable, uuid, varchar, text, timestamp, boolean, integer, decimal, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ==========================================
// ENUMS
// ==========================================

export const projectStatusEnum = pgEnum('project_status', [
    'PLANNING',
    'ACTIVE',
    'ON_HOLD',
    'COMPLETED',
    'CANCELLED'
]);

export const taskStatusEnum = pgEnum('task_status', [
    'PENDING',
    'IN_PLANNING',
    'IN_PROGRESS',
    'COMPLETED',
    'CANCELLED',
    'BLOCKED'
]);

export const priorityEnum = pgEnum('priority', [
    'CRITICAL',
    'HIGH',
    'MEDIUM',
    'LOW',
    'NONE'
]);

export const userRoleEnum = pgEnum('user_role', [
    'OWNER',
    'ADMIN',
    'MEMBER',
    'GUEST'
]);

export const entityTypeEnum = pgEnum('entity_type', [
    'TASK',
    'PROJECT'
]);

export const auditActionEnum = pgEnum('audit_action', [
    'CREATED',
    'UPDATED',
    'DELETED',
    'STATUS_CHANGED',
    'ASSIGNED',
    'COMMENTED'
]);


// ==========================================
// USERS TABLE
// ==========================================

export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    name: varchar('name', { length: 255 }).notNull(),
    avatarUrl: varchar('avatar_url', { length: 500 }),
    role: userRoleEnum('role').notNull().default('MEMBER'),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ==========================================
// TASK TYPES TABLE
// ==========================================

export const taskTypes = pgTable('task_types', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 100 }).notNull().unique(),
    description: text('description'),
    icon: varchar('icon', { length: 50 }).default('📋'),
    color: varchar('color', { length: 7 }).default('#6366f1'),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ==========================================
// COMMENTS TABLE
// ==========================================

export const comments = pgTable('comments', {
    id: uuid('id').primaryKey().defaultRandom(),
    taskId: uuid('task_id').notNull().references(() => tasks.id, { onDelete: 'cascade' }),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    content: text('content').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ==========================================
// AUDIT LOGS TABLE
// ==========================================

export const auditLogs = pgTable('audit_logs', {
    id: uuid('id').primaryKey().defaultRandom(),
    entityId: uuid('entity_id').notNull(),
    entityType: entityTypeEnum('entity_type').notNull(),
    action: auditActionEnum('action').notNull(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
    details: text('details'), // JSON stringified
    createdAt: timestamp('created_at').notNull().defaultNow(),
});

// ==========================================
// PROJECTS TABLE
// ==========================================

export const projects = pgTable('projects', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 200 }).notNull(),
    description: text('description'),
    color: varchar('color', { length: 7 }).default('#3b82f6'),
    icon: varchar('icon', { length: 50 }).default('📁'),

    status: projectStatusEnum('status').notNull().default('PLANNING'),

    startDate: timestamp('start_date'),
    targetEndDate: timestamp('target_end_date'),
    actualEndDate: timestamp('actual_end_date'),

    ownerId: uuid('owner_id').references(() => users.id, { onDelete: 'set null' }),

    isArchived: boolean('is_archived').notNull().default(false),
    archivedAt: timestamp('archived_at'),

    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ==========================================
// TASKS TABLE
// ==========================================

export const tasks = pgTable('tasks', {
    id: uuid('id').primaryKey().defaultRandom(),
    projectId: uuid('project_id').references(() => projects.id, { onDelete: 'cascade' }).notNull(),

    // Hierarchy (self-reference comentada temporariamente para evitar erro de tipo circular)
    parentTaskId: uuid('parent_task_id'),

    // Basic Info
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),

    // Classification
    typeId: uuid('type_id').references(() => taskTypes.id, { onDelete: 'set null' }),
    priority: priorityEnum('priority').notNull().default('MEDIUM'),
    status: taskStatusEnum('status').notNull().default('PENDING'),

    // Assignment
    assigneeId: uuid('assignee_id').references(() => users.id, { onDelete: 'set null' }),
    reporterId: uuid('reporter_id').references(() => users.id, { onDelete: 'set null' }),

    // Dates
    startDate: timestamp('start_date'),
    dueDate: timestamp('due_date'),
    completedAt: timestamp('completed_at'),

    // Effort
    estimatedHours: decimal('estimated_hours', { precision: 5, scale: 2 }),

    // Metadata
    order: integer('order').notNull().default(0),
    isArchived: boolean('is_archived').notNull().default(false),

    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ==========================================
// RELATIONS
// ==========================================

export const usersRelations = relations(users, ({ many }) => ({
    ownedProjects: many(projects, { relationName: 'projectOwner' }),
    assignedTasks: many(tasks, { relationName: 'taskAssignee' }),
    reportedTasks: many(tasks, { relationName: 'taskReporter' }),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
    owner: one(users, {
        fields: [projects.ownerId],
        references: [users.id],
        relationName: 'projectOwner',
    }),
    tasks: many(tasks),
}));

export const taskTypesRelations = relations(taskTypes, ({ many }) => ({
    tasks: many(tasks),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
    task: one(tasks, {
        fields: [comments.taskId],
        references: [tasks.id],
    }),
    author: one(users, {
        fields: [comments.userId],
        references: [users.id],
    }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
    user: one(users, {
        fields: [auditLogs.userId],
        references: [users.id],
    }),
}));

export const tasksRelations = relations(tasks, ({ one, many }) => ({
    project: one(projects, {
        fields: [tasks.projectId],
        references: [projects.id],
    }),
    type: one(taskTypes, {
        fields: [tasks.typeId],
        references: [taskTypes.id],
    }),
    assignee: one(users, {
        fields: [tasks.assigneeId],
        references: [users.id],
        relationName: 'taskAssignee',
    }),
    reporter: one(users, {
        fields: [tasks.reporterId],
        references: [users.id],
        relationName: 'taskReporter',
    }),
    comments: many(comments),
    // Comentado temporariamente devido a referência circular
    // parentTask: one(tasks, {
    //   fields: [tasks.parentTaskId],
    //   references: [tasks.id],
    //   relationName: 'taskHierarchy',
    // }),
    // subtasks: many(tasks, { relationName: 'taskHierarchy' }),
}));

// ==========================================
// TYPES (for TypeScript)
// ==========================================

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;

export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;

export type TaskType = typeof taskTypes.$inferSelect;
export type NewTaskType = typeof taskTypes.$inferInsert;

export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;

export type AuditLog = typeof auditLogs.$inferSelect;
export type NewAuditLog = typeof auditLogs.$inferInsert;
