import mongoose from "mongoose";

const moodEntrySchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        mood: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        energy: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        note: {
            type: String,
            default: "",
        },
        tags: {
            type: [String],
            default: [],
        },
        createdAt: {
            type: Date,
            default: Date.now,
            index: true,
        },
    },
    {
        versionKey: false,
    }
);

moodEntrySchema.index({ userId: 1, createdAt: -1 });
export default mongoose.model("MoodEntry", moodEntrySchema);