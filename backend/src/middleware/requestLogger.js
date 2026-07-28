const requestLogger = (req, res, next) => {
  const userId = req.user && req.user.id ? req.user.id : "anonymous";
  const timestamp = new Date().toISOString();
  const endpoint = `${req.method} ${req.originalUrl || req.url}`;

  console.log(
    `[extension-request] ${timestamp} user=${userId} endpoint=${endpoint}`,
  );
  next();
};

module.exports = requestLogger;
