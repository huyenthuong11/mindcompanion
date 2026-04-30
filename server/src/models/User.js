import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        fullname : String,
        avatar : String,
        password: {
            type: String,
            required: true,
        },
        gender: {
            type: String,   
            enum: ["male", "female", "other", "Don't want to reveal"],
            default: "Don't want to reveal",
        },
        avatar: {
            type: String,
            default: "",
        },
        dateOfBirth: {
            type: Date,
            default: Date.now,
        },
        phoneNumber: {
            type: String,
            unique: true,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema); 

export default User;