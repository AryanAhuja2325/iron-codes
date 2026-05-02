const jwt = require("jsonwebtoken");
const User = require("../models/users.model");

const auth = async (req, res, next) => {
    try {
        const token = req.cookies?.token;
        console.log(token);

        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token" });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }

        req.user = user;

        next();

    } catch (err) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};

module.exports = auth;