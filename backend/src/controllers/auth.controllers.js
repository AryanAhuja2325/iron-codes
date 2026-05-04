const User = require("../models/users.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendOTPEmail } = require('../utils/mailer');
const { generateOTP } = require('../utils/misc');
const redis = require("../config/redis");

const OTP_EXPIRY = 600;

/* REGISTER */
async function register(req, res) {
    try {
        const { name, userName, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const otp = generateOTP();
        const hashedPassword = await bcrypt.hash(password, 10);

        await redis.set(
            `otp:${email}:REGISTER`,
            JSON.stringify({ otp, name, password: hashedPassword, userName }),
            'EX',
            OTP_EXPIRY
        );

        // fire mail async (don't block)
        sendOTPEmail(email, otp, "Registration");

        return res.status(200).json({
            message: "OTP sent to email. Verify to complete registration"
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

/* VERIFY REGISTER OTP */
async function verifyRegisterOTP(req, res) {
    try {
        const { email, otp } = req.body;

        const data = await redis.get(`otp:${email}:REGISTER`);

        if (!data) {
            return res.status(400).json({ message: "OTP expired" });
        }

        const parsed = JSON.parse(data);

        if (parsed.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        const user = User({
            name: parsed.name,
            email,
            password: parsed.password,
            userName: parsed.userName
        });

        await user.save();

        await redis.del(`otp:${email}:REGISTER`);

        return res.status(201).json({
            message: "User registered successfully",
            userId: user._id
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

/* LOGIN */
async function login(req, res) {
    console.log("called");

    try {
        const { identifier, password, loginType } = req.body;

        const user = await User.findOne({
            $or: [
                { email: identifier.toLowerCase().trim() },
                { userName: identifier }
            ]
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        /* PASSWORD LOGIN */
        if (loginType === "PASSWORD") {

            if (!password) {
                return res.status(400).json({ message: "Password required" });
            }

            const isMatch = await user.comparePassword(password);

            if (!isMatch) {
                return res.status(401).json({ message: "Invalid credentials" });
            }

            const token = user.getJwt();

            res.cookie("token", token, {
                httpOnly: true,
                secure: false,
                sameSite: "lax"
            });
            console.log(token);
            return res.status(200).json({
                message: "Login successful",
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    userName: user.userName
                }
            });
        }

        /* OTP LOGIN */
        if (loginType === "OTP") {

            const otp = generateOTP();

            await redis.set(
                `otp:${user.email}:LOGIN`,
                otp,
                'EX',
                OTP_EXPIRY
            );

            // async mail
            sendOTPEmail(user.email, otp, "Login");

            return res.status(200).json({
                message: "OTP sent to registered email"
            });
        }

        return res.status(400).json({ message: "Invalid login request" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

/* VERIFY LOGIN OTP */
async function verifyLoginOTP(req, res) {
    try {
        const { identifier, otp } = req.body;

        const user = await User.findOne({
            $or: [
                { email: identifier.toLowerCase().trim() },
                { userName: identifier }
            ]
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const storedOtp = await redis.get(`otp:${user.email}:LOGIN`);

        if (!storedOtp) {
            return res.status(400).json({ message: "OTP expired" });
        }

        if (storedOtp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        await redis.del(`otp:${user.email}:LOGIN`);

        const token = user.getJwt();

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        });

        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                userName: user.userName
            }
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

/* FORGOT PASSWORD */
async function forgotPassword(req, res) {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const otp = generateOTP();

        await redis.set(
            `otp:${email}:FORGOT`,
            otp,
            'EX',
            OTP_EXPIRY
        );

        sendOTPEmail(email, otp, "Password Reset");

        return res.status(200).json({
            message: "OTP sent"
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

/* RESET PASSWORD */
async function resetPassword(req, res) {
    try {
        const { email, otp, newPassword } = req.body;

        const storedOtp = await redis.get(`otp:${email}:FORGOT`);

        if (!storedOtp) {
            return res.status(400).json({ message: "OTP expired" });
        }

        if (storedOtp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        const user = await User.findOne({ email });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

        await user.save();

        await redis.del(`otp:${email}:FORGOT`);

        return res.status(200).json({
            message: "Password reset successful"
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

/* CHANGE PASSWORD */
async function changePassword(req, res) {
    try {
        const { oldPassword, newPassword } = req.body;

        const user = await User.findById(req.user.id);

        const isMatch = await user.comparePassword(oldPassword);
        if (!isMatch) {
            return res.status(400).json({ error: "Incorrect old password" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

        await user.save();

        return res.status(200).json({ message: "Password updated" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    register,
    verifyRegisterOTP,
    login,
    verifyLoginOTP,
    changePassword,
    forgotPassword,
    resetPassword
};