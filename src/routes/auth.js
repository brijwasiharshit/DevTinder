const express = require("express");
const { isValid, userAuth } = require("../utils/validation.js");
const authrouter = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

// Login route
authrouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid email or password");
    }
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    const token = await user.getJWT();
    console.log(token);
    res.cookie("token", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    res.send("Logged in successfully");
  } catch (err) {
    console.error("Error during login:", err);
    if (err.message === "Invalid email or password") {
      return res.status(401).send(err.message);
    }
    res.status(500).send("An error occurred during login");
  }
});

//Signup route
authrouter.post("/signup", async (req, res) => {
  console.log("Received data:", req.body);
  const { firstName, lastName, email, password, gender, age } = req.body;
  try {
    isValid(req.body);
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      gender,
      age,
    });
    await user.save();
    res.status(201).send("User successfully created");
  } catch (err) {
    console.error("Error during signup:", err);
    if (err.message.includes("Validation failed")) {
      return res.status(400).send("Invalid input data");
    }
    if (err.code === 11000) {
      return res.status(409).send("Email already exists");
    }
    res.status(500).send("Failed to create user");
  }
});

//Logout route
authrouter.post("/logout", (req, res) => {
  res
    .cookie("token", null, {
      expires: new Date(Date.now()),
    })
    .send("Logegd out succesfully!!");
});

module.exports = authrouter;
