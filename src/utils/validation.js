const validator = require("validator");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const isValid = (val) => {
  const { firstName, lastName, age, gender, password, email } = val;
  if (
    !firstName ||
    !lastName ||
    firstName.length < 4 ||
    firstName.length > 50 ||
    lastName.length < 4 ||
    lastName.length > 50
  )
    throw new Error("Invalid name");
  if (!password) throw new Error("Please enter the password");
  if (!validator.isEmail(email)) throw new Error("Email id is not valid");
  if (!validator.isStrongPassword(password))
    throw new Error("Password is invalid");

  return true;
};

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).send("Please log in!");
    }

    const hashedMsg = await jwt.verify(token, "DEV@Tinder$790");
    const { _id } = hashedMsg;

    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).send("User not found!");
    }

    req.user = user; // Assign Mongoose document directly

    next(); 
  } catch (err) {
    console.error(err);
    res.status(401).send("Authentication failed!");
  }
};


module.exports = { isValid, userAuth };
