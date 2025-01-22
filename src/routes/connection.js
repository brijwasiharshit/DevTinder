const express = require('express');
const connectionRouter = express.Router();
const { isValid, userAuth } = require("../utils/validation.js");

connectionRouter.post("/sendConnectionRequest", userAuth, (req, res) => {
  try {
    const { firstName } = req.user._doc;
    console.log(req.user);
    res.send("Connection request sent to " + firstName);
  } catch (err) {
    res.status(400).send("Error : ", err);
  }
});

module.exports = connectionRouter;