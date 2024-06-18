import mongoose from "mongoose";

const dbURI =
  "mongodb+srv://Faith:Faith@2024@cluster0.6xayqw7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

export default mongoose;
