import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    token:{
        type: String,
        required: true,
        unique: true
    },

    expiresAt:{
        type: Date,
        required: true
    },

    userAgent:{
        type: String,
        default: ""
    },

    ipAddress: {
        type: String,
        default: ""
    }

},{
    timestamps: true
});

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);

export default RefreshToken;