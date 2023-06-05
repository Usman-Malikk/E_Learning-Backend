const ErrorHandler = (err, req, res, next) => {
  const message = err.message || "Internal Server Error";
  const Status = err.status || 401;
  res.status(Status).json({
    responseCode: 401,
    status: false,
    message: message,
  });
};

module.exports = ErrorHandler;
