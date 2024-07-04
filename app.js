import mainRoutes from "./routes/mainRoutes";
import protectedRoute from "./routes/protectedRoute";
import mongoose from "./config/db";
import express from "express";
const app = express();

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use(express.json());
app.use("/auth", mainRoutes);
app.use("/protected", protectedRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
