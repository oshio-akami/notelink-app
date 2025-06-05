CREATE TABLE "articles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"group_id" uuid NOT NULL,
	"title" text DEFAULT 'タイトル' NOT NULL,
	"image" text DEFAULT '',
	"content" text DEFAULT '',
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bookmarks" (
	"user_id" uuid NOT NULL,
	"article_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "bookmarks_user_id_article_id_pk" PRIMARY KEY("user_id","article_id")
);
--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_active_group_groups_group_id_fk";
--> statement-breakpoint
ALTER TABLE "group_invites" ALTER COLUMN "group_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "group_members" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "group_members" ALTER COLUMN "group_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD PRIMARY KEY ("user_id");--> statement-breakpoint
ALTER TABLE "user_profiles" ADD COLUMN "current_group_id" uuid;--> statement-breakpoint
ALTER TABLE "articles" ADD CONSTRAINT "articles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "articles" ADD CONSTRAINT "articles_group_id_groups_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("group_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_current_group_id_groups_group_id_fk" FOREIGN KEY ("current_group_id") REFERENCES "public"."groups"("group_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "active_group";