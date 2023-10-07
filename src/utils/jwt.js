const jwt = require("jsonwebtoken");

const createAcessToken = (userID, role) => {
  return jwt.sign({ _id: userID, role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

const createRefreshToken = (userID) => {
  return jwt.sign({ _id: userID }, process.env.JWT_SECRET);
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { createAcessToken, createRefreshToken, verifyToken };
