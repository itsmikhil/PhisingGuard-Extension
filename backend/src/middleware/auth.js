const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const extensionToken = req.headers["x-extension-token"];
    const token =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : extensionToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid token.",
    });
  }
};

module.exports = auth;
