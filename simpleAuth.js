import express from "express";
import mongoose from "mongoose";
import jsonwebtoken from "jsonwebtoken";
const app = express();
const jwt = jsonwebtoken();

// Secret key for JWT (should be kept secret and properly managed)
const secretKey = "your-secret-key";

// Mock user data
const users = [
  { id: 1, username: "john", password: "password123" },
  { id: 2, username: "jane", password: "secret456" },
];

// Login route
app.post("login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Inavalid Credentials" });
  }

  // Generate JWT token
  const token = jwt.sign({ userId: user.id }, secretKey);

  res.json({ token });
});

// Protected route
app.get("/protected", (req, res) => {
  const token = req.headers.authorization?.split("")[1];

  if (!token) {
    return res.status(401).json({ message: "Missing token" });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    const userId = decoded.userId;

    // Access granted, perform authorized operations
    res.json({ message: `Access granted to user with ID ${userId}` });
  } catch (error) {
    res.status(403).json({ message: "Invalid Token" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
