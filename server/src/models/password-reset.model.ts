import mongoose from "mongoose";

const passwordResetSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },

    token: {
        type: String,
        required: true,
        unique: true,
        index: true
    },

    expiresAt: {
        type: Date,
        required: true
    }
    
},{
    timestamps: true
});

const PasswordReset = mongoose.model('PasswordReset', passwordResetSchema);

export default PasswordReset;