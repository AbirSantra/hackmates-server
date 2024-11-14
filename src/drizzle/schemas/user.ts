import {
  boolean,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

export const user = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 255 }),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  isVerified: boolean('isVerified').notNull().default(false),
  isActive: boolean('isActive').notNull().default(true),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
  bio: text('bio'),
  avatar: varchar('avatar', { length: 255 }),
  github: varchar('github', { length: 255 }),
  linkedin: varchar('linkedin', { length: 255 }),
  twitter: varchar('twitter', { length: 255 }),
  website: varchar('website', { length: 255 }),
});
