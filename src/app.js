const express = require("express");
const app = express();

const connectDB = require("./config/connectDB");
const initMiddlewares = require("./config/initMiddlewares");
const swaggerDocs = require("./config/swagger");

const initRouter = require("./routes/index");

connectDB();
initMiddlewares(app);

app.use("/api/v1", initRouter);
swaggerDocs(app, 8000);

module.exports = app;
