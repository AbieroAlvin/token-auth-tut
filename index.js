import express from "express";
import mongoose from "mongoose";
import jsonwebtoken from "jsonwebtoken";
const app = express();
const jwt = jsonwebtoken();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
