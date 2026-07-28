const express = require("express");

const router = express.Router();

const { register, login, getMe } = require("../controllers/auth.controller");
const auth = require("../middleware/auth");
const validateRequest = require("../middleware/validateRequest");
const asyncHandler = require("../utils/asyncHandler");
const { rateLimitMiddleware } = require("../middleware/rateLimiter");

router.post(
  "/register",
  rateLimitMiddleware("register"),
  validateRequest({
    name: { required: true },
    email: { required: true, type: "email" },
    password: { required: true, minLength: 6 },
  }),
  asyncHandler(register),
);

router.post(
  "/login",
  rateLimitMiddleware("login"),
  validateRequest({
    email: { required: true, type: "email" },
    password: { required: true },
  }),
  asyncHandler(login),
);

router.get("/me", auth, asyncHandler(getMe));

module.exports = router;
