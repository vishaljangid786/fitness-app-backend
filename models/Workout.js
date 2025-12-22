const mongoose = require("mongoose");

const workoutSetSchema = new mongoose.Schema(
  {
    reps: { type: Number, required: true, min: 0 },
    weight: { type: Number, default: 0, min: 0 },
    weightUnit: { type: String, enum: ["kg", "lbs"], default: "kg" },
  },
  { _id: false }
);

const workoutExerciseSchema = new mongoose.Schema(
  {
    exerciseId: { type: mongoose.Schema.Types.ObjectId, ref: "Exercise" },
    name: { type: String, required: true, trim: true },
    sets: { type: [workoutSetSchema], default: [] },
  },
  { _id: false }
);

const workoutSchema = new mongoose.Schema(
  {
    userId:{
      type:String,
    },
    dateTime: { type: Date, default: Date.now },
    duration: { type: Number, default: 0 }, // seconds
    notes: { type: String, default: "" },
    exercises: { type: [workoutExerciseSchema], default: [] },
    likedBy: { type: [String], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Workout", workoutSchema);
