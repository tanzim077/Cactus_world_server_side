/*
 * File           : user.model.js
 * Project        : world-of-catus-server-side
 * Created Date   : Su 09 Jul 2023 02:02:36
 * Description    : <<description>>
 *
 *
 * Author         : Tanzim Ahmed
 * Email          : tanzim.ahmed1@g.bracu.ac.bd
 * ----------------------
 * Last Modified  : Sun Jul 09 2023
 * Modified By    : Tanzim Ahmed
 * ------------------------
 */

const mongoose = require("mongoose");

// create a simnple schema for user

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin", "super-admin"],
    },
  },
  {
    timestamps: true,
  }
);

// create a model from schema
const User = mongoose.model("User", userSchema);
module.exports = User;
