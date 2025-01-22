const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
    },
    gender: {
      type: String,
      validate(value) {
        const arr = ["male", "female", "others"];
        if (!arr.includes(value.toLowerCase()))
          throw new Error("Gender data is not valid");
      },
    },
    password: {
      type: String,
    },
    age: {
      type: Number,
    },
  },
  {
    timestamps: true, 
  }
);


userSchema.methods.getJWT = async function() {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "DEV@Tinder$790", { expiresIn: '7d' });
  return token;
};

// Validate the user's password
userSchema.methods.validatePassword = async function(passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;
  const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);
  return isPasswordValid;
};

module.exports = mongoose.model("User", userSchema);
