ALTER TABLE "user_profile" RENAME TO "user_profiles";--> statement-breakpoint
ALTER TABLE "user_profiles" DROP CONSTRAINT "user_profile_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;