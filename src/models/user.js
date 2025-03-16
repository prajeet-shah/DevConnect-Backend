const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 4,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      min: 18,
      validate: {
        validator: function (value) {
          if (!["male", "female", "others"].includes(value)) {
            throw new Error("Gender is not valid");
          }
        },
        message: "Gender is not valid",
      },
    },

    about: {
      type: String,
      default: "this is the default about",
    },
    photoUrl: {
      type: String,
      default: "https://www.flaticon.com/free-icon/profile_6522516",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
