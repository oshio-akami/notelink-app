import {
  pgTable,
  serial,
  integer,
  primaryKey,
  timestamp,
  text,
  uuid,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import type { AdapterAccountType } from "next-auth/adapters"
import {  } from "drizzle-orm/gel-core";


export const users = pgTable("users", {
  id: uuid("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),
  roleId: integer("role_id").references(() => roles.roleId),
  activeGroupId:uuid("active_group").references(() => groups.groupId, { onDelete: "set null" }),
});

export const accounts = pgTable(
  "account",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
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
  sessionToken: text("session_token").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
})

//ユーザーの役職
export const roles = pgTable("roles", {
  roleId: serial("role_id").primaryKey(),
  roleName: text("role_name").notNull(),
});

//グループ
export const groups = pgTable("groups", {
  groupId: uuid("group_id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  groupName: text("group_name").notNull(),
});

//グループに参加しているメンバー
export const groupMembers = pgTable("group_members",{
  userId: uuid("user_id").references(() => users.id, {
     onDelete: "cascade",
  }),
  groupId: uuid("group_id").references(() => groups.groupId,{
     onDelete:"cascade",
   }),
  },
  (table) => {
    return {
      pk: primaryKey(table.userId, table.groupId),
    };
  }
);

export const userRelations = relations(users, ({ many, one }) => ({
  groupMembers: many(groupMembers),
  role: one(roles, {
    fields: [users.roleId],
    references: [roles.roleId],
  }),
}));

export const groupsRelations = relations(groups, ({ many }) => ({
  groupMembers: many(groupMembers),
}));

//現状グループメンバーがあるとグループが削除できない、依存が逆になってる
export const groupMembersRelations = relations(
  groupMembers,
  ({ one }) => ({
    user: one(users, {
      fields: [groupMembers.userId],
      references: [users.id],
    }),
    group: one(groups, {
      fields: [groupMembers.groupId],
      references: [groups.groupId],
    }),
  })
);
