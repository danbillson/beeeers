import {
  boolean,
  pgTable,
  text,
  timestamp,
  integer,
  real,
  pgEnum,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

// Enums
export const ingredientKindEnum = pgEnum("ingredient_kind", [
  "fermentable",
  "hop",
  "yeast",
  "adjunct",
]);

export const recipeMethodEnum = pgEnum("recipe_method", [
  "all-grain",
  "extract",
  "partial",
]);

export const hopTypeEnum = pgEnum("hop_type", ["boil", "whirlpool", "dry-hop"]);

// Ingredients table
export const ingredients = pgTable("ingredients", {
  id: text("id").primaryKey(),
  kind: ingredientKindEnum("kind").notNull(),
  name: text("name").notNull(),
  origin: text("origin"),
  ppg: real("ppg"), // Points per kg per L
  colorLovibond: real("color_lovibond"),
  alphaAcid: real("alpha_acid"), // For hops
  attenuationMin: real("attenuation_min"), // For yeast
  attenuationMax: real("attenuation_max"), // For yeast
  description: text("description"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

// Recipes table
export const recipes = pgTable("recipes", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  style: text("style"),
  method: recipeMethodEnum("method").notNull(),
  batchSizeL: real("batch_size_l").notNull(),
  boilSizeL: real("boil_size_l").notNull(),
  efficiency: real("efficiency").notNull(), // Percentage
  boilTimeMin: integer("boil_time_min").notNull(),
  hopUtilizationMultiplier: real("hop_utilization_multiplier").default(1.0),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

// Recipe fermentables junction table
export const recipeFermentables = pgTable("recipe_fermentables", {
  id: text("id").primaryKey(),
  recipeId: text("recipe_id")
    .notNull()
    .references(() => recipes.id, { onDelete: "cascade" }),
  ingredientId: text("ingredient_id")
    .notNull()
    .references(() => ingredients.id, { onDelete: "cascade" }),
  amountKg: real("amount_kg").notNull(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

// Recipe hops junction table
export const recipeHops = pgTable("recipe_hops", {
  id: text("id").primaryKey(),
  recipeId: text("recipe_id")
    .notNull()
    .references(() => recipes.id, { onDelete: "cascade" }),
  ingredientId: text("ingredient_id")
    .notNull()
    .references(() => ingredients.id, { onDelete: "cascade" }),
  amountG: real("amount_g").notNull(),
  timeMin: integer("time_min").notNull(),
  type: hopTypeEnum("type").notNull(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

// Recipe yeast junction table
export const recipeYeast = pgTable("recipe_yeast", {
  id: text("id").primaryKey(),
  recipeId: text("recipe_id")
    .notNull()
    .references(() => recipes.id, { onDelete: "cascade" }),
  ingredientId: text("ingredient_id")
    .notNull()
    .references(() => ingredients.id, { onDelete: "cascade" }),
  pitchAmount: real("pitch_amount"), // Grams or cells
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

// Recipe water additions
export const recipeWaterAdditions = pgTable("recipe_water_additions", {
  id: text("id").primaryKey(),
  recipeId: text("recipe_id")
    .notNull()
    .references(() => recipes.id, { onDelete: "cascade" }),
  name: text("name").notNull(), // e.g., "Gypsum", "Calcium Chloride"
  amountG: real("amount_g").notNull(),
  ionType: text("ion_type").notNull(), // Ca, Mg, Na, Cl, SO4, HCO3
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

// Recipe other additions
export const recipeOtherAdditions = pgTable("recipe_other_additions", {
  id: text("id").primaryKey(),
  recipeId: text("recipe_id")
    .notNull()
    .references(() => recipes.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  amountG: real("amount_g").notNull(),
  timeMin: integer("time_min"), // When to add during boil
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

// Mash steps
export const mashSteps = pgTable("mash_steps", {
  id: text("id").primaryKey(),
  recipeId: text("recipe_id")
    .notNull()
    .references(() => recipes.id, { onDelete: "cascade" }),
  step: integer("step").notNull(),
  temperatureC: real("temperature_c").notNull(),
  durationMin: integer("duration_min").notNull(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});
