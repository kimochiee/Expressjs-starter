require("dotenv").config();
const mongoose = require("mongoose");

module.exports = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(console.log("Connect db successfully"))
    .catch((err) => console.error(err));
};
