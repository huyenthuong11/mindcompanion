import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";



const router = express.Router();

//POST /api/auth/register
router.post("/register", async(req, res) => {
    try {
        const {username, password} = req.body;

        //validate
        if (!username) {
            return res.status(400).json({
                message: "Username là bắt buộc",
            });
        }

        if(!password) {
            return res.status(400).json({
                message: "Password là bắt buộc",
            });
        }

        //Check user tồn tại
        const existingUser = await User.findOne({ username });

        if(existingUser) {
            return res.status(400).json({
                message: "Username đã tồn tại",
            });
        }

        //Tạo user mới
        const newUser = new User({
            username,
            password,
        });

        await newUser.save();

        res.status(201).json({
            message: "Đăng ký thành công",
            userId: newUser._id,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
        message: error.message,
        });
    }
});

///POST /api/auth/login
router.post("/login", async(req, res) => {
    try {
        const {username, password} = req.body;

        //validate
        if (!username) {
            return res.status(400).json({
                message: "Username là bắt buộc",
            });
        }

        if(!password) {
            return res.status(400).json({
                message: "Password là bắt buộc",
            });
        }

        //tìm user
        const user = await User.findOne({ username });

        if(!user) {
            return res.status(400).json({
                message: "Username không tồn tại",
            });
        }

        //check password
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({
                message: "Sai mật khẩu",
            });
        }

        // tạo token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d"}
        );

        res.json({
            message: "Đăng nhập thành công",
            token,
            user: {
                id: user._id,
                username: user.username,
            },
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
        message: error.message,
        });
    }
});

export default router; 