const express = require("express");
const {
  getWorkouts,
  getWorkoutById,
  createWorkout,
  deleteWorkout,
  getWorkoutByUserId,
} = require("../controllers/workoutController");

const router = express.Router();

router.route("/").get(getWorkouts).post(createWorkout);
router.route("/:id").get(getWorkoutById).delete(deleteWorkout);
router.route("/user/:id").get(getWorkoutByUserId);
module.exports = router;
