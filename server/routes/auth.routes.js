const Router = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const router = new Router();
const nodemailer = require('nodemailer');
const crypto = require("crypto");
const authMiddleware = require('../middleware/auth.middleware');
const fileService = require('../services/fileService');
const File = require('../models/File');

const transporter = nodemailer.createTransport({
    host: "smtp.yandex.ru",
    port: 465,
    secure: true,
    auth: {
        user: "SoftSeason@yandex.ru",
        pass: "tlrozowdvoqzkmpu",
    },
});

function generateVerificationCode() {
    return crypto.randomInt(100000, 999999).toString();
}

router.post(
    "/registration",
    [
        check("email", "Invalid email").isEmail(),
        check("password", "Password must be at least 8 characters and include a mix of uppercase, lowercase, and numbers")
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: "Invalid registration data", errors });
            }

            const { email, password, confirmPassword } = req.body;

            if (password !== confirmPassword) {
                return res.status(400).json({ message: "Passwords do not match" });
            }

            const candidate = await User.findOne({ email });
            if (candidate) {
                return res.status(400).json({ message: `User with email ${email} already exists` });
            }

            const verificationCode = generateVerificationCode();

            await transporter.sendMail({
                from: "SoftSeason@yandex.ru",
                to: email,
                subject: "Account Verification Code",
                text: `Your verification code is ${verificationCode}`,
            });
            const hashPassword = await bcrypt.hash(password, 8);
            const user = new User({ email, password: hashPassword, verificationCode, isActivated: false });
            await user.save();

            res.json({ message: "User registered. Please check your email for the verification code." });
        } catch (e) {
            console.log(e);
            res.status(500).send({ message: "Server error" });
        }
    }
);

router.post("/verify", async (req, res) => {
    try {
        const { email, verificationCode } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.verificationCode !== verificationCode) {
            return res.status(400).json({ message: "Invalid verification code" });
        }

        user.isActivated = true;
        user.verificationCode = null;
        await user.save();

        const token = jwt.sign({ id: user.id }, config.get("secretKey"), { expiresIn: "1h" });

        res.json({
            message: "Account successfully activated",
            token,
            user: {
                id: user.id,
                email: user.email,
                diskSpace: user.diskSpace,
                usedSpace: user.usedSpace,
                avatar: user.avatar,
            },
        });
    } catch (e) {
        console.log(e);
        res.status(500).send({ message: "Server error" });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.isActivated) {
            return res.status(403).json({ message: "Account is not activated. Please verify your email." });
        }

        const isPassValid = bcrypt.compareSync(password, user.password);
        if (!isPassValid) {
            return res.status(400).json({ message: "Invalid password" });
        }

        const token = jwt.sign({ id: user.id }, config.get("secretKey"), { expiresIn: "1h" });

        return res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                diskSpace: user.diskSpace,
                usedSpace: user.usedSpace,
                avatar: user.avatar,
            },
        });
    } catch (e) {
        console.log(e);
        res.status(500).send({ message: "Server error" });
    }
});

router.post("/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const resetCode = generateVerificationCode();

        await transporter.sendMail({
            from: "SoftSeason@yandex.ru",
            to: email,
            subject: "Password Reset Code",
            text: `Your password reset code is ${resetCode}`,
        });

        user.resetPasswordCode = resetCode;
        await user.save();

        res.json({ message: "Reset code sent to your email" });
    } catch (e) {
        console.log(e);
        res.status(500).send({ message: "Server error" });
    }
});

router.post("/reset-password", async (req, res) => {
    try {
        const { email, resetCode, newPassword, confirmNewPassword } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.resetPasswordCode !== resetCode) {
            return res.status(400).json({ message: "Invalid reset code" });
        }

        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const hashPassword = await bcrypt.hash(newPassword, 8);
        user.password = hashPassword;
        user.resetPasswordCode = null;

        await user.save();
        res.json({ message: "Password reset successfully" });
    } catch (e) {
        console.log(e);
        res.status(500).send({ message: "Server error" });
    }
});

router.get('/auth', authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user.id });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const token = jwt.sign({ id: user.id }, config.get("secretKey"), { expiresIn: "1h" });
        return res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                diskSpace: user.diskSpace,
                usedSpace: user.usedSpace,
                avatar: user.avatar
            }
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
