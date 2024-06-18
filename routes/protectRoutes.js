const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Secret key for JWT (should be properly managed)
const accessTokenSecret = "your-access-token-secret";

router.get("/protect", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Missing authorization header" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Missing token" });
  }

  try {
    const decoded = jwt.verify(token, accessTokenSecret);
    const userId = decoded.userId;

    // Access granted, perform authorized operations
    res.json({ message: `Access granted to user with ID ${userId}` });
  } catch (error) {
    res.status(403).json({ message: "Invalid token" });
  }
});

module.exports = router;
