const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const {
  getAllExercises,
  getExerciseById,
  createExercise,
  updateExercise,
  deleteExercise,
} = require("../controllers/exerciseController");

router
  .route("/")
  .get(getAllExercises)
  .post(upload.single("image"), createExercise);

router
  .route("/:id")
  .get(getExerciseById)
  .put(upload.single("image"), updateExercise)
  .delete(deleteExercise);

module.exports = router;
