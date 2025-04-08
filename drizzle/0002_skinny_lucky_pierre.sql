ALTER TABLE "users" DROP CONSTRAINT "users_active_group_groups_group_id_fk";
--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_active_group_groups_group_id_fk" FOREIGN KEY ("active_group") REFERENCES "public"."groups"("group_id") ON DELETE set null ON UPDATE no action;