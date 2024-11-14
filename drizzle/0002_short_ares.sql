ALTER TABLE "users" ALTER COLUMN "username" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "password" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "name" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "isVerified" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "isActive" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "bio" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "avatar" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "github" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "linkedin" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "twitter" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "website" varchar(255);--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "github_url";