const express = require("express");
const User = require("./models/user.js");
const connectDb = require("./config/database");
const app = express();


const cookieParser = require("cookie-parser");
var jwt = require("jsonwebtoken");
const authRouter = require('./routes/auth.js');
const connectionRouter = require('./routes/connection.js');
const profileRouter = require('./routes/profile.js');

app.use(express.json());
app.use(cookieParser());


app.use("/", authRouter);
app.use("/", connectionRouter);
app.use("/", profileRouter);






// Connect to the database and start the server
connectDb()
  .then(() => {
    console.log("Successfully connected to the database");
    app.listen(7777, () => {
      console.log("Server is running on port 7777");
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database:", err);
  });
