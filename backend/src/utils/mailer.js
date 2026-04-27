const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

async function sendOTPEmail(email, otp, purpose = "Verification") {
    try {
        const mailOptions = {
            from: `"Your App" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: `${purpose} OTP`,
            html: `
                <div style="font-family: Arial; padding: 20px;">
                    <h2>${purpose} OTP</h2>
                    <p>Your OTP is:</p>
                    <h1 style="letter-spacing: 5px;">${otp}</h1>
                    <p>This OTP will expire in <b>10 minutes</b>.</p>
                    <br/>
                    <p>If you didn't request this, ignore this email.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log("OTP email sent to:", email);

    } catch (err) {
        console.error("Error sending email:", err);
        throw new Error("Failed to send OTP email");
    }
}

module.exports = {
    sendOTPEmail
};