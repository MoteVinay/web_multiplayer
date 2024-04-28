const jwt = require("jsonwebtoken");
const secret = "m.v_k@7210";

async function restrictToLogedInUserOnly(req, res, next) {
  // const userUid = req.cookies?.cookie;
  const token = req.cookies.cookie;

  jwt.verify(token, secret, (err, decodedToken) => {
    if (err) {
      console.log("Invalid token");
      res.redirect("/");
    } else {
      const userId = decodedToken._doc._id;
      req.userID = userId;
      next();
    }
  });
}
module.exports = {
  restrictToLogedInUserOnly,
};
