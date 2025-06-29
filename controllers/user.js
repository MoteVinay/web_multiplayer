const User = require("../models/users");
const Winners = require("../models/winners");
const { setUser } = require("../service/auth");
const bcrypt = require("bcrypt");

async function handleUserSignup(req, res) {
  const { name, displayname, email, password } = req.body;
  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log(name);

  // Create a new user document
  const newUser = new User({
    userName: name,
    displayName: displayname,
    email: email,
    password: hashedPassword,
  });
  console.log(newUser);
  try {
    // Save the user document to the database
    const savedUser = await newUser.save();
    console.log("User saved successfully:", savedUser);
    res.redirect("/");
  } catch (error) {
    console.error("Error saving user:", error.message);
    res.status(500).send(error.message);
  }
}

async function handleUserLogin(req, res) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      console.log("User not found");
      return res.sendStatus(404);
    }

    // Compare provided password with hashed password from the database
    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log(user._id);
    if (passwordMatch) {
      console.log("Login successful");

      const token = setUser(user);
      res.cookie("cookie", token, {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });
      console.log(user);
      res.redirect("/user/dashboard");
    } else {
      console.log("Incorrect password");
      return res.sendStatus(401);
    }
  } catch (error) {
    console.error("Error logging in:", error);
    res.sendStatus(500);
  }
}

async function handleUserUpdate(req, res) {
  console.log(req.body);
  if (req.body.password[0] == req.body.password[1]) {
    const pastUser = await getUser(req.userID);
    try {
      const user = await User.findOneAndUpdate(
        { displayName: pastUser.displayName }, // Criteria to find the user to update
        { userName: req.body.userName }, // New data to update
        { new: true } // Option to return the updated document
      );
      console.log("Updated user:", user);
      res.redirect("/user/profile");
    } catch (err) {
      console.error("Error updating user:", err);
      res.sendStatus(500); // Internal Server Error
    }
  } else {
    res.sendStatus(509); // Custom status code indicating password mismatch
  }
}

async function findGamesByPlayer(playerName) {
  try {
    const games = await Winners.find({
      $or: [{ winner: playerName }, { otherPlayer: playerName }],
    });
    console.log(games[0]);
    return games;
  } catch (error) {
    console.error("Error fetching games:", error);
    throw error;
  }
}

async function getUser(userId) {
  try {
    const user = await User.findOne({ _id: userId });
    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
}

async function verifyPassword(req, res, next) {
  const user = await getUser(req.userID);
  req.user = user;
  const passwordMatch = await bcrypt.compare(req.body.password, user.password);
  if (passwordMatch) {
    next();
  } else {
    res.status(403).send("password Error");
  }
}

async function handleUpdateProfile(req, res) {
  try {
    if (!req.file) {
      throw new Error("No file uploaded");
    }

    // Assuming `User` is your Mongoose model for users
    const user = await User.findOne({ displayName: req.user.displayName });

    user.profilePhoto = req.file.filename;
    const updated = await user.save();

    if (!user) {
      throw new Error("User not found");
    }

    console.log("Updated user:", updated);
    res.redirect("/user/profile");
  } catch (err) {
    console.error("Error updating user:", err);
    res.sendStatus(500); // Internal Server Error
  }
}

module.exports = {
  handleUserSignup,
  handleUserLogin,
  handleUserUpdate,
  handleUpdateProfile,
  verifyPassword,
  findGamesByPlayer,
  getUser,
};
