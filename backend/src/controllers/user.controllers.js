const User = require('../models/users.model');

async function getProfile(req, res) {
    try {
        res.status(200).json({
            user: req.user
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function updateProfile(req, res) {
    try {
        const { github, linkedin } = req.body;

        const updates = {};
        if (github !== undefined) updates.github = github;
        if (linkedin !== undefined) updates.linkedin = linkedin;

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            updates,
            {
                new: true,
                runValidators: true
            }
        ).select("-password");

        res.status(200).json({
            message: "Profile updated",
            user: updatedUser
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    getProfile,
    updateProfile
};