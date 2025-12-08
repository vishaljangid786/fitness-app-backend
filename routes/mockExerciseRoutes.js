const express = require("express");
const router = express.Router();
const {
  getAllExercises,
  getExerciseById,
} = require("../controllers/mockExerciseController");

router.route("/").get(getAllExercises);

router.route("/:id").get(getExerciseById);

module.exports = router;
