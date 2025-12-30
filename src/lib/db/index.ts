// Export all tables
export { users, projects, tasks, taskTypes, comments, auditLogs } from './schema';
export type { User, NewUser, Project, NewProject, Task, NewTask, TaskType, NewTaskType, Comment, NewComment, AuditLog, NewAuditLog } from './schema';

// Export database client
export { db, testDbConnection } from './client';

