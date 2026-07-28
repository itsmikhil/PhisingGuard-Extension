const rateLimitMap = new Map();

const getWindowKey = (key, windowMs) =>
  `${key}:${Math.floor(Date.now() / windowMs)}`;

const rateLimitMiddleware = (scope) => (req, res, next) => {
  const windowMs = 15 * 60 * 1000;
  const maxRequests = 100;
  const ip = req.ip || req.headers["x-forwarded-for"] || "unknown";
  const key = `${scope}:${ip}`;
  const windowKey = getWindowKey(key, windowMs);

  const current = rateLimitMap.get(windowKey) || { count: 0 };

  if (current.count >= maxRequests) {
    return res.status(429).json({
      success: false,
      message: "Too many requests. Please try again later.",
    });
  }

  current.count += 1;
  rateLimitMap.set(windowKey, current);
  next();
};

module.exports = {
  rateLimitMiddleware,
};
