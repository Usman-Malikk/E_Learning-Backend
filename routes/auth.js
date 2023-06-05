const express = require("express");

const router = express.Router();

const authController = require("../controllers/auth");
const ErrorHandler = require("../middlewares/errorHandler");

router.post("/signup", authController.signup);
router.post("/signin", authController.signin, ErrorHandler);
router.post("/verifyToken", authController.verifyToken);

module.exports = router;
