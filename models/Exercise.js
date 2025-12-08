  const mongoose = require('mongoose');

  const exerciseSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    category: {
      type: String,
      enum: ['Strength', 'Cardio', 'Flexibility', 'Balance', 'Sports'],
      default: 'Strength'
    },
    muscleGroups: {
      type: [String],
      default: []
    },
    equipment: {
      type: [String],
      default: []
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner'
    },
    instructions: {
      type: [String],
      default: []
    },
    imageUrl: {
      type: String,
      default: ''
    },
    videoUrl: {
      type: String,
      default: ''
    },
    caloriesPerMinute: {
      type: Number,
      default: 0
    }
  }, {
    timestamps: true
  });

  module.exports = mongoose.model('Exercise', exerciseSchema);

