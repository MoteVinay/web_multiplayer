const mongoose = require("mongoose");

// Define schema
const gameSchema = new mongoose.Schema({
  friends: {
    type: [{ type: String }],
    required: true,
  },
  game: { type: String, required: true },
  date: { type: Date, required: true },
});

// Create model
const game = mongoose.model("game", gameSchema);

module.exports = game;
