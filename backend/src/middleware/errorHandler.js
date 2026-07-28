const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || 500;
  const isProduction = process.env.NODE_ENV === "production";

  const response = {
    success: false,
    message:
      statusCode === 500
        ? "Internal Server Error"
        : err.message || "Request failed",
  };

  if (!isProduction && err.stack) {
    response.stack = err.stack;
  }

  return res.status(statusCode).json(response);
};

module.exports = errorHandler;
