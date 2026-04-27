const express = require("express");
const authRouter = express.Router();

const {
    register,
    verifyRegisterOTP,
    login,
    verifyLoginOTP,
    forgotPassword,
    resetPassword,
    changePassword
} = require("../controllers/auth.controllers");

const auth = require("../middleware/auth.middleware");

authRouter.post("/register", register);
authRouter.post("/verify-register-otp", verifyRegisterOTP);
authRouter.post("/login", login);
authRouter.post("/verify-login-otp", verifyLoginOTP);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password", resetPassword);
authRouter.post("/change-password", auth, changePassword);

module.exports = authRouter;