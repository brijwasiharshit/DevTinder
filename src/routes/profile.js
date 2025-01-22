const express = require('express');
const profileRouter = express.Router();
const { isValid, userAuth } = require("../utils/validation.js");
const user = require('../models/user.js');

profileRouter.get("/profile", userAuth, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(404).send("User not found");
      }
      res.send(req.user._doc);
    } catch (err) {
      console.error(err);
      res.status(500).send("An error occurred");
    }
  });
  profileRouter.patch("/updateProfile", userAuth, async (req, res) => {
    try {
        const recievedData = req.body;
        const allowedUpdates = ["firstName", "lastName", "age"];
        console.log(recievedData);

       
        Object.keys(recievedData).forEach(key => {
            if (!allowedUpdates.includes(key)) {
                throw new Error(`Non-Updatable field: ${key}`);
            }
        });

     
        const loggedInUser = req.user;
        console.log(loggedInUser);
        Object.keys(recievedData).forEach(key => {
            loggedInUser[key] = recievedData[key];
        });
        console.log(loggedInUser);

        // Save the updated user
       await loggedInUser.save();

        res.send("Updated Successfully");
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});



  module.exports = profileRouter;