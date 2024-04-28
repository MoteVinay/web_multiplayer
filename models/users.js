const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  displayName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePhoto: { type: String, default: "profile.png" }, // Add profile photo field with default value
});

const User = mongoose.model("users", userSchema);

module.exports = User;
