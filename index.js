require("dotenv").config();
const app = require("./src/app");

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("Unhandled Rejection, Server shutting down...");

  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("Uncaught Exception, Server shutting down...");

  process.exit(1);
});

const port = 8000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
