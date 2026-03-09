import mongoose from "mongoose";

const suggestionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        moodHash: {
            type: String,
            required: true,
            index: true

        },
        avgMood: Number,
        avgEnergy: Number,
        emotion: String,
        energy: String,
        analysis: String,
        suggestions: {
          type: [String]  
        },
    },
    {   
        timestamps: true 
    }
);

suggestionSchema.index({ userId: 1, moodHash: 1 });

export default mongoose.model("AiSuggestion", suggestionSchema);