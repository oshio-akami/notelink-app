ALTER TABLE "articles" ALTER COLUMN "image" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "articles" ALTER COLUMN "content" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "comments" ALTER COLUMN "comment" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user_profiles" ALTER COLUMN "image" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "user_profiles" ALTER COLUMN "image" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user_profiles" ALTER COLUMN "about" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "user_profiles" ALTER COLUMN "about" SET NOT NULL;