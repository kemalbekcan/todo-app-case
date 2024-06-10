const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authenticateToken = require("../middlewares/authenticateToken");

const refreshTokenSecret = "yourSecretKey";
const refreshTokens = [];

router.post("/register", async (request, response) => {
  const { name, email, password } = request.body;

  try {
    // Kullanıcının daha önce kayıtlı olup olmadığını kontrol et
    let user = await User.findOne({ email });

    if (user) {
      return response.status(400).json({ message: "User already exists" });
    }

    // Şifreyi hash'le
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Yeni kullanıcı oluştur
    user = new User({ name, email, password: hashedPassword });
    await user.save();

    // JWT oluştur
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      "yourSecretKey", // Güvenli bir şekilde saklanması gereken gizli anahtar
      { expiresIn: 3600 }, // Opsiyonel: Token süresi (örnekte 1 saat)
      (error, token) => {
        if (error) throw error;
        response.status(201).json({ token });
      }
    );
  } catch (error) {
    console.error(error.message);
    response.status(500).json({ message: "Server Error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Kullanıcıyı bul
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Şifreyi kontrol et
    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // JWT oluştur
    const accessToken = jwt.sign({ userId: user.id }, "yourSecretKey", {
      expiresIn: "1m",
    });
    const refreshToken = jwt.sign({ userId: user.id }, "yourSecretKey", {
      expiresIn: "7d",
    });

    refreshTokens.push(refreshToken); // Refresh token'ı sakla

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // HTTPS kullanıyorsanız true yapın
      sameSite: "strict",
    });

    res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

// Refresh token endpoint
router.post("/token", (req, res) => {
  console.log('dsadsadsadsad', req.cookies.refreshToken)
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken || !refreshTokens.includes(refreshToken)) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  jwt.verify(refreshToken, 'yourSecretKey', (error, user) => {
    if (error) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    console.log('dsada', user)

    const payload = { 
      user: { 
        id: user.userId 
      } 
    };
    const accessToken = jwt.sign(payload, 'yourSecretKey', {
      expiresIn: '15m',
    });

    res.status(200).json({ accessToken });
  });
});

module.exports = router;
