ALTER TABLE "group_members" DROP CONSTRAINT "group_members_group_id_groups_group_id_fk";
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "active_group" uuid;--> statement-breakpoint
ALTER TABLE "group_members" ADD CONSTRAINT "group_members_group_id_groups_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("group_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_active_group_groups_group_id_fk" FOREIGN KEY ("active_group") REFERENCES "public"."groups"("group_id") ON DELETE cascade ON UPDATE no action;