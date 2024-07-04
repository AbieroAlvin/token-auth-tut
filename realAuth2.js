// in a more realistic scenario, you may want to implement user roles and permissions to control access to different parts of your application.

import express from "express";
import jsonwebtoken from "jsonwebtoken";

const app = express();
const jwt = jsonwebtoken();

// secret key for jwt
const secretKey = process.env.JWT_SECRET;

// MOCK user data with roles
const users = [
  { id: 1, username: "john", password: "password123", role: "admin" },
  { id: 2, username: "jane", password: "secret456", role: "user" },
];

// Login route
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid Credentials" });
  }

  // generate JWT token with user role
  const token = jwt.sign({ userId: user.id, role: user.role }, secretKey);

  res.json({ token });
});

// Protected admin route
app.get("/admin", (req, res) => {
  const token = req.headers.authorization?.split("")[1];

  if (!token) {
    return res.status(401).json({ message: "Missing token" });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    const userId = decoded.userId;
    const role = decoded.role;

    if (role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Access grantend for admin users
    res.json({ message: `Access granted to admin user with ID ${userId}` });
  } catch (error) {
    res.status(403).json({ message: "Invalid Token" });
  }
});

// Protected user route
app.get("/user", (req, res) => {
  const token = req.headers.authorization?.split("")[1];

  if (!token) {
    return res.status(401).json({ message: "Missing token" });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    const userId = decoded.userId;
    const role = decoded.role;

    if (role !== "user" && role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Access granted for regular users and admins
    res.json({ message: `Access granted to users with ID ${userId}` });
  } catch (error) {
    res.status(403).json({ message: "Invalid Token" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
