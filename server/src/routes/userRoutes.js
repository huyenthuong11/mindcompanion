import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import fs from "fs"
import path from "path";
import upload from "../middlewares/imageMiddleware.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";

const router = express.Router();

// GET /api/users/profile
router.get("/profile", authMiddleware,async (req, res) => {
    const { userId } = req.query;
    const user = await User.findById(userId);
    res.json({
        message: "Lấy profile thành công",
        user: user,
    });
});

//PATCH api/users/updateProfile
router.patch("/updateProfile", authMiddleware, upload.single("avatar"), async(req, res) => {
    try {
        const { userId } = req.body;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({message:"Không tìm thấy user"});
        const { fullName, dateOfBirth, phoneNumber, gender, username } = req.body;
        const updateFields = {};
        if (fullName) updateFields.fullName = fullName;
        if (dateOfBirth) updateFields.dateOfBirth = dateOfBirth;
        if (phoneNumber) updateFields.phoneNumber = phoneNumber;
        if (gender) updateFields.gender = gender;      
        if (req.file) {
            updateFields.avatar = req.file.path;
            if(user.avatar) {
                const oldPath = path.join(process.cwd(), user.avatar);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }
        }
        
        const updateUser = await User.findByIdAndUpdate(
            userId,
            updateFields,
            {new: true, runValidators: true}
        );

        if (!updateUser) return res.status(404).json({message: "Không tìm thấy người dùng!"});

        res.status(200).json({
            message: "Chỉnh sửa thành công"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Chỉnh sửa thất bại", err });
    }
})

router.patch("/change-password", authMiddleware, async(req, res) => {
    try {
        const { userId, oldPassword, newPassword } = req.body;
        const user = await User.findById(userId);
        if(!user) return res.status(404).json({message: "Không tìm thấy người dùng!"});
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({message: "Mật khẩu cũ không đúng"})
        }
        user.password = newPassword;
        await user.save();
        res.json({ message: "Đổi mật khẩu thành công" });
    } catch (error) {
        console.error(err);
        res.status(500).json({message: "Lỗi server"});
    }
})

export default router;