const mongoose = require("mongoose");
const Exercise = require("../models/Exercise");
const exercises = require("../data/seedExercises");
require("dotenv").config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/fitness-app";

async function seedExercises() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");

    // Clear existing exercises (optional - comment out if you want to keep existing data)
    await Exercise.deleteMany({});
    console.log("🗑️  Cleared existing exercises");

    // Insert seed exercises
    const insertedExercises = await Exercise.insertMany(exercises);
    console.log(`✅ Successfully seeded ${insertedExercises.length} exercises`);

    // Display some sample exercises
    console.log("\n📋 Sample exercises:");
    insertedExercises.slice(0, 5).forEach((exercise) => {
      console.log(`  - ${exercise.name} (${exercise.category})`);
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding exercises:", error);
    process.exit(1);
  }
}

seedExercises();
