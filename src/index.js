/*
 * File           : index.js
 * Project        : world-of-catus-server-side
 * Created Date   : Su 09 Jul 2023 02:11:33
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

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// middlewares
app.use(express.json());

// cors
app.use(cors());

// routes
app.use("/users", require("./routes/user.route"));

// connect to mongodb
mongoose
  .connect("mongodb://localhost:27017/world-of-catus", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to mongodb"))
  .catch((err) => console.log(err));

// start the server
app.listen(8080, () => console.log("Server is running on port 5000"));


