import { pgTable, text, uniqueIndex, uuid, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable(
	'users',
	{
		id: uuid('id').primaryKey().notNull(),
		workosID: varchar('workos_id', { length: 32 }).notNull(),
		email: text('email'),
		firstName: text('first_name'),
		lastName: text('last_name')
	},
	(table) => {
		return {
			emailIdx: uniqueIndex('email_idx').on(table.email)
		};
	}
);

export type SelectUser = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
