import { mysqlTable, text, uniqueIndex, varchar } from 'drizzle-orm/mysql-core';

export const users = mysqlTable("users", {
    id: varchar("id", { length: 36 }).primaryKey().unique(),
    email: text("email"),
    firstName: text("first_name"),
    lastName: text("last_name"),
}, (table) => {
    return {
        emailIdx: uniqueIndex("email_idx").on(table.email),
    };
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
