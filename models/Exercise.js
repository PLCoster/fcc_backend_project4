const mongoose = require('mongoose');

// Schema for Exercise performed by User
const exerciseSchema = new mongoose.Schema({
  user_id: String,
  description: String,
  duration: Number,
  date: Date,
  createdAt: { type: Date, expires: 86400, default: Date.now }, // Auto Expire document after 1 day
});

const Exercise = mongoose.model('exercise', exerciseSchema);

module.exports = Exercise;
