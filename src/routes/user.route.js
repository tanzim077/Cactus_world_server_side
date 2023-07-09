/*
 * File           : user.route.js
 * Project        : world-of-catus-server-side
 * Created Date   : Su 09 Jul 2023 02:05:36
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
const { signup } = require("../controllers/user.controller");
const router = express.Router();

// routes

router.post("/signup", signup);

module.exports = router;
