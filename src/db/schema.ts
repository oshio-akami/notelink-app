import {
  pgTable,
  serial,
  integer,
  primaryKey,
  timestamp,
  text,
  uuid,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

import type { AdapterAccountType } from "next-auth/adapters";

export const users = pgTable("users", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),
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
);

export const sessions = pgTable("session", {
  sessionToken: text("session_token").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

/*ユーザーのprofile情報*/
export const userProfiles = pgTable("user_profiles", {
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" })
    .primaryKey(),
  displayName: text("display_name").notNull(),
  image: text("image"),
  about: text("about"),
  currentGroupId: uuid("current_group_id").references(() => groups.groupId, {
    onDelete: "set null",
  }),
});

/**ユーザーの役職 */
export const roles = pgTable("roles", {
  id: serial("id").primaryKey(),
  roleId: integer("role_id").notNull(),
  roleName: text("role_name").notNull(),
});

/**グループ */
export const groups = pgTable("groups", {
  groupId: uuid("group_id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  groupName: text("group_name").notNull(),
});

/**グループに参加しているメンバー */
export const groupMembers = pgTable(
  "group_members",
  {
    userId: uuid("user_id")
      .references(() => users.id, {
        onDelete: "cascade",
      })
      .notNull(),
    groupId: uuid("group_id")
      .references(() => groups.groupId, {
        onDelete: "cascade",
      })
      .notNull(),
    roleId: integer("role_id").notNull().default(2),
  },
  (table) => {
    return {
      pk: primaryKey(table.userId, table.groupId),
    };
  }
);

/*グループの招待トークン*/
export const groupInvites = pgTable("group_invites", {
  id: serial().primaryKey().notNull(),
  groupId: uuid("group_id")
    .references(() => groups.groupId, {
      onDelete: "cascade",
    })
    .notNull(),
  token: uuid("token").$defaultFn(() => crypto.randomUUID()),
  expiresAt: timestamp("expires_at")
    .default(sql`now() + interval '10 days'`)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**投稿 */
export const articles = pgTable("articles", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: uuid("user_id")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),
  groupId: uuid("group_id")
    .references(() => groups.groupId, {
      onDelete: "cascade",
    })
    .notNull(),
  title: text("title").notNull().default("タイトル"),
  image: text("image").$default(""),
  content: text("content").default(""),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const schema = {
  users,
  userProfiles,
  roles,
  groups,
  groupMembers,
  groupInvites,
  articles,
};
