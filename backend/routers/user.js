const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authenticateToken = require("../middlewares/authenticateToken");
const Joi = require("joi");

const refreshTokenSecret = "yourSecretKey";
const refreshTokens = [];

const registerSchema = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[\\W]).{8,}$"))
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain at least one lowercase letter, one uppercase letter, one special character, and be at least 8 characters long.",
      "any.required": "Password is required.",
    }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[\\W]).{8,}$"))
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain at least one lowercase letter, one uppercase letter, one special character, and be at least 8 characters long.",
      "any.required": "Password is required.",
    }),
});

router.post("/register", async (request, response) => {
  const { error, value } = registerSchema.validate(request.body);

  if (error) {
    return response.status(400).json({ error: error.details[0].message });
  } else {
    const { name, email, password } = value;
    try {
      let user = await User.findOne({ email });

      if (user) {
        return response.status(400).json({ message: "User already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      user = new User({ name, email, password: hashedPassword });
      await user.save();

      const payload = {
        userId: user.id,
      };

      jwt.sign(
        payload,
        "yourSecretKey",
        { expiresIn: 3600 },
        (error, token) => {
          if (error) throw error;
          response.status(201).json({ accessToken: token });
        }
      );
    } catch (error) {
      response.status(500).json({ message: "Server Error" });
    }
  }
});

router.post("/login", async (req, res) => {
  const { error, value } = loginSchema.validate(req.body);

  if (error) {
    return response.status(400).json({ error: error.details[0].message });
  } else {
    const { email, password } = value;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      if (!(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const accessToken = jwt.sign({ userId: user.id }, "yourSecretKey", {
        expiresIn: "15m",
      });
      const refreshToken = jwt.sign({ userId: user.id }, "yourSecretKey", {
        expiresIn: "7d",
      });

      refreshTokens.push(refreshToken);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
      });

      res.status(200).json({ accessToken, refreshToken });
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  }
});

router.post("/token", (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken || !refreshTokens.includes(refreshToken)) {
    return res.status(403).json({ message: "Forbidden" });
  }

  jwt.verify(refreshToken, "yourSecretKey", (error, user) => {
    if (error) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const payload = {
      userId: user.userId,
    };
    const accessToken = jwt.sign(payload, "yourSecretKey", {
      expiresIn: "15m",
    });

    res.status(200).json({ accessToken });
  });
});

module.exports = router;
