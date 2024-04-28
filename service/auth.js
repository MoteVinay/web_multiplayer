const jwt = require("jsonwebtoken");
const secret = "m.v_k@7210";

function setUser(user) {
  const payload = {
    ...user,
  };
  return jwt.sign(payload, secret);
}

function getUser(token) {
  if (!tocken) return null;
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
}

module.exports = {
  setUser,
  getUser,
};
