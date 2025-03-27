import {
  pgTable,
  serial,
  integer,
  primaryKey,
  timestamp,
  text,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import type { AdapterAccountType } from "next-auth/adapters"


export const users = pgTable("users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  roleId: integer("role_id").references(() => roles.roleId),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ]
)

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
})

export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => [
    {
      compositePK: primaryKey({
        columns: [authenticator.userId, authenticator.credentialID],
      }),
    },
  ]
)

export const roles = pgTable("roles", {
  roleId: serial("role_id").primaryKey(),
  roleName: text("role_name").notNull(),
});

export const projects = pgTable("projects", {
  projectId: serial("project_id").primaryKey(),
  projectName: text("project_name").notNull(),
});

export const projectMembers = pgTable(
  "project_members",
  {
    userId: text("user_id").references(() => users.id, {
      onDelete: "cascade",
    }),
    projectId: integer("project_id").references(() => projects.projectId),
  },
  (table) => {
    return {
      pk: primaryKey(table.userId, table.projectId),
    };
  }
);

export const userRelations = relations(users, ({ many, one }) => ({
  projectMembers: many(projectMembers),
  role: one(roles, {
    fields: [users.roleId],
    references: [roles.roleId],
  }),
}));

export const projectsRelations = relations(projects, ({ many }) => ({
  projectMembers: many(projectMembers),
}));

export const projectMembersRelations = relations(
  projectMembers,
  ({ one }) => ({
    user: one(users, {
      fields: [projectMembers.userId],
      references: [users.id],
    }),
    project: one(projects, {
      fields: [projectMembers.projectId],
      references: [projects.projectId],
    }),
  })
);
