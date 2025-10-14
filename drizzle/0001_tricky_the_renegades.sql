CREATE TYPE "public"."hop_type" AS ENUM('boil', 'whirlpool', 'dry-hop');--> statement-breakpoint
CREATE TYPE "public"."ingredient_kind" AS ENUM('fermentable', 'hop', 'yeast', 'adjunct');--> statement-breakpoint
CREATE TYPE "public"."recipe_method" AS ENUM('all-grain', 'extract', 'partial');--> statement-breakpoint
CREATE TABLE "brew_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"recipe_id" text NOT NULL,
	"brew_date" timestamp NOT NULL,
	"measured_og" real,
	"measured_fg" real,
	"fermentation_temp_c" real,
	"notes" text,
	"issues" text,
	"tasting_notes" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ingredients" (
	"id" text PRIMARY KEY NOT NULL,
	"kind" "ingredient_kind" NOT NULL,
	"name" text NOT NULL,
	"origin" text,
	"ppg" real,
	"color_lovibond" real,
	"alpha_acid" real,
	"attenuation_min" real,
	"attenuation_max" real,
	"description" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mash_steps" (
	"id" text PRIMARY KEY NOT NULL,
	"recipe_id" text NOT NULL,
	"step" integer NOT NULL,
	"temperature_c" real NOT NULL,
	"duration_min" integer NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recipe_fermentables" (
	"id" text PRIMARY KEY NOT NULL,
	"recipe_id" text NOT NULL,
	"ingredient_id" text NOT NULL,
	"amount_kg" real NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recipe_hops" (
	"id" text PRIMARY KEY NOT NULL,
	"recipe_id" text NOT NULL,
	"ingredient_id" text NOT NULL,
	"amount_g" real NOT NULL,
	"time_min" integer NOT NULL,
	"type" "hop_type" NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recipe_other_additions" (
	"id" text PRIMARY KEY NOT NULL,
	"recipe_id" text NOT NULL,
	"name" text NOT NULL,
	"amount_g" real NOT NULL,
	"time_min" integer,
	"notes" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recipe_water_additions" (
	"id" text PRIMARY KEY NOT NULL,
	"recipe_id" text NOT NULL,
	"name" text NOT NULL,
	"amount_g" real NOT NULL,
	"ion_type" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recipe_yeast" (
	"id" text PRIMARY KEY NOT NULL,
	"recipe_id" text NOT NULL,
	"ingredient_id" text NOT NULL,
	"pitch_amount" real,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recipes" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"style" text,
	"method" "recipe_method" NOT NULL,
	"batch_size_l" real NOT NULL,
	"boil_size_l" real NOT NULL,
	"efficiency" real NOT NULL,
	"boil_time_min" integer NOT NULL,
	"hop_utilization_multiplier" real DEFAULT 1,
	"notes" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "brew_logs" ADD CONSTRAINT "brew_logs_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mash_steps" ADD CONSTRAINT "mash_steps_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_fermentables" ADD CONSTRAINT "recipe_fermentables_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_fermentables" ADD CONSTRAINT "recipe_fermentables_ingredient_id_ingredients_id_fk" FOREIGN KEY ("ingredient_id") REFERENCES "public"."ingredients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_hops" ADD CONSTRAINT "recipe_hops_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_hops" ADD CONSTRAINT "recipe_hops_ingredient_id_ingredients_id_fk" FOREIGN KEY ("ingredient_id") REFERENCES "public"."ingredients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_other_additions" ADD CONSTRAINT "recipe_other_additions_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_water_additions" ADD CONSTRAINT "recipe_water_additions_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_yeast" ADD CONSTRAINT "recipe_yeast_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_yeast" ADD CONSTRAINT "recipe_yeast_ingredient_id_ingredients_id_fk" FOREIGN KEY ("ingredient_id") REFERENCES "public"."ingredients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;