const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes - Use mock data if USE_MOCK_DATA is true, otherwise use MongoDB
const USE_MOCK_DATA = process.env.USE_MOCK_DATA === "true";

if (USE_MOCK_DATA) {
  // Use mock data (no MongoDB required)
  const mockExerciseRoutes = require("./routes/mockExerciseRoutes");
  const mockWorkoutRoutes = require("./routes/mockWorkoutRoutes");
  app.use("/api/exercises", mockExerciseRoutes);
  app.use("/api/workouts", mockWorkoutRoutes);
  console.log("📦 Using MOCK DATA mode (no MongoDB required)");
} else {
  // Use MongoDB
  const exerciseRoutes = require("./routes/exerciseRoutes");
  const workoutRoutes = require("./routes/workoutRoutes");
  app.use("/api/exercises", exerciseRoutes);
  app.use("/api/workouts", workoutRoutes);
  console.log("🗄️  Using MONGODB mode");
}

// Health check route
app.get("/", (req, res) => {
  res.json({ message: "Fitness Backend API is running!" });
});

// MongoDB connection (only if not using mock data)
if (!USE_MOCK_DATA) {
  const MONGODB_URI = process.env.MONGODB_URI;

  mongoose
    .connect(MONGODB_URI)
    .then(() => {
      console.log("✅ Connected to MongoDB");
    })
    .catch((error) => {
      console.error("❌ MongoDB connection error:", error);
    });
}

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(
    `📡 Exercise API available at http://localhost:${PORT}/api/exercises`
  );
  console.log(
    `📡 Workout API available at http://localhost:${PORT}/api/workouts`
  );
});
