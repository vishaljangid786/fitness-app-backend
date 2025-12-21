const Workout = require("../models/Workout");

// Fetch all workouts (newest first)
exports.getWorkouts = async (_req, res) => {
  try {
    const workouts = await Workout.find().sort({ dateTime: -1, createdAt: -1 });
    res
      .status(200)
      .json({ success: true, count: workouts.length, data: workouts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Fetch a single workout by id
exports.getWorkoutById = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout) {
      return res
        .status(404)
        .json({ success: false, error: "Workout not found" });
    }
    res.status(200).json({ success: true, data: workout });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getWorkoutByUserId = async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.params.id });
    res.status(200).json({ success: true, data: workouts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


// Create a workout
exports.createWorkout = async (req, res) => {
  try {
    const { dateTime, duration, notes, exercises, userId } = req.body;

    if (!Array.isArray(exercises) || exercises.length === 0) {
      return res
        .status(400)
        .json({ success: false, error: "At least one exercise is required" });
    }

    // basic normalization
    const normalizedExercises = exercises.map((ex) => ({
      exerciseId: ex.exerciseId || ex._id || undefined,
      name: ex.name,
      sets: Array.isArray(ex.sets)
        ? ex.sets.map((s) => ({
            reps: Number(s.reps) || 0,
            weight: Number(s.weight) || 0,
            weightUnit: s.weightUnit === "lbs" ? "lbs" : "kg",
          }))
        : [],
    }));

    const workout = await Workout.create({
      dateTime: dateTime ? new Date(dateTime) : new Date(),
      duration: Number(duration) || 0,
      notes: notes || "",
      exercises: normalizedExercises,
      userId:userId || ""
    });

    res.status(201).json({ success: true, data: workout });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Delete a workout
exports.deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout) {
      return res
        .status(404)
        .json({ success: false, error: "Workout not found" });
    }
    await Workout.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
