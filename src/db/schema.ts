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

export const users = pgTable("users", {
  id: uuid("id").primaryKey(),
  displayName: text("name"),
  image: text("image"),
  about:text("about"),
  currentGroupId:uuid("active_group").references(() => groups.groupId, { onDelete: "set null" }),
});


//ユーザーの役職
export const roles = pgTable("roles", {
  id: serial("id").primaryKey(),
  roleId:integer("role_id").notNull(),
  roleName: text("role_name").notNull(),
});

/**グループ */
export const groups = pgTable("groups", {
  groupId: uuid("group_id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  groupName: text("group_name").notNull(),
});

/*グループに参加しているメンバー */
export const groupMembers = pgTable("group_members",{
  userId: uuid("user_id").references(() => users.id, {
     onDelete: "cascade",
  }),
  groupId: uuid("group_id").references(() => groups.groupId,{
     onDelete:"cascade",
   }),
   roleId: integer("role_id").notNull().default(2),
  },
  (table) => {
    return {
      pk: primaryKey(table.userId, table.groupId),
    };
  }
);

/*グループの招待トークン*/
export const groupInvites=pgTable("group_invites",{
  id:serial().primaryKey().notNull(),
  groupId: uuid("group_id").references(() => groups.groupId,{
    onDelete:"cascade",
  }),
  token:uuid("token").$defaultFn(() => crypto.randomUUID()),
  expiresAt:timestamp("expires_at").default(sql`now() + interval '10 days'`).notNull(),
  createdAt:timestamp("created_at").defaultNow().notNull(),
})

export const schema={
  users,
  roles,
  groups,
  groupMembers,
  groupInvites,
}