const express = require("express");
const mongoose = require("mongoose");
const app = express();
const authRouter = require("./routes/auth");
const userRouter = require("./routes/users");
const moviesRouter = require("./routes/movies");
const listrRouter = require("./routes/list");
const dotenv = require("dotenv");

dotenv.config();

app.use(express.json());

// routes

// connect to database
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("ASdfsadf");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/movies", userRouter);
app.use("/api/lists", listrRouter);

app.listen(3003, () => {
  console.log("hithere");
});
