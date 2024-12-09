ALTER TABLE "users" ALTER COLUMN "name" SET DEFAULT 'Anonymous User';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "name" DROP NOT NULL;