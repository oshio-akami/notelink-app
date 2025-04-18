CREATE TABLE "user_profile" (
	"user_id" uuid NOT NULL,
	"display_name" text NOT NULL,
	"image" text,
	"about" text
);
--> statement-breakpoint
ALTER TABLE "user_profile" ADD CONSTRAINT "user_profile_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;