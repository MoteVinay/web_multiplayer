const express = require("express");
const path = require("path");
const { findFriendsByPlayer } = require("../controllers/games");
const { restrictToLogedInUserOnly } = require("../middleware/auth");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Specify the directory where files will be stored
    return cb(null, path.join(__dirname, "../public/assets/images/profiles"));
  },
  filename: function (req, file, cb) {
    // Specify how files should be named
    return cb(null, `${Date.now()}-${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage: storage });
const router = express.Router();

const {
  handleUserSignup,
  handleUserLogin,
  handleUserUpdate,
  findGamesByPlayer,
  verifyPassword,
  handleUpdateProfile,
  getUser,
} = require("../controllers/user");

router.post("/signup", handleUserSignup);
router.post("/login", handleUserLogin);
router.post("/updateDetails", restrictToLogedInUserOnly, handleUserUpdate);
router.post(
  "/updateProfile",
  restrictToLogedInUserOnly,
  upload.single("profilepic"),
  verifyPassword,
  handleUpdateProfile
);

router.get("/dashboard", restrictToLogedInUserOnly, async function (req, res) {
  const user = req.user;

  res.render("dashboard", { user });
});

router.get("/profile", restrictToLogedInUserOnly, async function (req, res) {
  console.log("atRouter", req.userID);
  const user = await getUser(req.userID);
  console.log(user);
  const games = await findGamesByPlayer(user.userName);
  console.log("game ", games[0]);
  let totalGames = 0;
  let gamesWon = 0;

  // Check if the player is either the winner or loser
  for (var i = 0; i < games.length; i++) {
    if (
      games[i].winner === user.userName ||
      games[i].otherPlayer === user.userName
    ) {
      totalGames++;

      // If the player is the winner, increase gamesWon by 1
      if (games[i].winner === user.userName) {
        gamesWon++;
      }
    }
  }

  res.render("profile", { user, totalGames, gamesWon });
});

router.get("/status", restrictToLogedInUserOnly, async function (req, res) {
  const user = await getUser(req.userID);
  console.log(user);
  const game = await findGamesByPlayer(user.userName);
  const friends = await findFriendsByPlayer(user.userName);
  console.log(game);
  res.render("status", { user, game, friends });
});

router.get("/tictactoe", restrictToLogedInUserOnly, async function (req, res) {
  const user = await getUser(req.userID);
  res.render("tictactoe", { user });
});

router.get("/pingpong", restrictToLogedInUserOnly, async function (req, res) {
  const user = await getUser(req.userID);
  res.render("pingpong", { user });
});

module.exports = router;
