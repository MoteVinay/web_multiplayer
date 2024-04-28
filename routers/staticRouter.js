const express = require("express");
const router = express.Router();

router.get("/", function (req, res) {
  try {
    if (req.cookies.cookie) {
      res.clearCookie("cookie");
      console.log("Logout Successful");
    }
    res.render("home.ejs");
  } catch (error) {
    console.error("Error while clearing cookie:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/login", function (req, res) {
  try {
    if (req.cookies.cookie) {
      res.clearCookie("cookie");
      console.log("Logout Successful");
    }
    res.render("login.ejs");
  } catch (error) {
    console.error("Error while clearing cookie:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
