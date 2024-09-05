import express, { json, urlencoded } from "express";
import { config } from "dotenv";
import cors from "cors";
import { set, connect } from "mongoose";
import UserRoutes from "./controllers/Event.js";

config();

const app = express();
app.use(cors());
app.use(json({ limit: "50mb" }));
app.use(urlencoded({ extended: true }));

app.use("/api/admin/", UserRoutes);

// error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  return res.status(status).json({
    success: false,
    status,
    message,
  });
});

app.get("/", async (req, res) => {
  res.status(200).json({
    message: "Hello developers",
  });
});

const connectDB = () => {
  set("strictQuery", true);
  connect(process.env.MONGODB_URL)
    .then(() => console.log("Connected to Mongo DB"))
    .catch((err) => {
      console.error("failed to connect with mongo");
      console.error(err);
    });
};

const startServer = async () => {
  try {
    connectDB();
    app.listen(8080, () => console.log("Server started on port 8080"));
  } catch (error) {
    console.log(error);
  }
};

startServer();
