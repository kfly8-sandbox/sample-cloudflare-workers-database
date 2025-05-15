import * as t from 'drizzle-orm/sqlite-core';

export const todos = t.sqliteTable('todos', {
  id: t.integer('id').primaryKey(),
  title: t.text('title'),
  description: t.text('description'),
  done: t.integer('done', { mode: 'boolean' }).default(false),
})

