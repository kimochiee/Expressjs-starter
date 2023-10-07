const CustomError = require("../utils/customError");

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new CustomError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = Object.keys(err.keyValue)[0];

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new CustomError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join(". ")}`;
  return new CustomError(message, 400);
};

module.exports = (err, req, res, next) => {
  console.log(err);
  let error = { ...err };
  error.statusCode = err.statusCode || 500;
  error.message = err.message || "Something went wrong, please try again later";

  if (err.name === "CastError") {
    error = handleCastErrorDB(err);
  }

  if (err.code === 11000) {
    error = handleDuplicateFieldsDB(err);
  }

  if (err.name === "ValidationError") {
    error = handleValidationErrorDB(err);
  }

  return res.status(error.statusCode).json({ msg: error.message });
};
