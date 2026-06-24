import { sql } from 'drizzle-orm';
import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core';

// 1. 自分の運用アカウント（親）
export const myAccounts = sqliteTable('my_accounts', {
  id: text('id').primaryKey(), // ThreadsのアカウントIDなど
  username: text('username').notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// 2. ターゲットユーザー（客層ステータス管理）
export const targetUsers = sqliteTable('target_users', {
  id: text('id').primaryKey(), // 相手のThreads ID
  myAccountId: text('my_account_id').notNull().references(() => myAccounts.id, { onDelete: 'cascade' }), // どの運用アカウントに紐づくか
  username: text('username').notNull(),
  status: text('status', { enum: ['none', 'hot', 'blacklist'] }).default('none').notNull(),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

// 3. 会話の履歴（DM・返信ログ）
export const interactionLogs = sqliteTable('interaction_logs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  myAccountId: text('my_account_id').notNull().references(() => myAccounts.id, { onDelete: 'cascade' }),
  targetUserId: text('target_user_id').notNull().references(() => targetUsers.id, { onDelete: 'cascade' }),
  type: text('type', { enum: ['dm_recv', 'dm_send', 'reply_recv', 'reply_send'] }).notNull(),
  content: text('content').notNull(), // メッセージ内容
  aiAnalyzed: integer('ai_analyzed', { mode: 'boolean' }).default(false), // AI分析フラグ
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});
