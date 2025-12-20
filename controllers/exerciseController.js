const Exercise = require("../models/Exercise");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
  extractPublicId,
} = require("../utils/cloudinaryUpload");

// Get all exercises
exports.getAllExercises = async (req, res) => {
  try {
    const exercises = await Exercise.find().sort({ name: 1 });
    res.status(200).json({
      success: true,
      count: exercises.length,
      data: exercises,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get single exercise by ID
exports.getExerciseById = async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);

    if (!exercise) {
      return res.status(404).json({
        success: false,
        error: "Exercise not found",
      });
    }

    res.status(200).json({
      success: true,
      data: exercise,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Create exercise
exports.createExercise = async (req, res) => {
  try {

    let imageUrl = "";

    if (req.file) {
      const uploadResult = await uploadToCloudinary(
        req.file.buffer,
        "exercises",
        `exercise-${Date.now()}`
      );
      imageUrl = uploadResult.secure_url;
    }

    const parseArrayField = (field) => {
      if (!field) return [];
      try {
        const parsed = JSON.parse(field);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return field
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean);
      }
    };

    const exerciseData = {
      ...req.body,
      imageUrl,
      muscleGroups: parseArrayField(req.body.muscleGroups),
      equipment: parseArrayField(req.body.equipment),
      instructions: parseArrayField(req.body.instructions),
      caloriesPerMinute: isNaN(parseInt(req.body.caloriesPerMinute))
        ? 0
        : parseInt(req.body.caloriesPerMinute),
    };

    const exercise = await Exercise.create(exerciseData);

    res.status(201).json({
      success: true,
      data: exercise,
    });
  } catch (error) {
    console.error("CREATE ERROR:", error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};


// Update exercise
exports.updateExercise = async (req, res) => {
  try {
    // Get existing exercise to check for old image
    const existingExercise = await Exercise.findById(req.params.id);

    if (!existingExercise) {
      return res.status(404).json({
        success: false,
        error: "Exercise not found",
      });
    }

    let imageUrl = existingExercise.imageUrl;

    // Upload new image to Cloudinary if file is provided
    if (req.file) {
      try {
        // Delete old image from Cloudinary if it exists
        if (existingExercise.imageUrl) {
          const oldPublicId = extractPublicId(existingExercise.imageUrl);
          if (oldPublicId) {
            try {
              await deleteFromCloudinary(oldPublicId);
            } catch (deleteError) {
              console.error("Error deleting old image:", deleteError);
              // Continue even if deletion fails
            }
          }
        }

        // Upload new image
        const uploadResult = await uploadToCloudinary(
          req.file.buffer,
          "exercises",
          `exercise-${Date.now()}`
        );
        imageUrl = uploadResult.secure_url;
      } catch (uploadError) {
        return res.status(400).json({
          success: false,
          error: `Image upload failed: ${uploadError.message}`,
        });
      }
    }

    // Prepare update data
    const updateData = {
      ...req.body,
      imageUrl: req.body.imageUrl || imageUrl,
    };

    // Parse JSON fields if they're strings (from form-data)
    if (typeof updateData.muscleGroups === "string") {
      try {
        updateData.muscleGroups = JSON.parse(updateData.muscleGroups);
      } catch (e) {
        updateData.muscleGroups = updateData.muscleGroups
          .split(",")
          .map((item) => item.trim());
      }
    }

    if (typeof updateData.equipment === "string") {
      try {
        updateData.equipment = JSON.parse(updateData.equipment);
      } catch (e) {
        updateData.equipment = updateData.equipment
          .split(",")
          .map((item) => item.trim());
      }
    }

    if (typeof updateData.instructions === "string") {
      try {
        updateData.instructions = JSON.parse(updateData.instructions);
      } catch (e) {
        updateData.instructions = updateData.instructions
          .split(",")
          .map((item) => item.trim());
      }
    }

    if (
      updateData.caloriesPerMinute &&
      typeof updateData.caloriesPerMinute === "string"
    ) {
      updateData.caloriesPerMinute = parseInt(updateData.caloriesPerMinute);
    }

    const exercise = await Exercise.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      data: exercise,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Delete exercise
exports.deleteExercise = async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);

    if (!exercise) {
      return res.status(404).json({
        success: false,
        error: "Exercise not found",
      });
    }

    // Delete image from Cloudinary if it exists
    if (exercise.imageUrl) {
      const publicId = extractPublicId(exercise.imageUrl);
      if (publicId) {
        try {
          await deleteFromCloudinary(publicId);
        } catch (deleteError) {
          console.error("Error deleting image from Cloudinary:", deleteError);
          // Continue with exercise deletion even if image deletion fails
        }
      }
    }

    // Delete exercise from database
    await Exercise.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
