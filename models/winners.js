const mongoose = require("mongoose");

// Define the schema for the winners collection
const winnerSchema = new mongoose.Schema({
  gameName: {
    type: String,
    required: true,
  },
  winner: {
    type: String,
    required: true,
  },
  otherPlayer: {
    type: String,
    required: true,
  },
  timeWhenPlayed: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

// Create the Winners model
const winners = mongoose.model("winners", winnerSchema);

module.exports = winners;
