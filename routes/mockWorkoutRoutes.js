const express = require("express");
const router = express.Router();

let workouts = [];

router.get("/", (_req, res) => {
  res.json({ success: true, count: workouts.length, data: workouts });
});

router.get("/:id", (req, res) => {
  const workout = workouts.find((w) => w._id === req.params.id);
  if (!workout) {
    return res.status(404).json({ success: false, error: "Workout not found" });
  }
  res.json({ success: true, data: workout });
});

router.post("/", (req, res) => {
  const { dateTime, duration, exercises = [], notes = "" } = req.body || {};
  if (!Array.isArray(exercises) || exercises.length === 0) {
    return res
      .status(400)
      .json({ success: false, error: "At least one exercise is required" });
  }

  const newWorkout = {
    _id: `mock-${Date.now()}`,
    dateTime: dateTime || new Date().toISOString(),
    duration: Number(duration) || 0,
    notes,
    exercises: exercises.map((ex, idx) => ({
      _id: ex._id || `mock-ex-${idx}-${Date.now()}`,
      name: ex.name,
      sets:
        ex.sets?.map((s) => ({
          reps: Number(s.reps) || 0,
          weight: Number(s.weight) || 0,
          weightUnit: s.weightUnit === "lbs" ? "lbs" : "kg",
        })) || [],
    })),
  };

  workouts = [newWorkout, ...workouts];
  res.status(201).json({ success: true, data: newWorkout });
});

router.delete("/:id", (req, res) => {
  const before = workouts.length;
  workouts = workouts.filter((w) => w._id !== req.params.id);
  if (before === workouts.length) {
    return res.status(404).json({ success: false, error: "Workout not found" });
  }
  res.json({ success: true, data: {} });
});

module.exports = router;
