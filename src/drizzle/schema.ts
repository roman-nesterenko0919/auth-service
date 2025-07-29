import { pgTable, serial, timestamp, varchar, text, date } from 'drizzle-orm/pg-core'

export const users = pgTable("users", {
    id: serial('id').primaryKey(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    username: varchar('username', { length: 50}).notNull(),
    email: varchar('email', { length: 254}).notNull().unique(),
    password: varchar('password', { length: 127 }).notNull(),
    fullname: text('fullname').notNull(),
    birthDate: date('birth_date'),
})