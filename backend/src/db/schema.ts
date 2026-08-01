import { relations, sql } from "drizzle-orm";
import {
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

/** Google `sub` — same as legacy Firestore user document id. */
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  photoUrl: text("photo_url"),
  accountCreated: integer("account_created", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
  lastLogin: integer("last_login", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
  /** JSON: { genres, providers, release_year } */
  filtersJson: text("filters_json").notNull().default("{}"),
});

/** User votes on TMDB movies (metadata from TMDB API at read time). */
export const userMovies = sqliteTable(
  "user_movies",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    movieId: integer("movie_id").notNull(),
    /** e.g. `like`, `dislike` — extensible string enum */
    vote: text("vote").notNull().default("like"),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
  },
  (t) => [primaryKey({ columns: [t.userId, t.movieId] })],
);

/** Former `users_contacts` collection */
export const contacts = sqliteTable("contacts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  contactId: text("contact_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accepted: integer("accepted", { mode: "boolean" }).notNull().default(false),
});

export const groups = sqliteTable("groups", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  creatorId: text("creator_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const groupMembers = sqliteTable(
  "group_members",
  {
    groupId: text("group_id")
      .notNull()
      .references(() => groups.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accepted: integer("accepted", { mode: "boolean" }).notNull().default(false),
  },
  (t) => [primaryKey({ columns: [t.groupId, t.userId] })],
);

export const usersRelations = relations(users, ({ many }) => ({
  userMovies: many(userMovies),
  contactsSent: many(contacts, { relationName: "contactSender" }),
  contactsReceived: many(contacts, { relationName: "contactReceiver" }),
  groupMemberships: many(groupMembers),
  groupsCreated: many(groups),
}));

export const userMoviesRelations = relations(userMovies, ({ one }) => ({
  user: one(users, { fields: [userMovies.userId], references: [users.id] }),
}));

export const contactsRelations = relations(contacts, ({ one }) => ({
  sender: one(users, {
    fields: [contacts.userId],
    references: [users.id],
    relationName: "contactSender",
  }),
  receiver: one(users, {
    fields: [contacts.contactId],
    references: [users.id],
    relationName: "contactReceiver",
  }),
}));

export const groupsRelations = relations(groups, ({ one, many }) => ({
  creator: one(users, { fields: [groups.creatorId], references: [users.id] }),
  members: many(groupMembers),
}));

export const groupMembersRelations = relations(groupMembers, ({ one }) => ({
  group: one(groups, {
    fields: [groupMembers.groupId],
    references: [groups.id],
  }),
  user: one(users, {
    fields: [groupMembers.userId],
    references: [users.id],
  }),
}));
