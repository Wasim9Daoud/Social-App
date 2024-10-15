// NotFound ERROR
const notFound = (req, res, next) => {
    const error = new Error(`not found - ${req.originalUrl}`);
    res.status(404);
    next(error);
  };
  
  // ErrorHandler
  const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : statusCode;
    res.status(statusCode).json({
      message: err.message,
      stake: process.env.NODE_ENV === "production" ? null : err.stake,
    });
  };
  
  module.exports = { errorHandler, notFound };
  