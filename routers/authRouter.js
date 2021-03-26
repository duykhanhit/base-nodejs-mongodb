const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController");

const protect = require("../middlewares/auth");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", protect.protect, authController.getMe);
router.put("/update-details", protect.protect, authController.updateDetails);
router.put("/update-password", protect.protect, authController.updatePassword);
router.put("/reset-password/:resetToken", authController.resetPassword);
router.post("/forgot", authController.forgotPassword);

module.exports = router;
