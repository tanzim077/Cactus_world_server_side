/*
 * File           : user.controller.js
 * Project        : world-of-catus-server-side
 * Created Date   : Su 09 Jul 2023 02:05:49
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

const User = require("../models/user.model");

const signup = async (req, res) => {
  const { name, email, password, image } = req.body;

  // validation
  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({
      message: "Password is required and should be min 6 characters long",
    });
  }
  let userExist = await User.findOne({ email }).exec();
  if (userExist) {
    return res.status(400).send({ message: "Email is taken already" });
  }

  // hash password
  // const hashedPassword = await bcrypt.hash(password, 10);

  // register
  const user = new User({
    name,
    email,
    password,
    image,
  });
  console.log("🚀 ~ file: user.controller.js:45 ~ signup ~ user:", user);

  try {
    await user.save();
    return res.status(200).send(user);
  } catch (err) {
    return res.status(400).send("Error. Try again.");
  }
};

module.exports = {
  signup,
};
