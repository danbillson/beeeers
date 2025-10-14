/**
 * Seed script for brewing ingredients
 * Populates the database with common fermentables, hops, and yeast
 */

import { db } from "./index";
import { ingredients } from "./schema";
import { nanoid } from "nanoid";

const ingredientSeedData = [
  // Fermentables
  {
    kind: "fermentable" as const,
    name: "Pale 2-Row",
    origin: "US",
    ppg: 3.0, // Points per kg per L
    colorLovibond: 2,
    description: "Base malt for most beer styles",
  },
  {
    kind: "fermentable" as const,
    name: "Pilsner",
    origin: "Germany",
    ppg: 3.1,
    colorLovibond: 1.5,
    description: "Light base malt for lagers and pilsners",
  },
  {
    kind: "fermentable" as const,
    name: "Munich",
    origin: "Germany",
    ppg: 2.9,
    colorLovibond: 9,
    description: "Malt with rich, toasty flavor",
  },
  {
    kind: "fermentable" as const,
    name: "Crystal 60",
    origin: "UK",
    ppg: 2.7,
    colorLovibond: 60,
    description: "Caramel malt for sweetness and color",
  },
  {
    kind: "fermentable" as const,
    name: "Wheat Malt",
    origin: "Germany",
    ppg: 3.0,
    colorLovibond: 2,
    description: "Wheat malt for head retention and body",
  },
  {
    kind: "fermentable" as const,
    name: "Vienna",
    origin: "Austria",
    ppg: 3.0,
    colorLovibond: 4,
    description: "Light amber malt with toasty notes",
  },
  {
    kind: "fermentable" as const,
    name: "CaraPils",
    origin: "Germany",
    ppg: 2.8,
    colorLovibond: 2,
    description: "Dextrin malt for body and head retention",
  },
  {
    kind: "fermentable" as const,
    name: "Chocolate",
    origin: "UK",
    ppg: 2.4,
    colorLovibond: 350,
    description: "Dark roasted malt for color and chocolate flavor",
  },
  {
    kind: "fermentable" as const,
    name: "Roasted Barley",
    origin: "UK",
    ppg: 2.3,
    colorLovibond: 500,
    description: "Very dark malt for stout character",
  },
  {
    kind: "fermentable" as const,
    name: "Oats (Flaked)",
    origin: "US",
    ppg: 2.8,
    colorLovibond: 1,
    description: "Unmalted oats for smooth mouthfeel",
  },

  // Hops
  {
    kind: "hop" as const,
    name: "Citra",
    origin: "US",
    alphaAcid: 12,
    description: "Tropical fruit, citrus, and passionfruit",
  },
  {
    kind: "hop" as const,
    name: "Mosaic",
    origin: "US",
    alphaAcid: 12,
    description: "Blueberry, tropical fruit, and citrus",
  },
  {
    kind: "hop" as const,
    name: "Cascade",
    origin: "US",
    alphaAcid: 6,
    description: "Floral, spicy, and citrusy",
  },
  {
    kind: "hop" as const,
    name: "Simcoe",
    origin: "US",
    alphaAcid: 13,
    description: "Pine, earth, and citrus",
  },
  {
    kind: "hop" as const,
    name: "Magnum",
    origin: "Germany",
    alphaAcid: 14,
    description: "Clean bittering hop with minimal aroma",
  },
  {
    kind: "hop" as const,
    name: "Amarillo",
    origin: "US",
    alphaAcid: 9,
    description: "Orange, grapefruit, and floral",
  },
  {
    kind: "hop" as const,
    name: "Centennial",
    origin: "US",
    alphaAcid: 10,
    description: "Citrus and floral, similar to Cascade",
  },
  {
    kind: "hop" as const,
    name: "Saaz",
    origin: "Czech Republic",
    alphaAcid: 4,
    description: "Classic noble hop, spicy and herbal",
  },
  {
    kind: "hop" as const,
    name: "Hallertau",
    origin: "Germany",
    alphaAcid: 5,
    description: "Noble hop with floral and spicy notes",
  },

  // Yeast
  {
    kind: "yeast" as const,
    name: "US-05 (Safale)",
    origin: "US",
    attenuationMin: 73,
    attenuationMax: 77,
    description: "Clean American ale yeast",
  },
  {
    kind: "yeast" as const,
    name: "S-04 (Safale)",
    origin: "UK",
    attenuationMin: 75,
    attenuationMax: 79,
    description: "English ale yeast with slight fruitiness",
  },
  {
    kind: "yeast" as const,
    name: "WLP001 (White Labs)",
    origin: "US",
    attenuationMin: 73,
    attenuationMax: 80,
    description: "California Ale yeast, clean and neutral",
  },
  {
    kind: "yeast" as const,
    name: "Kveik (Lallemand)",
    origin: "Norway",
    attenuationMin: 75,
    attenuationMax: 85,
    description: "Norwegian farmhouse yeast, fast fermentation",
  },
  {
    kind: "yeast" as const,
    name: "WLP300 (White Labs)",
    origin: "Germany",
    attenuationMin: 70,
    attenuationMax: 76,
    description: "Hefeweizen yeast with banana and clove",
  },
  {
    kind: "yeast" as const,
    name: "WLP830 (White Labs)",
    origin: "Germany",
    attenuationMin: 74,
    attenuationMax: 79,
    description: "German lager yeast, clean and crisp",
  },
];

async function seedIngredients() {
  console.log("🌱 Seeding ingredients...");

  try {
    // Insert all ingredients
    const ingredientData = ingredientSeedData.map((ingredient) => ({
      id: nanoid(),
      ...ingredient,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await db.insert(ingredients).values(ingredientData);

    console.log(`✅ Successfully seeded ${ingredientData.length} ingredients`);

    // Log summary
    const fermentables = ingredientData.filter(
      (i) => i.kind === "fermentable"
    ).length;
    const hops = ingredientData.filter((i) => i.kind === "hop").length;
    const yeast = ingredientData.filter((i) => i.kind === "yeast").length;

    console.log(`   - ${fermentables} fermentables`);
    console.log(`   - ${hops} hops`);
    console.log(`   - ${yeast} yeast strains`);
  } catch (error) {
    console.error("❌ Error seeding ingredients:", error);
    throw error;
  }
}

// Run the seed function if this file is executed directly
if (require.main === module) {
  seedIngredients()
    .then(() => {
      console.log("🎉 Seeding completed successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Seeding failed:", error);
      process.exit(1);
    });
}

export { seedIngredients };
