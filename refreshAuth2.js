// In more complex real-world applications, you may want to implement additional security measures, such as refresh tokens and token revocation. Refresh tokens allow users to obtain new access tokens without re-authenticating, while token revocation enables you to invalidate tokens, for example, upon user logout or in case of a security breach.

import express from "express";
import jsonwebtoken from "jsonwebtoken";
const jwt = jsonwebtoken();

const app = express();

// Secret keys for JWT (should be properly managed)
const accessTokenSecret = "your-access-token-secret";
const refreshTokenSecret = "your-refresh-token-secret";

// Mock user data with refresh tokens
const users = [
  {
    id: 1,
    username: "john",
    password: "password123",
    role: "admin",
    refreshToken: null,
  },
  {
    id: 2,
    username: "jane",
    password: "secret456",
    role: "user",
    refreshToken: null,
  },
];

//Login route
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid Credentials" });
  }

  // Generate access token
  const accessToken = jwt.sign(
    { userId: user.id, role: user.role },
    accessTokenSecret,
    { expiresIn: "15m" }
  );

  // generate refresh token
  const refreshToken = jwt.sign({ userId: user.id }, refreshTokenSecret, {
    expiresIn: "7d",
  });

  // Store the refresh token for the user
  user.refreshToken = refreshToken;

  res.json({ accessToken, refreshToken });
});

// Refresh token route
app.post("refresh", (req, res) => {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "Missing refresh token" });
  }

  // verify the refresh token
  try {
    const decoded = jwt.verify(refreshToken, refreshTokenSecret);
    const userId = decoded.userId;
    const user = users.find(
      (u) => u.id === userId && u.refreshToken === refreshToken
    );

    if (!user) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    // Generate a new access token
    const accessToken = jwt.sign(
      { userId: user.id, role: user.role },
      accessTokenSecret,
      { expiresIn: "15m" }
    );

    res.json({ accessToken });
  } catch (error) {
    res.status(403).json({ message: "Invalid refresh token" });
  }
});

// Logout route
app.post("/logout", (req, res) => {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "Missing refresh token" });
  }

  // Invalidate the refresh token
  const user = users.find((u) => u.refreshToken === refreshToken);

  if (!user) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }

  // Revoke the refresh token
  user.refreshToken = null;

  res.json({ message: "Logout successful" });
});

// Protected Route
app.get("/protected", (req, res) => {
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
    const role = decoded.role;

    // Access granted, perform authorized operations
    res.json({ message: `Access granted to user with ID ${userId}` });
  } catch (error) {
    res.status(403).json({ message: "Invalid token" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
