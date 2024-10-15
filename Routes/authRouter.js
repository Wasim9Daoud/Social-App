const express = require("express");
const router = express.Router();
const { Register, Login , VerifyEmailCtrl , ResetPassWordRequest , ResetPassWord } = require("../controllers/authController");
const photoUpload = require("../middleWares/photoUpload");

// Register
router.post("/register", photoUpload.single("image") , Register);

// Login
router.post("/login", Login);

// VerifyEmail
router.get( "/:userId/verify-email/:token" , VerifyEmailCtrl );

// ResetPassWordRequest
router.get( "/reset-password/:email" , ResetPassWordRequest );

// ResetPassWord
router.put( "/:userId/reset-password/:email" , ResetPassWord );


module.exports = router;
