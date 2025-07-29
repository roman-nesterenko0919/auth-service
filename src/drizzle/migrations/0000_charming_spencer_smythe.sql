CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"name" varchar(50) NOT NULL,
	"email" varchar(254) NOT NULL,
	"password" varchar(127) NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
