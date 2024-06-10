const jwt = require("jsonwebtoken");
const accessTokenSecret = "yourSecretKey";

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  console.log('tokennn', token)

  if (!token) {
    return res.sendStatus(401); // Unauthorized
  }

  jwt.verify(token, accessTokenSecret, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" }); // Forbidden
    }

    req.user = user;
    next();
  });
};

module.exports = authenticateToken;