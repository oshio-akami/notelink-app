ALTER TABLE "users" RENAME COLUMN "user_id" TO "id";--> statement-breakpoint
ALTER TABLE "project_members" DROP CONSTRAINT "project_members_user_id_users_user_id_fk";
--> statement-breakpoint
ALTER TABLE "project_members" ADD CONSTRAINT "project_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;