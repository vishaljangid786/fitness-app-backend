const express = require("express");
const {
  getWorkouts,
  getWorkoutById,
  createWorkout,
  deleteWorkout,
} = require("../controllers/workoutController");

const router = express.Router();

router.route("/").get(getWorkouts).post(createWorkout);
router.route("/:id").get(getWorkoutById).delete(deleteWorkout);

module.exports = router;
