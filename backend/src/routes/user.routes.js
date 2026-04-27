const express = require("express");
const userRouter = express.Router();

const { getProfile, updateProfile } = require("../controllers/user.controllers");
const auth = require("../middleware/auth.middleware");

userRouter.get("/profile", auth, getProfile);
userRouter.put("/profile", auth, updateProfile);

module.exports = userRouter;