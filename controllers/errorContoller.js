const AppError = require('./../utils/AppError');

const handleValidationError = (error) => {
  const errors = Object.values(error.errors).map((err) => {
    return err.message;
  });
  const message = `Invalid input data: ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleDuplicationError = (error) => {
  const value = error.errmsg.match(/(["'])(\\?.)*?\1/)[0];

  const message = `Duplicate field value: ${value}.Please use another value.`;
  return new AppError(message, 400);
};
const handleCastErrorDB = (error) => {
  const message = `Invalid ${error.path}: ${error.value}.`;
  return new AppError(message, 400);
};
const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again.', 401);

const sendResponse = (err, res) => {
  if (err && err.isOperational) {
    return res
      .status(err.statusCode)
      .json({ message: err.message, statusCode: err.statusCode });
  } else {
    return res
      .status(500)
      .json({ message: 'Something went wrong!!!! Please try again later.' });
  }
};

module.exports = function (error, req, res, next) {
  let err = { ...error };
  err.message = error.message;
  err.statusCode = error.statusCode;
  if (error.name === 'ValidationError') err = handleValidationError(error);

  if (error.code === 11000) err = handleDuplicationError(error);

  if (error.name === 'CastError') err = handleCastErrorDB(error);

  if (error.name === 'JsonWebTokenError') err = handleJWTError();
  if (error.name === 'TokenExpiredError') err = handleJWTExpiredError();

  sendResponse(err, res);
};
